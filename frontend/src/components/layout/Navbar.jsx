import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, LayoutDashboard, FileText, Archive,
         QrCode, Menu, X, Info, MessageSquare, Settings } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/directive', label: 'Directive',  icon: FileText        },
  { to: '/vault',     label: 'Vault',      icon: Archive         },
  { to: '/qr-card',  label: 'QR Card',    icon: QrCode          },
];

const publicLinks = [
  { to: '/about',    label: 'About',    icon: Info },
];

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const active = (to) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 border-b border-navy-600 bg-navy-800/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck size={17} className="text-white" />
            </div>
            <span className="font-display text-lg font-semibold text-white">WillTrail</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${active(to) ? 'bg-teal text-white' : 'text-navy-300 hover:text-white hover:bg-navy-700'}`}>
                <Icon size={14}/>{label}
              </Link>
            ))}

            {isAuthenticated && navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${active(to) ? 'bg-teal text-white' : 'text-navy-300 hover:text-white hover:bg-navy-700'}`}>
                <Icon size={14}/>{label}
              </Link>
            ))}

            {isModerator && (
              <Link to="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${active('/admin') ? 'bg-amber text-white' : 'text-amber-light hover:bg-amber/10'}`}>
                <Settings size={14}/>Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center">
                    <span className="text-teal text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm text-white leading-none">{user?.name}</p>
                    {user?.role !== 'user' && (
                      <span className="text-xs text-amber-light capitalize">{user.role}</span>
                    )}
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-navy-400 hover:text-crimson transition-colors text-sm">
                  <LogOut size={14}/>
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"    className="btn-ghost py-1.5 px-4 text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-navy-300 hover:text-white">
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-navy-600 bg-navy-800 px-4 py-3 space-y-1 animate-slide-up">
          {publicLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-navy-300 hover:text-white hover:bg-navy-700">
              <Icon size={15}/>{label}
            </Link>
          ))}
          {isAuthenticated && navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-navy-300 hover:text-white hover:bg-navy-700">
              <Icon size={15}/>{label}
            </Link>
          ))}
          {isModerator && (
            <Link to="/admin" onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-amber-light hover:bg-amber/10">
              <Settings size={15}/>Admin
            </Link>
          )}
          {isAuthenticated
            ? <button onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-crimson w-full">
                <LogOut size={15}/>Sign Out
              </button>
            : <div className="pt-2 flex gap-2">
                <Link to="/login"    className="btn-ghost flex-1 text-center text-sm py-2" onClick={() => setOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2" onClick={() => setOpen(false)}>Get Started</Link>
              </div>
          }
        </div>
      )}
    </nav>
  );
}
