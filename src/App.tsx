import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Login from './Pages/AuthPage'
import Dashboard from './Pages/Dashboard'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import Toast from './Components/UI/Toast'
import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient';
import { useAuthStore } from './store/useAuthStore'
import PublicRoute from './Components/Dashboard/PublicRoute'
import Interview from './Pages/Interview'
import InterviewSessionGuard from "./Components/Interview Re-design components/InterviewSessionGuard";
import Performance from './Pages/Performance'
import DashboardLayout from './Components/Dashboard/DashboardLayout';
import ContactPage from './Pages/ContactPage'
import HomePage from './Pages/HomePage'

const Layout = () => {
  return (
    <div>
      <InterviewSessionGuard />
       <Toast />
       <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children : [
      {index: true, element: (
        <PublicRoute>
          <HomePage />
        </PublicRoute>
      )},
      {path: '/login', element: (
        <PublicRoute>
           <Login />
        </PublicRoute>
      )},
      {path: '/contact', element: (
        <PublicRoute>
          <ContactPage />
        </PublicRoute>
      )},
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/performance', element: <Performance /> }
        ]
      },
      {
        path: '/interview',
        element: (
          <ProtectedRoute>
             <Interview />
          </ProtectedRoute>   
        )
      },
      {
        path: '/performance',
        element: (
           <Performance />
        )
      }
    ]
  }
])

const App = () => {

  const {setUser} = useAuthStore()

  useEffect(() => {
      // Zustand is in-memory — resets on page refresh
      // So we refetch user data from Supabase on every app load
      // to repopulate the store with fresh user data
      const refreshData = async () => {
        const { data: { session } } = await supabase.auth.getSession()

        if(!session) return 

        const { data: profileData  } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()

        setUser({
          id:session.user.id,
          email:session.user.email ?? '',
          username:profileData?.username ?? ''
        })
      }
      refreshData()
  }, [setUser])
  
  return (
    <RouterProvider router={router} />
  )
}

export default App
