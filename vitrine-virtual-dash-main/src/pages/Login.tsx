import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [name, setName] = useState('');
  const { setCurrentUser } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome para continuar.",
        variant: "destructive",
      });
      return;
    }

    const user = {
      id: '1',
      name: name.trim(),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@sualoja.com`,
      role: 'admin' as const,
    };

    setCurrentUser(user);
    toast({
      title: "Bem-vindo!",
      description: `Olá ${name}, você entrou no sistema com sucesso.`,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-gradient">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <Store className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">SUA LOJA</CardTitle>
            <CardDescription>Sistema de Gestão Comercial</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-foreground block mb-2">
                Seu nome
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full btn-primary h-11">
              Entrar no Sistema
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Não é necessário senha. Apenas informe seu nome para identificação.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}