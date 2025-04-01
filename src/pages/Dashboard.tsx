
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Users, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { authState } = useAuth();
  const { user } = authState;

  const quickActions = [
    {
      title: "Chat",
      icon: MessageCircle,
      description: "Message students, faculty or staff",
      href: "/messages",
      color: "bg-campus-blue text-white",
    },
    {
      title: "Resources",
      icon: FileText,
      description: "Access shared files and materials",
      href: "/resources",
      color: "bg-campus-green text-white",
    },
    {
      title: "Directory",
      icon: Users,
      description: "Find people across colleges",
      href: "/directory",
      color: "bg-campus-purple text-white",
    },
  ];

  const recentNotifications = [
    {
      id: "1",
      title: "New resource shared",
      message: "Dr. Smith has shared a new resource: 'Physics Lecture Notes'",
      time: "2 hours ago",
    },
    {
      id: "2",
      title: "Upcoming event",
      message: "Reminder: Virtual Career Fair this Friday at 10am",
      time: "Yesterday",
    },
    {
      id: "3",
      title: "Resource update",
      message: "'Data Structures Guide' has been updated with new content",
      time: "3 days ago",
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome, {user?.name}
        </h1>
        <div className="text-sm text-campus-gray-600 mt-2 md:mt-0">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action) => (
          <Card key={action.title} className="campus-card">
            <CardHeader className="pb-2">
              <div className={`p-2 rounded-md w-fit ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium">{action.title}</h3>
              <p className="text-sm text-campus-gray-600 mb-4">
                {action.description}
              </p>
              <Button asChild>
                <Link to={action.href}>Go to {action.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="campus-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
            <CardDescription>
              Stay updated with the latest information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 rounded-md border border-campus-gray-200 hover:bg-campus-gray-50 transition-colors"
                >
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-campus-gray-600">
                    {notification.message}
                  </p>
                  <p className="text-xs text-campus-gray-500 mt-2">
                    {notification.time}
                  </p>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/notifications">View all notifications</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="campus-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Resources
            </CardTitle>
            <CardDescription>
              Recently shared files and documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-md border border-campus-gray-200">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">Physics Lecture Notes</p>
                    <p className="text-sm text-campus-gray-600">
                      PDF • 2.4 MB • Shared by Dr. Smith
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-md border border-campus-gray-200">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">Data Structures Guide</p>
                    <p className="text-sm text-campus-gray-600">
                      PDF • 1.8 MB • Shared by Dr. Johnson
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-md border border-campus-gray-200">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">Campus Event Calendar</p>
                    <p className="text-sm text-campus-gray-600">
                      XLSX • 0.5 MB • Shared by Admin
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link to="/resources">View all resources</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
