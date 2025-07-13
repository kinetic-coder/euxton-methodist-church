'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  full_name: string;
  email: string;
  tenant_id?: number;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else if (response.status === 401) {
          // Redirect to login if not authenticated
          window.location.href = '/login';
          return;
        } else {
          setError('Failed to load user data');
        }
      } catch {
        setError('An error occurred while loading user data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to login page after logout
        window.location.href = '/login';
      } else {
        setError('Failed to logout');
      }
    } catch {
      setError('An error occurred during logout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Euxton Methodist Church
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Welcome, {user?.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Thank you for registering with Euxton Methodist Church. You now have access to our Wi-Fi network and services.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Your Account Information
              </h3>
              <div className="space-y-2 text-blue-700">
                <p><strong>Name:</strong> {user?.full_name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Account ID:</strong> {user?.id}</p>
                {user?.tenant_id && (
                  <p><strong>Organization ID:</strong> {user.tenant_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Wi-Fi Access
              </h3>
              <p className="text-gray-600 mb-4">
                You are now connected to our secure Wi-Fi network. Your connection is monitored for security purposes.
              </p>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-700 text-sm">
                  ✅ Wi-Fi connection active
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Church Services
              </h3>
              <p className="text-gray-600 mb-4">
                Stay connected with our community and access church resources and announcements.
              </p>
              <Link
                href="/services"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Important Information
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>
                • Your Wi-Fi session will remain active for 24 hours from your last login.
              </p>
              <p>
                • Please ensure you have read and accepted our Wi-Fi Acceptable Use Policy and Safeguarding Policy.
              </p>
              <p>
                • For technical support, please contact the church office.
              </p>
              <p>
                • You can log out at any time using the logout button in the header.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 