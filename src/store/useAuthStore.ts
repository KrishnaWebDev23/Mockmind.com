import { create } from 'zustand'

//Types
type ToastTypes = 'success' | 'error' | 'info';

type Toast = {
    message: string,
    type: ToastTypes,
    visible: boolean
}

type User = {
    id: string | undefined,
    email: string,
    username: string
}
// Blueprint of function
type AuthStore = {
    // user state
    user: User | null
    // toast state
    toast : Toast
    // welcome message for dashboar
    isNewUser: boolean

    // User actions
    setUser: (user: User) => void
    clearUser: () => void

    // Toast actions
    showToast: (message: string, type: ToastTypes) => void 
    hideToast: () => void

    // message action
    setIsNewUser: (value: boolean) => void

}
// Store
export const useAuthStore = create<AuthStore>((set) => ({
    // User initial state 
    user: null,
    // Toast initial state
    toast : {
       message:'Registration successful! Welcome to MockMind.',
       type: 'success',
       visible: false
    },
    // welcome message for dashboard
    isNewUser: false,

    // User actions
    setUser: (user) => set({user}),
    clearUser: () => set({user:null}),

    //Toast actions
    showToast: (message,type) => set({
        toast: {message, type, visible: true}
    }),
    hideToast: () => set({
        toast: {message:'', type:'success', visible:false}
    }),
    // message action
    setIsNewUser: (value: boolean) => set({ isNewUser: value })
}))