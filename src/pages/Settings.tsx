
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PaletteIcon, 
  BellIcon, 
  ShieldIcon, 
  LanguagesIcon,
  CloudIcon,
  MonitorIcon
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const { user } = authState;
  
  const [settings, setSettings] = useState({
    // Appearance
    darkMode: false,
    fontSize: "medium",
    
    // Notifications
    emailNotifications: true,
    appNotifications: true,
    resourceUpdates: true,
    
    // Privacy
    profileVisibility: "all",
    activityStatus: true,
    
    // Language
    language: "english",
    
    // Sync & Storage
    autoSync: true,
    offlineMode: false,
    
    // Display
    compactView: false,
    highContrast: false
  });
  
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Setting updated",
      description: "Your preference has been saved.",
    });
  };
  
  const handleToggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Setting updated",
      description: "Your preference has been saved.",
    });
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PaletteIcon className="h-4 w-4" />
            <span className="hidden md:block">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellIcon className="h-4 w-4" />
            <span className="hidden md:block">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4" />
            <span className="hidden md:block">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <LanguagesIcon className="h-4 w-4" />
            <span className="hidden md:block">Language</span>
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <CloudIcon className="h-4 w-4" />
            <span className="hidden md:block">Sync & Storage</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <MonitorIcon className="h-4 w-4" />
            <span className="hidden md:block">Display</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                  <p className="text-sm text-campus-gray-600">Enable dark mode for the application</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggleSetting("darkMode")}
                />
              </div>
              
              <div>
                <Label className="text-base mb-2 block">Font Size</Label>
                <div className="flex gap-2">
                  {["small", "medium", "large"].map((size) => (
                    <Button 
                      key={size}
                      variant={settings.fontSize === size ? "default" : "outline"}
                      onClick={() => handleSettingChange("fontSize", size)}
                      className="capitalize"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-campus-gray-600">Receive notifications via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggleSetting("emailNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="app-notifications" className="text-base">In-App Notifications</Label>
                  <p className="text-sm text-campus-gray-600">Show notifications within the application</p>
                </div>
                <Switch 
                  id="app-notifications" 
                  checked={settings.appNotifications}
                  onCheckedChange={() => handleToggleSetting("appNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="resource-updates" className="text-base">Resource Updates</Label>
                  <p className="text-sm text-campus-gray-600">Get notified about new resources</p>
                </div>
                <Switch 
                  id="resource-updates" 
                  checked={settings.resourceUpdates}
                  onCheckedChange={() => handleToggleSetting("resourceUpdates")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base mb-2 block">Profile Visibility</Label>
                <div className="flex flex-wrap gap-2">
                  {["all", "contacts", "none"].map((option) => (
                    <Button 
                      key={option}
                      variant={settings.profileVisibility === option ? "default" : "outline"}
                      onClick={() => handleSettingChange("profileVisibility", option)}
                      className="capitalize"
                    >
                      {option === "all" ? "Everyone" : option === "contacts" ? "Contacts Only" : "No One"}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="activity-status" className="text-base">Activity Status</Label>
                  <p className="text-sm text-campus-gray-600">Show when you're active on the platform</p>
                </div>
                <Switch 
                  id="activity-status" 
                  checked={settings.activityStatus}
                  onCheckedChange={() => handleToggleSetting("activityStatus")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-base mb-2 block">Language</Label>
                <div className="flex flex-wrap gap-2">
                  {["english", "spanish", "french", "german", "chinese"].map((lang) => (
                    <Button 
                      key={lang}
                      variant={settings.language === lang ? "default" : "outline"}
                      onClick={() => handleSettingChange("language", lang)}
                      className="capitalize"
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Sync & Storage Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-sync" className="text-base">Auto Sync</Label>
                  <p className="text-sm text-campus-gray-600">Automatically sync data across devices</p>
                </div>
                <Switch 
                  id="auto-sync" 
                  checked={settings.autoSync}
                  onCheckedChange={() => handleToggleSetting("autoSync")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="offline-mode" className="text-base">Offline Mode</Label>
                  <p className="text-sm text-campus-gray-600">Access content while offline</p>
                </div>
                <Switch 
                  id="offline-mode" 
                  checked={settings.offlineMode}
                  onCheckedChange={() => handleToggleSetting("offlineMode")}
                />
              </div>
              
              <Button variant="outline" className="w-full">
                Clear Local Cache
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-view" className="text-base">Compact View</Label>
                  <p className="text-sm text-campus-gray-600">Reduce spacing to show more content</p>
                </div>
                <Switch 
                  id="compact-view" 
                  checked={settings.compactView}
                  onCheckedChange={() => handleToggleSetting("compactView")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast" className="text-base">High Contrast</Label>
                  <p className="text-sm text-campus-gray-600">Increase contrast for better readability</p>
                </div>
                <Switch 
                  id="high-contrast" 
                  checked={settings.highContrast}
                  onCheckedChange={() => handleToggleSetting("highContrast")}
                />
              </div>
              
              {user?.role === "admin" && (
                <Card className="border-campus-blue/30 bg-campus-blue/5">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Admin Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Configure System Defaults
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
