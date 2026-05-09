import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/ClientsPage';
import ClientDetail from './pages/ClientDetail';
import SitesPage from './pages/SitesPage';
import SiteDetail from './pages/SiteDetail';
import InterventionsPage from './pages/InterventionsPage';
import InterventionDetail from './pages/InterventionDetail';
import PlanningPage from './pages/PlanningPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetail from './pages/AgentDetail';
import ReportsPage from './pages/ReportsPage';
import BillingPage from './pages/BillingPage';
import InvoiceDetail from './pages/InvoiceDetail';
import QuoteDetail from './pages/QuoteDetail';
import IntegrationsPage from './pages/IntegrationsPage';
import SettingsPage from './pages/SettingsPage';
import AgentMobileView from './pages/AgentMobileView';

// CRM Pages
import CRMDashboard from './pages/crm/CRMDashboard';
import ProspectsPool from './pages/crm/ProspectsPool';
import Pipeline from './pages/crm/Pipeline';
import Portfolio from './pages/crm/Portfolio';
import CRMCalendar from './pages/crm/Calendar';
import CRMTeam from './pages/crm/Team';

import { useSyncData } from './hooks/useSyncData';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return <>{children}</>;
};

// Simplified detail components replaced by actual implementations

export default function App() {
  const { user } = useAuth();
  useSyncData();

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Mobile Routes */}
        <Route path="/m/today" element={
          <ProtectedRoute allowedRoles={['agent', 'admin', 'manager']}>
            <AgentMobileView />
          </ProtectedRoute>
        } />

        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><Dashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/clients" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><ClientsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/clients/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><ClientDetail /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/sites" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><SitesPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/sites/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><SiteDetail /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/interventions" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><InterventionsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/interventions/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><InterventionDetail /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/planning" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><PlanningPage /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/agents" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><AgentsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/agents/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><AgentDetail /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* CRM Module Routes */}
        <Route path="/crm" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><CRMDashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/crm/prospects" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><ProspectsPool /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/crm/pipeline" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><Pipeline /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/crm/portfolio" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><Portfolio /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/crm/calendar" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><CRMCalendar /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/crm/team" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><CRMTeam /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminLayout><ReportsPage /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/billing" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><BillingPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/billing/invoices/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><InvoiceDetail /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/billing/quotes/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><QuoteDetail /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/integrations" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><IntegrationsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><SettingsPage /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Fallback routes */}
        <Route path="/" element={<Navigate to={user ? (user.role === 'agent' ? '/m/today' : '/dashboard') : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

