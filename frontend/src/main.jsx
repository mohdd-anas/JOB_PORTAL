import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider, useDispatch } from 'react-redux'
import store from './redux/store.js'
import { setUser } from './redux/authSlice.js'
import api from './lib/api.js'
import { ThemeProvider } from './context/ThemeContext.jsx'

const AppWithAuth = () => {
    const dispatch = useDispatch()
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const res = await api.get('/user/me')
                if (res.data.success) {
                    dispatch(setUser(res.data.user))
                }
            } catch {
                dispatch(setUser(null))
            } finally {
                setAuthChecked(true)
            }
        }
        restoreSession()
    }, [dispatch])

    if (!authChecked) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-white dark:bg-gray-900'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-10 h-10 bg-[#6A38C2] rounded-xl flex items-center justify-center animate-pulse'>
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                        </svg>
                    </div>
                    <p className='text-sm text-gray-400 dark:text-gray-500'>Loading JobPortal...</p>
                </div>
            </div>
        )
    }

    return <App />
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <AppWithAuth />
            </ThemeProvider>
        </Provider>
    </StrictMode>,
)
