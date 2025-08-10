import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  category: string;
  image?: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro 128GB',
    code: '7891234567890',
    description: 'Smartphone Apple iPhone 15 Pro 128GB Titânio Natural',
    costPrice: 1200.00,
    salePrice: 1499.90,
    stock: 15,
    minStock: 5,
    category: 'Smartphones',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 256GB',
    code: '7891234567891',
    description: 'Smartphone Samsung Galaxy S24 256GB Preto',
    costPrice: 950.00,
    salePrice: 1199.90,
    stock: 8,
    minStock: 10,
    category: 'Smartphones',
  },
  {
    id: '3',
    name: 'Fone Bluetooth JBL',
    code: '7891234567893',
    description: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
    costPrice: 89.90,
    salePrice: 129.90,
    stock: 1,
    minStock: 5,
    category: 'Acessórios',
  },
];

const categories = ['Smartphones', 'Acessórios', 'Capas', 'Carregadores', 'Fones'];

export default function Estoque() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    minStock: '',
    category: '',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.includes(searchTerm)
  );

  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      costPrice: '',
      salePrice: '',
      stock: '',
      minStock: '',
      category: '',
    });
    setEditingProduct(null);
  };

  const openNewProductDialog = () => {
    resetForm();
    setIsProductDialogOpen(true);
  };

  const openEditProductDialog = (product: Product) => {
    setFormData({
      name: product.name,
      code: product.code,
      description: product.description,
      costPrice: product.costPrice.toString(),
      salePrice: product.salePrice.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      category: product.category,
    });
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.code || !formData.salePrice) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos nome, código e preço de venda.",
        variant: "destructive",
      });
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      code: formData.code,
      description: formData.description,
      costPrice: parseFloat(formData.costPrice) || 0,
      salePrice: parseFloat(formData.salePrice),
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 0,
      category: formData.category,
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData : p));
      toast({
        title: "Produto atualizado",
        description: `${productData.name} foi atualizado com sucesso.`,
      });
    } else {
      setProducts([...products, productData]);
      toast({
        title: "Produto adicionado",
        description: `${productData.name} foi adicionado ao estoque.`,
      });
    }

    setIsProductDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (product: Product) => {
    setProducts(products.filter(p => p.id !== product.id));
    toast({
      title: "Produto removido",
      description: `${product.name} foi removido do estoque.`,
    });
  };

  const getStockBadge = (product: Product) => {
    if (product.stock <= product.minStock) {
      return <Badge variant="destructive">Estoque baixo</Badge>;
    }
    if (product.stock <= product.minStock * 2) {
      return <Badge variant="secondary">Atenção</Badge>;
    }
    return <Badge variant="default">OK</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openNewProductDialog} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="card-gradient border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Alerta de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {lowStockProducts.length} produto(s) com estoque abaixo do mínimo:
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map((product) => (
                <Badge key={product.id} variant="destructive">
                  {product.name} ({product.stock})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço Custo</TableHead>
                  <TableHead>Preço Venda</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.code}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      R$ {product.costPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium text-success">
                      R$ {product.salePrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{product.stock}</span>
                      <span className="text-muted-foreground text-sm">
                        {' '}(mín: {product.minStock})
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStockBadge(product)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditProductDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProduct(product)}
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

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome do produto"
              />
            </div>
            <div>
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="Código de barras"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição detalhada do produto"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="costPrice">Preço de Custo</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="salePrice">Preço de Venda *</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stock">Estoque Atual</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="minStock">Estoque Mínimo</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveProduct} className="btn-primary">
              {editingProduct ? 'Atualizar' : 'Salvar'} Produto
            </Button>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}