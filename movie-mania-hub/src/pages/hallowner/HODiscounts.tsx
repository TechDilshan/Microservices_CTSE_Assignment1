import { useEffect, useState } from 'react';
import { discountsApi, hallsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const HODiscounts = () => {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [halls, setHalls] = useState<any[]>([]);
  const [form, setForm] = useState({
    hallId: '',
    type: 'DATE',
    date: '',
    minSeats: '',
    percentage: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => {
    Promise.all([discountsApi.getMine(), hallsApi.getAll()])
      .then(([d, h]) => {
        setDiscounts(d.data || []);
        setHalls(h.data || []);
      })
      .catch(() => {
        setDiscounts([]);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      hallId: '',
      type: 'DATE',
      date: '',
      minSeats: '',
      percentage: '',
      description: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      hallId: form.hallId,
      type: form.type,
      percentage: Number(form.percentage),
      description: form.description,
    };
    if (form.type === 'DATE') {
      payload.date = form.date;
    } else {
      payload.minSeats = Number(form.minSeats);
    }
    try {
      if (editingId) {
        await discountsApi.update(editingId, payload);
        toast({ title: 'Discount updated' });
      } else {
        await discountsApi.create(payload);
        toast({ title: 'Discount created' });
      }
      resetForm();
      load();
    } catch (err: any) {
      toast({
        title: 'Failed to save discount',
        description: err.response?.data?.message || 'Try again',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (d: any) => {
    setEditingId(d._id);
    setForm({
      hallId: d.hallId || '',
      type: d.type || 'DATE',
      date: d.date ? String(d.date).split('T')[0] : '',
      minSeats: d.minSeats ? String(d.minSeats) : '',
      percentage: String(d.percentage || ''),
      description: d.description || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount?')) return;
    try {
      await discountsApi.delete(id);
      toast({ title: 'Discount deleted' });
      load();
    } catch {
      toast({ title: 'Failed to delete discount', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl tracking-wider">MANAGE <span className="text-primary">DISCOUNTS</span></h2>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Hall</Label>
            <Select
              value={form.hallId}
              onValueChange={(v) => setForm((f) => ({ ...f, hallId: v }))}
            >
              <SelectTrigger><SelectValue placeholder="Select hall" /></SelectTrigger>
              <SelectContent>
                {halls.map((h) => (
                  <SelectItem key={h._id} value={h._id}>
                    {h.name} - {h.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v as 'DATE' | 'SEAT_COUNT' }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DATE">Special Date</SelectItem>
                <SelectItem value="SEAT_COUNT">Seat Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Percentage (%)</Label>
            <Input
              type="number"
              value={form.percentage}
              onChange={(e) => setForm((f) => ({ ...f, percentage: e.target.value }))}
              required
            />
          </div>
        </div>

        {form.type === 'DATE' ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Minimum Seats</Label>
              <Input
                type="number"
                value={form.minSeats}
                onChange={(e) => setForm((f) => ({ ...f, minSeats: e.target.value }))}
                required
              />
            </div>
          </div>
        )}

        <div>
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Optional description for this discount"
          />
        </div>

        <Button type="submit" className="w-full">
          {editingId ? 'Update Discount' : 'Create Discount'}
        </Button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {discounts.map((d) => (
          <div key={d._id} className="glass-card p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-sm">
                {d.type === 'DATE' ? 'Special Date Discount' : 'Seat Count Discount'}
              </div>
              <div className="text-primary font-bold text-sm">{d.percentage}%</div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Hall: {d.hallId}</div>
              {d.type === 'DATE' && d.date && (
                <div>Date: {String(d.date).split('T')[0]}</div>
              )}
              {d.type === 'SEAT_COUNT' && d.minSeats && (
                <div>Min Seats: {d.minSeats}</div>
              )}
              {d.description && <div>{d.description}</div>}
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button size="sm" variant="outline" onClick={() => handleEdit(d)}>Edit</Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(d._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {discounts.length === 0 && (
          <p className="text-muted-foreground text-sm">No discounts created yet.</p>
        )}
      </div>
    </div>
  );
};

export default HODiscounts;

