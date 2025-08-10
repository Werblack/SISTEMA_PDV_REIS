import React, { useState } from 'react';
import { Calendar, Download, Filter, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockSalesData = [
  { id: '1', date: '2024-01-15', customer: 'João Silva', product: 'iPhone 15 Pro', quantity: 1, total: 1499.90 },
  { id: '2', date: '2024-01-15', customer: 'Maria Santos', product: 'Samsung Galaxy S24', quantity: 1, total: 1199.90 },
  { id: '3', date: '2024-01-14', customer: 'Pedro Costa', product: 'Fone JBL', quantity: 2, total: 259.80 },
  { id: '4', date: '2024-01-14', customer: 'Ana Oliveira', product: 'Carregador USB-C', quantity: 3, total: 119.70 },
  { id: '5', date: '2024-01-13', customer: 'Carlos Lima', product: 'Película de Vidro', quantity: 5, total: 99.50 },
];

const mockMovements = [
  { id: '1', date: '2024-01-15', product: 'iPhone 15 Pro', type: 'Saída', quantity: 1, reason: 'Venda #1234' },
  { id: '2', date: '2024-01-15', product: 'Samsung Galaxy S24', type: 'Entrada', quantity: 10, reason: 'Compra fornecedor' },
  { id: '3', date: '2024-01-14', product: 'Fone JBL', type: 'Saída', quantity: 2, reason: 'Venda #1235' },
  { id: '4', date: '2024-01-14', product: 'Carregador USB-C', type: 'Entrada', quantity: 50, reason: 'Estoque inicial' },
];

const mockStockReport = [
  { product: 'iPhone 15 Pro', category: 'Smartphones', stock: 15, minStock: 5, value: 22498.50 },
  { product: 'Samsung Galaxy S24', category: 'Smartphones', stock: 8, minStock: 10, value: 9599.20 },
  { product: 'Fone JBL', category: 'Acessórios', stock: 1, minStock: 5, value: 129.90 },
  { product: 'Carregador USB-C', category: 'Acessórios', stock: 30, minStock: 15, value: 1197.00 },
];

export default function Relatorios() {
  const [reportType, setReportType] = useState('vendas');
  const [period, setPeriod] = useState('today');

  const totalSales = mockSalesData.reduce((sum, sale) => sum + sale.total, 0);
  const totalItems = mockSalesData.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalStockValue = mockStockReport.reduce((sum, item) => sum + item.value, 0);

  const getMovementBadge = (type: string) => {
    return type === 'Entrada' 
      ? <Badge className="bg-success text-success-foreground">Entrada</Badge>
      : <Badge variant="destructive">Saída</Badge>;
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return <Badge variant="destructive">Crítico</Badge>;
    if (current <= min * 2) return <Badge variant="secondary">Baixo</Badge>;
    return <Badge variant="default">Normal</Badge>;
  };

  const renderTable = () => {
    switch (reportType) {
      case 'vendas':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSalesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{new Date(sale.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell className="font-medium text-success">
                    R$ {sale.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'movimentacoes':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{new Date(movement.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{movement.product}</TableCell>
                  <TableCell>{getMovementBadge(movement.type)}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'estoque':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead>Estoque Mínimo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStockReport.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>{getStockStatus(item.stock, item.minStock)}</TableCell>
                  <TableCell className="font-medium text-success">
                    R$ {item.value.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      default:
        return null;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'vendas': return 'Relatório de Vendas';
      case 'movimentacoes': return 'Movimentações de Estoque';
      case 'estoque': return 'Relatório de Estoque';
      default: return 'Relatório';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Vendas</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">R$ {totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {totalItems} itens vendidos
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalStockValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {mockStockReport.length} produtos diferentes
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMovements.length}</div>
            <p className="text-xs text-muted-foreground">
              Este período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="movimentacoes">Movimentações</SelectItem>
                  <SelectItem value="estoque">Estoque Atual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Período</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="btn-primary">
                <Calendar className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Table */}
      <Card className="card-gradient">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{getReportTitle()}</CardTitle>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            {renderTable()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}