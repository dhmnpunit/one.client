"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, X, Mail, Calendar, Briefcase, Award, Clock, Download } from "lucide-react";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the team member type
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarSeed: string;
  projects: number;
  rating: number;
  completionRate: number;
}

// Team members data
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Ali Demir",
    role: "QA Engineer",
    email: "ali@mail.com",
    avatarSeed: "Ali-Demir",
    projects: 13,
    rating: 4.9,
    completionRate: 94
  },
  {
    id: "2",
    name: "Zeynep Öztürk",
    role: "UI/UX Designer",
    email: "zeynep@mail.com",
    avatarSeed: "Zeynep-Ozturk",
    projects: 11,
    rating: 4.4,
    completionRate: 86
  },
  {
    id: "3",
    name: "Ahmet Yılmaz",
    role: "Frontend Developer",
    email: "ahmet@mail.com",
    avatarSeed: "Ahmet-Yilmaz",
    projects: 9,
    rating: 4.1,
    completionRate: 79
  },
  {
    id: "4",
    name: "Sercan Yayla",
    role: "Backend Developer",
    email: "sercan@mail.com",
    avatarSeed: "Sercan-Yayla",
    projects: 7,
    rating: 4.3,
    completionRate: 82
  },
  {
    id: "5",
    name: "Yusuf Hilmi",
    role: "DevOps Engineer",
    email: "yusuf@mail.com",
    avatarSeed: "Yusuf-Hilmi",
    projects: 10,
    rating: 4.7,
    completionRate: 91
  },
  {
    id: "6",
    name: "Emre Kara",
    role: "Full Stack Developer",
    email: "emre@mail.com",
    avatarSeed: "Emre-Kara",
    projects: 12,
    rating: 4.5,
    completionRate: 88
  }
];

// Available roles for new team members
const availableRoles = [
  "UI/UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "QA Engineer",
  "DevOps Engineer",
  "Project Manager",
  "Product Manager",
  "Technical Writer"
];

// Team role types for filtering
type Role = "All" | "Designers" | "Developers" | "Managers";

export default function TeamPage() {
  const [filter, setFilter] = useState<Role>("All");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showAddMemberSlider, setShowAddMemberSlider] = useState(false);
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>(teamMembers);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    role: ""
  });
  // Add new state variables for the team member profile details slider
  const [showProfileDetailSlider, setShowProfileDetailSlider] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);

  // Generate Dicebear avatar URL
  const getAvatarUrl = (seed: string) => {
    return `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(seed)}`;
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    const errors = {
      name: "",
      email: "",
      role: ""
    };

    if (!newMember.name.trim()) {
      errors.name = "Name is required";
      valid = false;
    }

    if (!newMember.email.trim()) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(newMember.email)) {
      errors.email = "Email is invalid";
      valid = false;
    }

    if (!newMember.role) {
      errors.role = "Role is required";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember({
      ...newMember,
      [name]: value
    });
  };

  // Handle role selection
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewMember({
      ...newMember,
      role: e.target.value
    });
  };

  // Add new team member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const avatarSeed = newMember.name.replace(/\s+/g, '-');
    const newTeamMember: TeamMember = {
      id: (teamMembersList.length + 1).toString(),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      avatarSeed,
      projects: 0, // New members start with 0 projects
      rating: 0, // New members don't have ratings yet
      completionRate: 0 // New members don't have completion rates yet
    };
    
    setTeamMembersList([...teamMembersList, newTeamMember]);
    setShowAddMemberSlider(false);
    setNewMember({ name: "", email: "", role: "" });
  };

  // Filter team members
  const filteredTeamMembers = teamMembersList
    .filter(member => {
      // Apply role filter
      if (filter === "All") return true;
      if (filter === "Designers") return member.role.includes("Designer");
      if (filter === "Developers") return member.role.includes("Developer") || member.role.includes("Engineer");
      if (filter === "Managers") return member.role.includes("Manager");
      return true;
    });

  // Add a new function to handle opening the team member profile details slider
  const handleViewMemberProfile = (member: TeamMember) => {
    setSelectedTeamMember(member);
    setShowProfileDetailSlider(true);
  };

  // Add a function to close the profile details slider
  const handleCloseProfileSlider = () => {
    setShowProfileDetailSlider(false);
  };

  return (
    <div className="p-6">
      {/* Add Team Member Modal - Replace with Slider */}
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground text-sm">Manage your team members and their access</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="default"
            onClick={() => setShowAddMemberSlider(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Team Member
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="border-b w-full md:w-auto">
          <div className="flex -mb-px">
            {(["All", "Designers", "Developers", "Managers"] as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={cn(
                  "py-2 px-4 text-sm font-medium transition-colors",
                  filter === role
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team members grid */}
      {filteredTeamMembers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No team members found matching your criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-muted flex items-center justify-center">
                      <Image 
                        src={getAvatarUrl(member.avatarSeed)} 
                        alt={member.name}
                        width={48}
                        height={48}
                        style={{ width: '100%', height: 'auto' }}
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to first letter of name if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="flex items-center justify-center w-full h-full text-lg font-semibold">${member.name.charAt(0)}</div>`;
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setShowActionMenu(showActionMenu === member.id ? null : member.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    
                    {showActionMenu === member.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              alert(`Edit ${member.name}`);
                              setShowActionMenu(null);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${member.name}?`)) {
                                setTeamMembersList(teamMembersList.filter(m => m.id !== member.id));
                              }
                              setShowActionMenu(null);
                            }}
                          >
                            Delete
                          </button>
                          <button 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              alert(`Change role for ${member.name}`);
                              setShowActionMenu(null);
                            }}
                          >
                            Change role
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm">{member.email}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Projects</span>
                    <span className="text-sm">{member.projects}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <span className="text-sm">{member.rating || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="text-sm">{member.completionRate}%</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewMemberProfile(member)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => window.location.href = `/agency-owner/messages?user=${member.id}`}
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Team Member Slider */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[500px] h-full bg-[#EFEFEF] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          showAddMemberSlider ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Add New Team Member</h2>
            <button onClick={() => setShowAddMemberSlider(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleAddMember} className="flex-1 overflow-y-auto">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full overflow-hidden mb-4 bg-white flex items-center justify-center border border-gray-200">
                {newMember.name ? (
                  <Image 
                    src={getAvatarUrl(newMember.name.replace(/\s+/g, '-'))}
                    alt="Avatar preview"
                    width={96}
                    height={96}
                    style={{ width: '100%', height: 'auto' }}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400 text-2xl">
                    ?
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Avatar will be generated based on name</p>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-[#E0E0E0]">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                Basic Information
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm text-gray-500 mb-1.5 block">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter full name"
                    value={newMember.name}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="role" className="text-sm text-gray-500 mb-1.5 block">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="role"
                    name="role"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newMember.role}
                    onChange={handleRoleChange}
                  >
                    <option value="" disabled>Select a role</option>
                    {availableRoles.map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="status" className="text-sm text-gray-500 mb-1.5 block">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Full-time"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="joinDate" className="text-sm text-gray-500 mb-1.5 block">
                    Join Date
                  </Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-[#E0E0E0]">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                Contact Information
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm text-gray-500 mb-1.5 block">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newMember.email}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm text-gray-500 mb-1.5 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-sm text-gray-500 mb-1.5 block">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, Country"
                    defaultValue="Istanbul, Turkey"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white h-10">
                Add Team Member
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-10"
                onClick={() => setShowAddMemberSlider(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Team Member Profile Details Slider */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[500px] h-full bg-[#EFEFEF] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          showProfileDetailSlider ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedTeamMember && (
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Team Member Profile</h2>
              <button onClick={handleCloseProfileSlider} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Member profile header */}
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full overflow-hidden mb-4 bg-white flex items-center justify-center border border-gray-200">
                  <Image 
                    src={getAvatarUrl(selectedTeamMember.avatarSeed)} 
                    alt={selectedTeamMember.name}
                    width={96}
                    height={96}
                    style={{ width: '100%', height: 'auto' }}
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to first letter of name if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<div class="flex items-center justify-center w-full h-full text-lg font-semibold">${selectedTeamMember.name.charAt(0)}</div>`;
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedTeamMember.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{selectedTeamMember.role}</p>
                
                {/* Status badge */}
                <div className="mb-3">
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(selectedTeamMember.rating) ? 'text-amber-500' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-700 ml-1">({selectedTeamMember.rating})</span>
                </div>
              </div>
              
              {/* Tabbed content */}
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="info" className="text-xs py-2">Basic Info</TabsTrigger>
                  <TabsTrigger value="performance" className="text-xs py-2">Performance</TabsTrigger>
                  <TabsTrigger value="projects" className="text-xs py-2">Projects</TabsTrigger>
                </TabsList>
                
                {/* Basic Info Tab */}
                <TabsContent value="info" className="space-y-4">
                  {/* Personal Information */}
                  <div className="bg-white rounded-lg p-4 border border-[#E0E0E0]">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      Basic Information
                    </h4>
                    
                    <div className="divide-y divide-gray-100">
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Full Name</span>
                        <span className="w-2/3 text-sm font-medium">{selectedTeamMember.name}</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Position</span>
                        <span className="w-2/3 text-sm font-medium">{selectedTeamMember.role}</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Department</span>
                        <span className="w-2/3 text-sm font-medium">
                          {selectedTeamMember.role.includes("Developer") || selectedTeamMember.role.includes("Engineer") 
                            ? "Engineering" 
                            : selectedTeamMember.role.includes("Designer") 
                              ? "Design" 
                              : "Operations"}
                        </span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Join Date</span>
                        <span className="w-2/3 text-sm font-medium">January 15, 2023</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Status</span>
                        <span className="w-2/3 text-sm font-medium">Full-time</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Employee ID</span>
                        <span className="w-2/3 text-sm font-medium">{selectedTeamMember.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="bg-white rounded-lg p-4 border border-[#E0E0E0]">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      Contact Information
                    </h4>
                    
                    <div className="divide-y divide-gray-100">
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Email</span>
                        <span className="w-2/3 text-sm font-medium">{selectedTeamMember.email}</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Phone</span>
                        <span className="w-2/3 text-sm font-medium">+90 555 123 4567</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Slack</span>
                        <span className="w-2/3 text-sm font-medium">@{selectedTeamMember.name.split(' ')[0].toLowerCase()}</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Location</span>
                        <span className="w-2/3 text-sm font-medium">Istanbul, Turkey</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div className="bg-white rounded-lg p-4 border border-[#E0E0E0]">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      Availability & Schedule
                    </h4>
                    
                    <div className="divide-y divide-gray-100">
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Status</span>
                        <span className="w-2/3">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
                        </span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Work Hours</span>
                        <span className="w-2/3 text-sm font-medium">9:00 AM - 6:00 PM (GMT+3)</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Time Zone</span>
                        <span className="w-2/3 text-sm font-medium">Istanbul (GMT+3)</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Next Time Off</span>
                        <span className="w-2/3 text-sm font-medium">No scheduled time off</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Capacity</span>
                        <span className="w-2/3 text-sm font-medium">
                          {selectedTeamMember.projects >= 10 ? "85% allocated" : 
                          selectedTeamMember.projects >= 5 ? "65% allocated" : "40% allocated"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Weekly availability visualization */}
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-gray-500 mb-2">Weekly Availability</h5>
                      <div className="grid grid-cols-5 gap-1 text-center">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                          <div key={day} className="text-xs">
                            <div className="mb-1 font-medium">{day}</div>
                            <div className="h-6 bg-green-100 text-green-800 rounded text-[10px] flex items-center justify-center">
                              Available
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="bg-white rounded-lg p-4 border border-[#E0E0E0]">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-500" />
                      Performance Metrics
                    </h4>
                    
                    <div className="divide-y divide-gray-100">
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Active Projects</span>
                        <span className="w-2/3 text-sm font-medium">{selectedTeamMember.projects}</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Rating</span>
                        <span className="w-2/3 text-sm font-medium">{selectedTeamMember.rating}/5</span>
                      </div>
                      <div className="py-2 flex">
                        <span className="w-1/3 text-sm text-gray-500">Completion Rate</span>
                        <span className="w-2/3 text-sm font-medium">{selectedTeamMember.completionRate}%</span>
                      </div>
                    </div>
                    
                    {/* Performance Chart - Simplified version */}
                    <div className="mt-4">
                      <h5 className="text-xs font-medium text-gray-500 mb-2">Monthly Task Completion</h5>
                      <div className="h-[100px] flex items-end space-x-2">
                        {[65, 80, 45, 90, 75, 60].map((height, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-blue-500 rounded-t"
                              style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs mt-1">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Skills Assessment Visualization */}
                    <div className="mt-5">
                      <h5 className="text-xs font-medium text-gray-500 mb-3">Skills Assessment</h5>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Technical Skills</span>
                            <span>85%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Communication</span>
                            <span>90%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Problem Solving</span>
                            <span>78%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-4">
                  {/* Projects Assignments */}
                  <div className="bg-white rounded-lg p-4 border border-[#E0E0E0]">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Project Assignments
                    </h4>
                    
                    <div className="space-y-3">
                      {[...Array(Math.min(selectedTeamMember.projects, 3))].map((_, i) => (
                        <div key={i} className="p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-medium">Project {i + 1}</h5>
                              <p className="text-xs text-gray-500">Client: Example Client {i + 1}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Role: {
                                  ["Lead Developer", "UI Designer", "QA Engineer"][i] || selectedTeamMember.role
                                }
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-amber-100 text-amber-800'][i]
                            }`}>
                              {['In Progress', 'Completed', 'On Hold'][i]}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{[75, 100, 40][i]}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${['bg-blue-500', 'bg-green-500', 'bg-amber-500'][i]}`}
                                style={{ width: `${[75, 100, 40][i]}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {selectedTeamMember.projects === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No active projects</p>
                      )}
                      
                      {selectedTeamMember.projects > 3 && (
                        <div className="text-center pt-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            View all {selectedTeamMember.projects} projects
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              <div className="flex gap-2">
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white h-10">
                  Assign to Project
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-10"
                  onClick={() => window.location.href = `/agency-owner/messages?user=${selectedTeamMember.id}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 h-10"
                  onClick={() => {
                    alert("Edit team member functionality would go here");
                    handleCloseProfileSlider();
                  }}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-10"
                  onClick={() => {
                    alert("Download profile as PDF functionality would go here");
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay for sliders */}
      {(showAddMemberSlider || showProfileDetailSlider) && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => {
            if (showAddMemberSlider) setShowAddMemberSlider(false);
            if (showProfileDetailSlider) setShowProfileDetailSlider(false);
          }}
        />
      )}
    </div>
  );
} 