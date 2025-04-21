"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal,
  MessageSquare,
  X, Calendar, List, FileText, MessageCircle, ListX, FileX, Users, 
  Upload,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ClientProject {
  id: string;
  title: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'On Hold';
  dueDate: string;
  teamMembers: string[];
  progress: number;
  description?: string;
  startDate?: string;
  tasks?: { id: string; title: string; completed: boolean }[];
  documents?: { id: string; name: string; url: string; size: string }[];
}

const clientProjects: ClientProject[] = [
  {
    id: "p1", title: "E-commerce Platform", status: "In Progress", dueDate: "2024-09-15", 
    teamMembers: ["Alice Smith", "Bob Johnson", "Charlie Brown"], progress: 75,
    description: "Full-featured e-commerce platform with custom checkout.", startDate: "2024-06-01",
    tasks: [{id:"t1", title:"Setup project", completed: true}, {id:"t2", title:"Design homepage", completed: true}, {id:"t3", title:"Develop cart", completed: false}],
    documents: [{id: "d1", name: "Project Brief v1.pdf", url: "#", size: "1.2MB"}, {id: "d2", name: "Wireframes.fig", url: "#", size: "3.5MB"}]
  },
  {
    id: "p2", title: "Mobile App Design", status: "Planned", dueDate: "2024-11-01", 
    teamMembers: ["David Williams", "Eve Davis"], progress: 30,
    description: "UI/UX design phase for a new iOS and Android application.", startDate: "2024-08-01",
    tasks: [],
    documents: []
  },
  {
    id: "p3", title: "Brand Identity Refresh", status: "Completed", dueDate: "2024-06-30", 
    teamMembers: ["Alice Smith", "David Williams", "Frank Miller", "Grace Wilson"], 
    progress: 100,
    description: "Complete overhaul of brand assets and guidelines.", startDate: "2024-04-15",
    tasks: [{id:"t7", title:"Logo concepts", completed: true}, {id:"t8", title:"Style guide", completed: true}, {id:"t9", title:"Asset delivery", completed: true}],
    documents: [{id: "d3", name: "Final Logo Pack.zip", url: "#", size: "15MB"}, {id: "d4", name: "Brand Guidelines.pdf", url: "#", size: "4.1MB"}]
  },
    { id: "p4", title: "Marketing Website", status: "On Hold", dueDate: "2024-12-01", teamMembers: ["Bob Johnson", "Eve Davis"], progress: 10, description: "Basic marketing website.", startDate: "2024-10-01" },
  { id: "p5", title: "SEO Optimization", status: "In Progress", dueDate: "2024-10-20", teamMembers: ["Charlie Brown", "Frank Miller"], progress: 55, description: "Improve search engine ranking.", startDate: "2024-09-01" },
];

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "On Hold": return "bg-amber-100 text-amber-800";
      case "Planned": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  return <Badge className={`${getStatusStyles()} font-medium hover:brightness-95`}>{status}</Badge>;
};

interface TeamAvatarsProps {
  members: string[];
}

const TeamAvatars = ({ members }: TeamAvatarsProps) => {
  const getAvatarUrl = (member: string) => {
    return `https://api.dicebear.com/7.x/micah/svg?seed=${member.toLowerCase().replace(/\s+/g, '-')}`;
  };
  return (
    <div className="flex -space-x-3">
      {members.slice(0, 3).map((member) => (
        <Avatar key={member} className="h-10 w-10 border-2 border-white">
          <AvatarImage src={getAvatarUrl(member)} alt={member} />
          <AvatarFallback>{member.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      {members.length > 3 && (
        <Avatar className="h-10 w-10 border-2 border-white">
           <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              +{members.length - 3}
           </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

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

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const servicesOptions = [
  { id: 'design', label: 'UI/UX Design' },
  { id: 'development', label: 'Web Development' },
  { id: 'mobile', label: 'Mobile App Development' },
  { id: 'marketing', label: 'Digital Marketing' },
  { id: 'branding', label: 'Branding & Identity' },
  { id: 'other', label: 'Other (please specify)' },
];

export default function ClientProjectsPage() {
  const [projectDetailPanelOpen, setProjectDetailPanelOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [requestPanelOpen, setRequestPanelOpen] = useState(false);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestServices, setRequestServices] = useState<string[]>([]);
  const [requestBudget, setRequestBudget] = useState('');
  const [requestTimeline, setRequestTimeline] = useState('');
  const [requestFiles, setRequestFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const projectIdFromUrl = searchParams.get('projectId');
    if (projectIdFromUrl && !requestPanelOpen) {
      const projectToOpen = clientProjects.find(p => p.id === projectIdFromUrl);
      if (projectToOpen) {
        setSelectedProject(projectToOpen);
        setProjectDetailPanelOpen(true);
      }
    }
  }, [searchParams, requestPanelOpen]);

  const handleRowClick = (project: ClientProject) => {
    setSelectedProject(project);
    setProjectDetailPanelOpen(true);
  };
  
  const openRequestPanel = () => {
    setProjectDetailPanelOpen(false);
    setSelectedProject(null);
    setRequestTitle('');
    setRequestDescription('');
    setRequestServices([]);
    setRequestBudget('');
    setRequestTimeline('');
    setRequestFiles([]);
    setIsSubmitting(false);
    setRequestPanelOpen(true);
  };

  const closeRequestPanel = () => {
    setRequestPanelOpen(false);
  };

  const handleServiceChange = (serviceId: string, checked: boolean | string) => {
    setRequestServices(prev => 
      checked 
        ? [...prev, serviceId]
        : prev.filter(id => id !== serviceId)
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
       setRequestFiles(Array.from(event.target.files));
    } 
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setRequestFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRequestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !requestTitle || !requestDescription) return;

    setIsSubmitting(true);

    const formData = {
      title: requestTitle,
      description: requestDescription,
      services: requestServices,
      budget: requestBudget,
      timeline: requestTimeline,
      files: requestFiles.map(f => f.name),
    };
    console.log("Submitting Project Request:", formData);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Success!');
      setRequestTitle('');
      setRequestDescription('');
      setRequestServices([]);
      setRequestBudget('');
      setRequestTimeline('');
      setRequestFiles([]);
      setTimeout(() => {
        closeRequestPanel();
      }, 1000);

    } catch (error) {
      console.error("Submission error:", error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredProjects = clientProjects;
  const isSubmitDisabled = !requestTitle || !requestDescription || isSubmitting;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-muted-foreground">View and manage all your projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openRequestPanel}> 
              <MessageSquare className="h-4 w-4 mr-2" /> Request New Project
          </Button>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</TableHead>
              <TableHead className="relative px-6 py-3"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow 
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(project)}
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(project.dueDate)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <TeamAvatars members={project.teamMembers} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <ProgressBar percentage={project.progress} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleRowClick(project); }}> 
                      <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div 
        className={`fixed top-0 right-0 w-full md:w-[550px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${ 
          projectDetailPanelOpen ? 'translate-x-0' : 'translate-x-full' 
        }`} 
      > 
        {selectedProject && ( 
          <div className="h-full flex flex-col"> 
            <div className="px-6 py-4 border-b border-gray-300 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100 sticky top-0 z-10"> 
              <button 
                onClick={() => { setProjectDetailPanelOpen(false); }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col gap-3"> 
                <h3 className="text-lg font-semibold text-gray-900">{selectedProject.title}</h3> 
                <div className="flex justify-between items-center"> 
                  <StatusBadge status={selectedProject.status} /> 
                  <span className="text-sm text-gray-500">{selectedProject.progress}% Complete</span>
                </div>
                <div className="w-full mt-1"> 
                  <Progress value={selectedProject.progress} className="h-2" /> 
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-4"> 
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-base font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedProject.description || "No description provided."}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-base font-semibold text-gray-800 mb-3">Timeline</h4>
                <div className="divide-y divide-gray-100">
                  <div className="py-2 flex">
                    <div className="w-1/3 text-sm text-gray-500 flex items-center"><Calendar className="h-4 w-4 mr-2" /> Start Date</div>
                    <div className="w-2/3 text-sm font-medium text-gray-700">{formatDate(selectedProject.startDate)}</div>
                  </div>
                  <div className="py-2 flex">
                    <div className="w-1/3 text-sm text-gray-500 flex items-center"><Calendar className="h-4 w-4 mr-2" /> Due Date</div>
                    <div className="w-2/3 text-sm font-medium text-gray-700">{formatDate(selectedProject.dueDate)}</div>
                    </div>
                      </div>
                    </div>
              <Separator className="my-4" /> 
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base font-semibold text-gray-800">Tasks</h4>
                  {(selectedProject.tasks || []).length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {(selectedProject.tasks || []).filter(t => t.completed).length}/{(selectedProject.tasks || []).length} Completed
                        </span>
                  )}
                </div>
                {(selectedProject.tasks || []).length > 0 ? (
                  <div className="space-y-2">
                    {(selectedProject.tasks || []).map((task) => (
                      <div key={task.id} className="flex items-center p-2 bg-white rounded-md border border-gray-100">
                        <List className={`h-4 w-4 mr-2 flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{task.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-col gap-2 text-sm text-gray-500 bg-white p-4 rounded-md border border-dashed border-gray-200">
                     <ListX className="h-6 w-6 text-gray-400" />
                     <span>No tasks added yet.</span> 
                  </div>
                )}
              </div>
              <Separator className="my-4" /> 
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base font-semibold text-gray-800">Documents</h4>
                  {(selectedProject.documents || []).length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {(selectedProject.documents || []).length} files
                        </span>
                  )}
                </div>
                {(selectedProject.documents || []).length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {(selectedProject.documents || []).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100">
                        <div className="flex items-center flex-1 min-w-0 mr-2">
                          <FileText className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate" title={doc.name}>{doc.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 mr-2 flex-shrink-0">{doc.size}</span>
                        <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                          <a href={doc.url} download={doc.name}>Download</a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : ( 
                   <div className="flex items-center justify-center flex-col gap-2 text-sm text-gray-500 bg-white p-4 rounded-md border border-dashed border-gray-200">
                      <FileX className="h-6 w-6 text-gray-400" />
                      <span>No documents shared for this project yet.</span> 
                   </div>
                )}
              </div>
              <Separator className="my-4" /> 
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base font-semibold text-gray-800">Assigned Team</h4>
                  {(selectedProject.teamMembers || []).length > 0 && (
                    <Button variant="outline" size="sm"> 
                       <MessageCircle className="h-3 w-3 mr-1.5" />
                        Message Team 
                    </Button>
                  )}
                </div>
                {(selectedProject.teamMembers || []).length > 0 ? (
                  <div className="space-y-3">
                    {(selectedProject.teamMembers || []).map((member) => (
                      <div key={member} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100">
                         <div className="flex items-center">
                           <Avatar className="h-10 w-10 mr-3 border border-gray-200">
                             <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${member.toLowerCase().replace(/\s+/g, '-')}`} alt={member} />
                             <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div><p className="text-sm font-medium text-gray-900">{member}</p></div>
                         </div>
                         <Button variant="outline" size="sm">
                           <MessageCircle className="h-3 w-3 mr-1.5" />
                           Message
                    </Button>
                      </div>
                    ))}
                  </div>
                ) : ( 
                   <div className="flex items-center justify-center flex-col gap-2 text-sm text-gray-500 bg-white p-4 rounded-md border border-dashed border-gray-200">
                      <Users className="h-6 w-6 text-gray-400" />
                      <span>Team information not available.</span> 
                   </div>
                )}
              </div>
            </div> 
            </div>
        )}
      </div>
      
      {projectDetailPanelOpen && ( 
        <div  
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => { setProjectDetailPanelOpen(false); }}
        /> 
      )} 

      <div 
        className={`fixed top-0 right-0 w-full md:w-[550px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${ 
          requestPanelOpen ? 'translate-x-0' : 'translate-x-full' 
        }`} 
      > 
        <div className="h-full flex flex-col"> 
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-100 sticky top-0 z-10"> 
            <button 
              onClick={closeRequestPanel}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">Request New Project</h3> 
          </div> 
          
          <form onSubmit={handleRequestSubmit} className="flex-1 overflow-y-auto p-6 pb-20 space-y-6"> 
            <p className="text-xs text-gray-500">* Indicates required field</p>

            <div className="space-y-1.5">
              <Label htmlFor="request-title">Project Title <span className="text-red-500">*</span></Label>
              <Input 
                id="request-title" 
                placeholder="e.g., New Marketing Website" 
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                required 
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="request-description">Brief Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="request-description"
                placeholder="Include main goals, target audience, key features/pages needed..."
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                required
                rows={5}
                disabled={isSubmitting}
              />
                  </div>

            <Separator className="my-6" /> 

            <div className="space-y-2">
              <Label>Services Needed</Label>
              <div className="space-y-2 pt-1">
                {servicesOptions.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`service-${service.id}`}
                      checked={requestServices.includes(service.id)}
                      onCheckedChange={(checked) => handleServiceChange(service.id, checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor={`service-${service.id}`} className="text-sm font-normal">
                      {service.label}
                    </Label>
                  </div>
                ))}
                  </div>
                  </div>
            
            <Separator className="my-6" /> 

            <div className="space-y-1.5">
              <Label htmlFor="request-budget">Estimated Budget (Optional)</Label>
              <Input 
                id="request-budget" 
                type="text"
                placeholder="e.g., $5,000 - $10,000"
                value={requestBudget}
                onChange={(e) => setRequestBudget(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 pl-1">Provide a range or a specific figure if known.</p>
                        </div>

            <div className="space-y-1.5">
              <Label htmlFor="request-timeline">Ideal Timeline/Deadline (Optional)</Label>
              <Input 
                id="request-timeline" 
                placeholder="e.g., Within 3 months, End of Q4 2024"
                value={requestTimeline}
                onChange={(e) => setRequestTimeline(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 pl-1">Provide a timeframe, target quarter, or specific date.</p>
            </div>
            
            <Separator className="my-6" /> 

            <div className="space-y-2">
              <Label htmlFor="request-files">Attach Files (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                 <label htmlFor="request-files" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
                         <Upload className="w-8 h-8 mb-3 text-gray-400" />
                         <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                         <p className="text-xs text-gray-500">Max 5 files, 10MB each (PDF, DOCX, JPG etc.)</p>
                          </div>
                     <Input 
                         id="request-files" 
                         type="file" 
                         multiple 
                         className="hidden" 
                         onChange={handleFileChange}
                         disabled={isSubmitting}
                     />
                 </label>
                        </div>
             {requestFiles.length > 0 && (
               <div className="space-y-1.5 pt-2">
                 <p className="text-sm font-medium">Selected files:</p>
                 <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
                   {requestFiles.map((file, index) => (
                     <li key={index} className="flex items-center justify-between">
                       <span className="truncate pr-2" title={file.name}>{file.name}</span>
                       <Button 
                         type="button" 
                         variant="ghost"
                         size="icon"
                         className="h-5 w-5 text-red-500 hover:bg-red-100" 
                         onClick={() => handleRemoveFile(index)}
                         disabled={isSubmitting}
                        >
                         <X className="h-4 w-4" />
                         <span className="sr-only">Remove file</span>
                       </Button>
                     </li>
                   ))}
                 </ul>
                            </div>
                          )}
                        </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitDisabled}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
                          </div>
          </form>
                        </div>
                        </div>

      {requestPanelOpen && ( 
        <div  
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => !isSubmitting && closeRequestPanel()} 
        /> 
      )} 

    </div>
  );
} 