import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Navigate } from 'react-router-dom'
//Toast
import { useAuthStore } from '../../store/useAuthStore'

const ProtectedRoute = ({children} : {children: React.ReactNode}) => {
    const [loading,setLoading] = useState<boolean>(true);
    const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
    //Store
    const { showToast } = useAuthStore()

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setIsLoggedIn(!!session)
            setLoading(false)
        })
    },[])

    if(loading) return <div className='text-white'>Loading...</div>

    if(!isLoggedIn) {  
      showToast('Please sign in to access this page.','info') 
      
      return <Navigate to='/login' />
    }

    return children
}

export default ProtectedRoute
