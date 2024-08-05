"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ApiAuthService from '@/app/services/auth/ApiAuth';

interface User {
  StudentID?: number;
  AcademicID?: number;
  FullName: string;
  email: string;
  Surname: string;
  Username?: string;
}

export default function RegisterPage() {
  const [StudentID, setStudentID] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [PasswordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({
    StudentID: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    PasswordConfirmation: '',
    form: ''
  });

  const router = useRouter();

  useEffect(() => {
    const storedStudentID = sessionStorage.getItem('StudentID');
    const storedFirstName = sessionStorage.getItem('FirstName');
    const storedLastName = sessionStorage.getItem('LastName');
    const storedEmail = sessionStorage.getItem('Email');
    if (storedStudentID) setStudentID(storedStudentID);
    if (storedFirstName) setFirstName(storedFirstName);
    if (storedLastName) setLastName(storedLastName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('StudentID', StudentID);
    sessionStorage.setItem('FirstName', FirstName);
    sessionStorage.setItem('LastName', LastName);
    sessionStorage.setItem('Email', Email);
  }, [StudentID, FirstName, LastName, Email]);

  const handleRegister = async () => {
    let validationErrors = { ...errors };
    let hasErrors = false;

    // Validate each field before attempting to register
    if (!StudentID) {
      validationErrors.StudentID = 'Student ID is required';
      hasErrors = true;
    }
    if (!FirstName) {
      validationErrors.FirstName = 'First Name is required';
      hasErrors = true;
    }
    if (!LastName) {
      validationErrors.LastName = 'Last Name is required';
      hasErrors = true;
    }
    if (!Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      validationErrors.Email = 'Valid email address is required';
      hasErrors = true;
    }
    if (Password.length < 6) {
      validationErrors.Password = 'Password must be at least 6 characters';
      hasErrors = true;
    }
    if (Password !== PasswordConfirmation) {
      validationErrors.PasswordConfirmation = 'Passwords do not match';
      hasErrors = true;
    }

    setErrors(validationErrors);

    if (hasErrors) {
      setErrors({ ...validationErrors, form: 'Please correct the errors above and try again.' });
      return;
    }

    try {
      const response = await ApiAuthService.registerStudent(
        StudentID,
        Password,
        FirstName,
        LastName,
        Email
      );
      console.log('Registration successful', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('StudentID', StudentID);
      localStorage.setItem('FirstName', FirstName);
      localStorage.setItem('LastName', LastName);
      localStorage.setItem('Email', Email);

      // Clear session storage after successful registration
      sessionStorage.removeItem('StudentID');
      sessionStorage.removeItem('FirstName');
      sessionStorage.removeItem('LastName');
      sessionStorage.removeItem('Email');

      // Redirect to the scholarships page
      router.push('/page/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors({ ...errors, form: 'Registration failed: ' + (error.response?.data.message || error.message) });
      } else {
        setErrors({ ...errors, form: 'An unknown error occurred during registration' });
      }
      console.error('Registration failed', error);
    }
  };

  const handleStudentIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setStudentID(value);
      setErrors({ ...errors, StudentID: '' });
    } else {
      setErrors({ ...errors, StudentID: 'Student ID must be a number' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://example.com/background.jpg')" }}>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {errors.form && <p className="text-red-500 mb-4">{errors.form}</p>}
        <input
          type="text"
          placeholder="Student ID (number only)"
          value={StudentID}
          onChange={handleStudentIDChange}
          className="w-full p-2 mb-1 border border-gray-300 rounded"
        />
        {errors.StudentID && <p className="text-red-500 mb-4">{errors.StudentID}</p>}
        <input
          type="text"
          placeholder="First Name"
          value={FirstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-2 mb-1 border border-gray-300 rounded"
        />
        {errors.FirstName && <p className="text-red-500 mb-4">{errors.FirstName}</p>}
        <input
          type="text"
          placeholder="Last Name"
          value={LastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-2 mb-1 border border-gray-300 rounded"
        />
        {errors.LastName && <p className="text-red-500 mb-4">{errors.LastName}</p>}
        <input
          type="email"
          placeholder="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-1 border border-gray-300 rounded"
        />
        {errors.Email && <p className="text-red-500 mb-4">{errors.Email}</p>}
        <input
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-1 border border-gray-300 rounded"
        />
        {errors.Password && <p className="text-red-500 mb-4">{errors.Password}</p>}
        <input
          type="password"
          placeholder="Confirm Password"
          value={PasswordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full p-2 mb-1 border border-gray-300 rounded"
        />
        {errors.PasswordConfirmation && <p className="text-red-500 mb-4">{errors.PasswordConfirmation}</p>}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </div>
    </div>
  );
}
