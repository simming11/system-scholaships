"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ApiAuthService from '@/app/services/auth/ApiAuth';
import ApiService from '@/app/services/scholarships/ApiScholarShips';

interface User {
  StudentID?: number;
  AcademicID?: number;
  FullName: string;
  email: string;
  Surname: string;
  Username?: string;
}

interface Scholarship {
  StartDate?: Date;
  EndDate?: Date;
  CreatedBy?: string;
  TypeID?: string;
  ScholarshipName?: string;
  UploadFile?: string;
  ImagePath?: string;
  updated_at?: Date;
  created_at?: Date;
  ScholarshipID?: number;
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>('');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('savedIdentifier');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedIdentifier && savedPassword) {
      setIdentifier(savedIdentifier);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const fetchScholarshipsData = async () => {
      try {
        const response = await ApiService.getAllScholarships();
        const scholarshipsData = response.data;

        const updatedScholarships = await Promise.all(
          scholarshipsData.map(async (scholarship: Scholarship) => {
            if (scholarship.ScholarshipID) {
              try {
                const imageResponse = await ApiService.getImage(scholarship.ScholarshipID);
                if (imageResponse.status === 200) {
                  scholarship.ImagePath = imageResponse.data.imageUrl;
                }
              } catch (error) {
                console.error(`Error fetching image for scholarship ${scholarship.ScholarshipID}`, error);
              }
            }
            return scholarship;
          })
        );

        setScholarships(updatedScholarships);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scholarships', error);
        setLoading(false);
      }
    };

    fetchScholarshipsData();
  }, []);

  const handleLoginStudent = async () => {
    try {
      const response = await ApiAuthService.loginStudent(identifier, password);
      console.log('Login successful', response.data);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('UserRole', 'student');
      localStorage.setItem('UserID', user.StudentID?.toString() || '');
      if (rememberMe) {
        localStorage.setItem('savedIdentifier', identifier);
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedIdentifier');
        localStorage.removeItem('savedPassword');
      }
      router.push('./scholarships');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError('Login failed: ' + (error.response?.data.message || error.message));
      } else {
        setError('An unknown error occurred during login');
      }
      console.error('Login failed', error);
    }
  };

  const handleLoginAcademic = async () => {
    try {
      const response = await ApiAuthService.loginAcademic(identifier, password);
      console.log('Login successful', response.data);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('UserRole', 'admin');
      localStorage.setItem('AcademicID', user.AcademicID?.toString() || '');
      localStorage.setItem('Username', user.Username || '');
      if (rememberMe) {
        localStorage.setItem('savedIdentifier', identifier);
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedIdentifier');
        localStorage.removeItem('savedPassword');
      }
      router.push('./admins');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError('Login failed: ' + (error.response?.data.message || error.message));
      } else {
        setError('An unknown error occurred during login');
      }
      console.error('Login failed', error);
    }
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setIdentifier(value);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-yellow-400 p-4 text-center">
        <img src="/path/to/logo.png" alt="Logo" className="h-12 mx-auto" />
        <h1 className="text-xl font-bold">Student Scholarship Management System</h1>
        <h2 className="text-lg">Faculty of Science and Digital Innovation, Thaksin University</h2>
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-4">ทุนการศึกษาใหม่</h1>
          <div className="w-full max-w-2xl flex justify-between mb-4">
            <button className="bg-gray-200 p-2 rounded-full">←</button>
            <button className="bg-gray-200 p-2 rounded-full">→</button>
          </div>
          <div className="w-full max-w-2xl flex space-x-4 overflow-x-auto">
            {loading ? (
              <div className="w-full text-center">Loading scholarships...</div>
            ) : (
              scholarships.map((scholarship) => (
                <div key={scholarship.ScholarshipID} className="w-1/3 bg-white p-4 shadow-md rounded-lg flex-shrink-0">
                  <img src={scholarship.ImagePath} alt={scholarship.ScholarshipName} className="w-full h-40 object-cover rounded-lg" />
                  <p className="mt-2 text-center">{scholarship.ScholarshipName}</p>
                </div>
              ))
            )}
          </div>
        </main>
        <aside className="w-full md:w-1/4 bg-gray-100 p-4 flex flex-col items-center">
          <h1 className="text-xl font-bold mb-4">ลงชื่อเข้าใช้</h1>
          <form className="w-full max-w-xs" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="ID (numbers only)"
              value={identifier}
              onChange={handleIdentifierChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 bg-gray-200 p-1 rounded"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              )}
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label>Remember Me</label>
            </div>
            <div className="flex justify-between w-full">
              <button onClick={handleLoginStudent} className="bg-blue-500 text-white px-4 py-2 rounded w-1/2 mr-2">
                เข้าสู่ระบบ (นิสิต)
              </button>
              <button onClick={handleLoginAcademic} className="bg-green-500 text-white px-4 py-2 rounded w-1/2">
                เข้าสู่ระบบ (ผู้ดูแล)
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <p className="text-gray-600 mt-4">หากยังไม่ได้สมัคร <a href="./register" className="text-blue-500">ลงทะเบียนที่นี่</a></p>
          </form>
        </aside>
      </div>
      <footer className="bg-gray-200 p-4 text-center">
        <p>© 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
