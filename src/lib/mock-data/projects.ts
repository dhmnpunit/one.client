import { Project, Task } from '@/types';

// Mock Projects
export const mockProjects: Project[] = [
  // Agency Member 1 Projects
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Complete redesign of corporate website with new branding',
    clientId: 'client-1',
    status: 'in-progress',
    startDate: new Date('2023-03-01'),
    dueDate: new Date('2023-05-15'),
    assignedToId: 'member-1',
    createdBy: 'owner-1',
    createdAt: new Date('2023-02-25'),
    updatedAt: new Date('2023-03-15'),
    budget: 15000,
    currency: 'USD'
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Development of iOS and Android mobile application',
    clientId: 'client-2',
    status: 'in-progress',
    startDate: new Date('2023-02-15'),
    dueDate: new Date('2023-06-30'),
    assignedToId: 'member-1',
    createdBy: 'owner-1',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-04-05'),
    budget: 25000,
    currency: 'USD'
  },
  {
    id: 'project-3',
    name: 'Brand Identity Package',
    description: 'Complete brand identity including logo, style guide, and templates',
    clientId: 'client-3',
    status: 'not-started',
    startDate: new Date('2023-05-01'),
    dueDate: new Date('2023-06-15'),
    assignedToId: 'member-1',
    createdBy: 'member-1',
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-04-20'),
    budget: 8000,
    currency: 'USD'
  },
  
  // Agency Member 2 Projects
  {
    id: 'project-4',
    name: 'Social Media Campaign',
    description: 'Three-month social media campaign across multiple platforms',
    clientId: 'client-4',
    status: 'in-progress',
    startDate: new Date('2023-03-15'),
    dueDate: new Date('2023-06-15'),
    assignedToId: 'member-2',
    createdBy: 'member-2',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-04-01'),
    budget: 12000,
    currency: 'USD'
  },
  {
    id: 'project-5',
    name: 'E-commerce Platform',
    description: 'Development of online store with inventory management',
    clientId: 'client-5',
    status: 'on-hold',
    startDate: new Date('2023-02-01'),
    dueDate: new Date('2023-05-30'),
    assignedToId: 'member-2',
    createdBy: 'owner-1',
    createdAt: new Date('2023-01-25'),
    updatedAt: new Date('2023-03-15'),
    budget: 18000,
    currency: 'USD'
  },
  
  // Freelancer Projects
  {
    id: 'project-8',
    name: 'Website Development',
    description: 'Development of company website with blog and contact form',
    clientId: 'client-9',
    status: 'in-progress',
    startDate: new Date('2023-03-10'),
    dueDate: new Date('2023-05-20'),
    assignedToId: 'freelancer-1',
    createdBy: 'freelancer-1',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-04-10'),
    budget: 7500,
    currency: 'USD'
  },
  {
    id: 'project-9',
    name: 'Logo Design',
    description: 'Design of company logo with brand guidelines',
    clientId: 'client-10',
    status: 'completed',
    startDate: new Date('2023-04-01'),
    dueDate: new Date('2023-04-15'),
    completedDate: new Date('2023-04-12'),
    assignedToId: 'freelancer-1',
    createdBy: 'freelancer-1',
    createdAt: new Date('2023-03-25'),
    updatedAt: new Date('2023-04-12'),
    budget: 1500,
    currency: 'USD'
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  // Project 1 Tasks (Website Redesign)
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Information Architecture',
    description: 'Develop site map and information architecture',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2023-03-10'),
    assignedToId: 'member-1',
    createdBy: 'owner-1',
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-10'),
    completedAt: new Date('2023-03-09'),
    estimatedHours: 8,
    actualHours: 10
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Wireframing',
    description: 'Create wireframes for all key pages',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2023-03-20'),
    assignedToId: 'member-1',
    createdBy: 'member-1',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-19'),
    completedAt: new Date('2023-03-18'),
    estimatedHours: 16,
    actualHours: 18
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    title: 'Visual Design',
    description: 'Develop visual designs based on approved wireframes',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2023-04-10'),
    assignedToId: 'member-1',
    createdBy: 'member-1',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-04-05'),
    estimatedHours: 24,
    actualHours: 16
  },
  {
    id: 'task-4',
    projectId: 'project-1',
    title: 'Frontend Development',
    description: 'Implement designs in HTML/CSS/JS',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date('2023-04-25'),
    assignedToId: 'member-1',
    createdBy: 'member-1',
    createdAt: new Date('2023-03-25'),
    updatedAt: new Date('2023-03-25'),
    estimatedHours: 40,
    actualHours: 0
  },
  {
    id: 'task-5',
    projectId: 'project-1',
    title: 'CMS Integration',
    description: 'Integrate CMS and migrate content',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date('2023-05-10'),
    assignedToId: 'member-1',
    createdBy: 'member-1',
    createdAt: new Date('2023-03-25'),
    updatedAt: new Date('2023-03-25'),
    estimatedHours: 24,
    actualHours: 0
  },
  
  // Project 2 Tasks (Mobile App Development)
  {
    id: 'task-6',
    projectId: 'project-2',
    title: 'App Requirements Gathering',
    description: 'Document all app requirements and user stories',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2023-02-25'),
    assignedToId: 'member-1',
    createdBy: 'member-1',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-24'),
    completedAt: new Date('2023-02-23'),
    estimatedHours: 16,
    actualHours: 14
  },
  {
    id: 'task-7',
    projectId: 'project-2',
    title: 'UI/UX Design',
    description: 'Design user interfaces for all app screens',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2023-03-20'),
    assignedToId: 'member-1',
    createdBy: 'member-1',
    createdAt: new Date('2023-02-26'),
    updatedAt: new Date('2023-03-18'),
    completedAt: new Date('2023-03-15'),
    estimatedHours: 32,
    actualHours: 36
  },
  {
    id: 'task-8',
    projectId: 'project-2',
    title: 'Frontend Development',
    description: 'Implement UI in React Native',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2023-04-30'),
    assignedToId: 'member-1',
    createdBy: 'member-1',
    createdAt: new Date('2023-03-21'),
    updatedAt: new Date('2023-04-05'),
    estimatedHours: 60,
    actualHours: 30
  }
];

// Projects with their tasks
export const getProjectsWithTasks = () => {
  return mockProjects.map(project => ({
    ...project,
    tasks: mockTasks.filter(task => task.projectId === project.id)
  }));
}; 