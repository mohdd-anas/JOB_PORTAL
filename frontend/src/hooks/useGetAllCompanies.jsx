import { useEffect } from 'react'
import { supabase, mapCompany } from '@/lib/supabase'
import { useDispatch } from 'react-redux'
import { setCompanies } from '@/redux/companySlice'

const useGetAllCompanies = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                const { data, error } = await supabase
                    .from('companies')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error

                const companies = (data || []).map(mapCompany)
                dispatch(setCompanies(companies))
            } catch (error) {
                console.error('[useGetAllCompanies]', error.message)
            }
        }
        fetchCompanies()
    }, [])
}

export default useGetAllCompanies
