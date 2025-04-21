"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { 
  DocumentTextIcon,
  DocumentIcon,
  PhotoIcon,
  TableCellsIcon,
  CodeBracketIcon,
  ArchiveBoxIcon,
  FolderIcon
} from "@heroicons/react/24/solid"

// Define types specific to Client view
interface ClientDocument {
  id: string;
  name: string;
  projectId: string;
  type: 'pdf' | 'doc' | 'image' | 'spreadsheet' | 'code' | 'archive' | 'other';
  size: string;
  uploadDate: string; // Renamed from 'uploaded' for consistency
  description?: string; // Optional description
  url: string;
  thumbnailUrl?: string; // Optional thumbnail for images
}

interface ClientProject {
  id: string;
  title: string; // Renamed from 'name' for consistency
}

// Mock Client Projects (Assume client only sees their projects)
const clientProjects: ClientProject[] = [
  {
    id: "cp1",
    title: "Website Redesign",
  },
  {
    id: "cp2",
    title: "Mobile App Development",
  },
];

// Mock Client Documents data, linked to client projects
const clientDocuments: ClientDocument[] = [
  // Website Redesign Documents (Client View)
  {
    id: "doc-1",
    name: "Website Wireframes_ClientReview.pdf",
    projectId: "cp1",
    type: "pdf",
    size: "4.2 MB",
    uploadDate: "2023-09-05",
    description: "Initial wireframes for review",
    url: "/documents/wireframes_client.pdf",
  },
  {
    id: "doc-3",
    name: "Homepage_Preview.jpg",
    projectId: "cp1",
    type: "image",
    size: "1.5 MB",
    uploadDate: "2023-09-15",
    description: "Preview of the final homepage design",
    url: "/documents/homepage_preview.jpg",
    thumbnailUrl: "/documents/thumbnail-homepage_preview.jpg",
  },

  // Mobile App Development Documents (Client View)
  {
    id: "doc-5",
    name: "App Mockups_v1.pdf",
    projectId: "cp2",
    type: "pdf",
    size: "5.1 MB",
    uploadDate: "2023-10-20",
    description: "First round of mockups for the mobile app",
    url: "/documents/app-mockups_client.pdf",
  },
  {
    id: "doc-6",
    name: "Functional Requirements.docx",
    projectId: "cp2",
    type: "doc",
    size: "1.2 MB",
    uploadDate: "2023-10-25",
    description: "Functional requirements document",
    url: "/documents/functional-reqs.docx",
  },
];

// Get file icon based on type
function getFileIcon(type: ClientDocument['type']) {
  // Use SOLID Heroicons with softer colors (e.g., shade 400)
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
      return <ArchiveBoxIcon className="h-6 w-6 text-orange-400" />; // Adjusted orange shade
    default:
      return <DocumentIcon className="h-6 w-6 text-gray-400" />; 
  }
}

export default function ClientDocumentsPage() {
  // For simplicity, client page might not need project filtering if they only see their projects
  // We can add type filtering later if needed.
  const [typeFilter, setTypeFilter] = useState('all'); 

  // Get project name by ID (using clientProjects)
  const getProjectName = (id: string) => {
    const project = clientProjects.find(project => project.id === id);
    return project ? project.title : 'Unknown Project';
  };

  // Filter documents based type filter
  const filteredDocuments = useMemo(() => {
    return clientDocuments.filter(document => {
      // Filter by file type
      const matchesType = typeFilter === 'all' || document.type === typeFilter;
      return matchesType;
    });
  }, [typeFilter]);

  // Get documents grouped by project
  const documentsByProject = useMemo(() => {
    const groupedDocuments: Record<string, ClientDocument[]> = {};
    
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
      }, {} as Record<string, ClientDocument[]>);

  }, [filteredDocuments]); // Added getProjectName dependency implicitly through sort

  // Handle document preview (simple window open for now)
  const handlePreviewDocument = (document: ClientDocument) => {
    console.log("Previewing document:", document);
    window.open(document.url, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">View and download documents related to your projects</p>
        </div>
        {/* Optional: Add type filter if needed */}
        <div className="flex items-center gap-3">
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
          {/* Removed Upload button for client view */}
        </div>
      </div>

      {/* Removed Tabs section */}

      {/* Documents Grouped by Project */}
      {Object.keys(documentsByProject).length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-white">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            {/* Use a relevant icon */}
            <DocumentIcon className="h-12 w-12" /> 
          </div>
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-gray-500 mt-1">No documents match the current filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(documentsByProject).map(([projectId, docs]) => (
            <div key={projectId} className="space-y-4">
              <div className="flex justify-between items-center">
                {/* Link project title to project details page */}
                <Link href={`/client/projects/${projectId}`} passHref className="flex items-center gap-2 text-gray-700 hover:text-primary hover:underline">
                  {/* Add Folder Icon */}
                  <FolderIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  {/* Change to text-base, add font-semibold, keep text-black */}
                  <h2 className="text-base cursor-pointer text-black font-semibold">{getProjectName(projectId)}</h2>
                </Link>
                <Badge variant="outline">
                  {docs.length} {docs.length === 1 ? 'document' : 'documents'}
                </Badge>
              </div>
              
              <div className="rounded-md border overflow-hidden bg-white shadow-sm">
                {/* Add table-fixed and define column widths */}
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* Define approximate column widths for client view */}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[55%]">File</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Size</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Date Uploaded</th>
                      <th scope="col" className="relative px-6 py-3 w-[15%]">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {docs.map(doc => {
                      // Define badge classes based on type using softer colors (e.g., bg-XXX-50, text-XXX-700)
                      let badgeClasses = "text-xs font-medium px-2 py-0.5 rounded-full";
                      let typeLabel = "File";
                      switch (doc.type) {
                        case 'pdf':
                          badgeClasses += " bg-red-50 text-red-700"; // Softer red
                          typeLabel = 'PDF';
                          break;
                        case 'doc':
                          badgeClasses += " bg-blue-50 text-blue-700"; // Softer blue
                          typeLabel = 'Document';
                          break;
                        case 'image':
                          badgeClasses += " bg-purple-50 text-purple-700"; // Softer purple
                          typeLabel = 'Image';
                          break;
                        case 'spreadsheet':
                          badgeClasses += " bg-green-50 text-green-700"; // Softer green
                          typeLabel = 'Spreadsheet';
                          break;
                        case 'code':
                          badgeClasses += " bg-yellow-50 text-yellow-700"; // Softer yellow
                          typeLabel = 'Code';
                          break;
                        case 'archive':
                          badgeClasses += " bg-orange-50 text-orange-700"; // Softer orange
                          typeLabel = 'Archive';
                          break;
                        default:
                          badgeClasses += " bg-gray-100 text-gray-700"; // Adjusted gray
                          typeLabel = 'File';
                      }

                      return (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-6 w-6 mr-3"> 
                                {getFileIcon(doc.type)}
                              </div>
                              {/* Wrap name and badge in a flex container */}
                              <div className="flex items-center gap-2"> 
                                <div className="text-sm font-medium text-gray-900 truncate" title={doc.name}>{doc.name}</div>
                                {/* Apply dynamic classes to the badge */}
                                <Badge className={badgeClasses}>{typeLabel}</Badge>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                          {/* Removed Uploaded By cell */}
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex gap-2 justify-end">
                               {/* Added Preview Button */}
                              <Button variant="ghost" size="sm" onClick={() => handlePreviewDocument(doc)} title="Preview File">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {/* Download Button using anchor tag */}
                              <Button variant="ghost" size="sm" asChild title="Download File">
                                <a href={doc.url} download={doc.name}>
                                   <Download className="h-4 w-4 mr-1" />
                                   Download
                                </a>
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