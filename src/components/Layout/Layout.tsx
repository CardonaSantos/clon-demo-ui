import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Plus,
  Box,
  Truck,
  RotateCw,
  AlertCircle,
  Layers,
  Clock,
  MailIcon,
  LogOut,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import nv2 from "@/assets/nv2.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { UserToken } from "@/Types/UserToken/UserToken";
import { jwtDecode } from "jwt-decode";
interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: ShoppingCart, label: "Punto venta", href: "/punto-venta" },
    { icon: Package, label: "Inventario", href: "/inventario" },

    { icon: Box, label: "Añadir Stock", href: "/adicion-stock" },
    { icon: Clock, label: "Historial de Ventas", href: "/historial/ventas" },

    { icon: Users, label: "Clientes", href: "/clientes" },
    { icon: BarChart2, label: "Reportes", href: "/reportes" },
    { icon: Truck, label: "Proveedores", href: "/proveedores" },
    { icon: Truck, label: "Entregas Stock", href: "/entregas-stock" },
    { icon: RotateCw, label: "Devoluciones", href: "/devoluciones" },
    { icon: AlertCircle, label: "Vencimientos", href: "/vencimientos" },
    {
      icon: Layers,
      label: "Categorías de Productos",
      href: "/categorias-de-productos",
    },
    { icon: Bell, label: "Notificaciones", href: "/notificaciones" },
  ];

  const [tokenUser, setTokenUser] = useState<UserToken | null>(null);

  function setShowLogoutModal(arg0: boolean): void {
    console.log(arg0);

    throw new Error("Function not implemented.");
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode<UserToken>(token);
        setTokenUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  function handleDeletToken() {
    localStorage.removeItem("authTokenPos");
    window.location.reload();
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-background shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              className="mr-4 rounded-md bg-secondary p-2 text-secondary-foreground hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:hidden"
              onClick={toggleSideMenu}
            >
              {isSideMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="">
              <Link to={"/"}>
                <img className="h-16 w-16" src={nv2} />
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex justify-center items-center p-4">
              <ModeToggle />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="mr-4 rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Bell className="h-6 w-6" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notificaciones</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-foreground">
                    No tienes nuevas notificaciones.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{tokenUser?.nombre}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MailIcon className="mr-2 h-4 w-4" />
                    <span>{tokenUser?.correo}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogoutModal(true)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span onClick={handleDeletToken}>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Side Menu */}
        <nav
          className={`w-64 transform bg-background p-4 transition-transform duration-300 ease-in-out ${
            isDesktop || isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
          } fixed left-0 top-16 bottom-0 z-10 overflow-y-auto shadow-lg lg:relative lg:top-0 lg:translate-x-0 lg:shadow-none`}
        >
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="flex items-center rounded-lg p-2 text-foreground hover:bg-muted"
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        {/* <main className="flex-1 overflow-y-auto p-4"> */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* <div className="mx-auto max-w-4xl"> */}
          <div className="mx-auto max-w-full lg:max-w-6xl">
            {/* Renderiza children o el Outlet para las rutas anidadas */}
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-background py-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 Empresa. Todos los derechos reservados</p>
      </footer>

      {/* Floating Action Button (FAB) for mobile */}
      <button className="fixed bottom-4 right-4 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:hidden">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
