// APP SETUP - This is the root component that wraps everything
// It sets up routing, notifications, and other app-wide features

// Import toast notification components (those popup messages)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Import tooltip provider (for hover popups)
import { TooltipProvider } from "@/components/ui/tooltip";

// Import React Query - helps manage data fetching and caching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import React Router - handles navigation between pages
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import our page components
import Index from "./pages/Index";       // Main homepage
import NotFound from "./pages/NotFound"; // 404 error page

// CREATE QUERY CLIENT - React Query needs this to work
// It manages caching and refetching data
const queryClient = new QueryClient();

// MAIN APP COMPONENT
const App = () => (
  // QueryClientProvider: Makes React Query available throughout the app
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider: Makes tooltips work throughout the app */}
    <TooltipProvider>
      {/* Toaster components: Enable toast notifications anywhere in the app */}
      <Toaster />
      <Sonner />
      
      {/* BrowserRouter: Enables routing (different URLs show different pages) */}
      <BrowserRouter>
        <Routes>
          {/* Route: Maps URLs to components */}
          {/* "/" = homepage, shows Index component */}
          <Route path="/" element={<Index />} />
          
          {/* "*" = catch-all route, any other URL shows NotFound page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Export so main.tsx can import and use this
export default App;
