import { useEffect } from 'react'
import { supabase, mapCompany } from '@/lib/supabase'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                if (!companyId) return
                const { data, error } = await supabase
                    .from('companies')
                    .select('*')
                    .eq('id', companyId)
                    .maybeSingle()

                if (error) throw error
                if (data) dispatch(setSingleCompany(mapCompany(data)))
            } catch (error) {
                console.error('[useGetCompanyById]', error.message)
            }
        }
        fetchCompany()
    }, [companyId])
}

export default useGetCompanyById
