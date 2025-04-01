
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  MessageCircle, 
  FileText, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Home,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { user } = authState;
  
  const navigation = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Messages", icon: MessageCircle, href: "/messages" },
    { name: "Resources", icon: FileText, href: "/resources" },
    { name: "Directory", icon: Users, href: "/directory" },
    { name: "Profile", icon: User, href: "/profile" },
    { name: "Settings", icon: Settings, href: "/settings" }
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile) {
      closeSidebar();
    }
  };
  
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-3 py-4 border-b">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-campus-blue p-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22L3 17V7L12 2L21 7V17L12 22Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22L12 11"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 7.5L7 7.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-xl font-bold text-campus-blue">
              Campus Connect
            </div>
          </div>
          
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={closeSidebar}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-campus-gray-500">{user.role}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`campus-sidebar-link w-full text-left ${
                location.pathname === item.href ? "active" : ""
              }`}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="px-3 py-4 border-t">
        <button 
          className="campus-sidebar-link w-full text-left text-campus-red"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-campus-gray-50">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-campus-gray-200">
          {renderSidebarContent()}
        </aside>
      )}
      
      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-4 left-4 z-40"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>
      )}
      
      {/* Main content */}
      <main className="flex-1 overflow-auto relative md:ml-64">
        <div className="w-full px-4 sm:px-6 md:px-8 py-4">
          {/* Header with notifications */}
          <div className="flex justify-end mb-6">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-campus-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
          
          {/* Page content */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
