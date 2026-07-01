import { useEffect, useState } from 'react'
import { supabase, mapUser } from '@/lib/supabase'
import { useDispatch } from 'react-redux'
import { setUser, setLoading } from '@/redux/authSlice'

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const init = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    const { data: profile, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle()
                    if (!error && profile) {
                        dispatch(setUser(mapUser(profile)))
                    }
                }
            } catch (e) {
                console.error('Session restore failed:', e)
            } finally {
                dispatch(setLoading(false))
                setReady(true)
            }
        }
        init()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            (async () => {
                if (event === 'SIGNED_OUT') {
                    dispatch(setUser(null))
                } else if (event === 'SIGNED_IN' && session) {
                    const { data: profile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle()
                    if (profile) dispatch(setUser(mapUser(profile)))
                }
            })()
        })

        return () => subscription.unsubscribe()
    }, [dispatch])

    if (!ready) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-10 w-10 border-4 border-[#6A38C2] border-t-transparent'></div>
            </div>
        )
    }

    return children
}

export default AuthInitializer
