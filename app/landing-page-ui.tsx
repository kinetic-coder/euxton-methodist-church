"use client"

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

interface LandingPageUIProps {
  ap?: string;
  id?: string;
  url?: string;
  ssis?: string;
  siteId?: string;
  clientId?: string;
}

export default function LandingPageUI({ ap, id, url, ssis, siteId, clientId }: LandingPageUIProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [safeguardingAccepted, setSafeguardingAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSafeguarding, setShowSafeguarding] = useState(false);
  const [hasOpenedTerms, setHasOpenedTerms] = useState(false);
  const [hasOpenedSafeguarding, setHasOpenedSafeguarding] = useState(false);
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleAccept = async () => {
    if (!fullName.trim() || !email.trim()) {
      setSubmitError('Please provide your full name and email address.');
      return;
    }

    if (!termsAccepted || !safeguardingAccepted) {
      setSubmitError('Please accept both the Terms and Conditions and Safeguarding Policy.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/captive-portal/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          deviceDetails: {
            macAddress: id,
            apMacAddress: ap,
            ssid: ssis,
            originalUrl: url,
            deviceName: `Device ${id ? id.substring(0, 8) : 'Unknown'}`,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('Thank you! Your acceptance has been recorded. You should now have access to the internet.');
        // Clear form
        setFullName('');
        setEmail('');
        setTermsAccepted(false);
        setSafeguardingAccepted(false);
        setHasOpenedTerms(false);
        setHasOpenedSafeguarding(false);
      } else {
        setSubmitError(data.message || 'Failed to record acceptance. Please try again.');
      }
    } catch {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Login Link */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Euxton Methodist Church
            </h1>
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Euxton Methodist Church Wi-Fi
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Before continuing, please provide your details and accept our Wi-Fi Acceptable Use Policy and Safeguarding Policy.
          </p>
        </div>

        <div className="space-y-8">
          {/* User Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Wi-Fi Acceptable Use Policy
              </h2>
              <button
                onClick={() => { setShowTerms(!showTerms); if (!hasOpenedTerms) setHasOpenedTerms(true); }}
                className="text-blue-600 hover:text-blue-800"
              >
                {showTerms ? "Hide" : "Show"} Terms
              </button>
            </div>
            
            {showTerms && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Image 
                  src="/docs/AcceptancePolicy/EmcGuestWifiAcceptableUsePolicy2025_1.jpg" 
                  alt="EMC Guest Wi-Fi Acceptable Use Policy Document Scan" 
                  className="max-w-full h-auto rounded-md shadow-sm mb-6" 
                />
                <Image 
                  src="/docs/AcceptancePolicy/EmcGuestWifiAcceptableUsePolicy2025_2.jpg" 
                  alt="EMC Guest Wi-Fi Acceptable Use Policy Document Scan" 
                  className="max-w-full h-auto rounded-md shadow-sm mb-6" 
                />
                <Image 
                  src="/docs/AcceptancePolicy/EmcGuestWifiAcceptableUsePolicy2025_3.jpg" 
                  alt="EMC Guest Wi-Fi Acceptable Use Policy Document Scan" 
                  className="max-w-full h-auto rounded-md shadow-sm mb-6" 
                />
                <Image 
                  src="/docs/AcceptancePolicy/EmcGuestWifiAcceptableUsePolicy2025_4.jpg" 
                  alt="EMC Guest Wi-Fi Acceptable Use Policy Document Scan" 
                  className="max-w-full h-auto rounded-md shadow-sm mb-6" 
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-gray-700">
                I have read and agree to the Terms and Conditions
              </label>
            </div>
          </div>

          {/* Safeguarding Policy Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Safeguarding Policy
              </h2>
              <button
                onClick={() => { setShowSafeguarding(!showSafeguarding); if (!hasOpenedSafeguarding) setHasOpenedSafeguarding(true); }}
                className="text-blue-600 hover:text-blue-800"
              >
                {showSafeguarding ? "Hide" : "Show"} Policy
              </button>
            </div>
            
            {showSafeguarding && (
              <>
                <Image 
                    src="/docs/SafeguardingPolicy/EmcSafeguardingPolicy2024_1.jpg" 
                    alt="EMC Euxton Safeguarding Policy Document Scan" 
                    className="max-w-full h-auto rounded-md shadow-sm" 
                  />
                  <Image 
                    src="/docs/SafeguardingPolicy/EmcSafeguardingPolicy2024_2.jpg" 
                    alt="EMC Euxton Safeguarding Policy Document Scan" 
                    className="max-w-full h-auto rounded-md shadow-sm" 
                  />
                  <Image 
                    src="/docs/SafeguardingPolicy/EmcSafeguardingPolicy2024_3.jpg" 
                    alt="EMC Euxton Safeguarding Policy Document Scan" 
                    className="max-w-full h-auto rounded-md shadow-sm" 
                  />
                  <Image 
                    src="/docs/SafeguardingPolicy/EmcSafeguardingPolicy2024_4.jpg" 
                    alt="EMC Euxton Safeguarding Policy Document Scan" 
                    className="max-w-full h-auto rounded-md shadow-sm" 
                  />
                  <Image 
                    src="/docs/SafeguardingPolicy/EmcSafeguardingPolicy2024_5.jpg" 
                    alt="EMC Euxton Safeguarding Policy Document Scan" 
                    className="max-w-full h-auto rounded-md shadow-sm" 
                  />
                  <Image 
                    src="/docs/SafeguardingPolicy/EmcSafeguardingPolicy2024_6.jpg" 
                    alt="EMC Euxton Safeguarding Policy Document Scan" 
                    className="max-w-full h-auto rounded-md shadow-sm" 
                  />
              </>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="safeguarding"
                checked={safeguardingAccepted}
                onChange={(e) => setSafeguardingAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="safeguarding" className="ml-2 text-gray-700">
                I have read and agree to the Safeguarding Policy
              </label>
            </div>
          </div>

          {/* Submit Messages */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {submitError}
            </div>
          )}
          {submitMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {submitMessage}
            </div>
          )}

          {/* Accept Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAccept}
              disabled={isSubmitting || !fullName.trim() || !email.trim() || !termsAccepted || !safeguardingAccepted}
              className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors ${
                isSubmitting || !fullName.trim() || !email.trim() || !termsAccepted || !safeguardingAccepted
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Processing..." : "Accept and Continue"}
            </button>
          </div>
        </div>

        {/* Collapsible Connection Parameters Section */}
        {(ap || id || url || ssis || siteId) && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Advanced
              </h2>
              <button
                onClick={() => setShowConnectionDetails(!showConnectionDetails)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showConnectionDetails ? "Hide" : "Show"} Details
              </button>
            </div>
            {showConnectionDetails && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                <ul className="list-disc list-inside space-y-1">
                  {ap && <li><strong>Access Point MAC:</strong> {ap}</li>}
                  {id && <li><strong>Device MAC:</strong> {id}</li>}
                  {url && <li><strong>Original URL:</strong> {url}</li>}
                  {ssis && <li><strong>SSID:</strong> {ssis}</li>}
                  {siteId && <li><strong>Site ID:</strong> {siteId}</li>}
                  {clientId && <li><strong>Client ID:</strong> {clientId}</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
