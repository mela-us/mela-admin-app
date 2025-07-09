import { useState } from 'react';
import { BarChart, BookOpen, FileText, Grid, Home, Layers, Users } from 'lucide-react';
import MainHeader from '../components/MainHeader';
import Navigation from '../components/Navigation';

export default function DashboardLayout({ children }) {
  const [contentOpen, setContentOpen] = useState(true);

  const navigationItems = [
    { label: 'Trang chủ', href: '/dashboard', icon: Home },
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

  return (
    <div className="flex h-screen bg-slate-100">
      <Navigation items={navigationItems} title="MELA ADMIN" />
      <div className="ml-[16rem] flex-1 flex flex-col">
        <MainHeader navigationItems={navigationItems} />
        <main className="p-6 flex-1 overflow-auto bg-slate-100">{children}</main>
      </div>
    </div>
  );
}
