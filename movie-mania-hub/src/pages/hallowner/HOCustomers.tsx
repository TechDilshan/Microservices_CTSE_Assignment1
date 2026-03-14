import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

const HOCustomers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    usersApi.getAll().then(r => setCustomers(r.data.filter((u: any) => u.role === 'customer'))).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer?')) return;
    try { await usersApi.delete(id); toast({ title: 'Deleted' }); load(); } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  return (
    <div>
      <h2 className="font-display text-3xl tracking-wider mb-6">CUSTOMERS</h2>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-3">
          {customers.map(c => (
            <div key={c._id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.email} · {c.phone}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(c._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          ))}
          {customers.length === 0 && <p className="text-muted-foreground">No customers.</p>}
        </div>
      )}
    </div>
  );
};

export default HOCustomers;
