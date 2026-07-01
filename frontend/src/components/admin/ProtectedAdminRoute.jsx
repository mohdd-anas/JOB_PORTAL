import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedAdminRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth)

    if (!user || user.role !== 'recruiter') {
        return <Navigate to='/' />
    }

    return children
}

export default ProtectedAdminRoute