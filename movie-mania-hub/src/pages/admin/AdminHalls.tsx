import { useEffect, useState } from 'react';
import { hallsApi, usersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';

const AdminHalls = () => {
  const { toast } = useToast();
  const [halls, setHalls] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ hallOwnerId: '', name: '', location: '', hallImageUrl: '' });

  const load = () => {
    setLoading(true);
    Promise.all([hallsApi.getAll(), usersApi.getHallOwners()])
      .then(([h, o]) => { setHalls(h.data); setOwners(o.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await hallsApi.update(editingId, { name: form.name, location: form.location, hallImageUrl: form.hallImageUrl });
        toast({ title: 'Hall updated' });
      } else {
        await hallsApi.create(form);
        toast({ title: 'Hall created' });
      }
      setDialogOpen(false);
      setEditingId(null);
      setForm({ hallOwnerId: '', name: '', location: '', hallImageUrl: '' });
      load();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', variant: 'destructive' });
    }
  };

  const handleEdit = (hall: any) => {
    setEditingId(hall._id);
    setForm({ hallOwnerId: hall.hallOwnerId, name: hall.name, location: hall.location, hallImageUrl: hall.hallImageUrl || '' });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hall?')) return;
    try { await hallsApi.delete(id); toast({ title: 'Deleted' }); load(); } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  const getOwnerName = (id: string) => owners.find(o => o._id === id)?.name || id;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-3xl tracking-wider">MANAGE <span className="text-primary">HALLS</span></h2>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setForm({ hallOwnerId: '', name: '', location: '', hallImageUrl: '' }); } }}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" /> Add Hall</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display text-xl tracking-wider">{editingId ? 'EDIT' : 'CREATE'} HALL</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <div>
                  <Label>Hall Owner</Label>
                  <Select value={form.hallOwnerId} onValueChange={v => setForm({ ...form, hallOwnerId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                    <SelectContent>{owners.map(o => <SelectItem key={o._id} value={o._id}>{o.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required /></div>
              <div><Label>Image URL</Label><Input value={form.hallImageUrl} onChange={e => setForm({ ...form, hallImageUrl: e.target.value })} /></div>
              <Button type="submit" className="w-full">{editingId ? 'Update' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {halls.map(h => (
            <div key={h._id} className="glass-card p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{h.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{h.location}</p>
                  <p className="text-xs text-muted-foreground">Owner: {getOwnerName(h.hallOwnerId)}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(h)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(h._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </div>
          ))}
          {halls.length === 0 && <p className="text-muted-foreground">No halls yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminHalls;
