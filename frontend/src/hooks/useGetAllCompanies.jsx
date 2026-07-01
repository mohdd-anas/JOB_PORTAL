import { useEffect } from 'react'
import api from '@/lib/api'
import { useDispatch } from 'react-redux'
import { setCompanies } from '@/redux/companySlice'

const useGetAllCompanies = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('/company/get')
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies))
                }
            } catch (error) {
                console.error('[useGetAllCompanies]', error?.response?.data?.message || error.message)
            }
        }
        fetchCompanies()
    }, [])
}

export default useGetAllCompanies