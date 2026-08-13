import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Iscas from "./pages/Iscas";
import Desafio from "./pages/Desafio";
import Diagnostico from "./pages/Diagnostico";
import Calculadora from "./pages/Calculadora";
import LandingIscas from "./pages/LandingIscas";
import LandingMasterclass from "./pages/LandingMasterclass";
import VendasDesafio from "./pages/VendasDesafio";
import Obrigado from "./pages/Obrigado";
import EbookCaptura from "./pages/EbookCaptura";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/iscas"} component={Iscas} />
      <Route path={"/guardioes"} component={Iscas} />
      <Route path={"/desafio"} component={Desafio} />
      <Route path={"/desafio/:section"} component={Desafio} />
      <Route path={"/diagnostico"} component={Diagnostico} />
      <Route path={"/calculadora"} component={Calculadora} />
      <Route path={"/isca/:isca"} component={LandingIscas} />
      <Route path={"/masterclass"} component={LandingMasterclass} />
      <Route path={"/desafio-21-dias"} component={VendasDesafio} />
      <Route path={"/obrigado"} component={Obrigado} />
      <Route path={"/ebook-10-horas"} component={EbookCaptura} />
      <Route path={"/10-horas-escondidas"} component={EbookCaptura} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
