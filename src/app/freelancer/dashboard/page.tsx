"use client"

import { Card, CardContent } from "@/components/ui/card";
import { mockClients, mockProjects } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MoreHorizontal, RefreshCw } from "lucide-react";
import { UserGroupIcon, BriefcaseIcon, CurrencyDollarIcon, StarIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Project } from "@/types/project";

export default function FreelancerDashboard() {
  // Placeholder data for the new 8 stat cards
  const totalClients = 5; 
  const activeProjects = 3;
  const totalRevenueMonthly = 4500;
  const clientSatisfaction = 4.8; // e.g., out of 5
  
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

  // Project status data - Commented out as it's currently unused
  /*
  const projectStatusData = [
    { name: "Completed", value: 24, color: "#E67E63" },
    { name: "In Progress", value: 13, color: "#32A893" },
    { name: "On Hold", value: 5, color: "#1E293B" },
    { name: "Planning", value: 8, color: "#F4CE6A" }
  ];
  */
  
  // Revenue by service data
  const serviceRevenueData = [
    { name: "Website Development", value: 45, color: "#E67E63" },
    { name: "Mobile Apps", value: 25, color: "#F4CE6A" },
    { name: "UI/UX Design", value: 18, color: "#F97B7B" },
    { name: "Branding", value: 12, color: "#A9B0BC" }
  ];
  
  // Define a more specific type for team members
  interface TeamMember {
    id: string;
    name: string;
    avatar: string;
  }

  // Projects with calculated progress and client names
  const [projectsWithProgress, setProjectsWithProgress] = useState<Array<Project & { progress: number; clientName: string; teamMembers: TeamMember[] }>>([]);
  
  useEffect(() => {
    const enhancedProjects = mockProjects.slice(0, 5).map(project => {
      const client = mockClients.find(c => c.id === project.clientId);
      
      const teamMembers: TeamMember[] = Array(3).fill(0).map((_, i) => ({
        id: `member-${i}`,
        name: `Team Member ${i + 1}`,
        avatar: `/avatars/placeholder.svg`
      }));
      
      return {
        ...project,
        createdBy: project.assignedToId, 
        createdAt: new Date(), 
        updatedAt: new Date(), 
        progress: Math.floor(Math.random() * 100),
        clientName: client?.company || 'Unknown Client',
        teamMembers
      };
    });
    
    setProjectsWithProgress(enhancedProjects);
  }, []);
  
  // Define a more specific type for the project in handleOpenDrawer
  const handleOpenDrawer = (project: Project & { progress: number; clientName: string; teamMembers: TeamMember[] }) => {
    console.log("Opening project details:", project);
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
  const TeamAvatars = ({ members }: { members: TeamMember[] }) => {
    return (
      <div className="flex -space-x-2 overflow-hidden">
        {members.map((member, index) => (
          <Avatar key={index} className="inline-block h-6 w-6 rounded-full border-2 border-white">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name?.charAt(0) || 'U'}</AvatarFallback>
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
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your work.</p>
        </div>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats cards - Replaced with 8 new cards for Freelancer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Clients */}
        <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#707070]">Total Clients</p>
              <p className="text-3xl font-medium text-[#333333]">{totalClients}</p>
            </div>
            <div className="bg-[#F5F5F5] p-3 rounded-full">
              <UserGroupIcon className="w-6 h-6 text-[#333333]" />
            </div>
          </div>
          {/* Optional: Add subtext if needed */}
          {/* <div className="mt-2 flex items-center text-xs text-[#707070]">...</div> */}
        </div>
        
        {/* Card 2: Active Projects */}
        <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#707070]">Active Projects</p>
              <p className="text-3xl font-medium text-[#333333]">{activeProjects}</p>
            </div>
            <div className="bg-[#F5F5F5] p-3 rounded-full">
              <BriefcaseIcon className="w-6 h-6 text-[#333333]" />
            </div>
          </div>
           <div className="mt-2 flex items-center text-xs text-[#707070]">
             <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">Currently in progress</span>
           </div>
        </div>

        {/* Card 3: Total Revenue (Monthly Example) */}
        <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]"> 
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#707070]">Revenue (This Month)</p>
              <p className="text-3xl font-medium text-[#333333]">${totalRevenueMonthly.toLocaleString()}</p>
            </div>
            <div className="bg-[#F5F5F5] p-3 rounded-full">
              <CurrencyDollarIcon className="w-6 h-6 text-[#333333]" />
            </div>
          </div>
           {/* Optional: Add comparison like % change */}
          {/* <div className="mt-2 flex items-center text-xs text-green-500">+5% from last month</div> */}
        </div>
        
        {/* Card 4: Client Satisfaction */}
        <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#707070]">Client Satisfaction</p>
              <p className="text-3xl font-medium text-[#333333]">{clientSatisfaction}/5</p> 
            </div>
            <div className="bg-[#F5F5F5] p-3 rounded-full">
              <StarIcon className="w-6 h-6 text-[#333333]" />
            </div>
          </div>
           <div className="mt-2 flex items-center text-xs text-[#707070]">
             <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-100">Based on feedback</span>
           </div>
        </div>

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