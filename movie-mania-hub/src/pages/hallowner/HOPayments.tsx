import { useEffect, useState } from 'react';
import { bookingsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

const HOPayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    bookingsApi.getPayments().then(r => setPayments(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (payId: string, status: string) => {
    try {
      await bookingsApi.updatePaymentStatus(payId, { status });
      toast({ title: 'Payment status updated' });
      load();
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  const handleDelete = async (payId: string) => {
    if (!confirm('Delete this payment?')) return;
    try { await bookingsApi.deletePayment(payId); toast({ title: 'Deleted' }); load(); } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  return (
    <div>
      <h2 className="font-display text-3xl tracking-wider mb-6">MANAGE <span className="text-primary">PAYMENTS</span></h2>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-3">
          {payments.map(p => (
            <div key={p.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Rs. {p.amount}</span>
                  <Badge variant="secondary">{p.method}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Booking: {p.bookingId?.slice(-6)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={p.status} onValueChange={v => handleStatusChange(p.id, v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
          {payments.length === 0 && <p className="text-muted-foreground">No payments.</p>}
        </div>
      )}
    </div>
  );
};

export default HOPayments;
