import { useEffect } from 'react'
import api from '@/lib/api'
import { useDispatch, useSelector } from 'react-redux'
import { setAllJobs } from '@/redux/jobSlice'

const useGetAllJobs = () => {
    const dispatch = useDispatch()
    const { searchJobQuery } = useSelector(store => store.job)

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await api.get(`/job/get?keyword=${searchJobQuery}`)
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs))
                }
            } catch (error) {
                console.error('[useGetAllJobs]', error?.response?.data?.message || error.message)
            }
        }
        fetchAllJobs()
    }, [searchJobQuery])
}

export default useGetAllJobs