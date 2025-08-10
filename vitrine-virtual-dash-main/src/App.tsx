import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider, useStore } from "@/contexts/StoreContext";
import { MainLayout } from "@/components/Layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PDV from "./pages/PDV";
import Estoque from "./pages/Estoque";
import Relatorios from "./pages/Relatorios";
import Importacao from "./pages/Importacao";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn } = useStore();

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<MainLayout title="Dashboard" breadcrumbs={["Início", "Dashboard"]} />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/pdv" element={<MainLayout title="PDV" breadcrumbs={["Vendas", "PDV"]} />}>
        <Route index element={<PDV />} />
      </Route>
      <Route path="/estoque" element={<MainLayout title="Estoque" breadcrumbs={["Produtos", "Estoque"]} />}>
        <Route index element={<Estoque />} />
      </Route>
      <Route path="/relatorios" element={<MainLayout title="Relatórios" breadcrumbs={["Análises", "Relatórios"]} />}>
        <Route index element={<Relatorios />} />
      </Route>
      <Route path="/importacao" element={<MainLayout title="Importação" breadcrumbs={["Produtos", "Importação"]} />}>
        <Route index element={<Importacao />} />
      </Route>
      <Route path="/usuarios" element={<MainLayout title="Usuários" breadcrumbs={["Sistema", "Usuários"]} />}>
        <Route index element={<Usuarios />} />
      </Route>
      <Route path="/perfil" element={<MainLayout title="Perfil" breadcrumbs={["Sistema", "Perfil"]} />}>
        <Route index element={<Perfil />} />
      </Route>
      <Route path="/configuracoes" element={<MainLayout title="Configurações" breadcrumbs={["Sistema", "Configurações"]} />}>
        <Route index element={<Configuracoes />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
