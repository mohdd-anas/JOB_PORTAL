import { useEffect } from 'react'
import { supabase, mapJob, mapCompany } from '@/lib/supabase'
import { useDispatch } from 'react-redux'
import { setAdminJobs } from '@/redux/jobSlice'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                const { data, error } = await supabase
                    .from('jobs')
                    .select(`*, company:companies(*)`)
                    .eq('created_by', session.user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error

                const jobs = (data || []).map(row => mapJob(row, mapCompany(row.company), []))
                dispatch(setAdminJobs(jobs))
            } catch (error) {
                console.error('[useGetAllAdminJobs]', error.message)
            }
        }
        fetchAdminJobs()
    }, [])
}

export default useGetAllAdminJobs
