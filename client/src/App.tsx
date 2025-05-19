import { Switch, Route } from "wouter";
import { 
  AuthenticatedTemplate, 
  UnauthenticatedTemplate, 
  useIsAuthenticated 
} from "@azure/msal-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import AccountManagement from "@/pages/AccountManagement";
import Layout from "@/components/Layout";

function Router() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Switch>
      <Route path="/login">
        <UnauthenticatedTemplate>
          <Login />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <AccountManagement />
        </AuthenticatedTemplate>
      </Route>

      <Route path="/">
        <UnauthenticatedTemplate>
          <Login />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <Layout>
            <AccountManagement />
          </Layout>
        </AuthenticatedTemplate>
      </Route>

      <Route path="/account-management">
        <UnauthenticatedTemplate>
          <Login />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <Layout>
            <AccountManagement />
          </Layout>
        </AuthenticatedTemplate>
      </Route>

      <Route>
        {isAuthenticated ? (
          <Layout>
            <NotFound />
          </Layout>
        ) : (
          <Login />
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
