'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                pathname === '/admin/dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">📊</span>
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                pathname === '/admin/products'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">📦</span>
              Products
            </Link>
            <Link
              href="/admin/categories"
              className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                pathname === '/admin/categories'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">🏷️</span>
              Categories
            </Link>
          </nav>

          {/* User Section */}
          <div className="border-t px-4 py-4">
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
            >
              <span className="mr-3">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <div className="min-h-screen bg-gray-100">
          {/* Top Bar */}
          <div className="bg-white shadow-sm">
            <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Products
              </h2>
            </div>
          </div>

          {/* Page Content */}
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 