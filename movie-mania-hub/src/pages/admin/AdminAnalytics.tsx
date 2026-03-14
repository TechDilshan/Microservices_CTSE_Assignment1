import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { Film, Ticket, Building2, CreditCard } from 'lucide-react';

const AdminAnalytics = () => {
  const [stats, setStats] = useState<{ halls: number; movies: number; bookings: number; payments: number; revenue: number }>({
    halls: 0,
    movies: 0,
    bookings: 0,
    payments: 0,
    revenue: 0,
  });

  useEffect(() => {
    analyticsApi.getAdminOverview()
      .then((res) => setStats(res.data))
      .catch(() => setStats({ halls: 0, movies: 0, bookings: 0, payments: 0, revenue: 0 }));
  }, []);

  const cards = [
    { label: 'Halls', value: stats.halls, icon: <Building2 className="w-6 h-6 text-primary" /> },
    { label: 'Movies', value: stats.movies, icon: <Film className="w-6 h-6 text-primary" /> },
    { label: 'Bookings', value: stats.bookings, icon: <Ticket className="w-6 h-6 text-primary" /> },
    { label: 'Payments', value: stats.payments, icon: <CreditCard className="w-6 h-6 text-primary" /> },
  ];

  return (
    <div>
      <h2 className="font-display text-3xl tracking-wider mb-6">ANALYTICS</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {c.icon}
            </div>
            <div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <p className="text-sm text-muted-foreground mb-2">Total Revenue (all halls)</p>
        <p className="text-3xl font-bold text-primary">Rs. {stats.revenue?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
};

export default AdminAnalytics;

