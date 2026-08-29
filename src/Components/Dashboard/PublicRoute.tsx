import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Navigate } from 'react-router-dom'


const PublicRoute = ({children} : {children: React.ReactNode}) => {
    const [loading,setLoading] = useState<boolean>(true);
    const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
    //Store
  
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setIsLoggedIn(!!session)
            setLoading(false)
        })
    },[])

    if(loading) return <div className='text-white'>Loading...</div>

    if(isLoggedIn) {  
      return <Navigate to='/dashboard' />
    }

    return children
}

export default PublicRoute
