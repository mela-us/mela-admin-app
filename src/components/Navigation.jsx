import { BookOpen, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Navigation({ items, title }) {
  return (
    <nav className="fixed z-50 w-64 h-screen flex flex-col border-r border-gray-200 shadow-md sidebar-image">
      {/* Sidebar Title */}
      <div className="p-4 border-b border-gray-500 flex items-center gap-3.5 mb-3">
        <div className="relative h-12 w-12 flex items-center justify-center rounded-2xl shadow-2xl bg-purple-500">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-purple-500">
            {title || 'MELA WEB'}
          </span>
          <p className="text-sm font-semibold text-gray-200">Quản lý nội dung học</p>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="flex-1 p-3 space-y-2">
        {items.map((item) => {
          const IconComponent = item.icon;
          if (item.isCollapsible) {
            return (
              <li key={item.href}>
                <button
                  onClick={item.onToggle}
                  className={`w-full flex justify-between items-center p-3 rounded-t-lg text-base font-medium text-white bg-purple-900 hover:bg-purple-700 transition-all duration-200 ${
                    item.isOpen ? 'rounded-b-none' : 'rounded-b-lg'
                  }`}
                >
                  <span className="flex items-center">
                    <IconComponent className="mr-4 h-6 w-6" />
                    {item.label}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-0' : 'rotate-180'}`} />
                </button>
                {item.isOpen && (
                  <ul
                    className={`flex flex-col px-4 py-2 space-y-1 rounded-b-lg border-purple-400/20 ${
                      item.isOpen ? 'border-b-2 border-x-2' : 'border-none'
                    }`}
                  >
                    {item.subItems.map((subItem) => (
                      <li key={subItem.href}>
                        <NavLink
                          to={subItem.href}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 p-2 rounded-md transition-colors duration-200 font-semibold text-gray-300 text-sm ${
                              isActive ? 'bg-gray-200 text-gray-900' : 'hover:text-white hover:bg-purple-700/30'
                            }`
                          }
                        >
                          <subItem.icon className="mr-2 h-5 w-5" />
                          {subItem.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }
          return (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-md transition-colors duration-200 text-gray-300 ${
                    isActive ? 'bg-gray-200 text-gray-900' : 'hover:text-white hover:bg-purple-700/30'
                  }`
                }
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-base font-medium">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
