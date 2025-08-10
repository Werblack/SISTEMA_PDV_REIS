import React, { useState } from 'react';
import { Settings, DollarSign, Percent, Palette, Store, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface StoreConfig {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  type: 'physical' | 'online';
}

const mockStores: StoreConfig[] = [
  { id: '1', name: 'Loja Principal', status: 'active', type: 'physical' },
  { id: '2', name: 'Filial Shopping', status: 'active', type: 'physical' },
  { id: '3', name: 'Loja Online', status: 'inactive', type: 'online' },
];

export default function Configuracoes() {
  const [stores, setStores] = useState<StoreConfig[]>(mockStores);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreConfig | null>(null);
  const { toast } = useToast();

  const [generalConfig, setGeneralConfig] = useState({
    currency: 'BRL',
    taxRate: '12',
    theme: 'yellow',
  });

  const [storeForm, setStoreForm] = useState({
    name: '',
    type: 'physical' as 'physical' | 'online',
    status: 'active' as 'active' | 'inactive',
  });

  const resetStoreForm = () => {
    setStoreForm({
      name: '',
      type: 'physical',
      status: 'active',
    });
    setEditingStore(null);
  };

  const openNewStoreDialog = () => {
    resetStoreForm();
    setIsStoreDialogOpen(true);
  };

  const openEditStoreDialog = (store: StoreConfig) => {
    setStoreForm({
      name: store.name,
      type: store.type,
      status: store.status,
    });
    setEditingStore(store);
    setIsStoreDialogOpen(true);
  };

  const handleSaveStore = () => {
    if (!storeForm.name) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome da loja.",
        variant: "destructive",
      });
      return;
    }

    const storeData: StoreConfig = {
      id: editingStore?.id || Date.now().toString(),
      name: storeForm.name,
      type: storeForm.type,
      status: storeForm.status,
    };

    if (editingStore) {
      setStores(stores.map(s => s.id === editingStore.id ? storeData : s));
      toast({
        title: "Loja atualizada",
        description: `${storeData.name} foi atualizada com sucesso.`,
      });
    } else {
      setStores([...stores, storeData]);
      toast({
        title: "Loja adicionada",
        description: `${storeData.name} foi adicionada ao sistema.`,
      });
    }

    setIsStoreDialogOpen(false);
    resetStoreForm();
  };

  const handleDeleteStore = (store: StoreConfig) => {
    setStores(stores.filter(s => s.id !== store.id));
    toast({
      title: "Loja removida",
      description: `${store.name} foi removida do sistema.`,
    });
  };

  const handleSaveGeneral = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações gerais foram atualizadas com sucesso.",
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-success text-success-foreground">Ativa</Badge>
      : <Badge variant="destructive">Inativa</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === 'physical' 
      ? <Badge variant="outline">Física</Badge>
      : <Badge variant="secondary">Online</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currency">Moeda</Label>
              <Select 
                value={generalConfig.currency} 
                onValueChange={(value) => setGeneralConfig({...generalConfig, currency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="taxRate">Taxa de Impostos (%)</Label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  value={generalConfig.taxRate}
                  onChange={(e) => setGeneralConfig({...generalConfig, taxRate: e.target.value})}
                  placeholder="0.00"
                  className="pr-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="theme">Cor do Tema</Label>
              <Select 
                value={generalConfig.theme} 
                onValueChange={(value) => setGeneralConfig({...generalConfig, theme: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yellow">Amarelo (Padrão)</SelectItem>
                  <SelectItem value="blue">Azul</SelectItem>
                  <SelectItem value="green">Verde</SelectItem>
                  <SelectItem value="purple">Roxo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveGeneral} className="btn-primary">
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Store Management */}
      <Card className="card-gradient">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Gerenciar Lojas
          </CardTitle>
          <Button onClick={openNewStoreDialog} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nova Loja
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Loja</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{getTypeBadge(store.type)}</TableCell>
                    <TableCell>{getStatusBadge(store.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditStoreDialog(store)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteStore(store)}
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

      {/* System Information */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Versão</h4>
              <p className="text-sm text-muted-foreground">SUA LOJA v1.0.0</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Última Atualização</h4>
              <p className="text-sm text-muted-foreground">15 de Janeiro de 2024</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Licença</h4>
              <p className="text-sm text-muted-foreground">Licença Comercial</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Suporte</h4>
              <p className="text-sm text-muted-foreground">suporte@sualoja.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Dialog */}
      <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingStore ? 'Editar Loja' : 'Nova Loja'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input
                id="storeName"
                value={storeForm.name}
                onChange={(e) => setStoreForm({...storeForm, name: e.target.value})}
                placeholder="Nome da loja"
              />
            </div>

            <div>
              <Label htmlFor="storeType">Tipo de Loja</Label>
              <Select 
                value={storeForm.type} 
                onValueChange={(value: 'physical' | 'online') => setStoreForm({...storeForm, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Física</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="storeStatus">Status</Label>
              <Select 
                value={storeForm.status} 
                onValueChange={(value: 'active' | 'inactive') => setStoreForm({...storeForm, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveStore} className="btn-primary">
              {editingStore ? 'Atualizar' : 'Salvar'} Loja
            </Button>
            <Button variant="outline" onClick={() => setIsStoreDialogOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}