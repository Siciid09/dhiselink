// src/components/AdminSidebar.tsx
import React from 'react';
import Link from 'next/link';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Settings', href: '/admin/settings' },
    { name: 'Reports', href: '/admin/reports' },
  ];

  return (
    <div style={{ width: 220, background: '#1f2937', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Admin Panel</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.href} style={{ marginBottom: '15px' }}>
            <Link href={item.href} style={{ color: '#fff', textDecoration: 'none' }}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
