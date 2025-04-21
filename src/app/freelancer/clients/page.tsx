"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Download, 
  Filter, 
  ChevronDown,
  X,
  MoreHorizontal,
  Eye,
  Edit,
  PlusCircle,
  Trash2
} from "lucide-react";
import { 
  UserIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import Avatar from "boring-avatars";

// Define client data structure
interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Pending";
  projects: number;
  joinedDate: string;
  avatar: string;
  avatarColors: string[];
}

// Mock data for clients
const initialClientsData: Client[] = [
  {
    id: "c1",
    name: "Ahmet Yilmaz",
    company: "Tech Solutions Inc.",
    email: "ahmet@techsolutions.com",
    phone: "+90 555 123 4567",
    status: "Active",
    projects: 5,
    joinedDate: "Feb 2023",
    avatar: `https://api.dicebear.com/6.x/lorelei/svg?seed=Ahmet Yilmaz`,
    avatarColors: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]
  },
  {
    id: "c2",
    name: "Zeynep Ozturk",
    company: "Digital Marketing Co.",
    email: "zeynep@digitalmarketing.com",
    phone: "+90 555 234 5678",
    status: "Active",
    projects: 3,
    joinedDate: "Apr 2023",
    avatar: `https://api.dicebear.com/6.x/lorelei/svg?seed=Zeynep Ozturk`,
    avatarColors: ["#A0B9C6", "#7A9CA5", "#6C7E8E", "#4B5A72", "#324267"]
  },
  {
    id: "c3",
    name: "Mehmet Kaya",
    company: "Innovate Solutions",
    email: "mehmet@innovate.com",
    phone: "+90 555 345 6789",
    status: "Inactive",
    projects: 2,
    joinedDate: "Jun 2023",
    avatar: `https://api.dicebear.com/6.x/lorelei/svg?seed=Mehmet Kaya`,
    avatarColors: ["#F5BB9C", "#EE9480", "#EB6877", "#D83F87", "#A91CF0"]
  },
  {
    id: "c4",
    name: "Ayse Demir",
    company: "Creative Designs",
    email: "ayse@creativedesigns.com",
    phone: "+90 555 456 7890",
    status: "Pending",
    projects: 1,
    joinedDate: "Aug 2023",
    avatar: `https://api.dicebear.com/6.x/lorelei/svg?seed=Ayse Demir`,
    avatarColors: ["#5E7CE2", "#72A1ED", "#7CCAED", "#92F2DA", "#B8F7D4"]
  },
  {
    id: "c5",
    name: "Mustafa Celik",
    company: "Global Enterprises",
    email: "mustafa@global.com",
    phone: "+90 555 567 8901",
    status: "Active",
    projects: 4,
    joinedDate: "Oct 2023",
    avatar: `https://api.dicebear.com/6.x/lorelei/svg?seed=Mustafa Celik`,
    avatarColors: ["#6FD08C", "#A2E665", "#CAF7CE", "#E2F6D3", "#F9F7D3"]
  },
  {
    id: "c6",
    name: "Elif Yildiz",
    company: "Smart Solutions",
    email: "elif@smartsolutions.com",
    phone: "+90 555 678 9012",
    status: "Active",
    projects: 2,
    joinedDate: "Dec 2023",
    avatar: `https://api.dicebear.com/6.x/lorelei/svg?seed=Elif Yildiz`,
    avatarColors: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]
  }
];

// Renamed function to FreelancerClientsPage
export default function FreelancerClientsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [slidePanelOpen, setSlidePanelOpen] = useState(false);
  const [clientDetailPanelOpen, setClientDetailPanelOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientsData, setClientsData] = useState<Client[]>(initialClientsData);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Pending"
  });
  
  // Define a set of color palettes for avatars
  const avatarColorPalettes = [
    ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
    ["#A0B9C6", "#7A9CA5", "#6C7E8E", "#4B5A72", "#324267"],
    ["#F5BB9C", "#EE9480", "#EB6877", "#D83F87", "#A91CF0"],
    ["#5E7CE2", "#72A1ED", "#7CCAED", "#92F2DA", "#B8F7D4"],
    ["#6FD08C", "#A2E665", "#CAF7CE", "#E2F6D3", "#F9F7D3"]
  ];

  // Select a random palette for the new client
  const [avatarPalette, setAvatarPalette] = useState(
    avatarColorPalettes[Math.floor(Math.random() * avatarColorPalettes.length)]
  );

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Calculate stats (Adjusted for freelancer context)
  const totalClients = clientsData.length;
  const maxClients = 10; // Maximum allowed clients (can be adjusted for freelancer tier)
  const totalRevenue = 12500; // Placeholder for total revenue (should reflect freelancer's revenue)

  // Filter clients based on search term and status
  const filteredClients = clientsData.filter(client => {
    const matchesStatus = statusFilter === "All" || client.status === statusFilter;
    
    return matchesStatus;
  });

  // Handler functions for client interactions
  const handleViewClientDetail = (client: Client) => {
    setSelectedClient(client);
    setClientDetailPanelOpen(true);
  };

  const handleEditClient = (client: Client) => {
    // Placeholder function for handling client editing
    console.log("Edit client:", client.id);
  };

  const handleAddClientClick = () => {
    setSlidePanelOpen(true);
    // Generate a new random color palette for the avatar
    setAvatarPalette(avatarColorPalettes[Math.floor(Math.random() * avatarColorPalettes.length)]);
  };

  const handleClosePanel = () => {
    setSlidePanelOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new client with a generated ID
    const newClientComplete: Client = {
      id: `c${clientsData.length + 1}`,
      name: newClient.name || "",
      company: newClient.company || "",
      email: newClient.email || "",
      phone: newClient.phone || "",
      status: newClient.status as "Active" | "Inactive" | "Pending" || "Pending",
      projects: 0,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      avatar: "",  // We'll render the avatar directly using the component
      avatarColors: [...avatarPalette] // Store the color palette
    };
    
    // Add the new client to the clients array
    setClientsData(prev => [...prev, newClientComplete]);
    
    // Reset form and close panel
    setNewClient({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "Pending"
    });
    setSlidePanelOpen(false);
    
    // Generate a new palette for the next client
    setAvatarPalette(avatarColorPalettes[Math.floor(Math.random() * avatarColorPalettes.length)]);
  };

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Are you sure you want to delete ${client.name}?`)) {
      setClientsData(prev => prev.filter(c => c.id !== client.id));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if we clicked outside any dropdown button or menu
      if (activeDropdown && 
          !(event.target as Element).closest('.dropdown-menu') && 
          !(event.target as Element).closest('.dropdown-trigger')) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);
  
  return (
    <div className="p-6 bg-[#EFEFEF] min-h-screen">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your clients and their projects</p>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="relative">
            <Button 
              variant="outline" 
              className="border border-gray-300 bg-white text-gray-700 flex items-center h-10 px-4"
              onClick={(e) => {
                const dropdown = e.currentTarget.nextElementSibling;
                if (dropdown) {
                  dropdown.classList.toggle('hidden');
                }
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Status: {statusFilter}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <div className="absolute top-full mt-1 z-10 bg-white border border-gray-200 rounded-md shadow-lg py-1 hidden">
              {["All", "Active", "Inactive", "Pending"].map((status) => (
                <div
                  key={status}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setStatusFilter(status);
                    // Hide dropdown after selection
                    const dropdown = document.querySelector('.absolute.top-full');
                    if (dropdown) dropdown.classList.add('hidden');
                  }}
                >
                  {status}
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="border border-gray-300 bg-white text-gray-700 h-10 px-4">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button 
            className="bg-black hover:bg-gray-800 text-white h-10 px-4"
            onClick={handleAddClientClick}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Client
          </Button>
        </div>
      </div>

      {/* Stats and table container */}
      <div className="mb-6">
        {/* Quick Stats - Adjusted some cards for freelancer context */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Total Clients</p>
                <p className="text-2xl font-medium text-[#333333]">{totalClients}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                <UserIcon className="w-6 h-6 text-[#333333]" />
              </div>
            </div>
            {/* Optional: Adjust or remove maxClients concept for freelancer */}
            <div className="mt-2 flex items-center text-xs text-[#707070]">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">{maxClients - totalClients} slots left</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Active Clients</p>
                <p className="text-2xl font-medium text-[#333333]">{clientsData.filter(c => c.status === 'Active').length}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                <ShieldCheckIcon className="w-6 h-6 text-[#333333]" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-[#707070]">
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">{clientsData.filter(c => c.status === 'Active').length} of {totalClients} clients</span>
            </div>
          </div>
          
          {/* Removed Clients per Member card as it's less relevant for freelancers */}
          {/* 
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Clients per Member</p>
                <p className="text-2xl font-medium text-[#333333]">{clientsPerMember}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                <UserGroupIcon className="w-6 h-6 text-[#333333]" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-[#707070]">
              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100">{teamMembers} team members</span>
            </div>
          </div>
          */}
          
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Total Revenue</p>
                <p className="text-2xl font-medium text-[#333333]">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                <CurrencyDollarIcon className="w-6 h-6 text-[#333333]" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-[#707070]">
              <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100">From {totalClients} clients</span>
            </div>
          </div>

          {/* Added Placeholder Card - Can be replaced with relevant freelancer stat */}
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Avg. Project Value</p>
                <p className="text-2xl font-medium text-[#333333]">${(totalRevenue / totalClients).toFixed(2)}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                {/* Choose a relevant icon */}
                <CurrencyDollarIcon className="w-6 h-6 text-[#333333]" /> 
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-[#707070]">
              <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-100">Across all clients</span>
            </div>
          </div>

        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F9F9F9]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Status</th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map(client => {
                return (
                  <tr key={client.id} className="hover:bg-[#F9F9F9] cursor-pointer" onClick={() => handleViewClientDetail(client)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <Avatar 
                            name={client.name}
                            variant="beam"
                            colors={client.avatarColors}
                            size={40}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#333333]">{client.name}</div>
                          <div className="text-xs text-[#707070]">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">{client.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">{client.projects}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">{client.joinedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        client.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : client.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          className="text-gray-500 hover:text-gray-700 dropdown-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === client.id ? null : client.id);
                          }}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === client.id && (
                          <div 
                            className="absolute right-0 mt-1 bg-white border border-[#E0E0E0] rounded-md shadow-lg py-1 z-10 w-48 dropdown-menu"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewClientDetail(client);
                                setActiveDropdown(null);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2 text-gray-500" />
                              <span>View Details</span>
                            </button>
                            
                            <button
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClient(client);
                                setActiveDropdown(null);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Edit Client</span>
                            </button>
                            
                            <div className="border-t border-gray-100 my-1"></div>
                            
                            <button
                              className="px-4 py-2 text-sm text-green-600 hover:bg-gray-50 w-full text-left flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add project functionality would go here
                                console.log('Add project for', client.id);
                                setActiveDropdown(null);
                              }}
                            >
                              <PlusCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>Add Project</span>
                            </button>
                            
                            <div className="border-t border-gray-100 my-1"></div>
                            
                            <button
                              className="px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client);
                                setActiveDropdown(null);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                              <span>Delete Client</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No clients found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Add Client Slide Panel */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#EFEFEF] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          slidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Add New Client</h2>
            <button onClick={handleClosePanel} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full overflow-hidden mb-4 bg-white flex items-center justify-center border border-gray-200">
                <Avatar 
                  name={newClient.name || ""}
                  variant="beam"
                  colors={avatarPalette}
                  size={96}
                />
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500">Random avatar</p>
                <button 
                  type="button" 
                  onClick={() => setAvatarPalette(avatarColorPalettes[Math.floor(Math.random() * avatarColorPalettes.length)])}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Generate new
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-[#E0E0E0]">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
              
              <div className="divide-y divide-gray-100">
                <div className="py-2 flex items-center">
                  <label htmlFor="name" className="w-1/3 text-sm text-gray-500">
                    Client Name
                  </label>
                  <div className="w-2/3">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newClient.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                      required
                    />
                  </div>
                </div>
                
                <div className="py-2 flex items-center">
                  <label htmlFor="company" className="w-1/3 text-sm text-gray-500">
                    Company
                  </label>
                  <div className="w-2/3">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={newClient.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                      required
                    />
                  </div>
                </div>
                
                <div className="py-2 flex items-center">
                  <label htmlFor="status" className="w-1/3 text-sm text-gray-500">
                    Status
                  </label>
                  <div className="w-2/3">
                    <select
                      id="status"
                      name="status"
                      value={newClient.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-[#E0E0E0]">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
              
              <div className="divide-y divide-gray-100">
                <div className="py-2 flex items-center">
                  <label htmlFor="email" className="w-1/3 text-sm text-gray-500">
                    Email
                  </label>
                  <div className="w-2/3">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newClient.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                      required
                    />
                  </div>
                </div>
                
                <div className="py-2 flex items-center">
                  <label htmlFor="phone" className="w-1/3 text-sm text-gray-500">
                    Phone
                  </label>
                  <div className="w-2/3">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={newClient.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white h-10">
                Add Client
          </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Client Details Slide Panel */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#EFEFEF] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          clientDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedClient && (
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Client Details</h2>
              <button onClick={() => setClientDetailPanelOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Client profile header */}
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full overflow-hidden mb-4 bg-white flex items-center justify-center border border-gray-200">
                  <Avatar 
                    name={selectedClient.name}
                    variant="beam"
                    colors={selectedClient.avatarColors}
                    size={96}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                <p className="text-sm text-gray-500">{selectedClient.company}</p>
                
                <div className="mt-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedClient.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedClient.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedClient.status}
                  </span>
                      </div>
                    </div>
                    
              {/* Client details */}
              <div className="bg-white rounded-lg p-4 mb-4 border border-[#E0E0E0]">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                
                <div className="divide-y divide-gray-100">
                  <div className="py-2 flex">
                    <span className="w-1/3 text-sm text-gray-500">Email</span>
                    <span className="w-2/3 text-sm font-medium">{selectedClient.email}</span>
                  </div>
                  <div className="py-2 flex">
                    <span className="w-1/3 text-sm text-gray-500">Phone</span>
                    <span className="w-2/3 text-sm font-medium">{selectedClient.phone}</span>
                      </div>
                      </div>
                    </div>
                    
              <div className="bg-white rounded-lg p-4 mb-4 border border-[#E0E0E0]">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Client Information</h4>
                
                <div className="divide-y divide-gray-100">
                  <div className="py-2 flex">
                    <span className="w-1/3 text-sm text-gray-500">Client ID</span>
                    <span className="w-2/3 text-sm font-medium">{selectedClient.id}</span>
                  </div>
                  <div className="py-2 flex">
                    <span className="w-1/3 text-sm text-gray-500">Date Joined</span>
                    <span className="w-2/3 text-sm font-medium">{selectedClient.joinedDate}</span>
                      </div>
                  <div className="py-2 flex">
                    <span className="w-1/3 text-sm text-gray-500">Projects</span>
                    <span className="w-2/3 text-sm font-medium">{selectedClient.projects} active projects</span>
                      </div>
                    </div>
                  </div>
                  
              {/* Action buttons */}
              <div className="mt-6 space-y-3">
                <Button className="w-full bg-white border border-gray-300 text-gray-700 h-10 hover:bg-gray-50">
                  View Projects
                </Button>
                
                <Button 
                  className="w-full bg-black hover:bg-gray-800 text-white h-10"
                  onClick={() => {
                    handleEditClient(selectedClient);
                    setClientDetailPanelOpen(false);
                  }}
                >
                  Edit Client
                    </Button>
                  </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for slide panels */}
      {(slidePanelOpen || clientDetailPanelOpen) && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => {
            if (slidePanelOpen) setSlidePanelOpen(false);
            if (clientDetailPanelOpen) setClientDetailPanelOpen(false);
          }}
        />
      )}
    </div>
  );
} 