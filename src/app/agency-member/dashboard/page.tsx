"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClients, mockProjects } from "@/lib/mock-data";
import { calculateProgress, formatCurrency } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Project } from "@/types/project";

export default function AgencyOwnerDashboard() {
  // Revenue data
  const totalRevenue = 267900;
  const revenueChangePercent = 12.5;
  
  // Active projects
  const activeProjects = 13;
  const projectChangePercent = 8.2;
  
  // Team utilization
  const teamUtilization = 87;
  const utilizationChangePercent = 3.1;
  
  // Client satisfaction
  const clientSatisfaction = 94;
  const satisfactionChangePercent = -1.4;
  
  // Revenue chart data for monthly revenue
  const revenueData = [
    { month: "Feb", value: 185000 },
    { month: "Mar", value: 195000 },
    { month: "Apr", value: 190000 },
    { month: "May", value: 205000 },
    { month: "Jun", value: 220000 },
    { month: "Jul", value: 215000 },
    { month: "Aug", value: 230000 },
    { month: "Sep", value: 245000 },
    { month: "Oct", value: 250000 },
    { month: "Nov", value: 260000 },
    { month: "Dec", value: 267900 }
  ];
  
  // Project status data
  const projectStatusData = [
    { name: "Completed", value: 24, color: "#E67E63" },
    { name: "In Progress", value: 13, color: "#32A893" },
    { name: "On Hold", value: 5, color: "#1E293B" },
    { name: "Planning", value: 8, color: "#F4CE6A" }
  ];
  
  // Revenue by service data
  const serviceRevenueData = [
    { name: "Website Development", value: 45, color: "#E67E63" },
    { name: "Mobile Apps", value: 25, color: "#F4CE6A" },
    { name: "UI/UX Design", value: 18, color: "#F97B7B" },
    { name: "Branding", value: 12, color: "#A9B0BC" }
  ];
  
  // Projects with calculated progress and client names
  const [projectsWithProgress, setProjectsWithProgress] = useState<Array<Project & { progress: number; clientName: string; teamMembers: any[] }>>([]);
  
  useEffect(() => {
    // Calculate progress for each project (mocked for this example)
    // In a real app, this would be based on completed tasks vs total tasks
    const enhancedProjects = mockProjects.slice(0, 5).map(project => {
      // Get client name
      const client = mockClients.find(c => c.id === project.clientId);
      
      // Create mock team members
      const teamMembers = Array(3).fill(0).map((_, i) => ({
        id: `member-${i}`,
        name: `Team Member ${i + 1}`,
        avatar: `/avatars/placeholder.svg`
      }));
      
      // Create a complete Project object with additional properties
      return {
        ...project,
        createdBy: project.assignedToId, // Use assigned ID as creator for demo
        createdAt: new Date(), // Use current date for demo
        updatedAt: new Date(), // Use current date for demo
        progress: Math.floor(Math.random() * 100), // Random progress for demo
        clientName: client?.company || 'Unknown Client',
        teamMembers
      };
    });
    
    setProjectsWithProgress(enhancedProjects);
  }, []);
  
  // Handle opening project details
  const handleOpenDrawer = (project: any) => {
    console.log("Opening project details:", project);
    // Implementation for opening project details drawer would go here
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      case 'not-started':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Not Started</Badge>;
      case 'on-hold':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">On Hold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Team avatars component
  const TeamAvatars = ({ members }: { members: any[] }) => {
    return (
      <div className="flex -space-x-2 overflow-hidden">
        {members.map((member, index) => (
          <Avatar key={index} className="inline-block h-6 w-6 rounded-full border-2 border-white">
            {typeof member === 'string' ? (
              <AvatarImage src={member} alt="Team member" />
            ) : (
              <>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name?.charAt(0) || 'U'}</AvatarFallback>
              </>
            )}
          </Avatar>
        ))}
      </div>
    );
  };
  
  // Progress bar component
  const ProgressBar = ({ percentage }: { percentage: number }) => {
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your agency.</p>
        </div>
        <Button variant="default">New Project</Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-[0px_2px_4px_rgba(0,0,0,0.03)] rounded-md">
          <CardContent>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-[#565656] uppercase">Total Revenue</p>
              <div>
                <p className="text-3xl font-bold text-[#1b1a1a]">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs mt-2">
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3" />
                    <span>{revenueChangePercent}%</span>
                  </div>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0px_2px_4px_rgba(0,0,0,0.03)] rounded-md">
          <CardContent>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-[#565656] uppercase">Active Projects</p>
              <div>
                <p className="text-3xl font-bold text-[#1b1a1a]">{activeProjects}</p>
                <div className="flex items-center gap-1 text-xs mt-2">
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3" />
                    <span>{projectChangePercent}%</span>
                  </div>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0px_2px_4px_rgba(0,0,0,0.03)] rounded-md">
          <CardContent>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-[#565656] uppercase">Team Utilization</p>
              <div>
                <p className="text-3xl font-bold text-[#1b1a1a]">{teamUtilization}%</p>
                <div className="flex items-center gap-1 text-xs mt-2">
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3" />
                    <span>{utilizationChangePercent}%</span>
                  </div>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0px_2px_4px_rgba(0,0,0,0.03)] rounded-md">
          <CardContent>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-[#565656] uppercase">Client Satisfaction</p>
              <div>
                <p className="text-3xl font-bold text-[#1b1a1a]">{clientSatisfaction}%</p>
                <div className="flex items-center gap-1 text-xs mt-2">
                  <div className="flex items-center text-red-500">
                    <ArrowDown className="h-3 w-3" />
                    <span>{Math.abs(satisfactionChangePercent)}%</span>
                  </div>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue Overview */}
        <Card className="lg:col-span-3 shadow-[0px_2px_4px_rgba(0,0,0,0.03)] rounded-md">
          <CardContent>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-[#565656] uppercase">Revenue Overview</p>
              <div className="text-sm text-muted-foreground">Monthly revenue for the current year</div>
            </div>
            <div className="h-[300px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FCA5A5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FCA5A5" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    tick={{ fontSize: 12 }}
                    domain={[0, 'dataMax + 50000']}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    fill="url(#colorRevenue)" 
                    stroke="#FCA5A5" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card className="lg:col-span-2 shadow-[0px_2px_4px_rgba(0,0,0,0.03)] rounded-md">
          <CardContent >
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-[#565656] uppercase">Revenue by Service</p>
              <div className="text-sm text-muted-foreground">Distribution of revenue by service type</div>
            </div>
            <div className="flex flex-col items-center mt-6">
              <div className="h-[200px] w-[200px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceRevenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {serviceRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-3 mt-2">
                {serviceRevenueData.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <div className="text-sm font-medium text-[#1b1a1a]">{service.name}</div>
                    </div>
                    <div className="text-sm font-semibold text-[#1b1a1a]">{service.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
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
                Progress
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projectsWithProgress.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOpenDrawer(project)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }) : 'No deadline'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TeamAvatars members={project.teamMembers} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ProgressBar percentage={project.progress} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the row's onClick
                      handleOpenDrawer(project);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add more bottom padding for the page */}
      <div className="h-6"></div>
    </div>
  );
} 