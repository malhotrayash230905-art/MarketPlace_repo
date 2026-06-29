import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Users, Grid, PlusCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/category/mens', label: 'Mens', icon: <Users size={20} /> },
    { path: '/category/womens', label: 'Womens', icon: <ShoppingBag size={20} /> },
    { path: '/category/general', label: 'General', icon: <Grid size={20} /> },
    { path: '/sell', label: 'Sell an Item', icon: <PlusCircle size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#FFF1D6]/70 backdrop-blur-md border-r-2 border-dark/10 min-h-[calc(100vh-112px)] p-6 sticky top-28 hidden md:block shadow-[4px_0px_10px_-5px_rgba(0,0,0,0.05)]">
      <nav className="space-y-2 flex flex-col h-full">
        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border-2 ${
                  isActive
                    ? 'bg-blue-50 text-primary font-medium border-transparent'
                    : 'text-gray-600 border-transparent hover:bg-white hover:text-dark hover:-translate-y-0.5 hover:border-dark hover:shadow-[2px_2px_0px_0px_#3F3A34]'
                }`
              }
            >
              <div className="text-gray-400 group-hover:text-primary transition-colors">
                {item.icon}
              </div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group hover:-translate-y-0.5"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
