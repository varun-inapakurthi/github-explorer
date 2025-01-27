import { Link, Outlet } from 'react-router-dom';
import { Github, History, Home } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isHistory = location.pathname.includes('/history');

  console.log('🚀 ~ Layout ~ location:', location);
  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex'>
              <Link
                to='/'
                className='flex items-center px-2 py-2 text-gray-900'
              >
                <Github className='h-6 w-6 mr-2' />
                <span className='font-semibold'>GitHub Explorer</span>
              </Link>
            </div>
            <div className='flex space-x-4'>
              <Link
                to='/'
                className={`flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 ${
                  !isHistory ? 'underline' : ''
                }`}
              >
                <Home className='h-5 w-5 mr-1' />
                <span>Home</span>
              </Link>
              <Link
                to='/history'
                className={`flex items-center px-3 py-2 text-gray-700 hover:text-gray-900
                ${isHistory ? 'underline' : ''}
              `}
              >
                <History className='h-5 w-5 mr-1' />
                <span>History</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Outlet />
      </main>
    </div>
  );
}
