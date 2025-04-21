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
  Trash2,
  ClipboardCheckIcon
} from "lucide-react";
import { 
  UserIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";
import Avatar from "boring-avatars";
import { mockAgencyMembers, mockClients, Client as MockClient } from "@/lib/mock-data";

// Use Client type from mock data
type Client = MockClient;

export default function ClientsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [slidePanelOpen, setSlidePanelOpen] = useState(false);
  const [clientDetailPanelOpen, setClientDetailPanelOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  // Use mockClients from import as the source
  const [clientsData, setClientsData] = useState<Client[]>(mockClients); 
  const [newClient, setNewClient] = useState<Partial<Omit<Client, 'id' | 'joinedDate' | 'lastActivity' | 'avatar'>>>({
    name: "",
    company: "",
    email: "",
    status: "active",
    totalProjects: 0,
    activeProjects: 0
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

  // --- Get assigned client IDs --- 
  const currentMember = mockAgencyMembers[0]; 
  const assignedClientIds = currentMember?.clientIds || []; 
  // -----------------------------

  // --- Filter SHARED clients based on assignment --- 
  const assignedClients = clientsData.filter(client => assignedClientIds.includes(client.id));
  // --------------------------------------------------

  // --- Now filter the assigned clients by status --- 
  const filteredClients = assignedClients.filter(client => {
    // Adjust status check based on the imported Client type's status values
    const statusString = client.status as string; // Cast if needed
    const matchesStatus = statusFilter === "All" || statusString.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
  });
  // -------------------------------------------------

  // --- Calculate stats based on assigned clients --- 
  const totalAssignedClients = assignedClients.length;
  const activeAssignedClientsCount = assignedClients.filter(c => c.status === 'active').length;
  const totalAssignedProjects = assignedClients.reduce((sum, client) => sum + (client.totalProjects || 0), 0); 
  const activeAssignedProjects = assignedClients
    .filter(c => c.status === 'active')
    .reduce((sum, client) => sum + (client.activeProjects || 0), 0); 
  // ----------------------------------------------------

  // Handler functions for client interactions
  const handleViewClientDetail = (client: Client) => {
    setSelectedClient(client);
    setClientDetailPanelOpen(true);
  };

  const handleEditClient = (client: Client) => {
    console.log("Edit client:", client.id);
    // TODO: Adapt edit logic if Client structure differs
  };

  const handleAddClientClick = () => {
    setSlidePanelOpen(true);
    // TODO: Adapt add form if Client structure differs
    // setAvatarPalette(...); // Keep if avatar generation is still used
  };

  const handleClosePanel = () => {
    setSlidePanelOpen(false);
    setClientDetailPanelOpen(false); // Ensure both panels can be closed
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Adapt client creation logic based on the imported Client type structure
    /* 
    const newClientComplete: Client = {
      id: `c${clientsData.length + 1}`,
      name: newClient.name || "",
      company: newClient.company || "",
      email: newClient.email || "",
      status: newClient.status || "active",
      // Add other required fields from imported Client type, maybe assign default values
      totalProjects: 0,
      activeProjects: 0,
      joinedDate: new Date(),
      lastActivity: new Date(),
      avatar: "", // Or generate one
    };
    setClientsData(prev => [...prev, newClientComplete]);
    */
    console.log("Add client submit needs adapting to new Client type", newClient);
    setNewClient({ name: "", company: "", email: "", status: "active", totalProjects: 0, activeProjects: 0 });
    setSlidePanelOpen(false);
    // setAvatarPalette(...); // Keep if needed
  };

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Are you sure you want to delete ${client.name}?`)) {
      // Note: This only removes from local state, not the actual mock source file
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
              {["All", "Active", "Inactive"].map((status) => (
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
        {/* Quick Stats - Modified cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Total Clients (Assigned)</p>
                <p className="text-2xl font-medium text-[#333333]">{totalAssignedClients}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                <UserIcon className="w-6 h-6 text-[#333333]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Active Clients (Assigned)</p>
                <p className="text-2xl font-medium text-[#333333]">{activeAssignedClientsCount}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                <ShieldCheckIcon className="w-6 h-6 text-[#333333]" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-[#707070]">
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">{activeAssignedClientsCount} of {totalAssignedClients} clients</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Total Assigned Projects</p>
                <p className="text-2xl font-medium text-[#333333]">{totalAssignedProjects}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                <BriefcaseIcon className="w-6 h-6 text-[#333333]" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-[#707070]">
              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100">Across {totalAssignedClients} clients</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#707070]">Active Projects (Assigned)</p>
                <p className="text-2xl font-medium text-[#333333]">{activeAssignedProjects}</p>
              </div>
              <div className="bg-[#F5F5F5] p-3 rounded-full">
                <ClipboardCheckIcon className="w-6 h-6 text-[#333333]" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-[#707070]">
              <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100">From {activeAssignedClientsCount} active clients</span>
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
                            colors={avatarColorPalettes[Math.floor(Math.random() * avatarColorPalettes.length)]}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">{client.activeProjects} / {client.totalProjects}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">
                      {client.joinedDate ? new Date(client.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        client.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
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
                    colors={avatarColorPalettes[Math.floor(Math.random() * avatarColorPalettes.length)]}
                    size={96}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                <p className="text-sm text-gray-500">{selectedClient.company}</p>
                
                <div className="mt-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedClient.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
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
                    <span className="w-2/3 text-sm font-medium">
                      {selectedClient.joinedDate ? new Date(selectedClient.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="py-2 flex">
                    <span className="w-1/3 text-sm text-gray-500">Projects</span>
                    <span className="w-2/3 text-sm font-medium">{selectedClient.activeProjects} active projects</span>
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