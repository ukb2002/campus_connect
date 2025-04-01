
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Mail, User, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { User as UserType, UserRole } from "@/types/auth";

// Mock users data
const mockUsers: UserType[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
    college: "College of Engineering",
    department: "Computer Science",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    role: "faculty",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    college: "College of Arts and Sciences",
    department: "Mathematics",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Admin+User",
    college: "University Administration",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Bob Johnson",
    email: "bob.johnson@university.edu",
    role: "faculty",
    avatar: "https://ui-avatars.com/api/?name=Bob+Johnson",
    college: "College of Engineering",
    department: "Electrical Engineering",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Sarah Williams",
    email: "sarah.williams@university.edu",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Williams",
    college: "College of Business",
    department: "Marketing",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Michael Brown",
    email: "michael.brown@university.edu",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=Michael+Brown",
    college: "College of Engineering",
    department: "Mechanical Engineering",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Emily Davis",
    email: "emily.davis@university.edu",
    role: "faculty",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis",
    college: "College of Medicine",
    department: "Neuroscience",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "8",
    name: "David Wilson",
    email: "david.wilson@university.edu",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=David+Wilson",
    college: "College of Arts and Sciences",
    department: "Psychology",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@university.edu",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=Jennifer+Martinez",
    college: "College of Law",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Robert Taylor",
    email: "robert.taylor@university.edu",
    role: "faculty",
    avatar: "https://ui-avatars.com/api/?name=Robert+Taylor",
    college: "College of Fine Arts",
    department: "Music",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
];

// Extract colleges and departments for filtering
const colleges = Array.from(new Set(mockUsers.map((user) => user.college)));
const departments = Array.from(
  new Set(mockUsers.filter((user) => user.department).map((user) => user.department))
);

const Directory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [collegeFilter, setCollegeFilter] = useState<string | "all">("all");
  
  const filteredUsers = mockUsers.filter((user) => {
    // Search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.college.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    // College filter
    const matchesCollege = collegeFilter === "all" || user.college === collegeFilter;

    return matchesSearch && matchesRole && matchesCollege;
  });

  const handleStartChat = (user: UserType) => {
    // In a real app, this would navigate to the chat page with this user
    navigate("/messages");
    
    toast({
      title: "Chat initiated",
      description: `Starting a conversation with ${user.name}`,
    });
  };

  const handleViewProfile = (user: UserType) => {
    // In a real app, this would navigate to the user's profile page
    toast({
      title: "View profile",
      description: `Viewing ${user.name}'s profile`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">College Directory</h1>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-campus-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, department..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <Select value={roleFilter} onValueChange={(value: UserRole | "all") => setRoleFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="faculty">Faculty</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by college" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              {colleges.map((college) => (
                <SelectItem key={college} value={college}>
                  {college}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card key={user.id} className="campus-card">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-campus-gray-600">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStartChat(user)}>
                        Send Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-campus-gray-500" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="h-4 w-4 mr-2 text-campus-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{user.college}</span>
                  </div>
                  {user.department && (
                    <div className="flex items-center text-sm">
                      <svg className="h-4 w-4 mr-2 text-campus-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{user.department}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewProfile(user)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleStartChat(user)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-campus-gray-600">No users found matching your filters</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                setCollegeFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
