import { useState } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ChevronDown, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MainHeader({ navigationItems = [] }) {
  const location = useLocation();
  const { state, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const generateBreadcrumb = () => {
    const breadcrumbs = [];
    const currentItem = navigationItems.find(
      (item) =>
        item.href === location.pathname ||
        location.pathname.startsWith(item.href) ||
        (item.subItems && item.subItems.some((sub) => location.pathname.startsWith(sub.href))),
    );
    if (currentItem) {
      if (currentItem.subItems) {
        const activeSubItem = currentItem.subItems.find((sub) => location.pathname.startsWith(sub.href));
        if (activeSubItem) {
          breadcrumbs.push({
            label: currentItem.label,
            href: currentItem.href,
            icon: currentItem.icon,
          });
          breadcrumbs.push({
            label: activeSubItem.label,
            href: activeSubItem.href,
            icon: activeSubItem.icon,
          });
        } else {
          breadcrumbs.push({
            label: currentItem.label,
            href: currentItem.href,
            icon: currentItem.icon,
          });
        }
      } else {
        breadcrumbs.push({
          label: currentItem.label,
          href: currentItem.href,
          icon: currentItem.icon,
        });
      }
    }
    return breadcrumbs;
  };
  const breadcrumbs = generateBreadcrumb();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 relative z-40">
      {/* Left side: Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.href}>
              {index < breadcrumbs.length - 1 ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href} className="flex items-center gap-1.5">
                      <crumb.icon className="w-4 h-4 text-gray-600" />
                      <span>{crumb.label}</span>
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <crumb.icon className="w-4 h-4 text-gray-600" />
                  <span>{crumb.label}</span>
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right side: Avatar with Logout */}
      <div className="flex items-center space-x-4">
        <DropdownMenu open={showProfileMenu} onOpenChange={setShowProfileMenu}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-white font-semibold text-sm bg-pink-400">
                  {state.user?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="block text-left">
                <div className="text-sm font-medium text-gray-900">{state.user?.username}</div>
                <div className="text-xs capitalize text-gray-500">{state.user?.role}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200 rounded-lg shadow-lg p-2">
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 hover:bg-red-50 flex items-center space-x-2 text-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
      <div className="absolute bottom-5 left-80 w-5 h-5 bg-purple-400/20 rounded-full animate-pulse delay-500" />
      <div className="absolute bottom-3 right-80 w-4 h-4 bg-pink-400/30 rounded-full animate-ping delay-1000" />
    </header>
  );
}
