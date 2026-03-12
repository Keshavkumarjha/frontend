import { lazy, Suspense } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Layout from '../components/layout/Layout'
import Spinner from '../components/ui/Spinner'

const Landing     = lazy(() => import('../pages/landing/Landing'))
const Login       = lazy(() => import('../pages/auth/Login'))
const Register    = lazy(() => import('../pages/auth/Register'))
const Dashboard   = lazy(() => import('../pages/dashboard/Dashboard'))
const Employees   = lazy(() => import('../pages/employees/Employees'))
const Departments = lazy(() => import('../pages/departments/Departments'))
const Roles       = lazy(() => import('../pages/roles/Roles'))
const Attendance  = lazy(() => import('../pages/attendance/Attendance'))
const Leave       = lazy(() => import('../pages/leave/Leave'))
const Payroll     = lazy(() => import('../pages/payroll/Payroll'))
const Recruitment = lazy(() => import('../pages/recruitment/Recruitment'))
const Performance = lazy(() => import('../pages/performance/Performance'))
const Profile     = lazy(() => import('../pages/profile/Profile'))
const Settings    = lazy(() => import('../pages/settings/Settings'))

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

const wrap = (el) => <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>}>{el}</Suspense>

export const router = createBrowserRouter([
  { path: '/',         element: wrap(<Landing />) },
  { path: '/login',    element: <PublicOnlyRoute>{wrap(<Login />)}</PublicOnlyRoute> },
  { path: '/register', element: <PublicOnlyRoute>{wrap(<Register />)}</PublicOnlyRoute> },
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: 'dashboard',   element: wrap(<Dashboard />) },
      { path: 'employees',   element: wrap(<Employees />) },
      { path: 'departments', element: wrap(<Departments />) },
      { path: 'roles',       element: wrap(<Roles />) },
      { path: 'attendance',  element: wrap(<Attendance />) },
      { path: 'leave',       element: wrap(<Leave />) },
      { path: 'payroll',     element: wrap(<Payroll />) },
      { path: 'recruitment', element: wrap(<Recruitment />) },
      { path: 'performance', element: wrap(<Performance />) },
      { path: 'profile',     element: wrap(<Profile />) },
      { path: 'settings',    element: wrap(<Settings />) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
