import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Film, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'hall_owner') return '/hall-owner';
    return '/my-bookings';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Film className="w-7 h-7 text-primary" />
          <span className="font-display text-2xl tracking-wider text-foreground">MOVIE HUB</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/movies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Movies</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <User className="w-4 h-4" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-2">
          <Link to="/" className="block py-2 text-muted-foreground" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/movies" className="block py-2 text-muted-foreground" onClick={() => setMenuOpen(false)}>Movies</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="block py-2 text-muted-foreground" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" className="block py-2 text-muted-foreground" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button className="block py-2 text-muted-foreground" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-muted-foreground" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 text-muted-foreground" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
