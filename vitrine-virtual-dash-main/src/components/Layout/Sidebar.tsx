import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Upload, 
  Users, 
  Settings,
  Store as StoreIcon,
  LogOut
} from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/pdv', icon: ShoppingCart, label: 'PDV' },
  { path: '/estoque', icon: Package, label: 'Estoque' },
  { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { path: '/importacao', icon: Upload, label: 'Importação' },
  { path: '/usuarios', icon: Users, label: 'Usuários' },
  { path: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const { currentStore, currentUser, setCurrentUser } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="w-64 h-screen bg-sidebar-background border-r border-sidebar-border flex flex-col">
      {/* Store Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            {currentStore.logo ? (
              <img src={currentStore.logo} alt={currentStore.name} className="w-8 h-8 rounded" />
            ) : (
              <StoreIcon className="w-6 h-6 text-primary-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">{currentStore.name}</h1>
            <p className="text-xs text-sidebar-foreground/60">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser?.photo} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {currentUser?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {currentUser?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {currentUser?.role === 'admin' ? 'Administrador' : 'Operador'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground hover:text-destructive"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sair</span>
        </Button>
      </div>
    </div>
  );
}