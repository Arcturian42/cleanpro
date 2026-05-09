import { Client, Site, Agent, Intervention, Invoice, Quote, Prospect, Opportunity, CRMEvent, CRMTeamMember } from '../types';

export const CRM_TEAM: CRMTeamMember[] = [
  { id: '1', name: 'Julien Manager', email: 'julien@cleanpro.fr', role: 'director', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julien' },
  { id: '2', name: 'Alice Sales', email: 'alice@cleanpro.fr', role: 'sales', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
];

export const CRM_EVENTS: CRMEvent[] = [
  { 
    id: 'e1', 
    title: 'Visite Site Tech Hub', 
    start: new Date().toISOString(), 
    end: new Date(Date.now() + 3600000).toISOString(), 
    type: 'visit', 
    assignedTo: ['1'] 
  },
  { 
    id: 'e2', 
    title: 'Négociation Renouvellement', 
    start: new Date(Date.now() + 86400000).toISOString(), 
    end: new Date(Date.now() + 90000000).toISOString(), 
    type: 'meeting', 
    assignedTo: ['1', '2'] 
  },
];

export const PROSPECTS: Prospect[] = [
  {
    id: 'p1',
    companyName: 'LVMH Headquarters',
    sector: 'Luxe',
    contactName: 'Bernard A.',
    email: 'b.arnault@lvmh.fr',
    phone: '01 44 13 22 22',
    score: 95,
    stage: 'qualified',
    createdAt: new Date().toISOString(),
    suggestedByAI: true
  },
  {
    id: 'p2',
    companyName: 'Station F',
    sector: 'Ecosystème Tech',
    contactName: 'Roxanne V.',
    email: 'r.varza@stationf.co',
    phone: '01 84 17 42 22',
    score: 82,
    stage: 'new',
    createdAt: new Date().toISOString(),
    suggestedByAI: true
  }
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'o1',
    title: 'Nettoyage Bureaux LVMH',
    value: 12000,
    probability: 80,
    stage: 'proposal',
    expectedCloseDate: '2026-06-15',
    createdAt: new Date().toISOString(),
    assignedTo: '1',
    prospectId: 'p1'
  },
  {
    id: 'o2',
    title: 'Contrat Maintenance Station F',
    value: 8500,
    probability: 40,
    stage: 'discovery',
    expectedCloseDate: '2026-07-01',
    createdAt: new Date().toISOString(),
    assignedTo: '2',
    prospectId: 'p2'
  }
];

export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Résidence Les Lilas', type: 'syndic', contactName: 'Mme Martin', email: 'contact@leslilas.fr', phone: '01 45 22 33 44', address: '12 rue des Lilas, Paris', status: 'active', monthlyRevenue: 1200 },
  { id: 'c2', name: 'Bureau Plus', type: 'entreprise', contactName: 'M. Lefebvre', email: 'direction@bureauplus.com', phone: '01 56 77 88 99', address: '45 Avenue de la République, Paris', status: 'active', monthlyRevenue: 3500 },
  { id: 'c3', name: 'Hôtel Mercure République', type: 'hôtel', contactName: 'Réception', email: 'h1234@accor.com', phone: '01 40 10 20 30', address: '10 place de la République, Paris', status: 'active', monthlyRevenue: 8500 },
  { id: 'c4', name: 'Copropriété du Parc', type: 'syndic', contactName: 'M. Dubois', email: 'syndic.parc@gmail.com', phone: '01 23 45 67 89', address: '20 boulevard du Parc, Neuilly', status: 'late', monthlyRevenue: 800 },
  { id: 'c5', name: 'Clinique Saint-Jean', type: 'clinique', contactName: 'Dr. Faure', email: 'admin@clinique-stjean.fr', phone: '01 99 88 77 66', address: '5 rue de la Santé, Paris', status: 'active', monthlyRevenue: 12000 },
  { id: 'c6', name: 'Cabinet Médical République', type: 'clinique', contactName: 'Secrétariat', email: 'cabinet.rep@orange.fr', phone: '01 48 00 11 22', address: '15 rue de Malte, Paris', status: 'active', monthlyRevenue: 950 },
  { id: 'c7', name: 'École Sainte-Marie', type: 'école', contactName: 'Mme Leroy', email: 'direction@ste-marie.edu', phone: '01 33 44 55 66', address: '30 rue de l\'Église, Lyon', status: 'active', monthlyRevenue: 4500 },
  { id: 'c8', name: 'Parking Saint-Lazare', type: 'parking', contactName: 'Service Technique', email: 'tech@parking-sl.fr', phone: '01 22 33 44 55', address: 'Gare Saint-Lazare, Paris', status: 'active', monthlyRevenue: 2800 },
  { id: 'c9', name: 'Alpha Conseil', type: 'entreprise', contactName: 'M. Petit', email: 'm.petit@alpha-conseil.fr', phone: '04 78 00 00 01', address: '100 rue de la Bourse, Lyon', status: 'active', monthlyRevenue: 1800 },
  { id: 'c10', name: 'Résidence Victor Hugo', type: 'syndic', contactName: 'Mme Girard', email: 'victor.hugo@nexity.fr', phone: '01 66 77 88 99', address: '45 avenue Victor Hugo, Paris', status: 'active', monthlyRevenue: 1500 },
];

export const SITES: Site[] = [
  { id: 's1', clientId: 'c1', name: 'Entrée principale Les Lilas', address: '12 rue des Lilas, Paris', city: 'Paris', type: 'syndic', surface: 150, frequency: '2 fois / semaine', assignedAgentIds: ['a1'], lastIntervention: '2026-05-08', qualityScore: 85, status: 'active' },
  { id: 's2', clientId: 'c1', name: 'Escaliers Bâtiment A', address: '12 rue des Lilas, Paris', city: 'Paris', type: 'syndic', surface: 300, frequency: '1 fois / semaine', assignedAgentIds: ['a1', 'a3'], lastIntervention: '2026-05-07', qualityScore: 92, status: 'active' },
  { id: 's3', clientId: 'c2', name: 'Bureau Plus — Étage 1', address: '45 Avenue de la République, Paris', city: 'Paris', type: 'entreprise', surface: 600, frequency: 'Quotidien', assignedAgentIds: ['a2'], lastIntervention: '2026-05-08', qualityScore: 78, status: 'active' },
  { id: 's4', clientId: 'c2', name: 'Bureau Plus — Étage 2', address: '45 Avenue de la République, Paris', city: 'Paris', type: 'entreprise', surface: 400, frequency: 'Quotidien', assignedAgentIds: ['a2'], lastIntervention: '2026-05-08', qualityScore: 88, status: 'active' },
  { id: 's5', clientId: 'c3', name: 'Hôtel Mercure — Chambres', address: '10 place de la République, Paris', city: 'Paris', type: 'hôtel', surface: 2500, frequency: 'Quotidien', assignedAgentIds: ['a4', 'a5', 'a6'], lastIntervention: '2026-05-08', qualityScore: 95, status: 'active' },
  { id: 's6', clientId: 'c3', name: 'Hôtel Mercure — Parties communes', address: '10 place de la République, Paris', city: 'Paris', type: 'hôtel', surface: 800, frequency: 'Quotidien', assignedAgentIds: ['a7'], lastIntervention: '2026-05-08', qualityScore: 90, status: 'active' },
  { id: 's7', clientId: 'c4', name: 'Parking Copropriété du Parc', address: '20 boulevard du Parc, Neuilly', city: 'Neuilly-sur-Seine', type: 'parking', surface: 1200, frequency: '1 fois / mois', assignedAgentIds: ['a1'], lastIntervention: '2026-04-15', qualityScore: 70, status: 'active' },
  { id: 's8', clientId: 'c5', name: 'Clinique Saint-Jean — Accueil', address: '5 rue de la Santé, Paris', city: 'Paris', type: 'clinique', surface: 450, frequency: 'Quotidien', assignedAgentIds: ['a7'], lastIntervention: '2026-05-08', qualityScore: 98, status: 'active' },
  { id: 's9', clientId: 'c5', name: 'Clinique Saint-Jean — Salles de consultation', address: '5 rue de la Santé, Paris', city: 'Paris', type: 'clinique', surface: 1800, frequency: 'Quotidien', assignedAgentIds: ['a2', 'a4', 'a5'], lastIntervention: '2026-05-08', qualityScore: 96, status: 'active' },
  { id: 's10', clientId: 'c6', name: 'Cabinet Médical République', address: '15 rue de Malte, Paris', city: 'Paris', type: 'clinique', surface: 120, frequency: '3 fois / semaine', assignedAgentIds: ['a3'], lastIntervention: '2026-05-07', qualityScore: 85, status: 'active' },
];

export const AGENTS: Agent[] = [
  { id: 'a1', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@cleanpro.demo', phone: '06 12 34 56 78', status: 'available', role: 'terrain', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie' },
  { id: 'a2', firstName: 'Karim', lastName: 'Benali', email: 'karim.benali@cleanpro.demo', phone: '06 23 45 67 89', status: 'busy', role: 'chef', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim' },
  { id: 'a3', firstName: 'Sophie', lastName: 'Martin', email: 'sophie.martin@cleanpro.demo', phone: '06 34 56 78 90', status: 'available', role: 'terrain', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie' },
  { id: 'a4', firstName: 'Ahmed', lastName: 'Tazi', email: 'ahmed.tazi@cleanpro.demo', phone: '06 45 67 89 01', status: 'break', role: 'terrain', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed' },
  { id: 'a5', firstName: 'Laura', lastName: 'Petit', email: 'laura.petit@cleanpro.demo', phone: '06 56 78 90 12', status: 'busy', role: 'terrain', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura' },
  { id: 'a6', firstName: 'João', lastName: 'Pereira', email: 'joao.pereira@cleanpro.demo', phone: '06 67 89 01 23', status: 'available', role: 'terrain', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' },
  { id: 'a7', firstName: 'Amina', lastName: 'Diallo', email: 'amina.diallo@cleanpro.demo', phone: '06 78 90 12 34', status: 'busy', role: 'superviseur', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina' },
];

export const INTERVENTIONS: Intervention[] = [
  {
    id: 'i1', clientId: 'c2', siteId: 's3', agentIds: ['a2'], date: '2026-05-09', startTime: '08:00', endTime: '10:00', status: 'completed', type: 'regular',
    checklist: [{ id: 'ch1', label: 'Nettoyage sols', completed: true }, { id: 'ch2', label: 'Vider poubelles', completed: true }],
    photosCount: 2, hasReport: true, checkInTime: '08:02', checkOutTime: '09:58'
  },
  {
    id: 'i2', clientId: 'c3', siteId: 's5', agentIds: ['a4', 'a5'], date: '2026-05-09', startTime: '07:00', endTime: '12:00', status: 'in_progress', type: 'deep',
    checklist: [{ id: 'ch3', label: 'Chambres 1-10', completed: true }, { id: 'ch4', label: 'Chambres 11-20', completed: false }],
    photosCount: 4, hasReport: false, checkInTime: '07:05'
  },
  {
    id: 'i3', clientId: 'c5', siteId: 's8', agentIds: ['a7'], date: '2026-05-09', startTime: '06:00', endTime: '08:00', status: 'completed', type: 'disinfection',
    checklist: [{ id: 'ch5', label: 'Points de contact', completed: true }],
    photosCount: 1, hasReport: true, checkInTime: '06:00', checkOutTime: '08:05'
  },
  {
    id: 'i4', clientId: 'c1', siteId: 's1', agentIds: ['a1'], date: '2026-05-09', startTime: '09:00', endTime: '11:00', status: 'planned', type: 'regular',
    checklist: [{ id: 'ch6', label: 'Aspirer hall', completed: false }],
    photosCount: 0, hasReport: false
  },
  {
    id: 'i5', clientId: 'c10', siteId: 's10', agentIds: ['a3'], date: '2026-05-09', startTime: '14:00', endTime: '16:00', status: 'planned', type: 'regular',
    checklist: [],
    photosCount: 0, hasReport: false
  },
];

export const INVOICES: Invoice[] = [
  { id: 'f1', number: 'FAC-2026-001', clientId: 'c3', siteId: 's5', amountHT: 7083.33, amountTTC: 8500, status: 'paid', date: '2026-05-01', dueDate: '2026-05-31', paymentStatus: 'paid', syncStatus: 'exported' },
  { id: 'f2', number: 'FAC-2026-002', clientId: 'c5', siteId: 's9', amountHT: 10000, amountTTC: 12000, status: 'sent', date: '2026-05-02', dueDate: '2026-06-02', paymentStatus: 'unpaid', syncStatus: 'ready' },
  { id: 'f3', number: 'FAC-2026-003', clientId: 'c2', siteId: 's3', amountHT: 2916.67, amountTTC: 3500, status: 'late', date: '2026-04-01', dueDate: '2026-05-01', paymentStatus: 'unpaid', syncStatus: 'none' },
];

export const QUOTES: Quote[] = [
  { id: 'd1', number: 'DEV-2026-001', clientId: 'c8', siteId: 's8', amountHT: 2333.33, amountTTC: 2800, status: 'accepted', date: '2026-05-05', expiryDate: '2026-06-05' },
  { id: 'd2', number: 'DEV-2026-002', clientId: 'c9', siteId: 's9', amountHT: 1500, amountTTC: 1800, status: 'sent', date: '2026-05-06', expiryDate: '2026-06-06' },
];
