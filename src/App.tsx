import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Story from "./pages/Story";
import Profile from "./pages/Profile";
import Write from "./pages/Write";
import Discover from "./pages/Discover";
import Library from "./pages/Library";
import Works from "./pages/Works";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Read from "./pages/Read";
import Notifications from "./pages/Notifications";
import EditProfile from "./pages/EditProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/story/:id" element={<Story />} />
            <Route path="/read/:storyId/:chapterNumber" element={<Read />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/profile/:username/edit" element={<EditProfile />} />
            <Route path="/write" element={<Write />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/library" element={<Library />} />
            <Route path="/works" element={<Works />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<Help />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
