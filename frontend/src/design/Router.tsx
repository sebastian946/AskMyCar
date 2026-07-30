import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VehicleProvider } from "./context/VehicleContext";
import { AppShell } from "./layout/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { VehicleSelectPage } from "./pages/VehicleSelectPage";
import { ChatPage } from "./pages/ChatPage";
import { UnsupportedBrandPage } from "./pages/UnsupportedBrandPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function DesignRouter() {
  return (
    <BrowserRouter>
      <VehicleProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/vehiculo" element={<VehicleSelectPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/marca-no-disponible" element={<UnsupportedBrandPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </VehicleProvider>
    </BrowserRouter>
  );
}
