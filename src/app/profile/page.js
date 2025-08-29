'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import apiClient from '@/app/utils/apiClient';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    email: '',
    role: '',
    createdAt: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await apiClient.getProfile();
        setProfileData({
          email: data.email || '',
          role: data.role || data.role_name || '',
          createdAt: data.created_at || data.createdAt || ''
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await apiClient.logout();
    router.replace('/');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            </div>
                         <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>



      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        
                 {!isLoading && !error && (
           <div className="space-y-6">
             <div className="bg-white shadow rounded-lg">
               <div className="px-4 py-5 sm:p-6">
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-4">
                     <div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center">
                       <span className="text-2xl font-bold text-white">
                         {profileData.email ? profileData.email[0].toUpperCase() : 'U'}
                       </span>
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900">
                         {profileData.email ? profileData.email.split('@')[0] : 'User'}
                       </h2>
                       <p className="text-gray-600">{profileData.email}</p>
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 uppercase mb-2">
                       Email Address
                     </label>
                     <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                       {profileData.email || 'Not available'}
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 uppercase mb-2">
                       Role
                     </label>
                     <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                       {profileData.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : 'Not available'}
                     </div>
                   </div>

                   <div className="sm:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 uppercase mb-2">
                       Account Created
                     </label>
                     <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                       {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric',
                         hour: '2-digit',
                         minute: '2-digit'
                       }) : 'Not available'}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

      
      </main>
    </div>
  );
}
