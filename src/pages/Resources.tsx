
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Image,
  FileArchive,
  FileCode,
  Download,
  MoreVertical,
  Upload,
  Search,
  Filter,
  BookOpen,
  FileJson,
  FilePieChart,
  Database,
} from "lucide-react";
import { ResourceFile } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Mock CS resource data
const mockResources: ResourceFile[] = [
  {
    id: "1",
    name: "Data Structures and Algorithms",
    size: 3500000, // 3.5 MB
    type: "pdf",
    url: "#",
    uploadedBy: { id: "2", name: "Prof. Jane Smith" },
    uploadedAt: "2023-06-10T14:30:00Z",
    downloads: 128,
    isPublic: true,
    category: "Algorithms",
    description: "Comprehensive guide covering sorting algorithms, trees, graphs and complexity analysis",
  },
  {
    id: "2",
    name: "Machine Learning Fundamentals",
    size: 4800000, // 4.8 MB
    type: "pdf",
    url: "#",
    uploadedBy: { id: "3", name: "Dr. Alan Turing" },
    uploadedAt: "2023-06-09T10:15:00Z",
    downloads: 98,
    isPublic: true,
    category: "AI & Machine Learning",
    description: "Introduction to machine learning concepts, neural networks, and practical implementations",
  },
  {
    id: "3",
    name: "Database Systems Architecture",
    size: 2800000, // 2.8 MB
    type: "pdf",
    url: "#",
    uploadedBy: { id: "3", name: "Prof. Ada Lovelace" },
    uploadedAt: "2023-06-08T09:45:00Z",
    downloads: 67,
    isPublic: true,
    category: "Databases",
    description: "Principles of database management systems, SQL, and data modeling",
    thumbnailUrl: "https://placehold.co/400x300",
  },
  {
    id: "4",
    name: "Web Development Project",
    size: 15000000, // 15 MB
    type: "zip",
    url: "#",
    uploadedBy: { id: "2", name: "Dr. Tim Berners-Lee" },
    uploadedAt: "2023-06-07T16:20:00Z",
    downloads: 45,
    isPublic: true,
    category: "Web Development",
    description: "Sample web development project with React, Node.js and MongoDB",
  },
  {
    id: "5",
    name: "Computer Networks Fundamentals",
    size: 1800000, // 1.8 MB
    type: "pdf",
    url: "#",
    uploadedBy: { id: "4", name: "Prof. Vint Cerf" },
    uploadedAt: "2023-06-06T11:30:00Z",
    downloads: 54,
    isPublic: true,
    category: "Networking",
    description: "Comprehensive guide on TCP/IP, routing protocols, and network security",
  },
  {
    id: "6",
    name: "Operating Systems Concepts",
    size: 5300000, // 5.3 MB
    type: "pdf",
    url: "#",
    uploadedBy: { id: "3", name: "Prof. Linus Torvalds" },
    uploadedAt: "2023-06-05T14:10:00Z",
    downloads: 76,
    isPublic: true,
    category: "Operating Systems",
    description: "In-depth exploration of OS design, process management, and memory allocation",
  },
  {
    id: "7",
    name: "Python for Data Science",
    size: 3800000, // 3.8 MB
    type: "ipynb",
    url: "#",
    uploadedBy: { id: "2", name: "Prof. Guido van Rossum" },
    uploadedAt: "2023-06-04T13:20:00Z",
    downloads: 112,
    isPublic: true,
    category: "Data Science",
    description: "Jupyter notebooks with Python examples for data analysis, visualization, and machine learning",
  },
  {
    id: "8",
    name: "Software Engineering Practices",
    size: 2100000, // 2.1 MB
    type: "pdf",
    url: "#",
    uploadedBy: { id: "4", name: "Dr. Margaret Hamilton" },
    uploadedAt: "2023-06-03T10:15:00Z",
    downloads: 63,
    isPublic: true,
    category: "Software Engineering",
    description: "Best practices for software design, testing, and project management",
  },
];

// File type icons mapping
const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-8 w-8 text-campus-red" />,
  zip: <FileArchive className="h-8 w-8 text-campus-purple" />,
  png: <Image className="h-8 w-8 text-campus-blue" />,
  jpg: <Image className="h-8 w-8 text-campus-blue" />,
  jpeg: <Image className="h-8 w-8 text-campus-blue" />,
  docx: <FileText className="h-8 w-8 text-campus-blue" />,
  xlsx: <FilePieChart className="h-8 w-8 text-campus-green" />,
  ipynb: <FileCode className="h-8 w-8 text-campus-blue" />,
  json: <FileJson className="h-8 w-8 text-campus-purple" />,
  sql: <Database className="h-8 w-8 text-campus-blue" />,
};

// Default file icon
const DefaultFileIcon = <BookOpen className="h-8 w-8 text-campus-gray-500" />;

const Resources = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const { toast } = useToast();
  
  const [resources, setResources] = useState(mockResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState("");
  const [fileCategory, setFileCategory] = useState("Algorithms");

  // Filter resources based on search term and active tab
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && resource.category === activeTab;
  });

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!newFile || !user) return;

    // Simulate file upload
    const newResource: ResourceFile = {
      id: Date.now().toString(),
      name: newFile.name,
      size: newFile.size,
      type: newFile.name.split(".").pop() || "",
      url: "#",
      uploadedBy: { id: user.id, name: user.name },
      uploadedAt: new Date().toISOString(),
      downloads: 0,
      isPublic: true,
      category: fileCategory,
      description: fileDescription,
    };

    setResources((prev) => [newResource, ...prev]);
    setUploadDialogOpen(false);
    setNewFile(null);
    setFileDescription("");
    setFileCategory("Algorithms");

    toast({
      title: "File uploaded",
      description: `${newFile.name} has been successfully uploaded`,
    });
  };

  const handleDownload = (resource: ResourceFile) => {
    // In a real application, this would trigger a file download
    // Here we'll just update the download count
    setResources((prev) =>
      prev.map((r) =>
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      )
    );

    toast({
      title: "Download started",
      description: `Downloading ${resource.name}`,
    });
  };

  // Get unique categories for the tabs
  const categories = ["all", ...Array.from(new Set(resources.map((r) => r.category || "Uncategorized")))];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Computer Science Resources</h1>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload CS Resource</DialogTitle>
              <DialogDescription>
                Share computer science materials with the community
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" onChange={handleFileChange} />
              </div>
              
              <div className="grid w-full gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value)}
                  placeholder="e.g., Algorithms, Data Science, Web Development"
                />
              </div>
              
              <div className="grid w-full gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  placeholder="Brief description of the CS resource"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!newFile}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Browse CS Resources</CardTitle>
          <CardDescription>
            Access and share computer science learning materials
          </CardDescription>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-campus-gray-400 h-4 w-4" />
              <Input
                placeholder="Search CS resources"
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Most Recent</DropdownMenuItem>
                <DropdownMenuItem>Most Downloaded</DropdownMenuItem>
                <DropdownMenuItem>Alphabetical</DropdownMenuItem>
                <DropdownMenuItem>File Size</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full overflow-x-auto flex">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="space-y-4">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => {
                  const fileIcon = fileIcons[resource.type.toLowerCase()] || DefaultFileIcon;
                  
                  return (
                    <div
                      key={resource.id}
                      className="border rounded-md p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:bg-campus-gray-50 dark:hover:bg-campus-gray-800"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center h-16 w-16">
                        {resource.thumbnailUrl ? (
                          <img
                            src={resource.thumbnailUrl}
                            alt={resource.name}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        ) : (
                          fileIcon
                        )}
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-medium">{resource.name}</h3>
                        <p className="text-sm text-campus-gray-600 dark:text-campus-gray-400 mb-1">{resource.description}</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-campus-gray-500 dark:text-campus-gray-400">
                          <span>
                            {resource.type.toUpperCase()} • {formatFileSize(resource.size)}
                          </span>
                          <span>Uploaded by {resource.uploadedBy.name}</span>
                          <span>{formatDate(resource.uploadedAt)}</span>
                          <span>{resource.downloads} downloads</span>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col gap-2 items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(resource)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Share Link</DropdownMenuItem>
                            {user?.id === resource.uploadedBy.id && (
                              <DropdownMenuItem className="text-campus-red">
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-campus-gray-600 dark:text-campus-gray-400">No resources found</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-between items-center">
          <p className="text-sm text-campus-gray-600 dark:text-campus-gray-400">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Resources;
