import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AgenticSRE from "./pages/AgenticSRE";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workflows" element={<Dashboard />} />
                <Route path="/agentic-sre" element={<AgenticSRE />} />
                <Route path="/analytics" element={<Dashboard />} />
                <Route path="/alerts" element={<Dashboard />} />
                <Route path="/databases/*" element={<Dashboard />} />
                <Route path="/monitoring" element={<Dashboard />} />
                <Route path="/users" element={<Dashboard />} />
                <Route path="/settings" element={<Dashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
