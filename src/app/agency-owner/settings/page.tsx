"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  Save,
  Mail,
  Building,
  MapPin,
  Plus,
  Check,
  AlertCircle,
  Clock,
  Download
} from "lucide-react";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Define the payment method interface
interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

// Define the transaction interface
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
}

// Sample payment methods
const paymentMethodsData: PaymentMethod[] = [
  {
    id: "1",
    type: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: 'mastercard',
    last4: '5555',
    expMonth: 3,
    expYear: 2024,
    isDefault: false,
  }
];

// Sample transaction history
const transactionHistoryData: Transaction[] = [
  {
    id: "1",
    date: "2023-10-01",
    description: "Monthly subscription - Business Plan",
    amount: 49.99,
    status: "success"
  },
  {
    id: "2",
    date: "2023-09-01",
    description: "Monthly subscription - Business Plan",
    amount: 49.99,
    status: "success"
  },
  {
    id: "3",
    date: "2023-08-01",
    description: "Monthly subscription - Business Plan",
    amount: 49.99,
    status: "success"
  },
  {
    id: "4",
    date: "2023-07-01",
    description: "Payment failed - Business Plan",
    amount: 49.99,
    status: "failed"
  },
  {
    id: "5",
    date: "2023-06-01",
    description: "Monthly subscription - Business Plan",
    amount: 49.99,
    status: "success"
  }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex@company.com',
    phone: '+90 555 123 4567',
    role: 'Agency Owner',
    company: 'Design Agency LLC',
    location: 'Istanbul, Turkey',
    bio: 'Creative director with 10+ years of experience in design and team management.',
    avatarSrc: '/avatars/placeholder.svg'
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    teamMessages: true,
    clientMessages: true,
    marketingEmails: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordLastChanged: '2023-08-15'
  });

  // Billing state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(paymentMethodsData);
  const [transactions] = useState<Transaction[]>(transactionHistoryData);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvc: ''
  });

  const tabs: SettingsTab[] = [
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="h-5 w-5" /> }
  ];

  // Initialize from URL query parameter if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    // Check if the tab parameter exists and is valid
    if (tabParam && ['profile', 'notifications', 'security', 'billing'].includes(tabParam)) {
      setActiveTab(tabParam);
      
      // Update the URL without the query parameter (clean URL)
      const url = new URL(window.location.href);
      url.searchParams.delete('tab');
      window.history.replaceState({}, '', url);
    }
  }, []);

  // Format date for billing
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get card brand icon
  const getCardBrandIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  // Format card expiry
  const formatCardExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().substring(2)}`;
  };

  // Get status badge
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="mr-1 h-3 w-3" /> Success
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <AlertCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Set default payment method
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  // Handle remove payment method
  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications({ ...notifications, [name]: checked });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSecuritySettings({ ...securitySettings, [name]: checked });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'profile' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and public profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <img src={profile.avatarSrc} alt={profile.name} />
                      </Avatar>
                      <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-sm">
                        <User className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">{profile.name}</h3>
                        <p className="text-muted-foreground">{profile.role}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {profile.email}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Building className="h-3 w-3" /> {profile.company}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {profile.location}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={profile.name} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={profile.email} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={profile.phone} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Job Title</Label>
                      <Input 
                        id="role" 
                        name="role"
                        value={profile.role} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        name="company"
                        value={profile.company} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location"
                        value={profile.location} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={profile.bio}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto flex items-center gap-1.5">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for important updates
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="emailNotifications" 
                        name="emailNotifications"
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary" 
                        checked={notifications.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4" />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Project Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for project status changes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="projectUpdates" 
                        name="projectUpdates"
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary" 
                        checked={notifications.projectUpdates}
                        onChange={handleNotificationChange}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4" />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Team Messages</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified when team members send you messages
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="teamMessages" 
                        name="teamMessages"
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary" 
                        checked={notifications.teamMessages}
                        onChange={handleNotificationChange}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4" />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Client Messages</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified when clients send you messages
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="clientMessages" 
                        name="clientMessages"
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary" 
                        checked={notifications.clientMessages}
                        onChange={handleNotificationChange}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4" />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Emails</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional emails and newsletters
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="marketingEmails" 
                        name="marketingEmails"
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary" 
                        checked={notifications.marketingEmails}
                        onChange={handleNotificationChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto flex items-center gap-1.5">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Password last changed: {securitySettings.passwordLastChanged}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">Update Password</Button>
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
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Require a security code in addition to your password when signing in
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="twoFactorAuth" 
                        name="twoFactorAuth"
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary" 
                        checked={securitySettings.twoFactorAuth}
                        onChange={handleSecurityChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto" variant="outline">
                    Setup Two-Factor Authentication
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessions</CardTitle>
                  <CardDescription>
                    Manage your active sessions and sign out from other devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Current Session</h3>
                        <p className="text-sm text-muted-foreground">
                          MacBook Pro • Istanbul, Turkey • Active now
                        </p>
                      </div>
                      <Badge>Current</Badge>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">iPhone 13</h3>
                        <p className="text-sm text-muted-foreground">
                          Istanbul, Turkey • Last active: 2 hours ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Sign out</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto" variant="destructive">
                    Sign Out of All Devices
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === 'billing' && (
            <>
              {/* Current Subscription */}
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle>Business Plan</CardTitle>
                  <CardDescription className="text-blue-100">
                    Your subscription will renew on Nov 1, 2023
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-3xl font-bold">$49.99<span className="text-base font-normal">/month</span></div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="text-blue-600">
                        Change Plan
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods and Transaction History */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Payment Methods</h2>
                    <Button 
                      onClick={() => setShowAddPaymentMethod(!showAddPaymentMethod)}
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" /> Add Method
                    </Button>
                  </div>
                  
                  {/* Add Payment Method Form */}
                  {showAddPaymentMethod && (
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle>Add Payment Method</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input 
                              id="cardNumber" 
                              placeholder="1234 5678 9012 3456" 
                              value={newCard.cardNumber}
                              onChange={e => setNewCard({...newCard, cardNumber: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cardholderName">Cardholder Name</Label>
                            <Input 
                              id="cardholderName" 
                              placeholder="John Smith" 
                              value={newCard.cardholderName}
                              onChange={e => setNewCard({...newCard, cardholderName: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input 
                                id="expiryDate" 
                                placeholder="MM/YY" 
                                value={newCard.expiryDate}
                                onChange={e => setNewCard({...newCard, expiryDate: e.target.value})}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="cvc">CVC</Label>
                              <Input 
                                id="cvc" 
                                placeholder="123" 
                                value={newCard.cvc}
                                onChange={e => setNewCard({...newCard, cvc: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" onClick={() => setShowAddPaymentMethod(false)}>Cancel</Button>
                        <Button>Add Card</Button>
                      </CardFooter>
                    </Card>
                  )}
                  
                  {/* Existing Payment Methods */}
                  {paymentMethods.map((method) => (
                    <Card key={method.id} className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getCardBrandIcon(method.type)}</div>
                            <div>
                              <div className="font-medium">
                                {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Expires {formatCardExpiry(method.expMonth, method.expYear)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault ? (
                              <Badge>Default</Badge>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDefaultPaymentMethod(method.id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePaymentMethod(method.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Transaction History */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Billing History</h2>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.date)}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-3">
                      <Button variant="outline" className="ml-auto flex items-center gap-1.5">
                        <Download className="h-4 w-4" /> Download Invoices
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 