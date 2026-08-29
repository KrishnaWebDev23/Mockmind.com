//Register Form 
//hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
//Lucide Icon
import { Eye } from 'lucide-react'
import { EyeOff } from 'lucide-react'
//supabase
import { supabase } from "../../lib/supabaseClient";
//Zustand store 
import { useAuthStore } from '../../store/useAuthStore.ts'

 type RegisterFormData  = {
    username: string;
    password: string;
    email: string;
  };
                  
const RegisterForm = () => {
  
  const [eyeFlag,setEyeFlag] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  //Store
  const {setUser, showToast, setIsNewUser} = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData >();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true)

    // Step 0 — Username check karo pehle
    const { data: existingUser } = await supabase.from('profiles').select('username').eq('username', data.username).single()

    if(existingUser) {
      showToast('Username already taken. Please choose another.', 'error');
      setLoading(false);
      return // ← rukh jao — signUp mat karo
    }
    
    // Step A — Create user in Supabase auth with email and password 
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })

    // If email already exists or any auth error
    if( signUpError ) {
      showToast(signUpError.message, 'error')
      setLoading(false);
      return;
    }

    // Step B — Save username in profiles table using the user id
    const { error: profileError } = await supabase.from('profiles').insert({
       id: signUpData.user?.id,
       username: data.username
    })

     // If username already exists or any profile error
     if(profileError) {
      showToast('Username already taken. Please choose another.', 'error')
      setLoading(false)
      return
     }

    // Step C — Save user to Zustand store
    setUser({
      id: signUpData.user?.id,
      email: data.email,
      username: data.username
    })

    // Success
    showToast('Registration successful! Welcome to MockMind.', 'success')
    reset()
    setLoading(false)
    setEyeFlag(false)
    setIsNewUser(true)
    navigate('/dashboard')  
  }

  return (
      <div className="flex items-center justify-center">
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col glass p-7 rounded-2xl w-full max-w-lg"
          autoComplete="off"
        >
          <div className="flex flex-col gap-2 mb-5">
             <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">Register</h1>
             <p className="text-sm font-semibold text-zinc-500">Register with your username, email and password.</p>
          </div>

            {/* Username */}
           <div className="flex flex-col">
              <label htmlFor="username" className="text-zinc-300 font-medium">
                Username
              </label>
              <input  
                type="text" 
                placeholder="Rahul_Sharma" 
                className="border-b-2 border-zinc-500 outline-none text-white py-2 px-1"
                {...register('username',{ 
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message:'Username must be at least 3 characters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'Username must be at most 20 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Only letters, numbers and underscore allowed'
                  }
                })}
              />
              {
                errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                )
              }
           </div>

          {/* Email */}
           <div className="flex flex-col mt-3">
              <label htmlFor="email" className="text-zinc-300 font-medium">
                Email
              </label>
              <input  
                type="email" 
                placeholder="rahul.sharma@gmail.com" 
                className="border-b-2 border-zinc-500 outline-none text-white py-2 px-1"
                {...register('email',{ 
                  required: 'Email is required',
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
           <div className="flex flex-col mt-3">
              <label htmlFor="password" className="text-zinc-300 font-medium">
                 Password
              </label>
              <span className="border-b-2 border-zinc-500 flex justify-between items-center">
                <input 
                id="password"
                type={eyeFlag ? 'text' : 'password'} 
                placeholder="RahulSharma@2145" 
                className=" outline-none text-white py-2 px-1"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{5,}$/,
                    message: "Password must be at least 5 characters, include uppercase, lowercase, number and special character"
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
              className={`mt-8 bg-white rounded-full py-3 ${loading ? 'cursor-not-allowed' : 'cursor-pointer' } text-sm font-medium `}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
      </div>  
  )
}

export default RegisterForm