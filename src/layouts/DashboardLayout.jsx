import { useState } from 'react';
import { BarChart, BookOpen, ChartPie, FileText, Grid, Home, Layers, Users } from 'lucide-react';
import MainHeader from '../components/MainHeader';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout({ children }) {
  const [contentOpen, setContentOpen] = useState(true);
  const { state } = useAuth();

  let navigationItems = null;
  if (state.user && state.user.userRole.toLowerCase() === 'admin') {
    navigationItems = [
      { label: 'Trang chủ', href: '/dashboard', icon: Home },
      { label: 'Thống kê', href: '/report', icon: ChartPie },
      { label: 'Người dùng', href: '/users', icon: Users },
      {
        label: 'Nội dung',
        href: '#',
        icon: BarChart,
        isCollapsible: true,
        isOpen: contentOpen,
        onToggle: () => setContentOpen(!contentOpen),
        subItems: [
          { label: 'Cấp độ', href: '/levels', icon: Layers },
          { label: 'Chủ đề', href: '/topics', icon: Grid },
          { label: 'Bài học', href: '/lectures', icon: BookOpen },
          { label: 'Luyện tập', href: '/exercises', icon: FileText },
        ],
      },
    ];
  } else if (state.user && state.user.userRole.toLowerCase() === 'contributor') {
    navigationItems = [
      { label: 'Trang chủ', href: '/dashboard', icon: Home },
      { label: 'Người dùng', href: '/users', icon: Users },
      { label: 'Bài học', href: '/lectures', icon: BookOpen },
      { label: 'Luyện tập', href: '/exercises', icon: FileText },
    ];
  } else {
    navigationItems = [];
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Navigation
        items={navigationItems}
        title={`${state.user.userRole.toUpperCase()}`}
        level={`${(state.user.userRole.toUpperCase() !== 'ADMIN' && state.user.levelTitle?.toLowerCase()) || 'tất cả các lớp'}`}
      />
      <div className="ml-[16rem] flex-1 flex flex-col">
        <MainHeader navigationItems={navigationItems} />
        <main className="p-6 flex-1 overflow-auto bg-slate-100">{children}</main>
      </div>
    </div>
  );
}
