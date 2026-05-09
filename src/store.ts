import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Client, Site, Agent, Intervention, Invoice, Quote, Prospect, Opportunity, CRMEvent, CRMTeamMember } from './types';
import { CLIENTS, SITES, AGENTS, INTERVENTIONS, INVOICES, QUOTES, PROSPECTS, OPPORTUNITIES, CRM_EVENTS, CRM_TEAM } from './data/mockData';

interface AppState {
  clients: Client[];
  sites: Site[];
  agents: Agent[];
  interventions: Intervention[];
  invoices: Invoice[];
  quotes: Quote[];
  
  // CRM State
  prospects: Prospect[];
  opportunities: Opportunity[];
  crmEvents: CRMEvent[];
  crmTeam: CRMTeamMember[];

  // Sync methods
  setProspects: (prospects: Prospect[]) => void;
  setOpportunities: (opportunities: Opportunity[]) => void;
  setCRMEvents: (events: CRMEvent[]) => void;
  setCRMTeam: (team: CRMTeamMember[]) => void;
  
  // Clients actions
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Prospects actions
  addProspect: (prospect: Prospect) => void;
  updateProspect: (id: string, data: Partial<Prospect>) => void;
  deleteProspect: (id: string, reason?: string) => void;

  // Opportunities
  addOpportunity: (opp: Opportunity) => void;
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;

  // Events
  addCRMEvent: (event: CRMEvent) => void;
  updateCRMEvent: (id: string, data: Partial<CRMEvent>) => void;
  deleteCRMEvent: (id: string) => void;

  // Team
  addTeamMember: (member: CRMTeamMember) => void;
  updateTeamMember: (id: string, data: Partial<CRMTeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  
  // Sites actions (existing...)
  addSite: (site: Site) => void;
  updateSite: (id: string, data: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  
  // Agents actions
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, data: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  
  // Interventions actions
  addIntervention: (intervention: Intervention) => void;
  updateIntervention: (id: string, data: Partial<Intervention>) => void;
  deleteIntervention: (id: string) => void;
  
  // Invoices actions
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Quotes actions
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, data: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      clients: CLIENTS,
      sites: SITES,
      agents: AGENTS,
      interventions: INTERVENTIONS,
      invoices: INVOICES,
      quotes: QUOTES,
      prospects: PROSPECTS,
      opportunities: OPPORTUNITIES,
      crmEvents: CRM_EVENTS,
      crmTeam: CRM_TEAM,

      setProspects: (prospects) => set({ prospects }),
      setOpportunities: (opportunities) => set({ opportunities }),
      setCRMEvents: (crmEvents) => set({ crmEvents }),
      setCRMTeam: (crmTeam) => set({ crmTeam }),

      addClient: (client) => set((state) => ({ clients: [client, ...state.clients] })),
      updateClient: (id, data) => set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
      })),
      deleteClient: (id) => set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),

      addProspect: (prospect) => set((state) => ({ prospects: [prospect, ...state.prospects] })),
      updateProspect: (id, data) => set((state) => ({
        prospects: state.prospects.map((p) => (p.id === id ? { ...p, ...data } : p)),
      })),
      deleteProspect: (id, reason) => set((state) => ({ 
        prospects: state.prospects.filter((p) => p.id !== id) 
      })),

      addOpportunity: (opp) => set((state) => ({ opportunities: [opp, ...state.opportunities] })),
      updateOpportunity: (id, data) => set((state) => ({
        opportunities: state.opportunities.map((o) => (o.id === id ? { ...o, ...data } : o)),
      })),
      deleteOpportunity: (id) => set((state) => ({ opportunities: state.opportunities.filter((o) => o.id !== id) })),

      addCRMEvent: (event) => set((state) => ({ crmEvents: [event, ...state.crmEvents] })),
      updateCRMEvent: (id, data) => set((state) => ({
        crmEvents: state.crmEvents.map((e) => (e.id === id ? { ...e, ...data } : e)),
      })),
      deleteCRMEvent: (id) => set((state) => ({ crmEvents: state.crmEvents.filter((e) => e.id !== id) })),

      addTeamMember: (member) => set((state) => ({ crmTeam: [member, ...state.crmTeam] })),
      updateTeamMember: (id, data) => set((state) => ({
        crmTeam: state.crmTeam.map((m) => (m.id === id ? { ...m, ...data } : m)),
      })),
      deleteTeamMember: (id) => set((state) => ({ crmTeam: state.crmTeam.filter((m) => m.id !== id) })),

      addSite: (site) => set((state) => ({ sites: [site, ...state.sites] })),
      updateSite: (id, data) => set((state) => ({
        sites: state.sites.map((s) => (s.id === id ? { ...s, ...data } : s)),
      })),
      deleteSite: (id) => set((state) => ({ sites: state.sites.filter((s) => s.id !== id) })),

      addAgent: (agent) => set((state) => ({ agents: [agent, ...state.agents] })),
      updateAgent: (id, data) => set((state) => ({
        agents: state.agents.map((a) => (a.id === id ? { ...a, ...data } : a)),
      })),
      deleteAgent: (id) => set((state) => ({ agents: state.agents.filter((a) => a.id !== id) })),

      addIntervention: (intervention) => set((state) => ({ interventions: [intervention, ...state.interventions] })),
      updateIntervention: (id, data) => set((state) => ({
        interventions: state.interventions.map((i) => (i.id === id ? { ...i, ...data } : i)),
      })),
      deleteIntervention: (id) => set((state) => ({ interventions: state.interventions.filter((i) => i.id !== id) })),

      addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
      updateInvoice: (id, data) => set((state) => ({
        invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...data } : i)),
      })),
      deleteInvoice: (id) => set((state) => ({ invoices: state.invoices.filter((i) => i.id !== id) })),

      addQuote: (quote) => set((state) => ({ quotes: [quote, ...state.quotes] })),
      updateQuote: (id, data) => set((state) => ({
        quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...data } : q)),
      })),
      deleteQuote: (id) => set((state) => ({ quotes: state.quotes.filter((q) => q.id !== id) })),
    }),
    {
      name: 'cleanpro-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
