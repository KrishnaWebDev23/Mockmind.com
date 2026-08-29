//Loign Form 
//supabase
import { supabase } from '../../lib/supabaseClient'
//hooks
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
//Lucide Icon
import { Eye } from 'lucide-react'
import { EyeOff } from 'lucide-react'
//Store
import { useAuthStore } from '../../store/useAuthStore.ts'
//Lucide Icon



 type LoginFormData = {
    email: string;
    password: string;
  };

const LoginForm = () => {
  
  const [eyeFlag, setEyeFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate()
  //Store
  const {showToast, setUser, setIsNewUser} = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    // Sign in with Supabase
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if(error) {
      showToast(error.message,'error');
      setLoading(false);
      return;
    }

    // Fetch username from profiles table, but fall back to auth metadata if the profile row is missing or blocked.
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', signInData.user?.id)
      .maybeSingle()

    const resolvedUsername = profileData?.username ?? signInData.user?.user_metadata?.username ?? 'User'

    // Save user to Zustand store
    setUser({
      id: signInData.user?.id ?? '',
      email: data.email,
      username: resolvedUsername
    })

    if (profileError && profileError.code !== 'PGRST116') {
      console.warn('Profile lookup failed, falling back to auth metadata:', profileError)
    }

    // Success — navigate to dashboard
    showToast(`Welcome back, ${resolvedUsername} 👋`, 'success')
    reset()
    setEyeFlag(false)
    setLoading(false) 
    setIsNewUser(false)
    navigate('/dashboard')
  }

  return (
      <div className="flex items-center justify-center">
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col glass gap-2 p-7 rounded-2xl w-full max-w-lg"
          autoComplete="off"
        >
          <div className="flex flex-col gap-2 mb-5">
             <h1 className="text-2xl md:text-4xl font-medium tracking-tight text-white">Sign in</h1>
             <p className="text-sm font-semibold text-zinc-500">Sign in with your username and password.</p>
          </div>

            {/* Email */}
           <div className="flex flex-col">
              <label htmlFor="email" className="text-zinc-300 font-medium">
                Email
              </label>
              <input  
                type="email" 
                placeholder="rahul.sharma@gmail.com" 
                className="border-b-2 border-zinc-500 outline-none text-white py-2 px-1"
                {...register('email',{ 
                  required: 'email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/,
                    message: "Please enter a valid email address"
                  },
                  setValueAs: (v) => v.trim(), // ← strips accidental whitespace
                })}
              />
              {
                errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )
              }
           </div>

          {/* Password */}
           <div className="flex flex-col mt-5">
              <label htmlFor="password" className="text-zinc-300 font-medium">
                 Password
              </label>
              <span className="border-b-2 border-zinc-500 flex justify-between items-center">
                <input 
                id="password"
                type={eyeFlag ? 'text' : 'password'} 
                placeholder="RahulSharma@1991" 
                className=" outline-none text-white py-2 px-1"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/,
                    message: "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
                  }
                })
              }
              />
              <button type="button" onClick={() => setEyeFlag(prev => !prev)}>
                  {eyeFlag 
                    ? <Eye className="text-white px-2 cursor-pointer" size={35}  />
                    : <EyeOff className="text-white px-2 cursor-pointer" size={35} />
                  }
              </button>
            </span>
              
              {
                errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )
              }
           </div>
           
            <button 
              type="submit" 
              className="mt-8 bg-white rounded-full py-3 cursor-pointer text-sm font-medium"
              disabled={loading}
            > 
             {loading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
      </div>  
  )
}

export default LoginForm