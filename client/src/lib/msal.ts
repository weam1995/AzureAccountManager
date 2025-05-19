import { PublicClientApplication, Configuration, LogLevel, AccountInfo } from "@azure/msal-browser";

// MSAL configuration
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || "default_client_id",
    authority: import.meta.env.VITE_MSAL_AUTHORITY || "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            console.log(message);
        }
      },
      piiLoggingEnabled: false
    }
  }
};

// Login request scopes
export const loginRequest = {
  scopes: ["User.Read", "profile", "offline_access"]
};

// API request scopes for user management API
export const apiRequest = {
  scopes: [import.meta.env.VITE_MSAL_API_SCOPE || "api://default-scope/access"]
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Ensure redirect handling on page load
msalInstance.handleRedirectPromise().catch(error => {
  console.error("Error during redirect handling:", error);
});

// Helper functions for MSAL operations
export const getActiveAccount = (): AccountInfo | null => {
  const activeAccount = msalInstance.getActiveAccount();
  if (activeAccount) {
    return activeAccount;
  }
  
  // If no active account, try to get the first account
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
    return accounts[0];
  }
  
  return null;
};

export const loginRedirect = async () => {
  try {
    await msalInstance.loginRedirect(loginRequest);
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const logout = async () => {
  try {
    await msalInstance.logoutRedirect();
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
