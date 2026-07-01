import { useEffect } from 'react'
import api from '@/lib/api'
import { useDispatch } from 'react-redux'
import { setAllAppliedJobs } from '@/redux/jobSlice'

const useGetAppliedJobs = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await api.get('/application/get')
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.applications))
                }
            } catch (error) {
                console.error('[useGetAppliedJobs]', error?.response?.data?.message || error.message)
            }
        }
        fetchAppliedJobs()
    }, [])
}

export default useGetAppliedJobs
