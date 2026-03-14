import { useEffect, useState } from 'react';
import { bookingsApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi.getUserBookings()
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'confirmed') return 'bg-success/20 text-success border-success/30';
    if (status === 'pending') return 'bg-primary/20 text-primary border-primary/30';
    return 'bg-destructive/20 text-destructive border-destructive/30';
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl tracking-wider mb-6">MY <span className="text-primary">BOOKINGS</span></h1>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <Ticket className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{b.movieId}</span>
                    <Badge className={getStatusColor(b.status)}>{b.status}</Badge>
                    <Badge className={getStatusColor(b.paymentStatus)}>Payment: {b.paymentStatus}</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date ? format(new Date(b.date), 'MMM dd, yyyy') : 'N/A'}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.showTime}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.hallId}</span>
                  </div>
                  <p className="text-sm">Seats: <span className="text-primary">{b.seats?.join(', ')}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
