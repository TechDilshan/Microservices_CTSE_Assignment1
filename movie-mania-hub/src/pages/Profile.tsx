import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Trash2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authApi.updateProfile({ name, phone });
      updateUser(res.data.user);
      toast({ title: 'Profile updated' });
    } catch {
      toast({ title: 'Update failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account?')) return;
    try {
      await authApi.deleteProfile();
      logout();
      navigate('/');
      toast({ title: 'Account deleted' });
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <User className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="font-display text-3xl tracking-wider">MY PROFILE</h1>
          <p className="text-sm text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Update Profile'}
          </Button>
        </form>
        <Button variant="destructive" className="w-full" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" /> Delete Account
        </Button>
      </div>
    </div>
  );
};

export default Profile;
