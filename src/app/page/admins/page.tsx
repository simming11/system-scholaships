// src/app/page/admins/page.tsx

"use client";

import ScholarshipDetail from '../scholarships/[id]/page';
import AdminComponent from './admins';

const AdminPage = () => {
  return (
    <div>
      <AdminComponent />
      <ScholarshipDetail />
    </div>
  );
}

export default AdminPage;
