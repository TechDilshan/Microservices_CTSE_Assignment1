import { useEffect, useState } from 'react';
import { moviesApi, bookingsApi, hallsApi } from '@/lib/api';
import { Film, Ticket, Building2, CreditCard } from 'lucide-react';

const HOOverview = () => {
  const [stats, setStats] = useState({ movies: 0, bookings: 0, halls: 0, payments: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const hallsRes = await hallsApi.getAll();
        const halls = hallsRes.data || [];
        const hallIds = new Set(halls.map((h: any) => h._id).filter(Boolean));

        let myMovies = 0;
        try {
          const moviesRes = await moviesApi.getAll();
          const allMovies = moviesRes.data || [];
          myMovies = allMovies.filter((m: any) => m.hallId && hallIds.has(m.hallId)).length;
        } catch {
          myMovies = 0;
        }

        const bookings = await bookingsApi.getAll().then(r => (r.data || []).length).catch(() => 0);
        const payments = await bookingsApi.getPayments().then(r => (r.data || []).length).catch(() => 0);

        setStats({ movies: myMovies, bookings, halls: halls.length, payments });
      } catch {
        setStats({ movies: 0, bookings: 0, halls: 0, payments: 0 });
      }
    };

    load();
  }, []);

  const cards = [
    { label: 'My Halls', value: stats.halls, icon: <Building2 className="w-6 h-6 text-primary" /> },
    { label: 'Movies', value: stats.movies, icon: <Film className="w-6 h-6 text-primary" /> },
    { label: 'Bookings', value: stats.bookings, icon: <Ticket className="w-6 h-6 text-primary" /> },
    { label: 'Payments', value: stats.payments, icon: <CreditCard className="w-6 h-6 text-primary" /> },
  ];

  return (
    <div>
      <h2 className="font-display text-3xl tracking-wider mb-6">DASHBOARD</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">{c.icon}</div>
            <div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HOOverview;
