'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/components/header/Header';
import Footer from '@/app/components/footer/footer';
import styles from '../createApplication.module.css'; // Corrected the import path
import ApiApplicationWithAttachmentService from '@/app/services/applicationwithAttachment/api';

interface PersonalInfo {
  studentId: string;
  name: string;
  surname: string;
  year: string;
}

interface FamilyInfo {
  father: { name: string };
  mother: { name: string };
}

interface AcademicInfo {
  GPA: string;
}

interface ScholarshipHistory {
  history: string;
}

interface WorkHistory {
  company: string;
  position: string;
}

interface FinancialInfo {
  income: string;
}

interface FormData {
  StudentID: string | null;
  ScholarshipID: string | null;
  ApplicationDate: string;
  Status: string;
  Attachment: string;
  PersonalInfo: PersonalInfo;
  FamilyInfo: FamilyInfo;
  AcademicInfo: AcademicInfo;
  ScholarshipHistory: ScholarshipHistory;
  LoanAmount: string;
  MonthlyExpense: string;
  WorkHistory: WorkHistory;
  FinancialInfo: FinancialInfo;
  Reasons: string;
  Signature: string;
}

export default function CreateApplicationInternalPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('scholarshipId');
  const idStudent = localStorage.getItem('UserID');
  const token = localStorage.getItem('token');
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    StudentID: idStudent,
    ScholarshipID: id,
    ApplicationDate: '',
    Status: 'รออนุมัติ',
    Attachment: '',
    PersonalInfo: { studentId: '', name: '', surname: '', year: '' },
    FamilyInfo: { father: { name: '' }, mother: { name: '' } },
    AcademicInfo: { GPA: '' },
    ScholarshipHistory: { history: '' },
    LoanAmount: '',
    MonthlyExpense: '',
    WorkHistory: { company: '', position: '' },
    FinancialInfo: { income: '' },
    Reasons: '',
    Signature: ''
  });
  
  const [error, setError] = useState('');
  const [showSection, setShowSection] = useState({ studentScholarship: true, personalInfo: true, familyInfo: true });

  useEffect(() => {
    if (!token) {
      router.push('/page/login');
    }
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length === 1) {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData((prevFormData) => {
        const updatedFormData = { ...prevFormData };
        let currentLevel: any = updatedFormData;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!currentLevel[keys[i]]) currentLevel[keys[i]] = {};
          currentLevel = currentLevel[keys[i]];
        }

        currentLevel[keys[keys.length - 1]] = value;

        return updatedFormData;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        PersonalInfo: JSON.stringify(formData.PersonalInfo),
        FamilyInfo: JSON.stringify(formData.FamilyInfo),
        AcademicInfo: JSON.stringify(formData.AcademicInfo),
        ScholarshipHistory: JSON.stringify(formData.ScholarshipHistory),
        WorkHistory: JSON.stringify(formData.WorkHistory),
        FinancialInfo: JSON.stringify(formData.FinancialInfo),
        Signature: String,
        Reasons: String,
        LoanAmount: String,
        Attachment: String,
        MonthlyExpense: String
      };

      Object.keys(payload).forEach(key => {
        if (payload[key] === '' || payload[key] === "{}") {
          payload[key] = null;
        }
      });

      console.log(payload);
      await ApiApplicationWithAttachmentService.createApplication(payload);
      console.log(payload);
      router.push('/page/application');
    } catch (error) {
      setError('Error creating application. Please check the form fields and try again.');
      console.error('Error creating application:', error);
    }
  };

  const toggleSection = (section: keyof typeof showSection) => {
    setShowSection((prevShowSection) => ({
      ...prevShowSection,
      [section]: !prevShowSection[section],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Create Application</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className={`${styles.section} ${styles['section-studentScholarship']}`}>
              <h3 className={`${styles.sectionHeader}`} onClick={() => toggleSection('studentScholarship')}>
                ข้อมูลนักเรียนและทุนการศึกษา
                <span>{showSection.studentScholarship ? '' : ''}</span>
              </h3>
              {showSection.studentScholarship && (
                <>
                  <div className="mb-4">
                    <label htmlFor="ApplicationDate" className={styles.label}>วันที่สมัคร</label>
                    <input
                      type="date"
                      id="ApplicationDate"
                      name="ApplicationDate"
                      value={formData.ApplicationDate}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </>
              )}
            </div>

            <div className={`${styles.section} ${styles['section-personalInfo']}`}>
              <h3 className={`${styles.sectionHeader}`} onClick={() => toggleSection('personalInfo')}>
                ข้อมูลส่วนตัว
                <span>{showSection.personalInfo ? '' : ''}</span>
              </h3>
              {showSection.personalInfo && (
                <div className="mb-4">
                  <label htmlFor="PersonalInfo.studentId" className={styles.label}>รหัสนิสิต</label>
                  <input
                    type="text"
                    id="PersonalInfo.studentId"
                    name="PersonalInfo.studentId"
                    value={formData.PersonalInfo.studentId}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  <label htmlFor="PersonalInfo.name" className={styles.label}>ชื่อ</label>
                  <input
                    type="text"
                    id="PersonalInfo.name"
                    name="PersonalInfo.name"
                    value={formData.PersonalInfo.name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  <label htmlFor="PersonalInfo.surname" className={styles.label}>นามสกุล</label>
                  <input
                    type="text"
                    id="PersonalInfo.surname"
                    name="PersonalInfo.surname"
                    value={formData.PersonalInfo.surname}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  <label htmlFor="PersonalInfo.year" className={styles.label}>ชั้นปีที่</label>
                  <input
                    type="text"
                    id="PersonalInfo.year"
                    name="PersonalInfo.year"
                    value={formData.PersonalInfo.year}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              )}
            </div>

            <div className={`${styles.section} ${styles['section-familyInfo']}`}>
              <h3 className={`${styles.sectionHeader}`} onClick={() => toggleSection('familyInfo')}>
                ข้อมูลครอบครัว
                <span>{showSection.familyInfo ? '' : ''}</span>
              </h3>
              {showSection.familyInfo && (
                <>
                  <div className="mb-4">
                    <label htmlFor="FamilyInfo.father.name" className={styles.label}>ชื่อพ่อ</label>
                    <input
                      type="text"
                      id="FamilyInfo.father.name"
                      name="FamilyInfo.father.name"
                      value={formData.FamilyInfo.father.name}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="FamilyInfo.mother.name" className={styles.label}>ชื่อแม่</label>
                    <input
                      type="text"
                      id="FamilyInfo.mother.name"
                      name="FamilyInfo.mother.name"
                      value={formData.FamilyInfo.mother.name}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6"
            >
              สร้างใบสมัคร
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
