import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className='h-screen flex bg-black overflow-hidden'>
       <Sidebar />
       <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
         <Outlet />
       </div>
    </div>
  )
}

export default DashboardLayout