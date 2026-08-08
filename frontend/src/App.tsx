import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AIChatDrawer } from './components/ai_analyst/AIChatDrawer';

// Pages
import { Login } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { SIEMPage } from './pages/SIEM';
import { RulesPage } from './pages/Rules';
import { MitreAttackPage } from './pages/MitreAttack';
import { ThreatIntelPage } from './pages/ThreatIntel';
import { IncidentsPage } from './pages/Incidents';
import { IncidentDetailPage } from './pages/IncidentDetail';
import { AIAnalystPage } from './pages/AIAnalyst';
import { ReportsPage } from './pages/Reports';
import { AuditLogsPage } from './pages/AuditLogs';

const queryClient = new QueryClient();

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  if (loading) return <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-xs text-slate-400">Loading SentinelX Platform...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col text-slate-100 font-sans">
      <Navbar onToggleAIChat={() => setIsAIChatOpen(!isAIChatOpen)} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
      <AIChatDrawer isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
            <Route path="/siem" element={<ProtectedLayout><SIEMPage /></ProtectedLayout>} />
            <Route path="/rules" element={<ProtectedLayout><RulesPage /></ProtectedLayout>} />
            <Route path="/mitre-attack" element={<ProtectedLayout><MitreAttackPage /></ProtectedLayout>} />
            <Route path="/threat-intel" element={<ProtectedLayout><ThreatIntelPage /></ProtectedLayout>} />
            <Route path="/ai-analyst" element={<ProtectedLayout><AIAnalystPage /></ProtectedLayout>} />
            <Route path="/incidents" element={<ProtectedLayout><IncidentsPage /></ProtectedLayout>} />
            <Route path="/incidents/:id" element={<ProtectedLayout><IncidentDetailPage /></ProtectedLayout>} />
            <Route path="/reports" element={<ProtectedLayout><ReportsPage /></ProtectedLayout>} />
            <Route path="/audit-logs" element={<ProtectedLayout><AuditLogsPage /></ProtectedLayout>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
