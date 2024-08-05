'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/components/header/Header';
import Footer from '@/app/components/footer/footer';
import ApiApplicationWithAttachmentService from '@/app/services/applicationwithAttachment/api';

interface Attachment {
  AttachmentID: number;
  applicationId: number;
  FilePath: string;
  created_at: string;
  updated_at: string;
}

interface Application {
  ApplicationID: number;
  StudentID: number;
  ScholarshipID: number;
  ApplicationDate: string;
  Status: string;
  Attachment: string;
  PersonalInfo: string;
  FamilyInfo: string;
  AcademicInfo: string;
  ScholarshipHistory: string;
  LoanAmount: number;
  MonthlyExpense: number;
  WorkHistory: string;
  FinancialInfo: string;
  Reasons: string;
  Signature: string;
  created_at: string;
  updated_at: string;
  attachments?: Attachment[];
}

export default function ApplicationDetail() {
  const router = useRouter(); // Hook for navigation
  const searchParams = useSearchParams(); // Get search params from the URL
  const id = searchParams.get('id'); // Extract the ID from the query parameters
  const [application, setApplication] = useState<Application | null>(null); // State to store application data
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Effect to fetch application data
  useEffect(() => {
    if (id) {
      const fetchApplication = async () => {
        console.log("Fetching application details for id:", id);
        try {
          // Fetch application details along with attachments
          const response = await ApiApplicationWithAttachmentService.getApplicationAttachments(Number(id));
          const applicationData = response.data;
          console.log("Application data fetched:", applicationData);

          setApplication(applicationData); // Set application data
        } catch (error) {
          console.error('Error fetching application details', error);
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      };

      fetchApplication();
    }
  }, [id]);

  // Display loading spinner if data is still being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Display a message if no application data is found
  if (!application) {
    return <p>Application not found</p>;
  }

  // Function to download the file
//   const downloadFile = async (fileName: string) => {
//     try {
//       const response = await ApiApplicationWithAttachmentService.downloadFile(Number(id), fileName); // Fetch the file
//       const url = window.URL.createObjectURL(new Blob([response.data])); // Create a URL for the file

//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', fileName); // Use the original filename
//       document.body.appendChild(link);
//       link.click(); // Programmatically click the link to trigger the download

//       // Clean up
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading file', error);
//     }
//   };

  return (
    <div className="min-h-screen flex flex-col">
      <Header /> {/* Header component */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Application ID: {application.ApplicationID}</h2>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Status:</span> {application.Status}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Personal Info:</span> {application.PersonalInfo}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Family Info:</span> {application.FamilyInfo}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Academic Info:</span> {application.AcademicInfo}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Scholarship History:</span> {application.ScholarshipHistory}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Loan Amount:</span> {application.LoanAmount}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Monthly Expense:</span> {application.MonthlyExpense}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Work History:</span> {application.WorkHistory}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Financial Info:</span> {application.FinancialInfo}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Reasons:</span> {application.Reasons}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold">Signature:</span> {application.Signature}</p>
          {application.attachments && application.attachments.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Attachments:</h3>
              <ul>
                {application.attachments.map((attachment: Attachment) => (
                  <li key={attachment.AttachmentID} className="flex items-center justify-between mt-2">
                    <span className="text-gray-700">{attachment.FilePath.split('/').pop()}</span>
                    {/* <button
                      onClick={() => downloadFile(attachment.FilePath.split('/').pop()!)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
                    >
                      Download
                    </button> */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Footer /> {/* Footer component */}
    </div>
  );
}
