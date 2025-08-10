import React from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle, DollarSign, BarChart3, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statsCards = [
  {
    title: 'Vendas Hoje',
    value: 'R$ 12.450,00',
    change: '+12%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-success',
  },
  {
    title: 'Faturamento Mensal',
    value: 'R$ 89.230,00',
    change: '+8%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-success',
  },
  {
    title: 'Produtos em Estoque',
    value: '1.234',
    change: '-3%',
    trend: 'down',
    icon: Package,
    color: 'text-warning',
  },
  {
    title: 'Ticket Médio',
    value: 'R$ 156,78',
    change: '+5%',
    trend: 'up',
    icon: BarChart3,
    color: 'text-success',
  },
];

const lowStockProducts = [
  { name: 'Smartphone Galaxy A54', stock: 3, min: 10 },
  { name: 'Fone Bluetooth JBL', stock: 1, min: 5 },
  { name: 'Carregador USB-C', stock: 2, min: 15 },
  { name: 'Película de Vidro', stock: 4, min: 20 },
];

const recentSales = [
  { id: '#1234', customer: 'João Silva', amount: 'R$ 234,90', time: '10:30' },
  { id: '#1235', customer: 'Maria Santos', amount: 'R$ 156,70', time: '10:15' },
  { id: '#1236', customer: 'Pedro Costa', amount: 'R$ 89,50', time: '09:45' },
  { id: '#1237', customer: 'Ana Oliveira', amount: 'R$ 345,20', time: '09:30' },
];

const topProducts = [
  { name: 'iPhone 15 Pro', sales: 45, revenue: 'R$ 67.500,00' },
  { name: 'Samsung Galaxy S24', sales: 32, revenue: 'R$ 38.400,00' },
  { name: 'Xiaomi Redmi Note 13', sales: 28, revenue: 'R$ 16.800,00' },
  { name: 'Motorola Edge 40', sales: 15, revenue: 'R$ 13.500,00' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={stat.color}>
                  {stat.change} em relação ao mês anterior
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card className="card-gradient">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <CardTitle>Estoque Baixo</CardTitle>
            </div>
            <CardDescription>
              Produtos que precisam de reposição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Mínimo: {product.min} unidades
                    </p>
                  </div>
                  <Badge variant="destructive">
                    {product.stock} restantes
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>
              Últimas transações realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{sale.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      Venda {sale.id} • {sale.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-success">{sale.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>
            Ranking dos produtos com melhor performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales} vendas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-success">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}