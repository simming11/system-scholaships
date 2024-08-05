"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/header/Header';
import ApiService from '@/app/services/scholarships/ApiScholarShips';
import Footer from '@/app/components/footer/footer';
import Sidebar from '@/app/components/Sidebar/Sidebar';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Scholarship {
  Description?: string;
  Type: any;
  StartDate?: Date;
  EndDate?: Date;
  CreatedBy?: string;
  TypeID?: string;
  ScholarshipName?: string;
  UploadFile?: string;
  updated_at?: string;
  created_at?: string;
  ScholarshipID?: number;
}

export default function ScholarShipsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState<string>('');
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const fetchUserData = () => {
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchScholarshipsData = async () => {
      try {
        const response = await ApiService.getAllScholarships();
        setScholarships(response.data);
        setFilteredScholarships(response.data); // Initialize filtered scholarships
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching scholarships', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarshipsData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const getStatus = (startDate?: Date, endDate?: Date): string => {
    const now = new Date();
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (now >= start && now <= end) {
        return "เปิดรับอยู่";
      }
    }
    return "ปิดรับแล้ว";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8 flex space-x-8">
        <Sidebar />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-6">ข่าวประกาศ</h2>
          <ul className="space-y-4">
            {filteredScholarships.map((scholarship) => (
              <li key={scholarship.ScholarshipID} className="flex items-start justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    <Link href={`/page/scholarships/detail?id=${scholarship.ScholarshipID}`}>
                      {scholarship.ScholarshipName}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-1">{scholarship.Description}</p>
                  <p className="text-gray-500 text-sm">Posted on: {scholarship.StartDate ? new Date(scholarship.StartDate).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-gray-500 text-sm">{getStatus(scholarship.StartDate, scholarship.EndDate)}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm">{Math.floor(Math.random() * 1000)} views</span> {/* Simulate views count */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
