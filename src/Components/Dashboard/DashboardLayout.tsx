import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className='h-screen flex bg-black overflow-hidden'>
       <Sidebar />
       <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
         <Outlet />
       </div>
    </div>
  )
}

export default DashboardLayout