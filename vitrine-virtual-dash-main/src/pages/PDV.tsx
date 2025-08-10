import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  code: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

const mockProducts: Product[] = [
  { id: '1', name: 'iPhone 15 Pro 128GB', price: 1499.90, code: '7891234567890', stock: 15 },
  { id: '2', name: 'Samsung Galaxy S24 256GB', price: 1199.90, code: '7891234567891', stock: 8 },
  { id: '3', name: 'Xiaomi Redmi Note 13 128GB', price: 599.90, code: '7891234567892', stock: 25 },
  { id: '4', name: 'Fone Bluetooth JBL Tune 510BT', price: 129.90, code: '7891234567893', stock: 12 },
  { id: '5', name: 'Carregador USB-C 20W', price: 39.90, code: '7891234567894', stock: 30 },
  { id: '6', name: 'Película de Vidro Temperado', price: 19.90, code: '7891234567895', stock: 45 },
];

export default function PDV() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "Estoque insuficiente",
          description: `Apenas ${product.stock} unidades disponíveis.`,
          variant: "destructive",
        });
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = mockProducts.find(p => p.id === productId);
    
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    if (product && newQuantity <= product.stock) {
      setCart(cart.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      toast({
        title: "Estoque insuficiente",
        description: `Apenas ${product?.stock} unidades disponíveis.`,
        variant: "destructive",
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const finalizeSale = (paymentMethod: string) => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos antes de finalizar a venda.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Venda finalizada!",
      description: `Pagamento de R$ ${totalAmount.toFixed(2)} realizado via ${paymentMethod}.`,
    });
    
    setCart([]);
    setIsPaymentOpen(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Product Search */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Buscar Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                ref={searchInputRef}
                placeholder="Digite o código de barras ou nome do produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg h-12"
                autoFocus
              />
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p><kbd className="px-2 py-1 bg-muted rounded">F1</kbd> Buscar produto</p>
              <p><kbd className="px-2 py-1 bg-muted rounded">F2</kbd> Finalizar venda</p>
              <p><kbd className="px-2 py-1 bg-muted rounded">F3</kbd> Cancelar venda</p>
            </div>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card className="card-gradient flex-1">
          <CardHeader>
            <CardTitle>Produtos ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => addToCart(product)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.code}</p>
                      <p className="text-lg font-bold text-success mt-1">
                        R$ {product.price.toFixed(2)}
                      </p>
                    </div>
                    <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                      {product.stock}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopping Cart */}
      <div className="space-y-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Carrinho ({totalItems})
            </CardTitle>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Carrinho vazio</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        R$ {item.price.toFixed(2)} cada
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total and Actions */}
        <Card className="card-gradient">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-success">
                  R$ {totalAmount.toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full btn-primary h-12" disabled={cart.length === 0}>
                      Finalizar Venda
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Finalizar Pagamento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Total a pagar</p>
                        <p className="text-2xl font-bold text-success">
                          R$ {totalAmount.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <Button
                          className="h-12 justify-start gap-3"
                          onClick={() => finalizeSale('Dinheiro')}
                        >
                          <Banknote className="w-5 h-5" />
                          Dinheiro
                        </Button>
                        <Button
                          className="h-12 justify-start gap-3"
                          onClick={() => finalizeSale('Cartão')}
                        >
                          <CreditCard className="w-5 h-5" />
                          Cartão
                        </Button>
                        <Button
                          className="h-12 justify-start gap-3"
                          onClick={() => finalizeSale('PIX')}
                        >
                          <Smartphone className="w-5 h-5" />
                          PIX
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Cancelar Venda
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}