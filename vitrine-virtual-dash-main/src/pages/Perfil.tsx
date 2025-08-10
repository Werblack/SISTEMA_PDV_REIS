import React, { useState } from 'react';
import { User, Store, Upload, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

export default function Perfil() {
  const { currentUser, currentStore, updateStore } = useStore();
  const { toast } = useToast();

  const [userForm, setUserForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const [storeForm, setStoreForm] = useState({
    name: currentStore.name,
    logo: currentStore.logo || '',
  });

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e e-mail.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Perfil atualizado",
      description: "Suas informações pessoais foram atualizadas com sucesso.",
    });
  };

  const handleSaveStore = () => {
    if (!storeForm.name) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da loja é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    updateStore({
      name: storeForm.name,
      logo: storeForm.logo || undefined,
    });

    toast({
      title: "Loja atualizada",
      description: "As informações da loja foram atualizadas com sucesso.",
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file upload
      const fakeUrl = URL.createObjectURL(file);
      setStoreForm({ ...storeForm, logo: fakeUrl });
      
      toast({
        title: "Logo carregada",
        description: "Nova logo foi carregada. Lembre-se de salvar as alterações.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUser?.photo} />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {currentUser?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Alterar Foto
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Recomendado: 200x200px, formato JPG ou PNG
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userName">Nome Completo</Label>
              <Input
                id="userName"
                value={userForm.name}
                onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <Label htmlFor="userEmail">E-mail</Label>
              <Input
                id="userEmail"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveUser} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Store Information */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Informações da Loja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {storeForm.logo ? (
                <img 
                  src={storeForm.logo} 
                  alt="Logo da loja" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {storeForm.logo ? 'Alterar Logo' : 'Adicionar Logo'}
                  </span>
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                Recomendado: 200x200px, formato JPG ou PNG
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="storeName">Nome da Loja</Label>
            <Input
              id="storeName"
              value={storeForm.name}
              onChange={(e) => setStoreForm({...storeForm, name: e.target.value})}
              placeholder="Nome da sua loja"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Este nome aparecerá no menu lateral e no cabeçalho de todas as páginas.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveStore} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Settings Summary */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Resumo das Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Usuário Atual</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Nome:</strong> {currentUser?.name}</p>
                <p><strong>E-mail:</strong> {currentUser?.email}</p>
                <p><strong>Perfil:</strong> {currentUser?.role === 'admin' ? 'Administrador' : 'Operador'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Loja Atual</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Nome:</strong> {currentStore.name}</p>
                <p><strong>Logo:</strong> {currentStore.logo ? 'Configurada' : 'Não configurada'}</p>
                <p><strong>ID:</strong> {currentStore.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}