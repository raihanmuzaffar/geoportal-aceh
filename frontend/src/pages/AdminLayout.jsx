import { Outlet } from 'react-router-dom';
import AppSidebar from '../admin/layout/AppSidebar';
import AppHeader from '../admin/layout/AppHeader';
import { SidebarProvider, useSidebar } from '../admin/context/SidebarContext';

function AdminContent() {
  const { isExpanded, isHovered } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AppSidebar />
      <div 
        className={`relative flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminContent />
    </SidebarProvider>
  );
}