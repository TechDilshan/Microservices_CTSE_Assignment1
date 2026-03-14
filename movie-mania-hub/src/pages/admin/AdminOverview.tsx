import { useEffect, useState } from 'react';
import { usersApi, hallsApi } from '@/lib/api';
import { Users, Building2 } from 'lucide-react';

const AdminOverview = () => {
  const [owners, setOwners] = useState(0);
  const [halls, setHalls] = useState(0);

  useEffect(() => {
    usersApi.getHallOwners().then(r => setOwners(r.data.length)).catch(() => {});
    hallsApi.getAll().then(r => setHalls(r.data.length)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="font-display text-3xl tracking-wider mb-6">DASHBOARD</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{owners}</p>
            <p className="text-sm text-muted-foreground">Hall Owners</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{halls}</p>
            <p className="text-sm text-muted-foreground">Total Halls</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
