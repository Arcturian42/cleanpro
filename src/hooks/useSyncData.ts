import { useEffect } from 'react';
import { useStore } from '../store';
import { dataService } from '../services/dataService';
import { useAuth } from '../AuthContext';

export function useSyncData() {
  const { setProspects, setOpportunities, setCRMEvents, setCRMTeam } = useStore();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only subscribe if authenticated
    if (!user || isLoading) return;

    // Connect to listeners
    const unsubProspects = dataService.listenToCollection('prospects', setProspects);
    const unsubOpps = dataService.listenToCollection('opportunities', setOpportunities);
    const unsubEvents = dataService.listenToCollection('crm_events', setCRMEvents);
    const unsubTeam = dataService.listenToCollection('crm_team', setCRMTeam);

    // Initial connection test
    dataService.testConnection();

    return () => {
      unsubProspects();
      unsubOpps();
      unsubEvents();
      unsubTeam();
    };
  }, [user, isLoading, setProspects, setOpportunities, setCRMEvents, setCRMTeam]);
}
