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
  Users as UsersIcon,
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
import { mockAgencyMembers, mockClients, mockProjects, Project as MockProject } from "@/lib/mock-data";

// Use Project type from mock data
type Project = MockProject;

// Status Badge Component
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "not-started":
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

// Team Avatars Component
interface TeamAvatarsProps {
  members: string[];
}

const TeamAvatars = ({ members }: TeamAvatarsProps) => {
  const getAvatarUrl = (member: string) => {
    // Use micah style from DiceBear for all team members
    return `https://api.dicebear.com/7.x/micah/svg?seed=${member.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="flex -space-x-3">
      {members.slice(0, 3).map((member) => (
        <Avatar key={member} className="h-10 w-10">
          <AvatarImage src={getAvatarUrl(member)} alt={member} />
          <AvatarFallback>{member.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      {members.length > 3 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
          +{members.length - 3}
        </div>
      )}
    </div>
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

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [slidePanelOpen, setSlidePanelOpen] = useState(false);
  const [projectDetailPanelOpen, setProjectDetailPanelOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Omit<Project, 'id' | 'startDate' | 'dueDate'>>>({ 
    name: "",
    clientId: "",
    description: "",
    assignedToId: "",
    status: "not-started",
    budget: 0,
    category: "web",
  });
  
  // --- Get assigned client IDs --- 
  const currentMember = mockAgencyMembers[0];
  const assignedClientIds = currentMember?.clientIds || [];
  // ----------------------------------------------------

  // --- Filter SHARED mockProjects based on assigned client IDs and status --- 
  const assignedProjects = mockProjects.filter(project => {
    const isAssigned = assignedClientIds.includes(project.clientId);
    return isAssigned;
  });

  const filteredProjects = assignedProjects.filter(project => {
    const projectStatus = project.status || "not-started";
    const matchesStatus = statusFilter === "all" || projectStatus.toLowerCase().replace('-', '') === statusFilter.toLowerCase().replace('-', '');
    return matchesStatus;
  });
  // --------------------------------------------------------------
  
  // --- Calculate stats based on ASSIGNED projects --- 
  const totalAssignedProjects = assignedProjects.length;
  const inProgressAssigned = assignedProjects.filter(p => p.status === 'in-progress').length;
  const completedAssigned = assignedProjects.filter(p => p.status === 'completed').length;
  const avgCompletionAssigned = 0;
  // --------------------------------------------------
  
  const handleOpenProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setProjectDetailPanelOpen(true);
  };

  const handleAddNewProject = () => {
    setSlidePanelOpen(true);
  };

  const handleClosePanel = () => {
    setSlidePanelOpen(false);
    setProjectDetailPanelOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    }));
  };

  const handleStatusChange = (status: 'completed' | 'in-progress' | 'not-started') => {
    setNewProject(prev => ({ ...prev, status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProjectComplete: Project = {
      id: `p${mockProjects.length + 1}${Date.now()}`,
      name: newProject.name || "",
      description: newProject.description || "",
      clientId: newProject.clientId || "",
      assignedToId: newProject.assignedToId || "",
      status: newProject.status || "not-started",
      startDate: new Date(),
      dueDate: new Date(),
      budget: newProject.budget || 0,
      category: newProject.category || "web",
    };
    
    console.log("New project created (local state):", newProjectComplete);
    setNewProject({ 
      name: "", clientId: "", description: "", assignedToId: "", 
      status: "not-started", budget: 0, category: "web" 
    });
    setSlidePanelOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your agency projects</p>
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
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Projects (Assigned)</p>
          <p className="text-2xl font-semibold text-[#444]">{totalAssignedProjects}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">In Progress (Assigned)</p>
          <p className="text-2xl font-semibold text-[#444]">
            {inProgressAssigned}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Completed (Assigned)</p>
          <p className="text-2xl font-semibold text-[#444]">
            {completedAssigned}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Avg. Completion (Assigned)</p>
          <p className="text-2xl font-semibold text-[#444]">
             N/A
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Budget
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {filteredProjects.map((project) => {
            const clientName = mockClients.find(c => c.id === project.clientId)?.name || project.clientId;
            const memberName = mockAgencyMembers.find(m => m.id === project.assignedToId)?.name || project.assignedToId;

            return (
              <tr 
                key={project.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenProjectDetail(project)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {clientName}
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {memberName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${project.budget?.toLocaleString() || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProjectDetail(project);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <MoreHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            )}
          )}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No assigned projects found matching criteria.</p>
          </div>
        )}
      </div>

      <div 
        className={`fixed top-0 right-0 w-full md:w-[550px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          slidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100">
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
              
              {newProject.clientId && (
                <div className="flex items-center mt-1 mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9 mr-2 border border-gray-200 bg-white">
                      <AvatarImage src={getClientAvatar(newProject.clientId)} alt={newProject.clientId} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{newProject.clientId}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 pb-24">
            <form id="newProjectForm" onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    Project Information
                  </h4>
                </div>
                
                <div className="p-4 divide-y divide-gray-100">
                  <div className="py-3 flex items-center">
                    <Label htmlFor="name" className="w-1/3 text-sm text-gray-500">
                      Project Name
                    </Label>
                    <div className="w-2/3">
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={newProject.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="py-3 flex items-center">
                    <Label htmlFor="clientId" className="w-1/3 text-sm text-gray-500">
                      Client
                    </Label>
                    <div className="w-2/3">
                      <Input
                        type="text"
                        id="clientId"
                        name="clientId"
                        value={newProject.clientId}
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
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="not-started">Not Started</SelectItem>
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
            </form>
          </div>
          
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

      <div 
        className={`fixed top-0 right-0 w-full md:w-[550px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          projectDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedProject && (
          <div className="h-full flex flex-col">
            <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100">
              <button 
                onClick={() => setProjectDetailPanelOpen(false)} 
                className="absolute top-4 left-4 md:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">{selectedProject.name}</h3>
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
                      <AvatarImage src={getClientAvatar(selectedProject.clientId)} alt={selectedProject.clientId} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{selectedProject.clientId}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <StatusBadge status={selectedProject.status} />
                </div>
                
                <div className="w-full mt-1">
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pb-24">
              <Tabs defaultValue="details" variant="folder" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="details" className="flex items-center flex-1">
                    <Info className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="team" className="flex items-center flex-1">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Team
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="flex items-center flex-1">
                    <ListTodo className="h-4 w-4 mr-2" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">
                      {selectedProject.description || "No description provided."}
                    </p>
                  </div>

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
                
                <TabsContent value="team" className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Team Members</h4>
                    
                    {selectedProject.assignedToId && (
                      <div className="space-y-3">
                        <div className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                          <Avatar className="h-10 w-10 mr-3 border border-gray-200">
                            <AvatarImage 
                              src={`https://api.dicebear.com/7.x/micah/svg?seed=${selectedProject.assignedToId.toLowerCase().replace(/\s+/g, '-')}`} 
                              alt={selectedProject.assignedToId} 
                            />
                            <AvatarFallback>{selectedProject.assignedToId.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{selectedProject.assignedToId}</p>
                            <p className="text-xs text-gray-500">Team Member</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white h-10">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </TabsContent>
                
                <TabsContent value="tasks" className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Tasks</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        0/0 Completed
                      </span>
                    </div>

                    {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProject.tasks.map((task, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className={`text-sm text-gray-700`}>
                                {task.title}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              Completed
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
                
                <TabsContent value="documents" className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Project Documents</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        0 files
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white h-10">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

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