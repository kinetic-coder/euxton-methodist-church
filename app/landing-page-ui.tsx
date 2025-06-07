"use client"

import Image from "next/image";
import { useState } from "react";

interface LandingPageUIProps {
  ap?: string;
  id?: string;
  url?: string;
  ssis?: string;
}

export default function LandingPageUI({ ap, id, url, ssis }: LandingPageUIProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [safeguardingAccepted, setSafeguardingAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSafeguarding, setShowSafeguarding] = useState(false);
  const [hasOpenedTerms, setHasOpenedTerms] = useState(false);
  const [hasOpenedSafeguarding, setHasOpenedSafeguarding] = useState(false);
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);

  const handleAccept = () => {
    if (termsAccepted && safeguardingAccepted) {
      // TODO: Implement actual acceptance logic (e.g., redirect to main content)
      console.log("Wifi Acceptable Use Policy and Safeguarding Policy accepted, and both have been opened!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Euxton Methodist Church Wi-Fi
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Before continuing, please read and accept our Wi-Fi Acceptable Use Policy and Safeguarding Policy.
          </p>

        </div>

        <div className="space-y-8">
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

          {/* Accept Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAccept}
              disabled={!(termsAccepted && safeguardingAccepted && hasOpenedTerms && hasOpenedSafeguarding)}
              className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors ${
                termsAccepted && safeguardingAccepted
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {termsAccepted && safeguardingAccepted ? "Accept and Continue" : "Please accept both documents"}
            </button>
          </div>
        </div>

        {/* Collapsible Connection Parameters Section */}
        {(ap || id || url || ssis) && (
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
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
