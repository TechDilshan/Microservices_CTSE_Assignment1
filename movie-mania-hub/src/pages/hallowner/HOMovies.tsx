import { useEffect, useRef, useState } from 'react';
import { moviesApi, hallsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Clock, Globe, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HOMovies = () => {
  const { toast } = useToast();
  const [movies, setMovies] = useState<any[]>([]);
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    hallId: '', name: '', startDate: '', endDate: '', duration: '',
    language: '', genre: '', movieImageUrl: '', showTime: '',
    ODC_Full: '', ODC_Half: '', Balcony: '', Box: ''
  });

  const today = new Date().toISOString().split('T')[0];

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([moviesApi.getAll(), hallsApi.getAll()])
      .then(([m, h]) => {
        const hallsData = h.data || [];
        setHalls(hallsData);

        const myHallIds = new Set(
          hallsData
            .map((hall: any) => hall._id)
            .filter(Boolean)
        );

        const allMovies = m.data || [];
        const ownMovies = allMovies.filter((mv: any) =>
          mv.hallId && myHallIds.has(mv.hallId)
        );

        setMovies(ownMovies);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => setForm({
    hallId: '', name: '', startDate: '', endDate: '', duration: '',
    language: '', genre: '', movieImageUrl: '', showTime: '',
    ODC_Full: '', ODC_Half: '', Balcony: '', Box: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      toast({ title: 'Please select start and end dates', variant: 'destructive' });
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const now = new Date(today);

    if (start < now) {
      toast({ title: 'Invalid start date', description: 'Start date cannot be in the past.', variant: 'destructive' });
      return;
    }

    if (end < start) {
      toast({ title: 'Invalid end date', description: 'End date must be on or after start date.', variant: 'destructive' });
      return;
    }
    const data = {
      hallId: form.hallId,
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      duration: Number(form.duration),
      language: form.language,
      genre: form.genre,
      movieImageUrl: form.movieImageUrl,
      showTime: form.showTime.split(',').map(s => s.trim()),
      price: {
        ODC_Full: Number(form.ODC_Full),
        ODC_Half: Number(form.ODC_Half),
        Balcony: Number(form.Balcony),
        Box: Number(form.Box),
      }
    };
    try {
      if (editingId) {
        await moviesApi.update(editingId, data);
        toast({ title: 'Movie updated' });
      } else {
        await moviesApi.create(data);
        toast({ title: 'Movie created' });
      }
      setDialogOpen(false);
      setEditingId(null);
      resetForm();
      load();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', variant: 'destructive' });
    }
  };

  const handleEdit = (m: any) => {
    setEditingId(m._id);
    setForm({
      hallId: m.hallId, name: m.name,
      startDate: m.startDate?.split('T')[0] || '',
      endDate: m.endDate?.split('T')[0] || '',
      duration: String(m.duration), language: m.language, genre: m.genre,
      movieImageUrl: m.movieImageUrl || '',
      showTime: m.showTime?.join(', ') || '',
      ODC_Full: String(m.price?.ODC_Full || ''),
      ODC_Half: String(m.price?.ODC_Half || ''),
      Balcony: String(m.price?.Balcony || ''),
      Box: String(m.price?.Box || ''),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this movie?')) return;
    try { await moviesApi.delete(id); toast({ title: 'Deleted' }); load(); } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-3xl tracking-wider">MANAGE <span className="text-primary">MOVIES</span></h2>
        <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) { setEditingId(null); resetForm(); } }}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" /> Add Movie</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display text-xl tracking-wider">{editingId ? 'EDIT' : 'CREATE'} MOVIE</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Hall</Label>
                <Select value={form.hallId} onValueChange={v => setForm({ ...form, hallId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select hall" /></SelectTrigger>
                  <SelectContent>{halls.map(h => <SelectItem key={h._id} value={h._id}>{h.name} - {h.location}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Movie Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Date</Label>
                  <div className="relative">
                    <Input
                      ref={startDateRef}
                      type="date"
                      value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      min={today}
                      required
                      className="pr-10"
                    />
                    <CalendarIcon
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white cursor-pointer"
                      onClick={() => {
                        const el = startDateRef.current;
                        if (!el) return;
                        // @ts-ignore
                        if (typeof el.showPicker === 'function') {
                          // @ts-ignore
                          el.showPicker();
                        } else {
                          el.focus();
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>End Date</Label>
                  <div className="relative">
                    <Input
                      ref={endDateRef}
                      type="date"
                      value={form.endDate}
                      onChange={e => setForm({ ...form, endDate: e.target.value })}
                      min={form.startDate || today}
                      required
                      className="pr-10"
                    />
                    <CalendarIcon
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white cursor-pointer"
                      onClick={() => {
                        const el = endDateRef.current;
                        if (!el) return;
                        // @ts-ignore
                        if (typeof el.showPicker === 'function') {
                          // @ts-ignore
                          el.showPicker();
                        } else {
                          el.focus();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Duration (min)</Label><Input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required /></div>
                <div><Label>Language</Label><Input value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} required /></div>
                <div><Label>Genre</Label><Input value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} required /></div>
              </div>
              <div><Label>Image URL</Label><Input value={form.movieImageUrl} onChange={e => setForm({ ...form, movieImageUrl: e.target.value })} /></div>
              <div><Label>Show Times (comma separated, e.g. 10:00, 14:00)</Label><Input value={form.showTime} onChange={e => setForm({ ...form, showTime: e.target.value })} required /></div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider pt-2">Pricing</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>ODC Full</Label><Input type="number" value={form.ODC_Full} onChange={e => setForm({ ...form, ODC_Full: e.target.value })} /></div>
                <div><Label>ODC Half</Label><Input type="number" value={form.ODC_Half} onChange={e => setForm({ ...form, ODC_Half: e.target.value })} /></div>
                <div><Label>Balcony</Label><Input type="number" value={form.Balcony} onChange={e => setForm({ ...form, Balcony: e.target.value })} /></div>
                <div><Label>Box</Label><Input type="number" value={form.Box} onChange={e => setForm({ ...form, Box: e.target.value })} /></div>
              </div>
              <Button type="submit" className="w-full">{editingId ? 'Update' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map(m => {
            const isExpired = m.endDate && new Date(m.endDate) < new Date(today);
            return (
            <div
              key={m._id}
              className={`glass-card overflow-hidden ${isExpired ? 'opacity-60' : ''}`}
            >
              {m.movieImageUrl && <img src={m.movieImageUrl} alt={m.name} className="w-full h-40 object-cover" />}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-display text-lg tracking-wider">{m.name}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(m)} disabled={false}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(m._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{m.genre}</Badge>
                  <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />{m.language}</Badge>
                  <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{m.duration}m</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {m.startDate?.split('T')[0]} → {m.endDate?.split('T')[0]} {isExpired && <span className="ml-2 text-destructive font-medium">(Expired)</span>}
                </p>
                <p className="text-xs text-muted-foreground">Shows: {m.showTime?.join(', ')}</p>
              </div>
            </div>
          )})}
          {movies.length === 0 && <p className="text-muted-foreground">No movies yet.</p>}
        </div>
      )}
    </div>
  );
};

export default HOMovies;
