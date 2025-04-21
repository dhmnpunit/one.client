"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Download, 
  Filter, 
  Eye
} from "lucide-react";
import { 
  DocumentTextIcon,
  DocumentIcon,
  PhotoIcon,
  TableCellsIcon,
  CodeBracketIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';

// Define types
interface Document {
  id: string;
  name: string;
  projectId: string;
  type: 'pdf' | 'doc' | 'image' | 'spreadsheet' | 'code' | 'archive' | 'other';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  tags?: string[];
}

interface Project {
  id: string;
  title: string;
  client: string;
}

// Mock projects (simplified version of the projects in the projects page)
const projects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    client: "Acme Corp"
  },
  {
    id: "2",
    title: "Mobile App Development",
    client: "TechStart"
  },
  {
    id: "3",
    title: "Brand Identity Package",
    client: "GreenLife"
  },
  {
    id: "4",
    title: "Marketing Campaign",
    client: "InnovateTech"
  },
  {
    id: "5",
    title: "E-commerce Platform",
    client: "FashionForward"
  },
  {
    id: "6",
    title: "Annual Report Design",
    client: "Global Finance"
  }
];

// Add missing teamMembers data
const teamMembers = [
  { id: "1", name: "Ali Demir", email: "ali.demir@example.com", role: "designer", avatar: "/avatars/ali-demir.jpg" },
  { id: "2", name: "Zeynep Ozturk", email: "zeynep.ozturk@example.com", role: "developer", avatar: "/avatars/zeynep-ozturk.jpg" },
  { id: "3", name: "Ahmet Yilmaz", email: "ahmet.yilmaz@example.com", role: "manager", avatar: "/avatars/ahmet-yilmaz.jpg" },
  { id: "4", name: "Sercan Yayla", email: "sercan.yayla@example.com", role: "developer", avatar: "/avatars/sercan-yayla.jpg" },
  // Add other members referenced if any
  { id: "5", name: "Yusuf Hilmi", email: "yusuf.hilmi@example.com", role: "designer", avatar: "/avatars/yusuf-hilmi.jpg" }, 
  { id: "6", name: "Emre Kara", email: "emre.kara@example.com", role: "marketing", avatar: "/avatars/emre-kara.jpg" }, 
];

// Mock documents data
const documents: Document[] = [
  // Website Redesign Documents
  {
    id: "doc-1",
    name: "Website Wireframes.pdf",
    projectId: "1",
    type: "pdf",
    size: "4.2 MB",
    uploadedBy: "1", // Ali Demir
    uploadDate: "2023-09-05",
    description: "Initial wireframes for the website redesign",
    url: "/documents/wireframes.pdf",
    tags: ["wireframe", "design", "ux"]
  },
  {
    id: "doc-2",
    name: "Brand Guidelines.pdf",
    projectId: "1",
    type: "pdf",
    size: "2.8 MB",
    uploadedBy: "2", // Zeynep Ozturk
    uploadDate: "2023-09-10",
    description: "Brand guidelines for the website",
    url: "/documents/brand-guidelines.pdf",
    tags: ["branding", "design"]
  },
  {
    id: "doc-3",
    name: "Homepage Design.jpg",
    projectId: "1",
    type: "image",
    size: "1.5 MB",
    uploadedBy: "1", // Ali Demir
    uploadDate: "2023-09-15",
    description: "Final homepage design",
    url: "/documents/homepage.jpg",
    thumbnailUrl: "/documents/thumbnail-homepage.jpg",
    tags: ["design", "homepage"]
  },
  {
    id: "doc-4",
    name: "Frontend Code.zip",
    projectId: "1",
    type: "archive",
    size: "8.7 MB",
    uploadedBy: "4", // Sercan Yayla
    uploadDate: "2023-10-05",
    description: "Frontend code package",
    url: "/documents/frontend-code.zip",
    tags: ["code", "frontend"]
  },

  // Mobile App Development Documents
  {
    id: "doc-5",
    name: "App Mockups.pdf",
    projectId: "2",
    type: "pdf",
    size: "5.1 MB",
    uploadedBy: "1", // Ali Demir
    uploadDate: "2023-10-20",
    description: "Mockups for the mobile app",
    url: "/documents/app-mockups.pdf",
    tags: ["design", "mockup", "mobile"]
  },
  {
    id: "doc-6",
    name: "Technical Specifications.docx",
    projectId: "2",
    type: "doc",
    size: "1.2 MB",
    uploadedBy: "3", // Ahmet Yilmaz
    uploadDate: "2023-10-25",
    description: "Technical specifications document",
    url: "/documents/tech-specs.docx",
    tags: ["specs", "technical"]
  },
  {
    id: "doc-7",
    name: "API Documentation.pdf",
    projectId: "2",
    type: "pdf",
    size: "3.4 MB",
    uploadedBy: "4", // Sercan Yayla
    uploadDate: "2023-11-05",
    description: "API documentation for the mobile app",
    url: "/documents/api-docs.pdf",
    tags: ["api", "documentation", "development"]
  },

  // Brand Identity Package Documents
  {
    id: "doc-8",
    name: "Logo Files.zip",
    projectId: "3",
    type: "archive",
    size: "15.3 MB",
    uploadedBy: "1", // Ali Demir
    uploadDate: "2023-08-20",
    description: "All logo files in various formats",
    url: "/documents/logo-files.zip",
    tags: ["logo", "branding"]
  },
  {
    id: "doc-9",
    name: "Brand Guide.pdf",
    projectId: "3",
    type: "pdf",
    size: "7.8 MB",
    uploadedBy: "1", // Ali Demir
    uploadDate: "2023-09-01",
    description: "Comprehensive brand guidelines",
    url: "/documents/brand-guide.pdf",
    tags: ["branding", "guidelines"]
  },
  {
    id: "doc-10",
    name: "Color Palette.png",
    projectId: "3",
    type: "image",
    size: "0.8 MB",
    uploadedBy: "5", // Yusuf Hilmi
    uploadDate: "2023-08-25",
    description: "Brand color palette",
    url: "/documents/color-palette.png",
    thumbnailUrl: "/documents/thumbnail-palette.png",
    tags: ["colors", "branding"]
  },

  // Marketing Campaign Documents
  {
    id: "doc-11",
    name: "Campaign Strategy.pptx",
    projectId: "4",
    type: "doc",
    size: "4.5 MB",
    uploadedBy: "3", // Ahmet Yilmaz
    uploadDate: "2024-01-15",
    description: "Marketing campaign strategy presentation",
    url: "/documents/campaign-strategy.pptx",
    tags: ["marketing", "strategy"]
  },
  {
    id: "doc-12",
    name: "Content Calendar.xlsx",
    projectId: "4",
    type: "spreadsheet",
    size: "1.1 MB",
    uploadedBy: "6", // Emre Kara
    uploadDate: "2024-01-20",
    description: "Content calendar for Q1 2024",
    url: "/documents/content-calendar.xlsx",
    tags: ["content", "planning", "marketing"]
  },

  // E-commerce Platform Documents
  {
    id: "doc-13",
    name: "Platform Architecture.pdf",
    projectId: "5",
    type: "pdf",
    size: "3.2 MB",
    uploadedBy: "4", // Sercan Yayla
    uploadDate: "2023-11-10",
    description: "Architecture diagram for the e-commerce platform",
    url: "/documents/platform-architecture.pdf",
    tags: ["architecture", "technical", "development"]
  },
  {
    id: "doc-14",
    name: "Database Schema.sql",
    projectId: "5",
    type: "code",
    size: "0.5 MB",
    uploadedBy: "4", // Sercan Yayla
    uploadDate: "2023-11-15",
    description: "Database schema SQL file",
    url: "/documents/db-schema.sql",
    tags: ["database", "development"]
  },
  {
    id: "doc-15",
    name: "Product Catalog.xlsx",
    projectId: "5",
    type: "spreadsheet",
    size: "2.3 MB",
    uploadedBy: "6", // Emre Kara
    uploadDate: "2023-12-01",
    description: "Product catalog spreadsheet",
    url: "/documents/product-catalog.xlsx",
    tags: ["products", "inventory"]
  },

  // Annual Report Design Documents
  {
    id: "doc-16",
    name: "Annual Report Draft.pdf",
    projectId: "6",
    type: "pdf",
    size: "6.7 MB",
    uploadedBy: "2", // Zeynep Ozturk
    uploadDate: "2023-12-10",
    description: "Draft of the annual report",
    url: "/documents/annual-report-draft.pdf",
    tags: ["report", "design"]
  },
  {
    id: "doc-17",
    name: "Financial Charts.xlsx",
    projectId: "6",
    type: "spreadsheet",
    size: "1.8 MB",
    uploadedBy: "3", // Ahmet Yilmaz
    uploadDate: "2023-12-15",
    description: "Financial charts for the annual report",
    url: "/documents/financial-charts.xlsx",
    tags: ["finance", "charts", "data"]
  }
];

// Get file icon based on type
function getFileIcon(type: Document['type']) {
  switch (type) {
    case 'pdf':
      return <DocumentTextIcon className="h-10 w-10 text-red-500" />;
    case 'doc':
      return <DocumentTextIcon className="h-10 w-10 text-blue-500" />;
    case 'image':
      return <PhotoIcon className="h-10 w-10 text-purple-500" />;
    case 'spreadsheet':
      return <TableCellsIcon className="h-10 w-10 text-green-500" />;
    case 'code':
      return <CodeBracketIcon className="h-10 w-10 text-yellow-500" />;
    case 'archive':
      return <ArchiveBoxIcon className="h-10 w-10 text-orange-500" />;
    default:
      return <DocumentIcon className="h-10 w-10 text-gray-500" />;
  }
}

// Get file type label
function getFileTypeLabel(type: Document['type']) {
  switch (type) {
    case 'pdf': return 'PDF';
    case 'doc': return 'Document';
    case 'image': return 'Image';
    case 'spreadsheet': return 'Spreadsheet';
    case 'code': return 'Code';
    case 'archive': return 'Archive';
    default: return 'File';
  }
}

// Main component
export default function DocumentsPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Commented out for now

  // Get project name by ID
  const getProjectName = (id: string) => {
    const project = projects.find(project => project.id === id);
    return project ? project.title : 'Unknown Project';
  };

  // Add missing getTeamMember helper function
  const getTeamMember = (id: string) => {
    return teamMembers.find(m => m.id === id) || { id: '', name: 'Unknown User', email: '', role: '', avatar: '' };
  };

  // Filter documents based on project filter and type filter
  const filteredDocuments = useMemo(() => {
    return documents.filter(document => {
      // Filter by project
      const matchesProject = selectedProject === null || document.projectId === selectedProject;
      
      // Filter by file type
      const matchesType = selectedType === null || document.type === selectedType;
      
      return matchesProject && matchesType;
    });
  }, [selectedProject, selectedType]);

  // Get documents grouped by project
  const documentsByProject = useMemo(() => {
    const groupedDocuments: Record<string, Document[]> = {};
    
    filteredDocuments.forEach(document => {
      if (!groupedDocuments[document.projectId]) {
        groupedDocuments[document.projectId] = [];
      }
      groupedDocuments[document.projectId].push(document);
    });
    
    return groupedDocuments;
  }, [filteredDocuments]);

  // Handle document preview
  const handlePreviewDocument = (document: Document) => {
    console.log("Previewing document:", document);
    // In a real app, this would open a modal or navigate to a preview page
    window.open(document.url, '_blank');
  };

  // Handle document download
  const handleDownloadDocument = (document: Document) => {
    console.log("Downloading document:", document);
    // In a real app, this would trigger a download
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Access and manage all your project documents in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-40">
            <Select value={selectedProject ?? 'all'} onValueChange={(value) => setSelectedProject(value === 'all' ? null : value)}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by project" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <Select value={selectedType ?? 'all'} onValueChange={(value) => setSelectedType(value === 'all' ? null : value)}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="doc">Documents</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="archive">Archives</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <Tabs defaultValue="all" value={selectedProject ?? 'all'} onValueChange={(value) => setSelectedProject(value === 'all' ? null : value as string | null)}>
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="shared">Shared with Me</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Documents */}
      {Object.keys(documentsByProject).length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <DocumentTextIcon className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or search</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(documentsByProject).map(([projectId, docs]) => (
            <div key={projectId} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{getProjectName(projectId)}</h2>
                <Badge variant="outline">
                  {docs.length} {docs.length === 1 ? 'document' : 'documents'}
                </Badge>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {docs.map(doc => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {getFileIcon(doc.type)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <div className="text-sm text-gray-500">
                                <Badge variant="outline" className="mt-1">{getFileTypeLabel(doc.type)}</Badge>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={getTeamMember(doc.uploadedBy).avatar} />
                              <AvatarFallback>{getTeamMember(doc.uploadedBy).name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="ml-2 text-sm text-gray-900">{getTeamMember(doc.uploadedBy).name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(doc.uploadDate), 'P')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => handlePreviewDocument(doc)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 