import { Navigate, Outlet } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const role = localStorage.getItem('userRole');

  // If no role is found, the user is not logged in / role not stored
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is provided, check if the user's role is in the list
  if (allowedRoles && role !== 'admin' && !allowedRoles.includes(role)) {
    return (
      <div className='h-[100vh] w-full bg-[#030305] text-white flex flex-col items-center justify-center font-montserrat gap-6'>
        <h1 className='text-[36px] font-bold text-red-500'>403 Forbidden</h1>
        <p className='text-[20px]'>Вы не можете сюда попасть. У вас недостаточно прав.</p>
        <button 
          onClick={() => window.location.assign('/staff/login/')}
          className='px-6 py-3 bg-[#FFB800] text-black font-semibold rounded-lg hover:bg-[#e0a800] transition-colors'
        >
          Вернуться на страницу входа
        </button>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
