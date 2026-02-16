import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreateCard from "./pages/CreateCard";
import CardViewer from "./pages/CardViewer";
import BouquetCreate from "./pages/BouquetCreate";
import BouquetViewer from "./pages/BouquetViewer";
import VoiceCreate from "./pages/VoiceCreate";
import VoiceViewer from "./pages/VoiceViewer";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/askout/create" element={<CreateCard />} />
          <Route path="/create" element={<CreateCard />} />
          <Route path="/bouquet/create" element={<BouquetCreate />} />
          <Route path="/voice/create" element={<VoiceCreate />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/card/:id" element={<CardViewer />} />
          <Route path="/bouquet/:id" element={<BouquetViewer />} />
          <Route path="/voice/:id" element={<VoiceViewer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
