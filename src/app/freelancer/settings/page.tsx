"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Bell, 
  Globe, 
  Shield, 
  Trash2,
  Clock,
  Calendar,
  Download,
  Upload
} from "lucide-react";
import { mockFreelancer } from '@/lib/mock-data';

export default function FreelancerSettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const freelancerData = mockFreelancer;

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: freelancerData.name,
    title: freelancerData.title || "Freelance Developer",
    email: freelancerData.email,
    phone: freelancerData.phone || "",
    location: freelancerData.location || "",
    bio: freelancerData.bio || "",
    avatar: freelancerData.avatar
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [notifications, setNotifications] = useState({
    email: {
      messages: true,
      projects: true,
      billing: true,
      updates: false,
    },
    push: {
      messages: true,
      projects: true,
      billing: false,
      updates: false,
    }
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC-5",
    currency: "USD",
    theme: "system"
  });

  // Handlers
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };

  const toggleNotification = (category: string, type: 'email' | 'push') => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: !prev[type][category]
      }
    }));
  };

  const handlePreferenceChange = (name: string, value: string) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalInfo = () => {
    // In a real app, you would save this to your backend
    console.log("Saving personal info:", personalInfo);
    // Show success message, etc.
  };

  const handleChangePassword = () => {
    // Validate password
    if (password.new !== password.confirm) {
      alert("New passwords don't match");
      return;
    }
    if (password.new.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    
    // In a real app, you would call your API to change the password
    console.log("Changing password");
    // Reset fields and show success message
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
      
      <Tabs 
        defaultValue="account" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img 
                      src={personalInfo.avatar || "/avatars/placeholder.svg"} 
                      alt="Profile picture" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="text-white">
                        <Upload className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF, max 2MB
                  </p>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={personalInfo.name} 
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={personalInfo.title} 
                        onChange={handlePersonalInfoChange} 
                        placeholder="e.g., Senior Developer"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={personalInfo.email} 
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={personalInfo.phone} 
                        onChange={handlePersonalInfoChange} 
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={personalInfo.location} 
                      onChange={handlePersonalInfoChange} 
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      value={personalInfo.bio} 
                      onChange={handlePersonalInfoChange} 
                      placeholder="Tell clients a bit about yourself and your work..."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      Brief description for your profile. This will be visible to clients and team members.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSavePersonalInfo}>Save Changes</Button>
            </CardFooter>
          </Card>

          {/* Billing section would go here in a real app */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your billing details and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Billing information is not available in the demo version.
              </p>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible account actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all of your data. This action cannot be undone.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input 
                  id="current" 
                  name="current" 
                  type="password" 
                  value={password.current} 
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input 
                  id="new" 
                  name="new" 
                  type="password" 
                  value={password.new} 
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input 
                  id="confirm" 
                  name="confirm" 
                  type="password" 
                  value={password.confirm} 
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>At least 8 characters long</li>
                  <li>Must include at least one uppercase letter and one number</li>
                  <li>Should not match previous passwords</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Authenticator App</h3>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app to generate verification codes.
                  </p>
                </div>
                <Button variant="outline">Set Up</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Recovery</h3>
                  <p className="text-sm text-muted-foreground">
                    Get recovery codes via SMS.
                  </p>
                </div>
                <Button variant="outline">Set Up</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Messages</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications for new messages
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.email.messages} 
                        onCheckedChange={() => toggleNotification('messages', 'email')}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Project Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about project changes and updates
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.email.projects} 
                        onCheckedChange={() => toggleNotification('projects', 'email')}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Billing Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive invoices and payment notifications
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.email.billing} 
                        onCheckedChange={() => toggleNotification('billing', 'email')}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Platform Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new features and updates
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.email.updates} 
                        onCheckedChange={() => toggleNotification('updates', 'email')}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Messages</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications for new messages
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.push.messages} 
                        onCheckedChange={() => toggleNotification('messages', 'push')}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Project Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about project changes and updates
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.push.projects} 
                        onCheckedChange={() => toggleNotification('projects', 'push')}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Billing Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive invoices and payment notifications
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.push.billing} 
                        onCheckedChange={() => toggleNotification('billing', 'push')}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Platform Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new features and updates
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.push.updates} 
                        onCheckedChange={() => toggleNotification('updates', 'push')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Customize language, timezone and currency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select 
                  id="language" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                >
                  <option value="en">English (US)</option>
                  <option value="en-gb">English (UK)</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">UTC / GMT</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                  <option value="UTC+2">Eastern European Time (UTC+2)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select 
                  id="currency" 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={preferences.currency}
                  onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="CAD">Canadian Dollar (C$)</option>
                  <option value="AUD">Australian Dollar (A$)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={preferences.theme === "light" ? "default" : "outline"}
                    className="flex-1 justify-start"
                    onClick={() => handlePreferenceChange('theme', 'light')}
                  >
                    Light
                  </Button>
                  <Button 
                    variant={preferences.theme === "dark" ? "default" : "outline"}
                    className="flex-1 justify-start"
                    onClick={() => handlePreferenceChange('theme', 'dark')}
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={preferences.theme === "system" ? "default" : "outline"}
                    className="flex-1 justify-start"
                    onClick={() => handlePreferenceChange('theme', 'system')}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Export your data for backup or migration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Export Account Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your profile information
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Export Project History</h3>
                  <p className="text-sm text-muted-foreground">
                    Download a log of your project activity
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 