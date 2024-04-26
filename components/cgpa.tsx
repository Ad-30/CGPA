
'use client'
import React, { useState } from 'react';
import {Loader} from '@/components/loader';
import axios from 'axios';
export default function Cgpa() {
  const [file, setFile] = useState(null);
  const [cgpa, setCgpa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleFileChange = async (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setLoading(true);
    if (!selectedFile) {
      setError('Please select a file.');
      setLoading(false);
      return;
    }
    setCgpa('');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post(
        '/api/cgpa',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
      );
      if (response.data && response.data.cgpa) {
        setCgpa(response.data.cgpa);
        setError('');
      } else {
        setError('Error calculating CGPA. Please try again.');
      }
    } catch (error) {
      // console.error('Error fetching CGPA:', error);
      setError('Invalid Request.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-50">
      <header className="bg-gray-900 py-4 px-6">
        <h1 className="text-2xl font-bold">SGPA Calculator</h1>
      </header>
      <main className="flex-1 py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-gray-900 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Upload Your Score Card</h2>
            <p className="text-gray-400 mb-6">To calculate your SGPA, please upload your Score Card file below.</p>
            <div className="flex items-center justify-center bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-8 cursor-pointer hover:bg-gray-700 transition-colors">
              <input className="sr-only" id="file-upload" type="file" onChange={handleFileChange} />
              <label className="flex flex-col items-center" htmlFor="file-upload">
                {loading ? <Loader /> : <UploadIcon className="h-8 w-8 text-gray-500 mb-2" />}
                {!loading && <span className="text-gray-500">Click to upload</span>}
              </label>
            </div>
          </div>
          {cgpa &&
          <div className="bg-gray-900 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Your SGPA</h2>
            <div className="flex items-center justify-center text-6xl font-bold text-gray-50">{cgpa}</div>
            <p className="text-gray-400 mt-4">
              Your Semester Grade Point Average (SGPA) is calculated based on the grades and credits of the courses you
              have taken this semester.
            </p>
          </div>}
          {error && 
            <div className="bg-red-500 rounded-lg shadow-md p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p className="text-gray-200">{error}</p>
                  </div>
                {/* <div className="h-1 bg-gray-200 rounded-full w-full absolute bottom-0 left-0 animate-timer" /> */}
              </div>
            </div>
          }
        </div>
      </main>
      <footer className="bg-gray-900 py-4 px-6 text-center">
        <p>© 2024 SGPA Calculator. All rights reserved.</p>
      </footer>
    </div>
  )
}

function UploadIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
