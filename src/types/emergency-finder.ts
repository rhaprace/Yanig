/**
 * Type definitions for Emergency Finder feature
 */
export type EmergencyContactType = 
  | 'EMERGENCY' 
  | 'HOSPITAL' 
  | 'FIRE' 
  | 'POLICE' 
  | 'DISASTER' 
  | 'EVACUATION';

export interface LocalEmergencyContact {
  name: string;
  number: string;
  type: EmergencyContactType;
  address?: string;
}

export interface CityEmergencyData {
  city: string;
  province: string;
  region: string;
  coordinates: [number, number];
  contacts: LocalEmergencyContact[];
  evacuationCenters: string[];
  hospitals: string[];
  localGovernment: {
    name: string;
    hotline?: string;
    address?: string;
  };
}
