
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
} from "lucide-react";
import { ResourceFile } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Mock resource data
const mockResources: ResourceFile[] = [
  {
    id: "1",
    name: "Physics Lecture Notes",
    size: 2400000, // 2.4 MB
    type: "pdf",
    url: "#",
    uploadedBy: { id: "2", name: "Jane Smith" },
    uploadedAt: "2023-06-10T14:30:00Z",
    downloads: 15,
    isPublic: true,
    category: "Lecture Notes",
    description: "Comprehensive notes from the Advanced Physics lecture series",
  },
  {
    id: "2",
    name: "Programming Assignment 3",
    size: 150000, // 150 KB
    type: "zip",
    url: "#",
    uploadedBy: { id: "3", name: "Admin User" },
    uploadedAt: "2023-06-09T10:15:00Z",
    downloads: 32,
    isPublic: true,
    category: "Assignments",
    description: "Source code and documentation for Programming Assignment 3",
  },
  {
    id: "3",
    name: "Campus Map",
    size: 1800000, // 1.8 MB
    type: "png",
    url: "#",
    uploadedBy: { id: "3", name: "Admin User" },
    uploadedAt: "2023-06-08T09:45:00Z",
    downloads: 67,
    isPublic: true,
    category: "Resources",
    description: "Updated map of the campus with new building labels",
    thumbnailUrl: "https://placehold.co/400x300",
  },
  {
    id: "4",
    name: "Research Paper Template",
    size: 350000, // 350 KB
    type: "docx",
    url: "#",
    uploadedBy: { id: "2", name: "Jane Smith" },
    uploadedAt: "2023-06-07T16:20:00Z",
    downloads: 45,
    isPublic: true,
    category: "Templates",
    description: "Official template for research papers with formatting guidelines",
  },
  {
    id: "5",
    name: "Data Structures Guide",
    size: 1800000, // 1.8 MB
    type: "pdf",
    url: "#",
    uploadedBy: { id: "4", name: "Bob Johnson" },
    uploadedAt: "2023-06-06T11:30:00Z",
    downloads: 28,
    isPublic: true,
    category: "Study Materials",
    description: "Comprehensive guide on fundamental data structures and algorithms",
  },
  {
    id: "6",
    name: "Campus Event Calendar",
    size: 500000, // 500 KB
    type: "xlsx",
    url: "#",
    uploadedBy: { id: "3", name: "Admin User" },
    uploadedAt: "2023-06-05T14:10:00Z",
    downloads: 19,
    isPublic: true,
    category: "Administrative",
    description: "Calendar of upcoming campus events for the current semester",
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
  xlsx: <FileText className="h-8 w-8 text-campus-green" />,
};

// Default file icon
const DefaultFileIcon = <FileText className="h-8 w-8 text-campus-gray-500" />;

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
  const [fileCategory, setFileCategory] = useState("Resources");

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
    setFileCategory("Resources");

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
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Resources</h1>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Resource</DialogTitle>
              <DialogDescription>
                Share a file with your college community
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
                  placeholder="e.g., Lecture Notes, Assignments"
                />
              </div>
              
              <div className="grid w-full gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  placeholder="Brief description of the file"
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
          <CardTitle>Browse Resources</CardTitle>
          <CardDescription>
            Access and share files across colleges
          </CardDescription>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-campus-gray-400 h-4 w-4" />
              <Input
                placeholder="Search resources"
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
                      className="border rounded-md p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:bg-campus-gray-50"
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
                        <p className="text-sm text-campus-gray-600 mb-1">{resource.description}</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-campus-gray-500">
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
                  <p className="text-campus-gray-600">No resources found</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-between items-center">
          <p className="text-sm text-campus-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Resources;
