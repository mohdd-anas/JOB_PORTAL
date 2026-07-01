import { useEffect } from 'react'
import { supabase, mapJob, mapCompany } from '@/lib/supabase'
import { useDispatch, useSelector } from 'react-redux'
import { setAllJobs } from '@/redux/jobSlice'

const useGetAllJobs = () => {
    const dispatch = useDispatch()
    const { searchJobQuery } = useSelector(store => store.job)

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                let query = supabase
                    .from('jobs')
                    .select(`*, company:companies(*)`)
                    .order('created_at', { ascending: false })

                if (searchJobQuery) {
                    query = query.or(`title.ilike.%${searchJobQuery}%,description.ilike.%${searchJobQuery}%,location.ilike.%${searchJobQuery}%`)
                }

                const { data, error } = await query
                if (error) throw error

                // Fetch application counts
                const jobIds = (data || []).map(j => j.id)
                let appCounts = {}
                if (jobIds.length > 0) {
                    const { data: apps } = await supabase
                        .from('applications')
                        .select('job_id')
                        .in('job_id', jobIds)
                    if (apps) {
                        apps.forEach(a => { appCounts[a.job_id] = (appCounts[a.job_id] || 0) + 1 })
                    }
                }

                const jobs = (data || []).map(row =>
                    mapJob(row, mapCompany(row.company), Array(appCounts[row.id] || 0).fill(null))
                )
                dispatch(setAllJobs(jobs))
            } catch (error) {
                console.error('[useGetAllJobs]', error.message)
            }
        }
        fetchAllJobs()
    }, [searchJobQuery])
}

export default useGetAllJobs
