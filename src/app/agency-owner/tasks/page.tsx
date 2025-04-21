"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  CheckCircle,
  MoreHorizontal,
  User,
  AlertCircle,
  ListChecks,
  Filter as FilterIcon,
  X,
  Clock,
  MessageSquare,
  Paperclip,
  History,
  Download,
  Calendar,
  Info,
} from "lucide-react";
import { FolderIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarLucideIcon, ChevronsUpDown, Check as CheckIcon } from "lucide-react";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { format } from "date-fns";

// Define types
interface Subtask {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignedToId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
  activities?: { timestamp: string; text: string; userId: string }[];
  comments?: { id: string; text: string; userId: string; timestamp: string }[];
  attachments?: { id: string; name: string; url: string; type: string }[];
  subtasks?: Subtask[];
}

interface Project {
  id: string;
  name: string;
  client: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

// Mock data
const projects: Project[] = [
  { id: "1", name: "Website Redesign", client: "Acme Corp" },
  { id: "2", name: "Mobile App Development", client: "TechStart" },
  { id: "3", name: "Brand Identity Package", client: "GreenLife" },
  { id: "4", name: "Marketing Campaign", client: "InnovateTech" },
  { id: "5", name: "E-commerce Platform", client: "FashionForward" }
];

const teamMembers: TeamMember[] = [
  { id: "1", name: "Ali Demir", email: "ali.demir@example.com", role: "designer", avatar: "/avatars/ali-demir.jpg" },
  { id: "2", name: "Zeynep Ozturk", email: "zeynep.ozturk@example.com", role: "developer", avatar: "/avatars/zeynep-ozturk.jpg" },
  { id: "3", name: "Ahmet Yilmaz", email: "ahmet.yilmaz@example.com", role: "manager", avatar: "/avatars/ahmet-yilmaz.jpg" },
  { id: "4", name: "Sercan Yayla", email: "sercan.yayla@example.com", role: "developer", avatar: "/avatars/sercan-yayla.jpg" }
];

// Mock tasks data
const tasks: Task[] = [
  {
    id: "task-1",
    title: "Design Homepage Mockup",
    description: "Create a high-fidelity mockup for the new homepage design.\nFocus on user engagement and clear call-to-actions.",
    projectId: "proj-101",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-08-15",
    assignedToId: "team-1",
    createdBy: "team-3",
    createdAt: "2024-07-20T10:00:00Z",
    updatedAt: "2024-07-28T14:30:00Z",
    progress: 60,
    estimatedHours: 8,
    actualHours: 10,
    activities: [ { timestamp: "2024-07-28T14:30:00Z", text: "updated progress to 60%", userId: "team-1" }, { timestamp: "2024-07-22T11:00:00Z", text: "added initial estimate", userId: "team-3" }, { timestamp: "2024-07-20T10:00:00Z", text: "created the task", userId: "team-3" } ],
    comments: [ { id: "c1", text: "Let's ensure the primary CTA stands out.", userId: "team-2", timestamp: "2024-07-25T09:30:00Z" }, { id: "c2", text: "Agreed. I'll use a contrasting color and larger size.", userId: "team-1", timestamp: "2024-07-25T10:15:00Z" } ],
    attachments: [ { id: "a1", name: "brand-guidelines.pdf", url: "#", type: "PDF Document" }, { id: "a2", name: "inspiration-moodboard.png", url: "#", type: "Image File" } ],
    subtasks: [
      { id: "sub-1", text: "Define color palette", isCompleted: true },
      { id: "sub-2", text: "Wireframe hero section", isCompleted: true },
      { id: "sub-3", text: "Design features section", isCompleted: false },
      { id: "sub-4", text: "Prototype interactions", isCompleted: false },
    ],
  },
  {
    id: "task-2",
    title: "Develop API Endpoint for User Auth",
    description: "Build the backend endpoint for user login and registration.",
    projectId: "proj-102",
    status: "todo",
    priority: "high",
    dueDate: "2024-08-20",
    assignedToId: "team-2",
    createdBy: "team-3",
    createdAt: "2024-07-22T11:00:00Z",
    updatedAt: "2024-07-22T11:00:00Z",
    progress: 0,
    estimatedHours: 12,
  },
  {
    id: "task-3",
    title: "Design App Icons",
    description: "Create icon set for the mobile application",
    projectId: "2",
    status: "review",
    priority: "medium",
    dueDate: "2023-09-10",
    assignedToId: "1",
    createdBy: "3",
    createdAt: "2023-08-25",
    updatedAt: "2023-09-05",
    estimatedHours: 16,
    actualHours: 14,
    progress: 85
  },
  {
    id: "task-4",
    title: "Implement Authentication Flow",
    description: "Develop user authentication and authorization flows",
    projectId: "2",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-09-15",
    assignedToId: "4",
    createdBy: "3",
    createdAt: "2023-08-30",
    updatedAt: "2023-09-05",
    estimatedHours: 24,
    actualHours: 18,
    progress: 75
  },
  {
    id: "task-5",
    title: "Logo Design Variations",
    description: "Create 3-5 logo variations based on approved concept",
    projectId: "3",
    status: "todo",
    priority: "high",
    dueDate: "2023-09-20",
    assignedToId: "1",
    createdBy: "3",
    createdAt: "2023-09-01",
    updatedAt: "2023-09-01",
    estimatedHours: 10,
    actualHours: 0,
    progress: 0
  },
  {
    id: "task-6",
    title: "Social Media Content Calendar",
    description: "Develop content calendar for Q4 campaign",
    projectId: "4",
    status: "todo",
    priority: "medium",
    dueDate: "2023-09-25",
    assignedToId: "3",
    createdBy: "3",
    createdAt: "2023-09-05",
    updatedAt: "2023-09-05",
    estimatedHours: 12,
    actualHours: 0,
    progress: 0
  },
  {
    id: "task-7",
    title: "Product Catalog Integration",
    description: "Integrate product catalog with e-commerce platform",
    projectId: "5",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-09-30",
    assignedToId: "4",
    createdBy: "3",
    createdAt: "2023-09-10",
    updatedAt: "2023-09-15",
    estimatedHours: 30,
    actualHours: 12,
    progress: 40
  }
];

// Helper functions
function getStatusBadge(status: Task['status']) {
  switch (status) {
    case 'todo':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">To Do</Badge>;
    case 'in-progress':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
    case 'review':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Review</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
}

function getPriorityBadge(priority: Task['priority']) {
  switch (priority) {
    case 'low':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
    case 'high':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
}

// Add a helper for relative time formatting (example)
function formatRelativeTime(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds < 60) return `just now`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return `yesterday`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Main component
export default function TasksTablePage() {
  // Consolidated filter state
  const [filters, setFilters] = useState({
    project: 'all',
    statuses: new Set<string>(),
    assignee: 'all',
    priority: 'all',
  });
  const [activeTab, setActiveTab] = useState<'all' | 'my-tasks' | 'overdue'>('all');

  // --- NEW State for Task Detail Slider ---
  const [taskDetailPanelOpen, setTaskDetailPanelOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [tasksData, setTasksData] = useState<Task[]>(tasks);

  // State for Add Task Slider
  const [isAddTaskPanelOpen, setIsAddTaskPanelOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProjectId, setNewTaskProjectId] = useState<string | undefined>(undefined);
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState<string | undefined>(undefined);
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(undefined);
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskEstHours, setNewTaskEstHours] = useState<number | undefined>(undefined);
  const [showAddTaskOptionalFields, setShowAddTaskOptionalFields] = useState(false);

  // Helper to check if any filters are active (excluding 'all')
  const areFiltersActive = useMemo(() => {
    return filters.project !== 'all' ||
           filters.statuses.size > 0 ||
           filters.assignee !== 'all' ||
           filters.priority !== 'all';
  }, [filters]);

  // Get team member by ID
  const getTeamMember = (id: string | undefined): TeamMember => id ? (teamMembers.find(m => m.id === id) || { id: '', name: 'Unknown', email: '', role: '', avatar: '' }) : { id: '', name: 'Unassigned', email: '', role: '', avatar: '' };

  // Get project by ID
  const getProject = (id: string) => {
    return projects.find(project => project.id === id) || { name: 'Unknown Project', client: 'Unknown' };
  };

  // Format date
  const formatDate = (dateStr: string | Date | undefined): string => {
    if (!dateStr) return 'N/A';
    try {
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      return format(date, 'MMM d, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  // Calculate days remaining or overdue
  const getDaysRemaining = (dateStr: string | undefined): string => {
    if (!dateStr) return 'N/A';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  };

  // Determine if a task is overdue
  const isOverdue = (task: Task): boolean => {
    if (task.status === 'completed') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };

  // --- Calculate Stats (using the full 'tasks' list) ---
  const ownerId = '3'; // Assuming agency owner is id 3 from mock data
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const oneWeekFromNow = useMemo(() => { const d = new Date(today); d.setDate(d.getDate() + 7); return d; }, [today]);

  // Combined Stats Calculation
  const openStats = useMemo(() => {
    const allOpen = tasks.filter(t => t.status !== 'completed');
    const myOpen = allOpen.filter(t => t.assignedToId === ownerId);
    return { total: allOpen.length, mine: myOpen.length };
  }, [ownerId]);

  const overdueStats = useMemo(() => {
    const allOverdue = tasks.filter(t => isOverdue(t));
    const myOverdue = allOverdue.filter(t => t.assignedToId === ownerId);
    return { total: allOverdue.length, mine: myOverdue.length };
  }, [ownerId, isOverdue]);

  const dueThisWeekStats = useMemo(() => {
    const allDue = tasks.filter(t => {
      if (t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate); dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today && dueDate < oneWeekFromNow;
    });
    const myDue = allDue.filter(t => t.assignedToId === ownerId);
    return { total: allDue.length, mine: myDue.length };
  }, [ownerId, today, oneWeekFromNow]);

  const inReviewStats = useMemo(() => {
    const allInReview = tasks.filter(t => t.status === 'review');
    const myInReview = allInReview.filter(t => t.assignedToId === ownerId);
    return { total: allInReview.length, mine: myInReview.length };
  }, [ownerId]);

  // Update Filtering Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Active tab filtering still takes priority
      if (activeTab === 'my-tasks') {
        if (task.assignedToId !== ownerId) return false;
        // Apply status filter if needed for 'My Tasks' tab
        return filters.statuses.size === 0 || filters.statuses.has(task.status);
      }
      if (activeTab === 'overdue') {
        if (!isOverdue(task)) return false;
        // Apply project filter if needed for 'Overdue' tab
        return filters.project === 'all' || task.projectId === filters.project;
      }

      // Default filtering ('All Tasks' tab) using consolidated state
      const matchesProject = filters.project === 'all' || task.projectId === filters.project;
      const matchesStatus = filters.statuses.size === 0 || filters.statuses.has(task.status);
      const matchesAssignee = filters.assignee === 'all' || task.assignedToId === filters.assignee;
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

      return matchesProject && matchesStatus && matchesAssignee && matchesPriority;
    });
  }, [filters, activeTab, isOverdue, ownerId]);

  // Group tasks by project
  const tasksByProject = useMemo(() => {
    const groupedTasks: Record<string, Task[]> = {};
    
    filteredTasks.forEach(task => {
      if (!groupedTasks[task.projectId]) {
        groupedTasks[task.projectId] = [];
      }
      groupedTasks[task.projectId].push(task);
    });
    
    return groupedTasks;
  }, [filteredTasks]);

  // Function to handle status checkbox changes
  const handleStatusChange = (status: string, checked: boolean) => {
    setFilters(prev => {
      const newStatuses = new Set(prev.statuses);
      if (checked) {
        newStatuses.add(status);
      } else {
        newStatuses.delete(status);
      }
      return { ...prev, statuses: newStatuses };
    });
  };

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      project: 'all',
      statuses: new Set<string>(),
      assignee: 'all',
      priority: 'all',
    });
  };
  
  // Function to handle stat card clicks
  const handleStatCardClick = (type: 'open' | 'overdue' | 'dueThisWeek' | 'inReview') => {
    switch (type) {
      case 'overdue':
        setActiveTab('overdue');
        setFilters(prev => ({ ...prev, project: 'all' })); // Reset project filter when clicking overdue
        setFilters(prev => ({ ...prev, statuses: new Set<string>() })); // Reset status filter
        break;
      case 'inReview':
        setActiveTab('all');
        setFilters(prev => ({ ...prev, project: 'all' }));
        setFilters(prev => ({ ...prev, statuses: new Set<string>(), priority: 'all' }));
        break;
      // Add cases for 'open' and 'dueThisWeek' if specific filters are desired
      default:
        setActiveTab('all');
        setFilters(prev => ({ ...prev, project: 'all' }));
        setFilters(prev => ({ ...prev, statuses: new Set<string>() }));
        break;
    }
  };

  // --- NEW Handler to open the slider ---
  const handleOpenTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailPanelOpen(true);
    setIsEditingTitle(false);
    setEditedTitle(task.title);
    setNewSubtaskText("");
  };

  // Add comment handler (placeholder)
  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return;
    console.log(`Adding comment to task ${selectedTask.id}:`, newComment);
    // In real app: API call to add comment, update local state/refetch
    setNewComment("");
  };

  const handleTitleEditToggle = () => {
    if (!selectedTask) return;
    if (isEditingTitle) {
      if (editedTitle.trim() && editedTitle !== selectedTask.title) {
        const updatedTasks = tasksData.map(t =>
          t.id === selectedTask.id ? { ...t, title: editedTitle.trim() } : t
        );
        setTasksData(updatedTasks);
        setSelectedTask(prev => prev ? { ...prev, title: editedTitle.trim() } : null);
      } else {
        setEditedTitle(selectedTask.title);
      }
    } else {
      setEditedTitle(selectedTask.title);
    }
    setIsEditingTitle(!isEditingTitle);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTitleEditToggle();
    } else if (event.key === 'Escape') {
      setIsEditingTitle(false);
      setEditedTitle(selectedTask?.title || "");
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!selectedTask) return;
    const updatedSubtasks = selectedTask.subtasks?.map(st =>
      st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
    ) || [];

    const updatedTasks = tasksData.map(t =>
      t.id === selectedTask.id ? { ...t, subtasks: updatedSubtasks } : t
    );
    setTasksData(updatedTasks);
    setSelectedTask(prev => prev ? { ...prev, subtasks: updatedSubtasks } : null);
  };

  const handleAddSubtask = () => {
    if (!selectedTask || !newSubtaskText.trim()) return;
    const newSubtask: Subtask = {
      id: `sub-${Date.now()}`,
      text: newSubtaskText.trim(),
      isCompleted: false,
    };
    const updatedSubtasks = [...(selectedTask.subtasks || []), newSubtask];

    const updatedTasks = tasksData.map(t =>
      t.id === selectedTask.id ? { ...t, subtasks: updatedSubtasks } : t
    );
    setTasksData(updatedTasks);
    setSelectedTask(prev => prev ? { ...prev, subtasks: updatedSubtasks } : null);
    setNewSubtaskText("");
  };

  const handleSubtaskInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddSubtask();
    }
  };

  // Add Task Handlers
  const resetAddTaskForm = () => {
    setNewTaskTitle("");
    setNewTaskProjectId(undefined);
    setNewTaskAssigneeId(undefined);
    setNewTaskDueDate(undefined);
    setNewTaskPriority('medium');
    setNewTaskStatus('todo');
    setNewTaskDescription("");
    setNewTaskEstHours(undefined);
    setShowAddTaskOptionalFields(false);
  };

  const handleOpenAddTaskPanel = () => {
    resetAddTaskForm();
    setIsAddTaskPanelOpen(true);
  };

  const handleCloseAddTaskPanel = () => {
    setIsAddTaskPanelOpen(false);
  };

  const handleCreateTask = useCallback(() => {
    if (!newTaskTitle.trim() || !newTaskProjectId) {
      alert("Please provide a Title and select a Project.");
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      projectId: newTaskProjectId,
      status: newTaskStatus,
      priority: newTaskPriority,
      dueDate: newTaskDueDate ? format(newTaskDueDate, 'yyyy-MM-dd') : '',
      assignedToId: newTaskAssigneeId || '',
      createdBy: ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: newTaskDescription.trim(),
      estimatedHours: newTaskEstHours,
      progress: 0,
      activities: [{
          timestamp: new Date().toISOString(),
          text: 'created the task',
          userId: ownerId
      }],
      comments: [],
      attachments: [],
      subtasks: [],
    };

    setTasksData(prevTasks => [newTask, ...prevTasks]);
    handleCloseAddTaskPanel();
  }, [
    newTaskTitle, newTaskProjectId, newTaskStatus, newTaskPriority, newTaskDueDate,
    newTaskAssigneeId, newTaskDescription, newTaskEstHours, ownerId
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header (Simplified) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage and track all tasks across your projects</p>
        </div>
      </div>

      {/* Combined & Interactive Task Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          className="bg-white rounded-lg border p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
          onClick={() => handleStatCardClick('open')}
        >
          <div className="text-sm text-muted-foreground">Open Tasks</div>
          <div className="text-2xl font-bold">{openStats.total}</div>
          <div className="text-xs text-muted-foreground mt-1">Mine: {openStats.mine}</div>
        </button>
        <button 
          className="bg-white rounded-lg border p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
          onClick={() => handleStatCardClick('overdue')}
        >
          <div className="text-sm text-muted-foreground">Overdue</div>
          <div className="text-2xl font-bold">{overdueStats.total}</div>
          <div className="text-xs text-muted-foreground mt-1">Mine: {overdueStats.mine}</div>
        </button>
        <button 
          className="bg-white rounded-lg border p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
          onClick={() => handleStatCardClick('dueThisWeek')}
        >
          <div className="text-sm text-muted-foreground">Due This Week</div>
          <div className="text-2xl font-bold">{dueThisWeekStats.total}</div>
          <div className="text-xs text-muted-foreground mt-1">Mine: {dueThisWeekStats.mine}</div>
        </button>
        <button 
          className="bg-white rounded-lg border p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
          onClick={() => handleStatCardClick('inReview')}
        >
          <div className="text-sm text-muted-foreground">In Review</div>
          <div className="text-2xl font-bold">{inReviewStats.total}</div>
          <div className="text-xs text-muted-foreground mt-1">Mine: {inReviewStats.mine}</div>
        </button>
      </div>

      {/* NEW: Tabs and Consolidated Filter Bar Row */}
      <div className="flex justify-between items-center">
        {/* Left: Tabs */} 
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'my-tasks' | 'overdue')} variant="folder" className="w-auto">
          <TabsList>
            <TabsTrigger value="all" className="flex-1 flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              All Tasks
            </TabsTrigger>
            <TabsTrigger value="my-tasks" className="flex-1 flex items-center gap-2">
              <User className="h-4 w-4" />
              My Tasks
            </TabsTrigger>
            <TabsTrigger value="overdue" className="flex-1 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Overdue
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right: Filter Button & Actions */} 
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 relative">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filter
                {areFiltersActive && (
                  <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Project Filter */} 
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Project</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={filters.project} onValueChange={(value) => setFilters(prev => ({ ...prev, project: value }))}>
                    <DropdownMenuRadioItem value="all">All Projects</DropdownMenuRadioItem>
                    {projects.map(project => (
                      <DropdownMenuRadioItem key={project.id} value={project.id}>{project.name}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Status Filter */} 
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {['todo', 'in-progress', 'review', 'completed'].map(status => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filters.statuses.has(status)}
                      onCheckedChange={(checked) => handleStatusChange(status, Boolean(checked))}
                      onSelect={(e) => e.preventDefault()} // Prevent closing on check
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Assignee Filter */} 
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Assignee</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                   <DropdownMenuRadioGroup value={filters.assignee} onValueChange={(value) => setFilters(prev => ({ ...prev, assignee: value }))}>
                      <DropdownMenuRadioItem value="all">All Assignees</DropdownMenuRadioItem>
                      {teamMembers.map(member => (
                          <DropdownMenuRadioItem key={member.id} value={member.id}>{member.name}</DropdownMenuRadioItem>
                      ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Priority Filter */} 
               <DropdownMenuSub>
                <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                   <DropdownMenuRadioGroup value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                      <DropdownMenuRadioItem value="all">All Priorities</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters} disabled={!areFiltersActive}>
                Clear All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Correct Add Task Button - Opens Slider */}
          <Button size="sm" className="h-9" onClick={handleOpenAddTaskPanel}> 
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Tasks tables by project */}
      {Object.keys(tasksByProject).length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(tasksByProject).map(([projectId, projectTasks]) => (
            <div key={projectId} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FolderIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h2 className="text-base font-medium">{getProject(projectId).name}</h2>
                </div>
                <Badge variant="outline">
                  {projectTasks.length} {projectTasks.length === 1 ? 'task' : 'tasks'}
                </Badge>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">Task</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Priority</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Assignee</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Due Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Progress</th>
                      <th scope="col" className="relative px-6 py-3 w-[5%]">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectTasks.map(task => {
                      const assignee = getTeamMember(task.assignedToId);
                      const isTaskOverdue = isOverdue(task);
                      const avatarUrl = `https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(assignee.name)}`;

                      // Circular Progress SVG properties
                      const progressSize = 20; // Diameter of the circle
                      const strokeWidth = 3; // Increased stroke width
                      const radius = (progressSize - strokeWidth) / 2;
                      const circumference = 2 * Math.PI * radius;
                      const progressOffset = circumference - (task.progress / 100) * circumference;

                      return (
                        <tr key={task.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenTaskDetail(task)}>
                          <td className="px-6 py-3">
                            <div className="text-sm font-medium text-gray-900 truncate" title={task.title}>{task.title}</div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-center">
                            {getStatusBadge(task.status)}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-center">
                            {getPriorityBadge(task.priority)}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-7 w-7"> 
                                <AvatarImage src={avatarUrl} alt={assignee.name} />
                                <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600 truncate" title={assignee.name}>{assignee.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className={`text-sm ${isTaskOverdue ? 'text-red-600' : 'text-gray-500'}`} title={getDaysRemaining(task.dueDate)}>
                              {formatDate(task.dueDate)}
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2" title={`${task.progress}% complete`}>
                              <svg width={progressSize} height={progressSize} viewBox={`0 0 ${progressSize} ${progressSize}`} className="-rotate-90">
                                <circle
                                  cx={progressSize / 2}
                                  cy={progressSize / 2}
                                  r={radius}
                                  stroke="currentColor"
                                  strokeWidth={strokeWidth}
                                  fill="transparent"
                                  className="text-gray-200" // Track color
                                />
                                <circle
                                  cx={progressSize / 2}
                                  cy={progressSize / 2}
                                  r={radius}
                                  stroke="currentColor"
                                  strokeWidth={strokeWidth}
                                  fill="transparent"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={progressOffset}
                                  strokeLinecap="round"
                                  className="text-gray-900" // Progress color changed to black (gray-900)
                                />
                              </svg>
                              <span className="text-xs text-gray-500 w-8 text-right">{task.progress}%</span>
                </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuItem onClick={() => handleOpenTaskDetail(task)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Change Status</DropdownMenuItem>
                                <DropdownMenuItem>Reassign</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

      {/* --- Task Details Slider --- */} 
      <div 
        className={`fixed top-0 right-0 w-full md:w-[550px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-200 ${
          taskDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedTask && (
          <div className="h-full flex flex-col">
            {/* Fixed Header */} 
            <div className="p-4 border-b border-gray-200 bg-white space-y-3">
              <div className="flex justify-between items-center">
                {isEditingTitle ? (
                   <Input
                     value={editedTitle}
                     onChange={handleTitleChange}
                     onKeyDown={handleTitleKeyDown}
                     onBlur={handleTitleEditToggle}
                     className="text-lg font-semibold flex-grow mr-2 h-9"
                     autoFocus
                   />
                ) : (
                  <h3
                    className="text-lg font-semibold truncate cursor-pointer hover:text-blue-600 flex-grow mr-2"
                    onClick={handleTitleEditToggle}
                    title="Click to edit title"
                  >
                    {selectedTask.title}
                  </h3>
                )}
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleTitleEditToggle} title={isEditingTitle ? "Save Title" : "Edit Title"}>
                     <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-5 w-5 text-gray-500" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>Archive Task</DropdownMenuItem><DropdownMenuItem>Duplicate Task</DropdownMenuItem><DropdownMenuItem>Save as Template</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem></DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTaskDetailPanelOpen(false)} title="Close Panel">
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
        </div>
      </div>

              {/* Row 2: "At a Glance" Info */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1.5">
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(selectedTask.status)}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-medium">Priority:</span>
                  {getPriorityBadge(selectedTask.priority)}
                </div>
                <div className="flex items-center space-x-1.5">
                   <User className="h-4 w-4 opacity-70"/>
                   <span className="font-medium">Assignee:</span>
                   <div className="flex items-center space-x-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(getTeamMember(selectedTask.assignedToId).name)}`} alt={getTeamMember(selectedTask.assignedToId).name} />
                        <AvatarFallback className="text-xs">{getTeamMember(selectedTask.assignedToId).name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-gray-800">{getTeamMember(selectedTask.assignedToId).name}</span>
                   </div>
                </div>
                <div className="flex items-center space-x-1.5">
                   <Calendar className="h-4 w-4 opacity-70"/>
                   <span className="font-medium">Due:</span>
                   <span className={`${isOverdue(selectedTask) ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatDate(selectedTask.dueDate)}
                      {selectedTask.dueDate && <span className="text-xs text-gray-500 ml-1">({getDaysRemaining(selectedTask.dueDate)})</span>}
              </span>
                </div>
              </div>
            </div>

            {/* Scrollable Content with Tabs */} 
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20">
              <Tabs defaultValue="details" variant="folder" className="w-full">
                <TabsList className="w-full mb-4 grid grid-cols-5">
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <Info className="h-4 w-4" /> Details
                  </TabsTrigger>
                  <TabsTrigger value="checklist" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" /> Checklist ({selectedTask.subtasks?.filter(st => st.isCompleted).length || 0}/{selectedTask.subtasks?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-2">
                    <History className="h-4 w-4" /> Activity
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Comments
                  </TabsTrigger>
                  <TabsTrigger value="attachments" className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" /> Attachments
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content: Details */} 
                <TabsContent value="details" className="space-y-6 mt-0">
                  {/* Description Section */} 
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {selectedTask.description || "No description provided."}
                    </p>
                  </div>

                  {/* Details Section */} 
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Details</h4>
                    <div className="divide-y divide-gray-100">
                      {/* Assignee */} 
                      <div className="py-2 flex items-center">
                        <span className="w-1/3 text-sm text-gray-500 flex items-center"><FolderIcon className="h-4 w-4 mr-2 opacity-60"/>Project</span>
                        <span className="w-2/3 text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
                          {getProject(selectedTask.projectId).name}
                        </span>
                      </div>
                      {/* Client */} 
                      <div className="py-2 flex items-center">
                        <span className="w-1/3 text-sm text-gray-500 flex items-center"><User className="h-4 w-4 mr-2 opacity-60"/>Client</span> {/* Assuming client is a user/contact */} 
                        <span className="w-2/3 text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
                          {getProject(selectedTask.projectId).client} 
                        </span>
                      </div>
                       {/* Created By */} 
                      <div className="py-2 flex items-center">
                        <span className="w-1/3 text-sm text-gray-500 flex items-center"><User className="h-4 w-4 mr-2 opacity-60"/>Created By</span>
                         <div className="w-2/3 flex items-center space-x-2">
                          <Avatar className="h-6 w-6"> 
                            <AvatarImage src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(getTeamMember(selectedTask.createdBy).name)}`} alt={getTeamMember(selectedTask.createdBy).name} />
                            <AvatarFallback className="text-xs">{getTeamMember(selectedTask.createdBy).name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-800">{getTeamMember(selectedTask.createdBy).name}</span>
                        </div>
                      </div>
                      {/* Created Date */} 
                      <div className="py-2 flex items-center">
                        <span className="w-1/3 text-sm text-gray-500 flex items-center"><Plus className="h-4 w-4 mr-2 opacity-60"/>Created Date</span>
                        <span className="w-2/3 text-sm text-gray-500">{formatDate(selectedTask.createdAt)}</span>
                      </div>
                      {/* Updated */} 
                      <div className="py-2 flex items-center">
                        <span className="w-1/3 text-sm text-gray-500 flex items-center"><History className="h-4 w-4 mr-2 opacity-60"/>Last Updated</span>
                        <span className="w-2/3 text-sm text-gray-500">{formatDate(selectedTask.updatedAt)}</span>
                      </div>
                      {/* Estimated Time */} 
                      {selectedTask.estimatedHours !== undefined && (
                        <div className="py-2 flex items-center">
                          <span className="w-1/3 text-sm text-gray-500 flex items-center"><Clock className="h-4 w-4 mr-2 opacity-60"/>Est. Time</span>
                          <span className="w-2/3 text-sm text-gray-500">{selectedTask.estimatedHours} hours</span>
                        </div>
                      )}
                      {/* Time Logged */} 
                      {selectedTask.actualHours !== undefined && (
                        <div className="py-2 flex items-center">
                          <span className="w-1/3 text-sm text-gray-500 flex items-center"><Clock className="h-4 w-4 mr-2 opacity-60"/>Time Logged</span>
                          <span className="w-2/3 text-sm text-gray-500">{selectedTask.actualHours} hours</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Section */} 
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Progress</h4>
                    <div className="flex items-center space-x-2" title={`${selectedTask.progress}% complete`}>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                         <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${selectedTask.progress}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800 w-12 text-right">{selectedTask.progress}%</span>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab Content: Checklist */} 
                <TabsContent value="checklist" className="mt-0">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <ListChecks className="h-4 w-4 mr-2 opacity-60"/>Sub-tasks
                    </h4>
                    {/* Subtask List */}
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                       {(selectedTask.subtasks && selectedTask.subtasks.length > 0) ? (
                          selectedTask.subtasks.map(subtask => (
                             <div key={subtask.id} className="flex items-center space-x-3 group">
                                <Checkbox
                                   id={`subtask-${subtask.id}`}
                                   checked={subtask.isCompleted}
                                   onCheckedChange={() => handleToggleSubtask(subtask.id)}
                                   aria-label={`Mark ${subtask.text} as ${subtask.isCompleted ? 'incomplete' : 'complete'}`}
                                />
                                <label
                                  htmlFor={`subtask-${subtask.id}`}
                                  className={`flex-grow text-sm cursor-pointer ${subtask.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}
                                >
                                  {subtask.text}
                                </label>
                             </div>
                          ))
                       ) : (
                         <p className="text-sm text-gray-400 text-center py-4">No sub-tasks added yet.</p>
                       )}
                    </div>
                    {/* Add Subtask Input */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                      <Input
                        placeholder="Add a new sub-task..."
                        className="flex-grow h-9 text-sm"
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        onKeyDown={handleSubtaskInputKeyDown}
                      />
                      <Button size="sm" onClick={handleAddSubtask} disabled={!newSubtaskText.trim()}>
                        <Plus className="h-4 w-4 mr-1"/> Add
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab Content: Activity */} 
                <TabsContent value="activity" className="mt-0">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <History className="h-4 w-4 mr-2 opacity-60"/>Activity Log
                    </h4>
                    {selectedTask.activities && selectedTask.activities.length > 0 ? (
                      <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {selectedTask.activities.map((activity, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <Avatar className="h-6 w-6 mt-0.5"> 
                               <AvatarImage src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(getTeamMember(activity.userId).name)}`} alt={getTeamMember(activity.userId).name} />
                               <AvatarFallback className="text-xs">{getTeamMember(activity.userId).name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div><p className="text-sm text-gray-600"><span className="font-medium text-gray-800">{getTeamMember(activity.userId).name}</span> {activity.text}</p><p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(activity.timestamp)}</p></div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">No activity yet.</p>
                    )}
                  </div>
                </TabsContent>

                {/* Tab Content: Comments */} 
                <TabsContent value="comments" className="mt-0">
                  <div className="bg-white rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 p-4 border-b border-gray-200 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 opacity-60"/>Comments
                    </h4>
                    {/* Existing Comments */} 
                    <div className="p-4 space-y-4 max-h-60 overflow-y-auto">
                      {selectedTask.comments && selectedTask.comments.length > 0 ? (
                        selectedTask.comments.map(comment => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8 mt-0.5"> 
                               <AvatarImage src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(getTeamMember(comment.userId).name)}`} alt={getTeamMember(comment.userId).name} />
                               <AvatarFallback className="text-xs">{getTeamMember(comment.userId).name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-gray-100 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm text-gray-800">{getTeamMember(comment.userId).name}</span>
                                <span className="text-xs text-gray-400">{formatRelativeTime(comment.timestamp)}</span>
                              </div>
                              <p className="text-sm text-gray-600">{comment.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">No comments yet.</p>
                      )}
                    </div>
                    {/* Add Comment Input */} 
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                       <div className="flex items-start space-x-3">
                         <Avatar className="h-8 w-8 mt-1"> 
                            <AvatarImage src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(getTeamMember(ownerId).name)}`} alt={getTeamMember(ownerId).name} />
                            <AvatarFallback className="text-xs">{getTeamMember(ownerId).name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="flex-1 space-y-2">
                            <Textarea 
                               placeholder="Add a comment..." 
                               className="w-full text-sm bg-white"
                               rows={2}
                               value={newComment}
                               onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end">
                               <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                                  Comment
                               </Button>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab Content: Attachments */} 
                <TabsContent value="attachments" className="mt-0">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center">
                            <Paperclip className="h-4 w-4 mr-2 opacity-60"/>Attachments
                        </h4>
                        <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1"/> Add File
                         </Button>
                      </div>
                      {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                        <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                            {selectedTask.attachments.map(file => (
                            <li key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                <div className="flex items-center space-x-3">
                                <FolderIcon className="h-5 w-5 text-gray-400 flex-shrink-0" /> 
                                <div>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">{file.name}</a>
                                    <p className="text-xs text-gray-500">{file.type}</p>
                                </div>
                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" onClick={() => alert('Download triggered')}> 
                                   <Download className="h-4 w-4"/>
                                </Button>
                            </li>
                            ))}
                        </ul>
                     ) : (
                         <p className="text-sm text-gray-400 text-center py-4">No attachments yet.</p>
                     )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Optional Fixed Footer - Example: Mark Complete Button */}
            {selectedTask.status !== 'completed' && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-3">
                <Button className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay for slide panel */}
      {taskDetailPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-40" 
          onClick={() => setTaskDetailPanelOpen(false)}
        />
      )}

      {/* --- Add Task Slider --- */}
      <div
        className={`fixed top-0 right-0 w-full md:w-[500px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-200 ${
          isAddTaskPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */} 
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Add New Task</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCloseAddTaskPanel} title="Close Panel">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Body (Form) */} 
        <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-20">
           {/* Task Title (Required) */} 
           <div>
             <label htmlFor="newTaskTitle" className="block text-sm font-medium text-gray-700 mb-1">
               Task Title <span className="text-red-500">*</span>
             </label>
             <Input
               id="newTaskTitle"
               value={newTaskTitle}
               onChange={(e) => setNewTaskTitle(e.target.value)}
               placeholder="e.g., Draft client proposal"
               required
               autoFocus
             />
           </div>

           {/* Project (Required) */} 
           <div>
             <label htmlFor="newTaskProject" className="block text-sm font-medium text-gray-700 mb-1">
               Project <span className="text-red-500">*</span>
             </label>
             <Popover>
               <PopoverTrigger asChild>
                 <Button
                   variant="outline"
                   role="combobox"
                   className="w-full justify-between font-normal"
                 >
                   {newTaskProjectId
                     ? projects.find((p) => p.id === newTaskProjectId)?.name
                     : "Select project..."}
                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                 <Command>
                   <CommandInput placeholder="Search project..." />
                   <CommandEmpty>No project found.</CommandEmpty>
                   <CommandGroup>
                     {projects.map((project) => (
                       <CommandItem
                         key={project.id}
                         value={project.name}
                         onSelect={() => {
                           setNewTaskProjectId(project.id);
                         }}
                       >
                         <CheckIcon
                           className={`mr-2 h-4 w-4 ${newTaskProjectId === project.id ? "opacity-100" : "opacity-0"}`}
                         />
                         {project.name} ({project.client})
                       </CommandItem>
                     ))}
                   </CommandGroup>
                 </Command>
               </PopoverContent>
             </Popover>
           </div>

           {/* Assignee (Optional) */} 
           <div>
             <label htmlFor="newTaskAssignee" className="block text-sm font-medium text-gray-700 mb-1">
               Assignee
             </label>
              <Popover>
               <PopoverTrigger asChild>
                 <Button
                   variant="outline"
                   role="combobox"
                   className="w-full justify-between font-normal"
                 >
                   {newTaskAssigneeId
                     ? teamMembers.find((tm) => tm.id === newTaskAssigneeId)?.name
                     : "Select assignee..."}
                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                 <Command>
                   <CommandInput placeholder="Search team member..." />
                   <CommandEmpty>No team member found.</CommandEmpty>
                   <CommandGroup>
                      <CommandItem value="Unassigned" onSelect={() => setNewTaskAssigneeId(undefined)}>
                         <CheckIcon className={`mr-2 h-4 w-4 ${!newTaskAssigneeId ? "opacity-100" : "opacity-0"}`} />
                         Unassigned
                      </CommandItem>
                     {teamMembers.map((member) => (
                       <CommandItem
                         key={member.id}
                         value={member.name}
                         onSelect={() => setNewTaskAssigneeId(member.id)}
                       >
                         <CheckIcon
                           className={`mr-2 h-4 w-4 ${newTaskAssigneeId === member.id ? "opacity-100" : "opacity-0"}`}
                         />
                         {member.name}
                       </CommandItem>
                     ))}
                   </CommandGroup>
                 </Command>
               </PopoverContent>
             </Popover>
           </div>

           {/* Due Date (Optional) */} 
           <div>
             <label htmlFor="newTaskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
               Due Date
             </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${ !newTaskDueDate && "text-muted-foreground" }`}
                  >
                    <CalendarLucideIcon className="mr-2 h-4 w-4" />
                    {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <ShadCalendar
                    mode="single"
                    selected={newTaskDueDate}
                    onSelect={setNewTaskDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
           </div>

          {/* Priority & Status (Side-by-side) */} 
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="newTaskPriority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <Select value={newTaskPriority} onValueChange={(value: Task['priority']) => setNewTaskPriority(value)}>
                <SelectTrigger id="newTaskPriority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div>
              <label htmlFor="newTaskStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select value={newTaskStatus} onValueChange={(value: Task['status']) => setNewTaskStatus(value)}>
                <SelectTrigger id="newTaskStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggle Optional Fields Button */} 
          {!showAddTaskOptionalFields && (
             <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setShowAddTaskOptionalFields(true)}>
               + Add Description & Estimate
             </Button>
          )}

           {/* Optional Fields */} 
           {showAddTaskOptionalFields && (
             <>
                {/* Description (Optional) */} 
               <div>
                 <label htmlFor="newTaskDescription" className="block text-sm font-medium text-gray-700 mb-1">
                   Description
                 </label>
                 <Textarea
                   id="newTaskDescription"
                   value={newTaskDescription}
                   onChange={(event) => setNewTaskDescription(event.target.value)}
                   placeholder="Add details about the task..."
                   rows={4}
                 />
               </div>

               {/* Estimated Hours (Optional) */} 
               <div>
                 <label htmlFor="newTaskEstHours" className="block text-sm font-medium text-gray-700 mb-1">
                   Estimated Hours
                 </label>
                 <Input
                   id="newTaskEstHours"
                   type="number"
                   value={newTaskEstHours ?? ''}
                   onChange={(event) => setNewTaskEstHours(event.target.value ? parseInt(event.target.value, 10) : undefined)}
                   placeholder="e.g., 8"
                   min="0"
                 />
               </div>
               {/* Hide Optional Fields Button */} 
               <Button variant="link" className="p-0 h-auto text-sm text-gray-500" onClick={() => setShowAddTaskOptionalFields(false)}>
                 - Hide optional fields
               </Button>
             </>
           )}

        </div>

        {/* Footer */} 
        <div className="p-4 border-t border-gray-200 bg-gray-50 absolute bottom-0 left-0 right-0 flex justify-end space-x-3">
           <Button variant="ghost" onClick={handleCloseAddTaskPanel}>
             Cancel
           </Button>
           <Button
             onClick={handleCreateTask}
             disabled={!newTaskTitle.trim() || !newTaskProjectId}
           >
             <CheckIcon className="h-4 w-4 mr-2"/>
             Create Task
           </Button>
        </div>
      </div>

      {/* Overlay for BOTH sliders */} 
      {(taskDetailPanelOpen || isAddTaskPanelOpen) && (
        <div
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => {
            if (taskDetailPanelOpen) setTaskDetailPanelOpen(false);
            if (isAddTaskPanelOpen) setIsAddTaskPanelOpen(false);
          }}
        ></div>
      )}
    </div>
  )
} 