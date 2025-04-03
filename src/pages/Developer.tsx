
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code, Database, Layout, Server, ShieldAlert } from "lucide-react";

const Developer = () => {
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState("frontend");
  const isAdmin = authState.user?.role === 'admin' || authState.user?.role === 'developer';

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Developer Documentation</h1>
        <p className="text-campus-gray-500">
          Learn about the technical architecture of Campus Connect
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-8">
          <TabsTrigger value="frontend" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Frontend</span>
          </TabsTrigger>
          <TabsTrigger value="backend" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Backend</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Database</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Admin Tools</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="frontend" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frontend Architecture</CardTitle>
              <CardDescription>
                Overview of the client-side implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Technologies</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>React</strong>: Component-based UI library</li>
                  <li><strong>React Router</strong>: Client-side routing</li>
                  <li><strong>TanStack Query</strong>: Data fetching and state management</li>
                  <li><strong>Tailwind CSS</strong>: Utility-first CSS framework</li>
                  <li><strong>Shadcn UI</strong>: Component library built on Radix UI</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Component Structure</h3>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    <code>
{`src/
├── components/     # Reusable UI components
│   ├── ui/         # Base UI components from shadcn
│   ├── layout/     # Layout components
│   └── auth/       # Authentication components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Page components
└── types/          # TypeScript type definitions`}
                    </code>
                  </pre>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Authentication Flow</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>User enters credentials on the Login page</li>
                  <li>AuthContext processes login and stores user state</li>
                  <li>PrivateRoute component protects authenticated routes</li>
                  <li>JWT token stored in localStorage for persistence</li>
                </ol>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backend" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backend Architecture</CardTitle>
              <CardDescription>
                Server-side implementation details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xl font-semibold">API Structure</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>RESTful API</strong>: Follows standard REST conventions</li>
                  <li><strong>Authentication</strong>: JWT-based token system</li>
                  <li><strong>Controllers</strong>: Handle business logic for each resource</li>
                  <li><strong>Middleware</strong>: Request processing, auth verification, error handling</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Endpoint Structure</h3>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    <code>
{`/api/v1/
├── auth/           # Authentication endpoints
│   ├── login       # User login
│   ├── register    # New user registration
│   └── refresh     # Refresh JWT token
├── users/          # User management
├── messages/       # Messaging system
├── resources/      # Educational resources
└── directory/      # University directory`}
                    </code>
                  </pre>
                </div>
              </section>

              <Alert className="mt-6">
                <Code className="h-4 w-4" />
                <AlertTitle>Developer Note</AlertTitle>
                <AlertDescription>
                  This application currently uses mock data for demonstration purposes. In a production environment, these endpoints would connect to a real backend service.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>
                Data model and relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Core Tables</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>users</strong>: User accounts and profile information
                    <ul className="list-circle pl-6 mt-2">
                      <li>id, name, email, password_hash, role, avatar_url, college, department, created_at, last_active</li>
                    </ul>
                  </li>
                  <li>
                    <strong>messages</strong>: Communication between users
                    <ul className="list-circle pl-6 mt-2">
                      <li>id, sender_id, recipient_id, content, sent_at, read_at</li>
                    </ul>
                  </li>
                  <li>
                    <strong>resources</strong>: Educational materials
                    <ul className="list-circle pl-6 mt-2">
                      <li>id, title, description, file_url, type, uploaded_by, created_at</li>
                    </ul>
                  </li>
                  <li>
                    <strong>departments</strong>: Academic departments
                    <ul className="list-circle pl-6 mt-2">
                      <li>id, name, college_id, description</li>
                    </ul>
                  </li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Database Workflow</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>API requests data from specific endpoint</li>
                  <li>Controller processes request and constructs database query</li>
                  <li>Database executes query and returns results</li>
                  <li>Controller formats response and sends to client</li>
                  <li>Frontend displays data to user</li>
                </ol>
              </section>

              <Alert className="mt-6">
                <Database className="h-4 w-4" />
                <AlertTitle>Database Connection</AlertTitle>
                <AlertDescription>
                  The application uses a connection pool to efficiently manage database connections, with transactions for data integrity and prepared statements to prevent SQL injection.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Database Tools</CardTitle>
                <CardDescription>
                  Advanced database management options for administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-xl font-semibold">Database Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">354</p>
                        <p className="text-xs text-campus-gray-500">+12 this week</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Messages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">1,892</p>
                        <p className="text-xs text-campus-gray-500">+253 this week</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">87</p>
                        <p className="text-xs text-campus-gray-500">+9 this week</p>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-semibold">Query Tool</h3>
                  <div className="rounded-md border border-campus-gray-200 p-4">
                    <p className="text-sm text-campus-gray-500 mb-4">
                      This is where a database query tool would be implemented for administrators.
                      For security reasons, this feature is not fully implemented in the demo version.
                    </p>
                    <div className="bg-muted rounded-md p-3">
                      <code className="text-sm text-campus-gray-700">
                        SELECT * FROM users WHERE role = 'student' LIMIT 10;
                      </code>
                    </div>
                  </div>
                </section>

                <Alert variant="destructive" className="mt-6">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Admin Access Only</AlertTitle>
                  <AlertDescription>
                    These database tools are restricted to users with admin privileges.
                    All actions are logged for security audit purposes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Developer;
