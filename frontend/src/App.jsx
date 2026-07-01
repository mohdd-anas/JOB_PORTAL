import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

// Lazy-loaded route components for optimal performance
const Login = lazy(() => import('./components/auth/Login'))
const Signup = lazy(() => import('./components/auth/Signup'))
const Home = lazy(() => import('./components/Home'))
const Jobs = lazy(() => import('./components/Jobs'))
const Browse = lazy(() => import('./components/Browse'))
const Profile = lazy(() => import('./components/Profile'))
const JobDescription = lazy(() => import('./components/JobDescription'))
const Companies = lazy(() => import('./components/admin/Companies'))
const CompanyCreate = lazy(() => import('./components/admin/CompanyCreate'))
const CompanySetup = lazy(() => import('./components/admin/CompanySetup'))
const AdminJobs = lazy(() => import('./components/admin/AdminJobs'))
const PostJob = lazy(() => import('./components/admin/PostJob'))
const Applicants = lazy(() => import('./components/admin/Applicants'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))
const ProtectedAdminRoute = lazy(() => import('./components/admin/ProtectedAdminRoute'))

// Global loading fallback for route transitions
const PageLoader = () => (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-4 border-[#6A38C2] border-t-transparent'></div>
    </div>
)

const appRouter = createBrowserRouter([
    { path: '/', element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
    { path: '/login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
    { path: '/signup', element: <Suspense fallback={<PageLoader />}><Signup /></Suspense> },
    {
        path: '/jobs',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedRoute><Jobs /></ProtectedRoute>
            </Suspense>
        )
    },
    {
        path: '/browse',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedRoute><Browse /></ProtectedRoute>
            </Suspense>
        )
    },
    {
        path: '/profile',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedRoute><Profile /></ProtectedRoute>
            </Suspense>
        )
    },
    {
        path: '/description/:id',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedRoute><JobDescription /></ProtectedRoute>
            </Suspense>
        )
    },
    // Admin routes — protected to recruiters only
    {
        path: '/admin/dashboard',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
            </Suspense>
        )
    },
    {
        path: '/admin/companies',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedAdminRoute><Companies /></ProtectedAdminRoute>
            </Suspense>
        )
    },
    {
        path: '/admin/companies/create',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedAdminRoute><CompanyCreate /></ProtectedAdminRoute>
            </Suspense>
        )
    },
    {
        path: '/admin/companies/:id',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedAdminRoute><CompanySetup /></ProtectedAdminRoute>
            </Suspense>
        )
    },
    {
        path: '/admin/jobs',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedAdminRoute><AdminJobs /></ProtectedAdminRoute>
            </Suspense>
        )
    },
    {
        path: '/admin/jobs/create',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedAdminRoute><PostJob /></ProtectedAdminRoute>
            </Suspense>
        )
    },
    {
        path: '/admin/jobs/:id/applicants',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ProtectedAdminRoute><Applicants /></ProtectedAdminRoute>
            </Suspense>
        )
    },
])

function App() {
    return (
        <>
            <RouterProvider router={appRouter} />
            <Toaster position='top-right' richColors />
        </>
    )
}

export default App