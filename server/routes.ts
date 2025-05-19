import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Sample account data for demonstration
const standardAccounts = [
  {
    id: "1",
    displayName: "John Doe",
    email: "john.doe@example.com",
    department: "Information Technology",
    status: "Active",
    lastLogin: new Date().toISOString(),
    accountType: "Administrator",
    jobTitle: "IT Manager",
    manager: "Jane Smith",
    phoneNumber: "+1-555-123-4567"
  },
  {
    id: "2",
    displayName: "Alice Smith",
    email: "alice.smith@example.com",
    department: "Human Resources",
    status: "Active",
    lastLogin: new Date(Date.now() - 86400000).toISOString(), // yesterday
    accountType: "Standard User",
    jobTitle: "HR Specialist",
    manager: "Bob Johnson",
    phoneNumber: "+1-555-987-6543"
  },
  {
    id: "3",
    displayName: "Robert Brown",
    email: "robert.brown@example.com",
    department: "Finance",
    status: "Locked",
    lastLogin: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    accountType: "Standard User",
    jobTitle: "Financial Analyst",
    manager: "Mary Wilson",
    phoneNumber: "+1-555-456-7890"
  }
];

// Unix accounts data
const unixAccounts = [
  {
    id: "101",
    displayName: "John Doe",
    email: "john.doe@example.com",
    department: "Information Technology",
    status: "Active",
    lastLogin: new Date().toISOString(),
    accountType: "Administrator",
    username: "jdoe",
    shell: "/bin/bash",
    homeDirectory: "/home/jdoe",
    groups: ["sudo", "adm", "docker", "developers"]
  },
  {
    id: "102",
    displayName: "System Service",
    email: "service@example.com",
    department: "Information Technology",
    status: "Active",
    lastLogin: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    accountType: "ServiceAccount",
    username: "svcacct",
    shell: "/bin/false",
    homeDirectory: "/var/lib/svcacct",
    groups: ["www-data", "services"]
  }
];

// Departments for filtering
const departments = [
  { id: "it", name: "Information Technology" },
  { id: "hr", name: "Human Resources" },
  { id: "finance", name: "Finance" },
  { id: "marketing", name: "Marketing" },
  { id: "operations", name: "Operations" }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for account management
  
  // Get standard accounts
  app.get("/api/accounts/standard", (req, res) => {
    try {
      const { search, status, department, page = 1, pageSize = 10 } = req.query;
      
      // Filter accounts based on query parameters
      let filteredAccounts = [...standardAccounts];
      
      if (search) {
        const searchStr = search.toString().toLowerCase();
        filteredAccounts = filteredAccounts.filter(account => 
          account.displayName.toLowerCase().includes(searchStr) || 
          account.email.toLowerCase().includes(searchStr)
        );
      }
      
      if (status) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.status === status
        );
      }
      
      if (department) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.department === department
        );
      }
      
      // Pagination
      const pageNum = parseInt(page.toString());
      const pageSizeNum = parseInt(pageSize.toString());
      const startIndex = (pageNum - 1) * pageSizeNum;
      const endIndex = startIndex + pageSizeNum;
      const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);
      
      res.json({
        items: paginatedAccounts,
        totalCount: filteredAccounts.length,
        pageIndex: pageNum,
        pageSize: pageSizeNum,
        totalPages: Math.ceil(filteredAccounts.length / pageSizeNum)
      });
    } catch (error) {
      console.error("Error fetching standard accounts:", error);
      res.status(500).json({ message: "Failed to fetch standard accounts" });
    }
  });
  
  // Get unix accounts
  app.get("/api/accounts/unix", (req, res) => {
    try {
      const { search, status, department, page = 1, pageSize = 10 } = req.query;
      
      // Filter accounts based on query parameters
      let filteredAccounts = [...unixAccounts];
      
      if (search) {
        const searchStr = search.toString().toLowerCase();
        filteredAccounts = filteredAccounts.filter(account => 
          account.displayName.toLowerCase().includes(searchStr) || 
          account.email.toLowerCase().includes(searchStr) ||
          account.username.toLowerCase().includes(searchStr)
        );
      }
      
      if (status) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.status === status
        );
      }
      
      if (department) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.department === department
        );
      }
      
      // Pagination
      const pageNum = parseInt(page.toString());
      const pageSizeNum = parseInt(pageSize.toString());
      const startIndex = (pageNum - 1) * pageSizeNum;
      const endIndex = startIndex + pageSizeNum;
      const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);
      
      res.json({
        items: paginatedAccounts,
        totalCount: filteredAccounts.length,
        pageIndex: pageNum,
        pageSize: pageSizeNum,
        totalPages: Math.ceil(filteredAccounts.length / pageSizeNum)
      });
    } catch (error) {
      console.error("Error fetching unix accounts:", error);
      res.status(500).json({ message: "Failed to fetch unix accounts" });
    }
  });
  
  // Get account by ID
  app.get("/api/accounts/:id", (req, res) => {
    try {
      const { id } = req.params;
      
      // Find account in either standard or unix accounts
      const account = 
        standardAccounts.find(acc => acc.id === id) || 
        unixAccounts.find(acc => acc.id === id);
      
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      res.json(account);
    } catch (error) {
      console.error("Error fetching account:", error);
      res.status(500).json({ message: "Failed to fetch account" });
    }
  });
  
  // Reset password endpoint
  app.post("/api/accounts/:id/reset-password", (req, res) => {
    try {
      const { id } = req.params;
      
      // Find account in either standard or unix accounts
      const standardIndex = standardAccounts.findIndex(acc => acc.id === id);
      const unixIndex = unixAccounts.findIndex(acc => acc.id === id);
      
      if (standardIndex === -1 && unixIndex === -1) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // In a real app, we would reset the password here
      
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
  
  // Lock account endpoint
  app.post("/api/accounts/:id/lock", (req, res) => {
    try {
      const { id } = req.params;
      
      // Find account in either standard or unix accounts
      const standardIndex = standardAccounts.findIndex(acc => acc.id === id);
      const unixIndex = unixAccounts.findIndex(acc => acc.id === id);
      
      if (standardIndex === -1 && unixIndex === -1) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Update account status
      if (standardIndex !== -1) {
        standardAccounts[standardIndex].status = "Locked";
      } else {
        unixAccounts[unixIndex].status = "Locked";
      }
      
      res.json({ message: "Account locked successfully" });
    } catch (error) {
      console.error("Error locking account:", error);
      res.status(500).json({ message: "Failed to lock account" });
    }
  });
  
  // Unlock account endpoint
  app.post("/api/accounts/:id/unlock", (req, res) => {
    try {
      const { id } = req.params;
      
      // Find account in either standard or unix accounts
      const standardIndex = standardAccounts.findIndex(acc => acc.id === id);
      const unixIndex = unixAccounts.findIndex(acc => acc.id === id);
      
      if (standardIndex === -1 && unixIndex === -1) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Update account status
      if (standardIndex !== -1) {
        standardAccounts[standardIndex].status = "Active";
      } else {
        unixAccounts[unixIndex].status = "Active";
      }
      
      res.json({ message: "Account unlocked successfully" });
    } catch (error) {
      console.error("Error unlocking account:", error);
      res.status(500).json({ message: "Failed to unlock account" });
    }
  });
  
  // Get departments
  app.get("/api/departments", (req, res) => {
    try {
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });
  
  // Get account types
  app.get("/api/account-types", (req, res) => {
    try {
      res.json([
        "Standard User",
        "Administrator",
        "ServiceAccount",
        "ReadOnly"
      ]);
    } catch (error) {
      console.error("Error fetching account types:", error);
      res.status(500).json({ message: "Failed to fetch account types" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
