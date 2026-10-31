import { Outlet } from 'react-router-dom';
import AppSidebar from '../admin/layout/AppSidebar';
import AppHeader from '../admin/layout/AppHeader';
import { SidebarProvider, useSidebar } from '../admin/context/SidebarContext';
import ErrorBoundary from '../components/ErrorBoundary'; // <-- Import

function AdminContent() {
  const { isExpanded, isHovered } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      <AppSidebar />
      <div 
        className={`relative flex min-h-screen flex-col transition-all duration-300 ease-in-out w-full ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        }`}
      >
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            {/* Bungkus Outlet dengan ErrorBoundary */}
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
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