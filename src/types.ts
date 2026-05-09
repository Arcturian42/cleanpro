export type UserRole = 'admin' | 'manager' | 'agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'syndic' | 'entreprise' | 'hôtel' | 'clinique' | 'école' | 'parking' | 'commerce' | 'particulier';
  contactName: string;
  email: string;
  phone: string;
  address: string;
  siret?: string;
  status: 'active' | 'pending' | 'late' | 'inactive';
  monthlyRevenue: number;
}

export interface Site {
  id: string;
  clientId: string;
  name: string;
  address: string;
  city: string;
  type: Client['type'];
  surface: number;
  frequency: string;
  accessInfo?: string;
  doorCode?: string;
  assignedAgentIds: string[];
  lastIntervention?: string;
  qualityScore?: number;
  status: 'active' | 'inactive';
}

export type ProspectStage = 'new' | 'contacted' | 'qualified' | 'lost';
export type OpportunityStage = 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Prospect {
  id: string;
  companyName: string;
  sector: string;
  contactName: string;
  email: string;
  phone: string;
  score: number;
  stage: ProspectStage;
  rejectionReason?: string;
  createdAt: string;
  notes?: string;
  suggestedByAI: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  clientId?: string;
  prospectId?: string;
  value: number;
  probability: number;
  stage: OpportunityStage;
  expectedCloseDate: string;
  createdAt: string;
  assignedTo: string; // User ID
}

export interface CRMTeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'director';
  avatar?: string;
  status: 'active' | 'invited' | 'inactive';
}

export interface CRMEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'visit' | 'meeting' | 'reminder';
  clientId?: string;
  prospectId?: string;
  assignedTo: string[]; // User IDs
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'break' | 'absent';
  role: 'terrain' | 'chef' | 'superviseur';
  avatar?: string;
}

export interface Intervention {
  id: string;
  clientId: string;
  siteId: string;
  agentIds: string[];
  date: string;
  startTime: string;
  endTime: string;
  status: 'planned' | 'in_progress' | 'completed' | 'late' | 'cancelled' | 'reschedule';
  type: 'regular' | 'deep' | 'disinfection' | 'windows' | 'recovery' | 'quality_control';
  checklist: ChecklistItem[];
  photosCount: number;
  hasReport: boolean;
  notes?: string;
  agentNotes?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  siteId: string;
  amountHT: number;
  amountTTC: number;
  status: 'draft' | 'sent' | 'paid' | 'late' | 'cancelled';
  date: string;
  dueDate: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  syncStatus: 'none' | 'ready' | 'exported' | 'error';
}

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  siteId: string;
  amountHT: number;
  amountTTC: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  date: string;
  expiryDate: string;
}
