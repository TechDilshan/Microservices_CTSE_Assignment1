import { useEffect, useState } from 'react';
import { hallsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SeatMap from '@/components/SeatMap';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const HOSeatBlock = () => {
  const { toast } = useToast();
  const [halls, setHalls] = useState<any[]>([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [form, setForm] = useState({ odcRows: '', odcColumns: '', balcony: '', box: '' });
  const [layout, setLayout] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    hallsApi.getAll().then(r => setHalls(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedHall) return;
    hallsApi.getSeatBlock(selectedHall).then(r => {
      const sb = r.data.seatBlock;
      if (sb) {
        setForm({
          odcRows: String(sb.odc?.rows || ''),
          odcColumns: String(sb.odc?.columns || ''),
          balcony: String(sb.numSeats?.Balcony || ''),
          box: String(sb.numSeats?.Box || ''),
        });
      }
      setLayout(r.data.layout);
    }).catch(() => { setLayout(null); setForm({ odcRows: '', odcColumns: '', balcony: '', box: '' }); });
  }, [selectedHall]);

  const handleSave = async () => {
    setSaving(true);
    const odcSeats = Number(form.odcRows) * Number(form.odcColumns);
    try {
      const res = await hallsApi.updateSeatBlock(selectedHall, {
        numSeats: { ODC: odcSeats, Balcony: Number(form.balcony), Box: Number(form.box) },
        odc: { rows: Number(form.odcRows), columns: Number(form.odcColumns) },
      });
      setLayout(res.data.layout);
      toast({ title: 'Seat block saved' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl tracking-wider mb-6">SEAT <span className="text-primary">BLOCKS</span></h2>

      <div className="glass-card p-6 space-y-6">
        <div>
          <Label>Select Hall</Label>
          <Select value={selectedHall} onValueChange={setSelectedHall}>
            <SelectTrigger><SelectValue placeholder="Choose a hall" /></SelectTrigger>
            <SelectContent>{halls.map(h => <SelectItem key={h._id} value={h._id}>{h.name} - {h.location}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {selectedHall && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><Label>ODC Rows</Label><Input type="number" value={form.odcRows} onChange={e => setForm({ ...form, odcRows: e.target.value })} /></div>
              <div><Label>ODC Columns</Label><Input type="number" value={form.odcColumns} onChange={e => setForm({ ...form, odcColumns: e.target.value })} /></div>
              <div><Label>Balcony Seats</Label><Input type="number" value={form.balcony} onChange={e => setForm({ ...form, balcony: e.target.value })} /></div>
              <div><Label>Box Seats</Label><Input type="number" value={form.box} onChange={e => setForm({ ...form, box: e.target.value })} /></div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save Seat Block'}
            </Button>

            {layout && (
              <div className="pt-6 border-t border-border">
                <h3 className="font-display text-xl tracking-wider mb-4">SEAT <span className="text-primary">PREVIEW</span></h3>
                <SeatMap layout={layout} readOnly />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HOSeatBlock;
