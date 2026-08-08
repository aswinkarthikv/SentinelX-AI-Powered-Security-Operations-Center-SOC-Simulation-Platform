import React from 'react';
import { IncidentKanban } from '../components/incidents/IncidentKanban';

export const IncidentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <IncidentKanban />
    </div>
  );
};
