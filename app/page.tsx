import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Euxton Methodist Church
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/captive-portal"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Wi-Fi Portal
              </Link>
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to Euxton Methodist Church
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect to our Wi-Fi network and stay connected with our community
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/captive-portal"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
            >
              Connect to Wi-Fi
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Create Account
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Wi-Fi</h3>
              <p className="text-gray-600">
                Connect to our secure Wi-Fi network with user authentication and monitoring.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Access</h3>
              <p className="text-gray-600">
                Access church resources, announcements, and stay connected with our community.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Safe Environment</h3>
              <p className="text-gray-600">
                Our network is monitored to ensure a safe and appropriate environment for all users.
              </p>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Getting Started
            </h3>
            <div className="text-left space-y-4 text-gray-600">
              <p>
                To access our Wi-Fi network, you have two options:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Quick Wi-Fi Access</h4>
                  <p className="text-blue-700 mb-3">
                    For immediate Wi-Fi access, click &quot;Connect to Wi-Fi&quot; to accept our policies and get connected.
                  </p>
                  <Link
                    href="/captive-portal"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Connect Now
                  </Link>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Full Account Access</h4>
                  <p className="text-green-700 mb-3">
                    Create an account to access your personalized dashboard and additional features.
                  </p>
                  <Link
                    href="/register"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2024 Euxton Methodist Church. All rights reserved.</p>
            <div className="mt-4 space-x-4">
              <Link href="/docs/AcceptancePolicy/" className="text-gray-300 hover:text-white">
                Wi-Fi Policy
              </Link>
              <Link href="/docs/SafeguardingPolicy/" className="text-gray-300 hover:text-white">
                Safeguarding Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
