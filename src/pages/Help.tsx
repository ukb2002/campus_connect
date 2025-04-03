
import React from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Laptop, Smartphone, Server, Globe, Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Help = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      
      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="usage">Using the Platform</TabsTrigger>
          <TabsTrigger value="devices">Device Compatibility</TabsTrigger>
          <TabsTrigger value="hosting">Local Hosting</TabsTrigger>
        </TabsList>
        
        {/* Using the Platform Tab */}
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>How to Use Campus Connect</CardTitle>
              <CardDescription>
                A guide to help you navigate and get the most out of Campus Connect
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Navigation Basics</h3>
                <p className="text-campus-gray-700 mb-4">
                  Campus Connect is designed with an intuitive sidebar for easy navigation between key features:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dashboard</strong> - View important announcements, upcoming events, and your personal statistics</li>
                  <li><strong>Messages</strong> - Communicate with other students, faculty, and staff</li>
                  <li><strong>Resources</strong> - Access study materials, documents, and learning resources</li>
                  <li><strong>Directory</strong> - Find contact information for students, faculty, and staff</li>
                  <li><strong>Profile</strong> - View and edit your personal information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Common Tasks</h3>
                <div className="space-y-4">
                  <Collapsible className="border rounded-md p-2">
                    <CollapsibleTrigger className="flex items-center justify-between w-full font-medium">
                      <span>Sending Messages</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 pl-4">
                      <p>
                        1. Navigate to the Messages page<br />
                        2. Select a contact or create a new conversation<br />
                        3. Type your message in the text field<br />
                        4. Click the send button or press Enter
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible className="border rounded-md p-2">
                    <CollapsibleTrigger className="flex items-center justify-between w-full font-medium">
                      <span>Accessing Resources</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 pl-4">
                      <p>
                        1. Go to the Resources section<br />
                        2. Browse categories or use the search function<br />
                        3. Click on a resource to view or download it<br />
                        4. Use the filter options to narrow down resources by type or category
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible className="border rounded-md p-2">
                    <CollapsibleTrigger className="flex items-center justify-between w-full font-medium">
                      <span>Updating Your Profile</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 pl-4">
                      <p>
                        1. Navigate to the Profile section<br />
                        2. Click the Edit button next to your information<br />
                        3. Make the desired changes<br />
                        4. Click Save to update your information
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Device Compatibility Tab */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Using Campus Connect on Different Devices</CardTitle>
              <CardDescription>
                Campus Connect is designed to work seamlessly across all your devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Laptop className="h-12 w-12 mb-4 text-campus-blue" />
                  <h3 className="text-xl font-semibold mb-2">Desktop & Laptop</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Full-featured experience with optimized layout</li>
                    <li>Recommended browsers: Chrome, Firefox, Safari, Edge</li>
                    <li>Minimum screen resolution: 1024 × 768</li>
                    <li>Keyboard shortcuts available for power users</li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Smartphone className="h-12 w-12 mb-4 text-campus-blue" />
                  <h3 className="text-xl font-semibold mb-2">Mobile Devices</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Responsive design automatically adapts to your screen</li>
                    <li>Access via mobile web browser or progressive web app</li>
                    <li>Swipe gestures for navigation on touch devices</li>
                    <li>Optimized data usage for mobile networks</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Tips for Mobile Users</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Use the menu button in the top left to access the navigation sidebar</li>
                  <li>Rotate to landscape mode for a better viewing experience on tables and data</li>
                  <li>Use the pull-to-refresh gesture to update content</li>
                  <li>Add to your home screen for app-like experience (via browser settings)</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Local Hosting Tab */}
        <TabsContent value="hosting">
          <Card>
            <CardHeader>
              <CardTitle>Hosting Campus Connect Locally</CardTitle>
              <CardDescription>
                Steps to run Campus Connect on your local machine and make it available over a network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Code className="mr-2 h-5 w-5 text-campus-blue" />
                    Setting Up in Visual Studio Code
                  </h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <strong>Prerequisites:</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>Install <a href="https://nodejs.org/" className="text-campus-blue hover:underline">Node.js</a> (v16.x or later)</li>
                        <li>Install <a href="https://code.visualstudio.com/" className="text-campus-blue hover:underline">Visual Studio Code</a></li>
                        <li>Install Git for version control</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Clone the repository:</strong>
                      <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                        <code>git clone [repository-url]</code>
                      </pre>
                    </li>
                    <li>
                      <strong>Open in VS Code:</strong>
                      <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                        <code>code ./campus-connect</code>
                      </pre>
                    </li>
                    <li>
                      <strong>Install dependencies:</strong>
                      <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                        <code>npm install</code>
                      </pre>
                    </li>
                    <li>
                      <strong>Start the development server:</strong>
                      <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                        <code>npm run dev</code>
                      </pre>
                    </li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-campus-blue" />
                    Making it Available on Your Network
                  </h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <strong>Configure Vite for network access:</strong>
                      <p className="mt-1">By default, the dev server runs at <code>http://localhost:8080</code>, but you can make it available on your network by configuring the server options.</p>
                      <p className="mt-1">Edit the <code>vite.config.ts</code> file to include:</p>
                      <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                        <code>{`server: {
  host: '0.0.0.0',
  port: 8080
},`}</code>
                      </pre>
                    </li>
                    <li>
                      <strong>Restart the server:</strong>
                      <p className="mt-1">Stop and restart your development server with <code>npm run dev</code></p>
                    </li>
                    <li>
                      <strong>Find your local IP address:</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>On Windows: Open Command Prompt and type <code>ipconfig</code></li>
                        <li>On macOS: Open Terminal and type <code>ifconfig</code> or go to System Preferences → Network</li>
                        <li>On Linux: Open Terminal and type <code>ip addr show</code> or <code>hostname -I</code></li>
                      </ul>
                    </li>
                    <li>
                      <strong>Access from other devices:</strong>
                      <p className="mt-1">On other devices connected to the same network, open a web browser and go to:</p>
                      <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                        <code>http://[your-local-ip]:8080</code>
                      </pre>
                      <p className="mt-1">For example: <code>http://192.168.1.5:8080</code></p>
                    </li>
                    <li>
                      <strong>Firewall considerations:</strong>
                      <p className="mt-1">You may need to allow port 8080 through your firewall for other devices to connect</p>
                    </li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Server className="mr-2 h-5 w-5 text-campus-blue" />
                    Production Deployment
                  </h3>
                  <p>For production deployment, build the application first:</p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                    <code>npm run build</code>
                  </pre>
                  <p className="mt-2">This will generate optimized files in the <code>dist</code> directory that can be served by any static file server.</p>
                  <p className="mt-2">For a simple local production server, you can use:</p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                    <code>npm install -g serve
serve -s dist</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help;
