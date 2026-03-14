import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Film, Building2, Users, Ticket, CreditCard, LayoutDashboard, Armchair } from 'lucide-react';
import HOOverview from './HOOverview';
import HOMovies from './HOMovies';
import HOBookings from './HOBookings';
import HOPayments from './HOPayments';
import HOCustomers from './HOCustomers';
import HOSeatBlock from './HOSeatBlock';

const navItems = [
  { label: 'Overview', href: '/hall-owner', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Movies', href: '/hall-owner/movies', icon: <Film className="w-4 h-4" /> },
  { label: 'Seat Blocks', href: '/hall-owner/seat-blocks', icon: <Armchair className="w-4 h-4" /> },
  { label: 'Bookings', href: '/hall-owner/bookings', icon: <Ticket className="w-4 h-4" /> },
  { label: 'Payments', href: '/hall-owner/payments', icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Customers', href: '/hall-owner/customers', icon: <Users className="w-4 h-4" /> },
];

const HallOwnerDashboard = () => (
  <DashboardLayout title="HALL OWNER" navItems={navItems}>
    <Routes>
      <Route index element={<HOOverview />} />
      <Route path="movies" element={<HOMovies />} />
      <Route path="seat-blocks" element={<HOSeatBlock />} />
      <Route path="bookings" element={<HOBookings />} />
      <Route path="payments" element={<HOPayments />} />
      <Route path="customers" element={<HOCustomers />} />
      <Route path="*" element={<Navigate to="/hall-owner" />} />
    </Routes>
  </DashboardLayout>
);

export default HallOwnerDashboard;
