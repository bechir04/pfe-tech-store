"use client";

import * as React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {children}
      </div>
    </AdminAuthProvider>
  );
} 