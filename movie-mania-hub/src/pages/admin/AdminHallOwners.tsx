import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const AdminHallOwners = () => {
  const { toast } = useToast();
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const load = () => {
    setLoading(true);
    usersApi.getHallOwners().then(r => setOwners(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await usersApi.update(editingId, { name: form.name, phone: form.phone });
        toast({ title: 'Hall owner updated' });
      } else {
        await usersApi.createHallOwner(form);
        toast({ title: 'Hall owner created' });
      }
      setDialogOpen(false);
      setEditingId(null);
      setForm({ name: '', email: '', password: '', phone: '' });
      load();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', variant: 'destructive' });
    }
  };

  const handleEdit = (owner: any) => {
    setEditingId(owner._id);
    setForm({ name: owner.name, email: owner.email, password: '', phone: owner.phone });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hall owner?')) return;
    try {
      await usersApi.delete(id);
      toast({ title: 'Deleted' });
      load();
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-3xl tracking-wider">HALL <span className="text-primary">OWNERS</span></h2>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setForm({ name: '', email: '', password: '', phone: '' }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-1" /> Add Owner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display text-xl tracking-wider">{editingId ? 'EDIT' : 'CREATE'} HALL OWNER</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              {!editingId && <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>}
              {!editingId && <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>}
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
              <Button type="submit" className="w-full">{editingId ? 'Update' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-3">
          {owners.map(o => (
            <div key={o._id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{o.name}</p>
                <p className="text-sm text-muted-foreground">{o.email} · {o.phone}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(o)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(o._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
          {owners.length === 0 && <p className="text-muted-foreground">No hall owners yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminHallOwners;
