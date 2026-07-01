import { useEffect } from 'react'
import api from '@/lib/api'
import { useDispatch } from 'react-redux'
import { setAdminJobs } from '@/redux/jobSlice'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await api.get('/job/getadminjobs')
                if (res.data.success) {
                    dispatch(setAdminJobs(res.data.jobs))
                }
            } catch (error) {
                console.error('[useGetAllAdminJobs]', error?.response?.data?.message || error.message)
            }
        }
        fetchAdminJobs()
    }, [])
}

export default useGetAllAdminJobs