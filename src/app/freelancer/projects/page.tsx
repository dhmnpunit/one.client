"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Filter, 
  Plus,
  MoreHorizontal as MoreHorizontalIcon,
  X,
  Calendar,
  CheckCircle,
  Clock,
  Info,
  ListTodo,
  Building,
  FileText,
  Briefcase
} from "lucide-react";
import { PencilSquareIcon, ShareIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Define types
interface Project {
  id: string;
  title: string;
  client: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'On Hold';
  dueDate: string;
  teamMembers: string[]; // Kept for structure, but likely only the freelancer
  progress: number;
  description: string;
  startDate: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// Mock projects data (adjust for freelancer context if needed)
const projects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    client: "Acme Corp",
    status: "In Progress",
    dueDate: "2023-12-15",
    teamMembers: ["Freelancer"], // Example: Just the freelancer
    progress: 75,
    description: "Complete redesign of the corporate website with new branding guidelines and improved user experience.",
    startDate: "2023-09-01",
    tasks: [
      { id: "t1", title: "Wireframing", completed: true },
      { id: "t2", title: "Design System", completed: true },
      { id: "t3", title: "Homepage Development", completed: false },
      { id: "t4", title: "Responsive Testing", completed: false }
    ]
  },
  {
    id: "2",
    title: "Mobile App Development",
    client: "TechStart",
    status: "In Progress",
    dueDate: "2024-01-30",
    teamMembers: ["Freelancer"], 
    progress: 40,
    description: "Cross-platform mobile application for customer engagement and retention.",
    startDate: "2023-10-15",
    tasks: [
      { id: "t5", title: "UI/UX Design", completed: true },
      { id: "t6", title: "Frontend Development", completed: true },
      { id: "t7", title: "Backend Integration", completed: false },
      { id: "t8", title: "Authentication System", completed: false },
      { id: "t9", title: "Testing & Deployment", completed: false }
    ]
  },
  {
    id: "3",
    title: "Brand Identity Package",
    client: "GreenLife",
    status: "Completed",
    dueDate: "2023-11-10",
    teamMembers: ["Freelancer"],
    progress: 100,
    description: "Complete branding package including logo design, style guides, and brand assets.",
    startDate: "2023-08-15",
    tasks: [
      { id: "t10", title: "Logo Design", completed: true },
      { id: "t11", title: "Brand Guidelines", completed: true },
      { id: "t12", title: "Visual Assets", completed: true },
      { id: "t13", title: "Brand Implementation", completed: true }
    ]
  },
  {
    id: "4",
    title: "Marketing Campaign",
    client: "InnovateTech",
    status: "Planned",
    dueDate: "2024-02-28",
    teamMembers: ["Freelancer"],
    progress: 0,
    description: "Q4 marketing campaign for product launch across all channels.",
    startDate: "2024-01-15",
    tasks: [
      { id: "t14", title: "Campaign Strategy", completed: false },
      { id: "t15", title: "Content Creation", completed: false },
      { id: "t16", title: "Media Planning", completed: false },
      { id: "t17", title: "Performance Analytics", completed: false }
    ]
  },
  {
    id: "5",
    title: "E-commerce Platform",
    client: "FashionForward",
    status: "In Progress",
    dueDate: "2024-03-15",
    teamMembers: ["Freelancer"],
    progress: 60,
    description: "Custom e-commerce solution with inventory management system.",
    startDate: "2023-11-01",
    tasks: [
      { id: "t18", title: "Platform Architecture", completed: true },
      { id: "t19", title: "Frontend Development", completed: true },
      { id: "t20", title: "Payment Integration", completed: true },
      { id: "t21", title: "Inventory System", completed: false },
      { id: "t22", title: "User Testing", completed: false },
      { id: "t23", title: "Launch Preparation", completed: false }
    ]
  },
  {
    id: "6",
    title: "Annual Report Design",
    client: "Global Finance",
    status: "On Hold",
    dueDate: "2024-01-20",
    teamMembers: ["Freelancer"],
    progress: 20,
    description: "Design and layout of annual report for investors and stakeholders.",
    startDate: "2023-12-01",
    tasks: [
      { id: "t24", title: "Content Analysis", completed: true },
      { id: "t25", title: "Design Concept", completed: false },
      { id: "t26", title: "Layout Development", completed: false },
      { id: "t27", title: "Data Visualization", completed: false },
      { id: "t28", title: "Final Delivery", completed: false }
    ]
  }
];

// Status Badge Component
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "On Hold":
        return "bg-amber-100 text-amber-800";
      case "Planned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`${getStatusStyles()} font-medium`}>
      {status}
    </Badge>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

// Generate a consistent avatar URL for clients
const getClientAvatar = (clientName: string) => {
  const seed = clientName.replace(/\s+/g, '-').toLowerCase();
  return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`;
};

// Renamed function to FreelancerProjectsPage
export default function FreelancerProjectsPage() { 
  const [statusFilter, setStatusFilter] = useState("all");
  const [slidePanelOpen, setSlidePanelOpen] = useState(false);
  const [projectDetailPanelOpen, setProjectDetailPanelOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    client: "",
    status: "Planned",
    dueDate: "",
    teamMembers: [],
    progress: 0,
    description: "",
    startDate: new Date().toISOString().split('T')[0]
  });
  
  // Filter projects based on status
  const filteredProjects = statusFilter === "all" 
    ? projects 
    : projects.filter(project => project.status === statusFilter);
  
  const handleOpenProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setProjectDetailPanelOpen(true);
  };

  const handleAddNewProject = () => {
    setSlidePanelOpen(true);
  };

  const handleClosePanel = () => {
    setSlidePanelOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (status: 'Planned' | 'In Progress' | 'Completed' | 'On Hold') => {
    setNewProject(prev => ({ ...prev, status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new project with a generated ID
    const newProjectComplete: Project = {
      id: `p${projects.length + 1}`,
      title: newProject.title || "",
      client: newProject.client || "",
      status: newProject.status || "Planned",
      dueDate: newProject.dueDate || new Date().toISOString().split('T')[0],
      teamMembers: ["Freelancer"], // Default to freelancer
      progress: 0,
      description: newProject.description || "",
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      tasks: []
    };
    
    // In a real app, you would add the new project to the projects array
    console.log("New project created:", newProjectComplete);
    // TODO: Add logic to update the actual projects list state
    
    // Reset form and close panel
    setNewProject({
      title: "",
      client: "",
      status: "Planned",
      dueDate: "",
      teamMembers: [],
      progress: 0,
      description: "",
      startDate: new Date().toISOString().split('T')[0]
    });
    setSlidePanelOpen(false);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          {/* Adjusted subtitle for freelancer */}
          <p className="text-muted-foreground">Manage and track all your projects</p> 
        </div>
        <div className="flex gap-2 items-center">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddNewProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Projects</p>
          <p className="text-2xl font-semibold text-[#444]">{projects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">In Progress</p>
          <p className="text-2xl font-semibold text-[#444]">
            {projects.filter(p => p.status === 'In Progress').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-semibold text-[#444]">
            {projects.filter(p => p.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Avg. Completion</p>
          <p className="text-2xl font-semibold text-[#444]">
            {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              {/* Removed Team column for freelancer view */}
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th> */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {filteredProjects.map((project) => (
              <tr 
              key={project.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenProjectDetail(project)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(project.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </td>
                {/* Removed TeamAvatars cell for freelancer */}
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <TeamAvatars members={project.teamMembers} />
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <ProgressBar percentage={project.progress} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the row's onClick
                      handleOpenProjectDetail(project);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <MoreHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Project Slide Panel */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[550px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          slidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Fixed Header */}
          <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100">
            {/* Close overlay when clicking outside on mobile */}
            <button 
              onClick={handleClosePanel} 
              className="absolute top-4 left-4 md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
                  <p className="text-sm text-gray-500 mt-1">Add details about your new project</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={handleClosePanel}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {newProject.client && (
                <div className="flex items-center mt-1 mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9 mr-2 border border-gray-200 bg-white">
                      <AvatarImage src={getClientAvatar(newProject.client)} alt={newProject.client} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{newProject.client}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-24">
            <form id="newProjectForm" onSubmit={handleSubmit} className="space-y-8">
              {/* Project Information */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    Project Information
                  </h4>
                </div>
                
                <div className="p-4 divide-y divide-gray-100">
                  <div className="py-3 flex items-center">
                    <Label htmlFor="title" className="w-1/3 text-sm text-gray-500">
                      Project Name
                    </Label>
                    <div className="w-2/3">
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        value={newProject.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="py-3 flex items-center">
                    <Label htmlFor="client" className="w-1/3 text-sm text-gray-500">
                      Client
                    </Label>
                    <div className="w-2/3">
                      <Input
                        type="text"
                        id="client"
                        name="client"
                        value={newProject.client}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="py-3 flex items-center">
                    <Label htmlFor="status" className="w-1/3 text-sm text-gray-500">
                      Status
                    </Label>
                    <div className="w-2/3">
                      <Select value={newProject.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="py-3 flex items-start">
                    <Label htmlFor="description" className="w-1/3 text-sm text-gray-500 pt-2">
                      Description
                    </Label>
                    <div className="w-2/3">
                      <textarea
                        id="description"
                        name="description"
                        value={newProject.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Project Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    Project Timeline
                  </h4>
                </div>
                
                <div className="p-4 divide-y divide-gray-100">
                  <div className="py-3 flex items-center">
                    <Label htmlFor="startDate" className="w-1/3 text-sm text-gray-500">
                      Start Date
                    </Label>
                    <div className="w-2/3">
                      <Input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={newProject.startDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="py-3 flex items-center">
                    <Label htmlFor="dueDate" className="w-1/3 text-sm text-gray-500">
                      Due Date
                    </Label>
                    <div className="w-2/3">
                      <Input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={newProject.dueDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Team Members section might be removed or simplified for freelancer */}
            </form>
          </div>
          
          {/* Fixed Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-10 space-x-2"
              onClick={handleClosePanel}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            <Button 
              type="submit"
              form="newProjectForm"
              className="flex-1 bg-primary hover:bg-primary/90 text-white h-10 space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Project Details Slide Panel */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[550px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          projectDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedProject && (
          <div className="h-full flex flex-col">
            {/* Fixed Header */}
            <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100">
              {/* Close overlay when clicking outside on mobile */}
              <button 
                onClick={() => setProjectDetailPanelOpen(false)} 
                className="absolute top-4 left-4 md:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">{selectedProject.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                      <ShareIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center mt-1 mb-2">
                        <div className="flex items-center">
                    <Avatar className="h-9 w-9 mr-2 border border-gray-200 bg-white">
                      <AvatarImage src={getClientAvatar(selectedProject.client)} alt={selectedProject.client} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Building className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                    <span className="text-sm font-medium text-gray-700">{selectedProject.client}</span>
                  </div>
                      </div>
                      
                <div className="flex justify-between items-center">
                  <StatusBadge status={selectedProject.status} />
                  <span className="text-sm text-gray-500">
                    {selectedProject.progress}% Complete
                  </span>
                </div>
                
                <div className="w-full mt-1">
                  <Progress value={selectedProject.progress} className="h-2" />
                </div>
              </div>
                        </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 pb-24">
              {/* Tabs for project information */}
              <Tabs defaultValue="details" variant="folder" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="details" className="flex items-center flex-1">
                    <Info className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                  {/* Removed Team tab for freelancer view - ensured UsersIcon ref removed */}
                  {/* <TabsTrigger value="team" className="flex items-center flex-1">
                    <Users_Icon_Removed className="h-4 w-4 mr-2" />
                    Team
                  </TabsTrigger> */}
                  <TabsTrigger value="tasks" className="flex items-center flex-1">
                    <ListTodo className="h-4 w-4 mr-2" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                </TabsList>
                
                {/* Details tab content */}
                <TabsContent value="details" className="space-y-4">
                  {/* Project description */}
                  <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">
                      {selectedProject.description || "No description provided."}
                    </p>
                      </div>
                      
                  {/* Project details */}
                  <div className="bg-white rounded-lg p-4 mb-2 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Project Details</h4>
                    
                    <div className="divide-y divide-gray-100">
                      <div className="py-2 flex">
                        <div className="w-1/3 text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Timeline
                        </div>
                        <div className="w-2/3 text-sm font-medium text-gray-700">
                          {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : "Not set"} - {new Date(selectedProject.dueDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Team tab content - Removed for freelancer */}
                {/* <TabsContent value="team" className="space-y-4"> ... </TabsContent> */}
                
                {/* Tasks tab content */}
                <TabsContent value="tasks" className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Tasks</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {selectedProject.tasks ? 
                          `${selectedProject.tasks.filter(t => t.completed).length}/${selectedProject.tasks.length} Completed` : 
                          "0/0 Completed"}
                                </span>
                      </div>

                    {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProject.tasks.map((task, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              {task.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <Clock className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                              )}
                              <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                {task.title}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {task.completed ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-2">No tasks added to this project yet.</p>
                        )}
                      </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white h-10">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Task
                        </Button>
                </TabsContent>
                
                {/* Documents tab content */}
                <TabsContent value="documents" className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Project Documents</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        3 files
                      </span>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Project Brief.pdf</span>
                        </div>
                        <span className="text-xs text-gray-500">2.4 MB</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Client Requirements.xlsx</span>
                        </div>
                        <span className="text-xs text-gray-500">1.8 MB</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Contract.docx</span>
                        </div>
                        <span className="text-xs text-gray-500">782 KB</span>
                      </div>
                    </div>
                      </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white h-10">
                  <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </TabsContent>
              </Tabs>
                      </div>

            {/* Fixed Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 flex gap-4">
              <Button variant="outline" className="flex-1 h-10 space-x-2">
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-white h-10 space-x-2">
                <PencilSquareIcon className="h-4 w-4" />
                <span>Edit Project</span>
                        </Button>
                      </div>
            </div>
          )}
        </div>
      
      {/* Overlay for slide panels */}
      {(slidePanelOpen || projectDetailPanelOpen) && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => {
            if (slidePanelOpen) setSlidePanelOpen(false);
            if (projectDetailPanelOpen) setProjectDetailPanelOpen(false);
          }}
        />
      )}
    </div>
  );
} 