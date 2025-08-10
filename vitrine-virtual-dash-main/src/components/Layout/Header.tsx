import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title: string;
  breadcrumbs?: string[];
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  return (
    <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          {breadcrumbs?.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              <span>{crumb}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar..."
            className="pl-10 w-80"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive text-destructive-foreground flex items-center justify-center">
            3
          </Badge>
        </Button>
      </div>
    </div>
  );
}