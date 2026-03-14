import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Building2, LayoutDashboard, BarChart3 } from 'lucide-react';
import AdminHallOwners from './AdminHallOwners';
import AdminHalls from './AdminHalls';
import AdminOverview from './AdminOverview';
import AdminAnalytics from './AdminAnalytics';

const navItems = [
  { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Hall Owners', href: '/admin/hall-owners', icon: <Users className="w-4 h-4" /> },
  { label: 'Halls', href: '/admin/halls', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
];

const AdminDashboard = () => (
  <DashboardLayout title="ADMIN PANEL" navItems={navItems}>
    <Routes>
      <Route index element={<AdminOverview />} />
      <Route path="hall-owners" element={<AdminHallOwners />} />
      <Route path="halls" element={<AdminHalls />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;
