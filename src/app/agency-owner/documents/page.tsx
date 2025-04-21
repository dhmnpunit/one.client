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
  ArchiveBoxIcon,
  FolderIcon
} from "@heroicons/react/24/solid";
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

// Team members (simplified)
const teamMembers = [
  { id: "1", name: "Ali Demir", role: "Designer", avatar: getTeamMemberAvatar("Ali Demir") },
  { id: "2", name: "Zeynep Ozturk", role: "Developer", avatar: getTeamMemberAvatar("Zeynep Ozturk") },
  { id: "3", name: "Ahmet Yilmaz", role: "Manager", avatar: getTeamMemberAvatar("Ahmet Yilmaz") },
  { id: "4", name: "Sercan Yayla", role: "Developer", avatar: getTeamMemberAvatar("Sercan Yayla") },
  { id: "5", name: "Yusuf Hilmi", role: "Designer", avatar: getTeamMemberAvatar("Yusuf Hilmi") },
  { id: "6", name: "Emre Kara", role: "Developer", avatar: getTeamMemberAvatar("Emre Kara") }
];

// Generate avatar URL for team members using DiceBear with micah style
function getTeamMemberAvatar(name: string) {
  const seed = name.toLowerCase().replace(/\s+/g, '-');
  return `https://api.dicebear.com/7.x/micah/svg?seed=${seed}`;
}

// Get file icon based on type
function getFileIcon(type: Document['type']) {
  switch (type) {
    case 'pdf':
      return <DocumentTextIcon className="h-6 w-6 text-red-400" />;
    case 'doc':
      return <DocumentIcon className="h-6 w-6 text-blue-400" />;
    case 'image':
      return <PhotoIcon className="h-6 w-6 text-purple-400" />;
    case 'spreadsheet':
      return <TableCellsIcon className="h-6 w-6 text-green-400" />;
    case 'code':
      return <CodeBracketIcon className="h-6 w-6 text-yellow-400" />;
    case 'archive':
      return <ArchiveBoxIcon className="h-6 w-6 text-orange-400" />;
    default:
      return <DocumentIcon className="h-6 w-6 text-gray-400" />;
  }
}

// Main component
export default function DocumentsPage() {
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'shared' | 'favorites'>('all');

  // Get document uploader name
  const getUploaderName = (id: string) => {
    const member = teamMembers.find(member => member.id === id);
    return member ? member.name : 'Unknown';
  };

  // Get project name by ID
  const getProjectName = (id: string) => {
    const project = projects.find(project => project.id === id);
    return project ? project.title : 'Unknown Project';
  };

  // Filter documents based on project filter and type filter
  const filteredDocuments = useMemo(() => {
    return documents.filter(document => {
      // Filter by project
      const matchesProject = projectFilter === 'all' || document.projectId === projectFilter;
      
      // Filter by file type
      const matchesType = typeFilter === 'all' || document.type === typeFilter;
      
      return matchesProject && matchesType;
    });
  }, [projectFilter, typeFilter]);

  // Get documents grouped by project
  const documentsByProject = useMemo(() => {
    const groupedDocuments: Record<string, Document[]> = {};
    
    filteredDocuments.forEach(document => {
      if (!groupedDocuments[document.projectId]) {
        groupedDocuments[document.projectId] = [];
      }
      groupedDocuments[document.projectId].push(document);
    });
    
    // Sort projects alphabetically by name for consistent order
    return Object.entries(groupedDocuments)
      .sort(([projectIdA], [projectIdB]) => {
        const nameA = getProjectName(projectIdA).toLowerCase();
        const nameB = getProjectName(projectIdB).toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, Document[]>);
  }, [filteredDocuments]);

  // Handle document preview
  const handlePreviewDocument = (document: Document) => {
    console.log("Previewing document:", document);
    // In a real app, this would open a modal or navigate to a preview page
    window.open(document.url, '_blank');
  };

  // Handle document download (Reverted to simple log, download simulation removed)
  const handleDownloadDocument = (document: Document) => {
    console.log("Downloading document:", document);
    // In a real app, this would trigger a download via backend or direct link
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
            <Select value={projectFilter} onValueChange={setProjectFilter}>
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
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
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'recent' | 'shared' | 'favorites')}>
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
                <div className="flex items-center gap-2 text-gray-700">
                  <FolderIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <h2 className="text-base font-semibold text-black">{getProjectName(projectId)}</h2>
                </div>
                <Badge variant="outline">
                  {docs.length} {docs.length === 1 ? 'document' : 'documents'}
                </Badge>
              </div>
              
              <div className="rounded-md border overflow-hidden bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">File</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Size</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Uploaded By</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Date</th>
                      <th scope="col" className="relative px-6 py-3 w-[15%]">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {docs.map(doc => {
                      // Define badge classes based on type using softer colors
                      let badgeClasses = "text-xs font-medium px-2 py-0.5 rounded-full";
                      let typeLabel = "File";
                      switch (doc.type) {
                        case 'pdf':
                          badgeClasses += " bg-red-50 text-red-700";
                          typeLabel = 'PDF';
                          break;
                        case 'doc':
                          badgeClasses += " bg-blue-50 text-blue-700";
                          typeLabel = 'Document';
                          break;
                        case 'image':
                          badgeClasses += " bg-purple-50 text-purple-700";
                          typeLabel = 'Image';
                          break;
                        case 'spreadsheet':
                          badgeClasses += " bg-green-50 text-green-700";
                          typeLabel = 'Spreadsheet';
                          break;
                        case 'code':
                          badgeClasses += " bg-yellow-50 text-yellow-700";
                          typeLabel = 'Code';
                          break;
                        case 'archive':
                          badgeClasses += " bg-orange-50 text-orange-700";
                          typeLabel = 'Archive';
                          break;
                        default:
                          badgeClasses += " bg-gray-100 text-gray-700";
                          typeLabel = 'File';
                      }
                      
                      return (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-6 w-6 mr-3">
                                {getFileIcon(doc.type)}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-900 truncate" title={doc.name}>{doc.name}</div>
                                <Badge className={badgeClasses}>{typeLabel}</Badge>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={teamMembers.find(m => m.id === doc.uploadedBy)?.avatar} />
                                <AvatarFallback>{getUploaderName(doc.uploadedBy).charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="ml-2 text-sm text-gray-900">{getUploaderName(doc.uploadedBy)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handlePreviewDocument(doc)} title="Preview File">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc)} title="Download File">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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