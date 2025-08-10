import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users as UsersIcon, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  active: boolean;
  stores: string[];
  lastAccess?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@sualoja.com',
    role: 'admin',
    active: true,
    stores: ['Loja Principal'],
    lastAccess: '2024-01-15 14:30',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@sualoja.com',
    role: 'operator',
    active: true,
    stores: ['Loja Principal', 'Filial Shopping'],
    lastAccess: '2024-01-15 09:15',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@sualoja.com',
    role: 'operator',
    active: false,
    stores: ['Filial Shopping'],
    lastAccess: '2024-01-10 16:45',
  },
];

const availableStores = ['Loja Principal', 'Filial Shopping', 'Loja Online'];

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator' as 'admin' | 'operator',
    active: true,
    stores: [] as string[],
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'operator',
      active: true,
      stores: [],
    });
    setEditingUser(null);
  };

  const openNewUserDialog = () => {
    resetForm();
    setIsUserDialogOpen(true);
  };

  const openEditUserDialog = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      stores: user.stores,
    });
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e e-mail.",
        variant: "destructive",
      });
      return;
    }

    const userData: User = {
      id: editingUser?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      active: formData.active,
      stores: formData.stores,
      lastAccess: editingUser?.lastAccess,
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? userData : u));
      toast({
        title: "Usuário atualizado",
        description: `${userData.name} foi atualizado com sucesso.`,
      });
    } else {
      setUsers([...users, userData]);
      toast({
        title: "Usuário adicionado",
        description: `${userData.name} foi adicionado ao sistema.`,
      });
    }

    setIsUserDialogOpen(false);
    resetForm();
  };

  const handleDeleteUser = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast({
      title: "Usuário removido",
      description: `${user.name} foi removido do sistema.`,
    });
  };

  const toggleUserStatus = (user: User) => {
    const updatedUser = { ...user, active: !user.active };
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    
    toast({
      title: updatedUser.active ? "Usuário ativado" : "Usuário desativado",
      description: `${user.name} foi ${updatedUser.active ? 'ativado' : 'desativado'}.`,
    });
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? <Badge className="bg-primary text-primary-foreground">Administrador</Badge>
      : <Badge variant="outline">Operador</Badge>;
  };

  const getStatusBadge = (active: boolean) => {
    return active 
      ? <Badge className="bg-success text-success-foreground">Ativo</Badge>
      : <Badge variant="destructive">Inativo</Badge>;
  };

  const activeUsers = users.filter(user => user.active).length;
  const totalUsers = users.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <UsersIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Com acesso liberado
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
            <UserX className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalUsers - activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Acesso bloqueado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openNewUserDialog} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Users Table */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Usuários ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Lojas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.stores.map((store, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {store}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.active)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastAccess || 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditUserDialog(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.active ? (
                            <UserX className="w-4 h-4 text-destructive" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-success" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome do usuário"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="role">Perfil de Acesso</Label>
              <Select value={formData.role} onValueChange={(value: 'admin' | 'operator') => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operator">Operador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lojas com Acesso</Label>
              <div className="space-y-2 mt-2">
                {availableStores.map((store) => (
                  <div key={store} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={store}
                      checked={formData.stores.includes(store)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, stores: [...formData.stores, store]});
                        } else {
                          setFormData({...formData, stores: formData.stores.filter(s => s !== store)});
                        }
                      }}
                      className="rounded border-border"
                    />
                    <Label htmlFor={store} className="text-sm">{store}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
              />
              <Label htmlFor="active">Usuário ativo</Label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveUser} className="btn-primary">
              {editingUser ? 'Atualizar' : 'Salvar'} Usuário
            </Button>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}