import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ImportItem {
  name: string;
  code: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  status: 'valid' | 'warning' | 'error';
  message?: string;
}

const mockImportData: ImportItem[] = [
  {
    name: 'iPhone 15 Pro Max 256GB',
    code: '7891234567899',
    category: 'Smartphones',
    costPrice: 1800.00,
    salePrice: 2199.90,
    stock: 5,
    status: 'valid',
  },
  {
    name: 'AirPods Pro 2ª Geração',
    code: '7891234567898',
    category: 'Acessórios',
    costPrice: 450.00,
    salePrice: 599.90,
    stock: 10,
    status: 'valid',
  },
  {
    name: 'MacBook Air M2',
    code: '',
    category: 'Notebooks',
    costPrice: 2500.00,
    salePrice: 3199.90,
    stock: 3,
    status: 'error',
    message: 'Código obrigatório',
  },
  {
    name: 'iPad 10ª Geração',
    code: '7891234567897',
    category: 'Tablets',
    costPrice: 800.00,
    salePrice: 950.00,
    stock: 8,
    status: 'warning',
    message: 'Margem baixa (18%)',
  },
];

export default function Importacao() {
  const [importData, setImportData] = useState<ImportItem[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      simulateFileImport(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      simulateFileImport(file);
    }
  };

  const simulateFileImport = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive",
      });
      return;
    }

    // Simulate file processing
    toast({
      title: "Processando arquivo",
      description: "Analisando dados do arquivo CSV...",
    });

    setTimeout(() => {
      setImportData(mockImportData);
      setIsPreview(true);
      toast({
        title: "Arquivo processado",
        description: `${mockImportData.length} produtos encontrados para importação.`,
      });
    }, 2000);
  };

  const confirmImport = () => {
    const validItems = importData.filter(item => item.status === 'valid');
    const warningItems = importData.filter(item => item.status === 'warning');
    
    toast({
      title: "Importação concluída",
      description: `${validItems.length} produtos importados, ${warningItems.length} com avisos.`,
    });
    
    setImportData([]);
    setIsPreview(false);
  };

  const cancelImport = () => {
    setImportData([]);
    setIsPreview(false);
  };

  const downloadTemplate = () => {
    toast({
      title: "Download iniciado",
      description: "Template CSV baixado com sucesso.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-success text-success-foreground">Válido</Badge>;
      case 'warning':
        return <Badge variant="secondary">Aviso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return null;
    }
  };

  const validCount = importData.filter(item => item.status === 'valid').length;
  const warningCount = importData.filter(item => item.status === 'warning').length;
  const errorCount = importData.filter(item => item.status === 'error').length;

  if (isPreview) {
    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-gradient">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">{validCount}</p>
                  <p className="text-sm text-muted-foreground">Produtos válidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-warning">{warningCount}</p>
                  <p className="text-sm text-muted-foreground">Com avisos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                  <p className="text-sm text-muted-foreground">Com erros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {errorCount > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorCount} produto(s) com erro não serão importados. Corrija os problemas antes de continuar.
            </AlertDescription>
          </Alert>
        )}

        {warningCount > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {warningCount} produto(s) com avisos serão importados, mas verifique as observações.
            </AlertDescription>
          </Alert>
        )}

        {/* Preview Table */}
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pré-visualização da Importação</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelImport}>
                Cancelar
              </Button>
              <Button 
                onClick={confirmImport} 
                className="btn-primary"
                disabled={errorCount > 0}
              >
                Confirmar Importação
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço Custo</TableHead>
                    <TableHead>Preço Venda</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-mono text-sm">{item.code || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>R$ {item.costPrice.toFixed(2)}</TableCell>
                      <TableCell className="font-medium text-success">
                        R$ {item.salePrice.toFixed(2)}
                      </TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.message || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Importação de Produtos via CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Importe múltiplos produtos de uma só vez usando um arquivo CSV. 
              Baixe nosso template para garantir o formato correto.
            </p>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Baixar Template CSV
              </Button>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Formato obrigatório do CSV:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>nome:</strong> Nome do produto (obrigatório)</li>
                <li>• <strong>codigo:</strong> Código de barras (obrigatório)</li>
                <li>• <strong>categoria:</strong> Categoria do produto</li>
                <li>• <strong>preco_custo:</strong> Preço de custo</li>
                <li>• <strong>preco_venda:</strong> Preço de venda (obrigatório)</li>
                <li>• <strong>estoque:</strong> Quantidade em estoque</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="card-gradient">
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Arraste seu arquivo CSV aqui
            </h3>
            <p className="text-muted-foreground mb-4">
              ou clique no botão abaixo para selecionar
            </p>
            
            <div className="flex justify-center">
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Button className="btn-primary">
                  <FileText className="w-4 h-4 mr-2" />
                  Selecionar Arquivo CSV
                </Button>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              Tamanho máximo: 10MB • Formato: CSV
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}