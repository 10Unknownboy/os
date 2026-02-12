import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LoveOS from "./pages/LoveOS";
import Edit from "./pages/Edit";
import SharedLoveOS from "./pages/SharedLoveOS";
import NotFound from "./pages/NotFound";

import { StorageProvider, useStorage } from "@/context/StorageContext";
import { UploadProgress } from "@/components/love/UploadProgress";

const queryClient = new QueryClient();

const AppContent = () => {
  const { fileName, progress, isUploading, error } = useStorage();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/loveos" element={<LoveOS />} />
        <Route path="/loveos/code" element={<SharedLoveOS />} />
        <Route path="/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <UploadProgress fileName={fileName} progress={progress} isUploading={isUploading} error={error} />
    </BrowserRouter>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <StorageProvider>
          <AppContent />
        </StorageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
