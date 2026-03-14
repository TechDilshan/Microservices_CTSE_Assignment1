import { useEffect, useState } from 'react';
import { bookingsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const HOBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    bookingsApi.getAll().then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await bookingsApi.update(id, { status });
      toast({ title: 'Status updated' });
      load();
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this booking?')) return;
    try { await bookingsApi.delete(id); toast({ title: 'Deleted' }); load(); } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  return (
    <div>
      <h2 className="font-display text-3xl tracking-wider mb-6">MANAGE <span className="text-primary">BOOKINGS</span></h2>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b._id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="font-semibold text-sm">{b._id.slice(-6)}</span>
                  <Badge variant="secondary">{b.paymentStatus}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {b.date ? format(new Date(b.date), 'MMM dd, yyyy') : ''} · {b.showTime} · Seats: {b.seats?.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={b.status} onValueChange={v => handleStatusChange(b._id, v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(b._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
          {bookings.length === 0 && <p className="text-muted-foreground">No bookings.</p>}
        </div>
      )}
    </div>
  );
};

export default HOBookings;
