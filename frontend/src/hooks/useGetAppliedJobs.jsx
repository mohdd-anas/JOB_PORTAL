import { useEffect } from 'react'
import { supabase, mapApplication, mapJob, mapCompany } from '@/lib/supabase'
import { useDispatch } from 'react-redux'
import { setAllAppliedJobs } from '@/redux/jobSlice'

const useGetAppliedJobs = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                const { data, error } = await supabase
                    .from('applications')
                    .select(`*, job:jobs(*, company:companies(*))`)
                    .eq('applicant_id', session.user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error

                const applications = (data || []).map(row => {
                    const jobRow = row.job
                    const companyRow = jobRow ? jobRow.company : null
                    const job = jobRow ? mapJob(jobRow, mapCompany(companyRow), []) : null
                    return mapApplication(row, job, null)
                })
                dispatch(setAllAppliedJobs(applications))
            } catch (error) {
                console.error('[useGetAppliedJobs]', error.message)
            }
        }
        fetchAppliedJobs()
    }, [])
}

export default useGetAppliedJobs
