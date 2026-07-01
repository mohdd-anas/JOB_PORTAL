import { useEffect } from 'react'
import api from '@/lib/api'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                if (!companyId) return
                const res = await api.get(`/company/get/${companyId}`)
                if (res.data.success) {
                    dispatch(setSingleCompany(res.data.company))
                }
            } catch (error) {
                console.error('[useGetCompanyById]', error?.response?.data?.message || error.message)
            }
        }
        fetchCompany()
    }, [companyId])
}

export default useGetCompanyById