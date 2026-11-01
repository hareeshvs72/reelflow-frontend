import { useLocation } from 'react-router-dom';
import { Bell, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/upload': 'Upload Videos',
  '/library': 'Content Library',
  '/calendar': 'Schedule Calendar',
  '/queue': 'Publishing Queue',
  '/history': 'Publishing History',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = TITLES[pathname] || 'ReelFlow';

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-white/[0.06] bg-surface-50/30 backdrop-blur-sm shrink-0">
      <div>
        <h1 className="font-display font-bold text-white text-lg">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          id="btn-quick-upload"
          onClick={() => navigate('/upload')}
          className="btn-primary text-xs px-4 py-2"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
      </div>
    </header>
  );
}
