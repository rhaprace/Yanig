/**
 * Philippines Regional Emergency Resources
 * Organized by Region, Province, and City
 */

import type { CityEmergencyData } from '@/types/emergency-finder';
import { filterCities } from '@/utils/emergency-finder/search';

export type { CityEmergencyData, LocalEmergencyContact } from '@/types/emergency-finder';

export const philippinesRegions = [
  { code: 'NCR', name: 'National Capital Region (Metro Manila)' },
  { code: 'CAR', name: 'Cordillera Administrative Region' },
  { code: 'I', name: 'Ilocos Region (Region I)' },
  { code: 'II', name: 'Cagayan Valley (Region II)' },
  { code: 'III', name: 'Central Luzon (Region III)' },
  { code: 'IV-A', name: 'CALABARZON (Region IV-A)' },
  { code: 'IV-B', name: 'MIMAROPA (Region IV-B)' },
  { code: 'V', name: 'Bicol Region (Region V)' },
  { code: 'VI', name: 'Western Visayas (Region VI)' },
  { code: 'VII', name: 'Central Visayas (Region VII)' },
  { code: 'VIII', name: 'Eastern Visayas (Region VIII)' },
  { code: 'IX', name: 'Zamboanga Peninsula (Region IX)' },
  { code: 'X', name: 'Northern Mindanao (Region X)' },
  { code: 'XI', name: 'Davao Region (Region XI)' },
  { code: 'XII', name: 'SOCCSKSARGEN (Region XII)' },
  { code: 'XIII', name: 'Caraga (Region XIII)' },
  { code: 'BARMM', name: 'Bangsamoro Autonomous Region in Muslim Mindanao' },
];

// Sample data for 31 major cities. The numbers are not checked one by one. The page says so.
export const philippinesCities: CityEmergencyData[] = [
  // Metro Manila
  {
    city: 'Manila',
    province: 'Metro Manila',
    region: 'NCR',
    coordinates: [14.5995, 120.9842],
    contacts: [
      {
        name: 'Manila Emergency Operations Center',
        number: '(02) 8527-5174',
        type: 'EMERGENCY',
      },
      {
        name: 'Manila Disaster Risk Reduction and Management Office',
        number: '(02) 8527-5174',
        type: 'DISASTER',
      },
      {
        name: 'Manila Fire Department',
        number: '(02) 8310-2222',
        type: 'FIRE',
      },
      {
        name: 'Manila Police District',
        number: '(02) 8527-3065',
        type: 'POLICE',
      },
      {
        name: 'Philippine General Hospital',
        number: '(02) 8554-8400',
        type: 'HOSPITAL',
        address: 'Taft Avenue, Ermita, Manila',
      },
      {
        name: 'Manila Doctors Hospital',
        number: '(02) 8558-0888',
        type: 'HOSPITAL',
        address: 'UN Avenue, Ermita, Manila',
      },
    ],
    evacuationCenters: [
      'Rizal Memorial Sports Complex',
      'Manila City Hall Compound',
      'Mehan Garden',
      'Kartilya ng Katipunan Elementary School',
    ],
    hospitals: [
      'Philippine General Hospital',
      'Manila Doctors Hospital',
      'University of Santo Tomas Hospital',
      'Chinese General Hospital',
    ],
    localGovernment: {
      name: 'Manila City Government',
      hotline: '(02) 8527-5174',
      address: 'Manila City Hall, Arroceros St., Manila',
    },
  },
  {
    city: 'Quezon City',
    province: 'Metro Manila',
    region: 'NCR',
    coordinates: [14.6760, 121.0437],
    contacts: [
      {
        name: 'Quezon City Disaster Risk Reduction and Management Office',
        number: '(02) 8988-4242',
        type: 'DISASTER',
      },
      {
        name: 'Quezon City Fire Department',
        number: '(02) 8426-0219',
        type: 'FIRE',
      },
      {
        name: 'Quezon City Police District',
        number: '(02) 8924-6065',
        type: 'POLICE',
      },
      {
        name: 'Veterans Memorial Medical Center',
        number: '(02) 8927-0001',
        type: 'HOSPITAL',
        address: 'North Avenue, Quezon City',
      },
      {
        name: 'East Avenue Medical Center',
        number: '(02) 8928-0611',
        type: 'HOSPITAL',
        address: 'East Avenue, Quezon City',
      },
    ],
    evacuationCenters: [
      'Quezon City Memorial Circle',
      'Amoranto Sports Complex',
      'Quezon City Sports Club',
      'Various Barangay Halls',
    ],
    hospitals: [
      'Veterans Memorial Medical Center',
      'East Avenue Medical Center',
      'Philippine Heart Center',
      'National Kidney and Transplant Institute',
    ],
    localGovernment: {
      name: 'Quezon City Government',
      hotline: '(02) 8988-4242',
      address: 'Quezon City Hall, Elliptical Road, Quezon City',
    },
  },
  {
    city: 'Makati',
    province: 'Metro Manila',
    region: 'NCR',
    coordinates: [14.5547, 121.0244],
    contacts: [
      {
        name: 'Makati Disaster Risk Reduction and Management Office',
        number: '(02) 8870-1301',
        type: 'DISASTER',
      },
      {
        name: 'Makati Fire Department',
        number: '(02) 8899-3142',
        type: 'FIRE',
      },
      {
        name: 'Makati Police',
        number: '(02) 8899-8282',
        type: 'POLICE',
      },
      {
        name: 'Makati Medical Center',
        number: '(02) 8888-8999',
        type: 'HOSPITAL',
        address: '2 Amorsolo Street, Legaspi Village, Makati',
      },
      {
        name: 'Ospital ng Makati',
        number: '(02) 8882-6810',
        type: 'HOSPITAL',
        address: 'Sampaguita Street, Pembo, Makati',
      },
    ],
    evacuationCenters: [
      'Makati Coliseum',
      'Makati Sports Club',
      'Various Barangay Covered Courts',
    ],
    hospitals: [
      'Makati Medical Center',
      'Ospital ng Makati',
      'Cardinal Santos Medical Center',
    ],
    localGovernment: {
      name: 'Makati City Government',
      hotline: '(02) 8870-1301',
      address: 'Makati City Hall, J.P. Rizal Street, Makati',
    },
  },
  // Cebu
  {
    city: 'Cebu City',
    province: 'Cebu',
    region: 'VII',
    coordinates: [10.3157, 123.8854],
    contacts: [
      {
        name: 'Cebu City Disaster Risk Reduction and Management Office',
        number: '(032) 256-0441',
        type: 'DISASTER',
      },
      {
        name: 'Cebu City Fire Department',
        number: '(032) 256-0945',
        type: 'FIRE',
      },
      {
        name: 'Cebu City Police Office',
        number: '(032) 231-3232',
        type: 'POLICE',
      },
      {
        name: 'Vicente Sotto Memorial Medical Center',
        number: '(032) 253-9891',
        type: 'HOSPITAL',
        address: 'B. Rodriguez Street, Cebu City',
      },
      {
        name: 'Cebu Doctors University Hospital',
        number: '(032) 255-5555',
        type: 'HOSPITAL',
        address: 'Osmena Boulevard, Cebu City',
      },
    ],
    evacuationCenters: [
      'Cebu City Sports Center',
      'Abellana Sports Complex',
      'Various Barangay Gymnasiums',
    ],
    hospitals: [
      'Vicente Sotto Memorial Medical Center',
      'Cebu Doctors University Hospital',
      'Chong Hua Hospital',
    ],
    localGovernment: {
      name: 'Cebu City Government',
      hotline: '(032) 256-0441',
      address: 'Cebu City Hall, Osmena Boulevard, Cebu City',
    },
  },
  // Pasig
  {
    city: 'Pasig',
    province: 'Metro Manila',
    region: 'NCR',
    coordinates: [14.5764, 121.0851],
    contacts: [
      {
        name: 'Pasig City Disaster Risk Reduction and Management Office',
        number: '(02) 8643-0000',
        type: 'DISASTER',
      },
      {
        name: 'Pasig City Fire Department',
        number: '(02) 8641-3997',
        type: 'FIRE',
      },
      {
        name: 'Pasig City Police',
        number: '(02) 8641-3646',
        type: 'POLICE',
      },
      {
        name: 'The Medical City',
        number: '(02) 8988-1000',
        type: 'HOSPITAL',
        address: 'Ortigas Avenue, Pasig City',
      },
    ],
    evacuationCenters: [
      'Pasig City Sports Center',
      'Rainforest Park',
      'Various Barangay Covered Courts',
    ],
    hospitals: [
      'The Medical City',
      'Pasig City General Hospital',
      'Capitol Medical Center',
    ],
    localGovernment: {
      name: 'Pasig City Government',
      hotline: '(02) 8643-0000',
      address: 'Pasig City Hall, Caruncho Avenue, Pasig City',
    },
  },
  // Davao
  {
    city: 'Davao City',
    province: 'Davao del Sur',
    region: 'XI',
    coordinates: [7.1907, 125.4553],
    contacts: [
      {
        name: 'Davao City Disaster Risk Reduction and Management Office',
        number: '(082) 221-1111',
        type: 'DISASTER',
      },
      {
        name: 'Davao City Fire Department',
        number: '(082) 221-1111',
        type: 'FIRE',
      },
      {
        name: 'Davao City Police Office',
        number: '(082) 244-4601',
        type: 'POLICE',
      },
      {
        name: 'Southern Philippines Medical Center',
        number: '(082) 227-2731',
        type: 'HOSPITAL',
        address: 'J.P. Laurel Avenue, Davao City',
      },
      {
        name: 'Davao Doctors Hospital',
        number: '(082) 222-8000',
        type: 'HOSPITAL',
        address: 'E. Quirino Avenue, Davao City',
      },
    ],
    evacuationCenters: [
      'Almendras Gym',
      'University of Mindanao Gym',
      'Various Barangay Covered Courts',
    ],
    hospitals: [
      'Southern Philippines Medical Center',
      'Davao Doctors Hospital',
      'Davao Regional Medical Center',
    ],
    localGovernment: {
      name: 'Davao City Government',
      hotline: '(082) 221-1111',
      address: 'Davao City Hall, San Pedro Street, Davao City',
    },
  },
  // Baguio
  {
    city: 'Baguio',
    province: 'Benguet',
    region: 'CAR',
    coordinates: [16.4023, 120.5960],
    contacts: [
      {
        name: 'Baguio City DRRMO',
        number: '(074) 442-5609',
        type: 'DISASTER',
      },
      {
        name: 'Baguio Fire Department',
        number: '(074) 442-3331',
        type: 'FIRE',
      },
      {
        name: 'Baguio City Police',
        number: '(074) 442-4971',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Baguio Convention Center',
      'Baguio Athletic Bowl',
      'Various Barangay Halls',
    ],
    hospitals: [
      'Baguio General Hospital',
      'Notre Dame de Chartres Hospital',
      'Saint Louis University Hospital',
    ],
    localGovernment: {
      name: 'Baguio City Government',
      hotline: '(074) 442-5609',
      address: 'City Hall Loop, Baguio City',
    },
  },
  // Iloilo City
  {
    city: 'Iloilo City',
    province: 'Iloilo',
    region: 'VI',
    coordinates: [10.7202, 122.5621],
    contacts: [
      {
        name: 'Iloilo City DRRMO',
        number: '(033) 337-7890',
        type: 'DISASTER',
      },
      {
        name: 'Iloilo Fire Department',
        number: '(033) 337-3333',
        type: 'FIRE',
      },
      {
        name: 'Iloilo City Police',
        number: '(033) 320-1188',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Iloilo Sports Complex',
      'Various Barangay Covered Courts',
      'Public Schools',
    ],
    hospitals: [
      'Western Visayas Medical Center',
      'Iloilo Doctors Hospital',
      'The Medical City Iloilo',
    ],
    localGovernment: {
      name: 'Iloilo City Government',
      hotline: '(033) 337-7890',
      address: 'City Hall, Iloilo City',
    },
  },
  // Cagayan de Oro
  {
    city: 'Cagayan de Oro',
    province: 'Misamis Oriental',
    region: 'X',
    coordinates: [8.4542, 124.6319],
    contacts: [
      {
        name: 'Cagayan de Oro City DRRMO',
        number: '(088) 856-2862',
        type: 'DISASTER',
      },
      {
        name: 'CDO Fire Department',
        number: '(088) 857-3333',
        type: 'FIRE',
      },
      {
        name: 'CDO City Police',
        number: '(088) 856-5555',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Pelaez Sports Center',
      'Xavier University Gym',
      'Various Barangay Centers',
    ],
    hospitals: [
      'Northern Mindanao Medical Center',
      'Capitol University Medical City',
      'Polymedic General Hospital',
    ],
    localGovernment: {
      name: 'Cagayan de Oro City Government',
      hotline: '(088) 856-2862',
      address: 'City Hall, Cagayan de Oro City',
    },
  },
  // Bacolod
  {
    city: 'Bacolod',
    province: 'Negros Occidental',
    region: 'VI',
    coordinates: [10.6770, 122.9500],
    contacts: [
      {
        name: 'Bacolod City DRRMO',
        number: '(034) 435-4545',
        type: 'DISASTER',
      },
      {
        name: 'Bacolod Fire Department',
        number: '(034) 433-3333',
        type: 'FIRE',
      },
      {
        name: 'Bacolod City Police',
        number: '(034) 434-8181',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Panaad Stadium',
      'Bacolod City Government Center',
      'Various Public Schools',
    ],
    hospitals: [
      'CLMMRH',
      'Riverside Medical Center',
      'The Doctors Hospital',
    ],
    localGovernment: {
      name: 'Bacolod City Government',
      hotline: '(034) 435-4545',
      address: 'Bacolod City Government Center',
    },
  },
  // Zamboanga City
  {
    city: 'Zamboanga',
    province: 'Zamboanga del Sur',
    region: 'IX',
    coordinates: [6.9214, 122.0790],
    contacts: [
      {
        name: 'Zamboanga City DRRMO',
        number: '(062) 991-2222',
        type: 'DISASTER',
      },
      {
        name: 'Zamboanga Fire Department',
        number: '(062) 991-3333',
        type: 'FIRE',
      },
      {
        name: 'Zamboanga City Police',
        number: '(062) 991-2345',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Joaquin F. Enriquez Memorial Sports Complex',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Zamboanga City Medical Center',
      'Brent Hospital',
      'Zamboanga Doctors Hospital',
    ],
    localGovernment: {
      name: 'Zamboanga City Government',
      hotline: '(062) 991-2222',
      address: 'City Hall, Zamboanga City',
    },
  },
  // Tacloban
  {
    city: 'Tacloban',
    province: 'Leyte',
    region: 'VIII',
    coordinates: [11.2447, 125.0036],
    contacts: [
      {
        name: 'Tacloban City DRRMO',
        number: '(053) 321-2222',
        type: 'DISASTER',
      },
      {
        name: 'Tacloban Fire Department',
        number: '(053) 321-3333',
        type: 'FIRE',
      },
      {
        name: 'Tacloban City Police',
        number: '(053) 321-2345',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Tacloban City Convention Center',
      'Astrodome',
      'Various Public Schools',
    ],
    hospitals: [
      'Eastern Visayas Regional Medical Center',
      'Divine Word Hospital',
      'RTR Medical Foundation',
    ],
    localGovernment: {
      name: 'Tacloban City Government',
      hotline: '(053) 321-2222',
      address: 'City Hall, Tacloban City',
    },
  },
  // Angeles City
  {
    city: 'Angeles',
    province: 'Pampanga',
    region: 'III',
    coordinates: [15.1450, 120.5887],
    contacts: [
      {
        name: 'Angeles City DRRMO',
        number: '(045) 888-5555',
        type: 'DISASTER',
      },
      {
        name: 'Angeles Fire Department',
        number: '(045) 888-3333',
        type: 'FIRE',
      },
      {
        name: 'Angeles City Police',
        number: '(045) 888-2222',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Bren Z. Guiao Convention Center',
      'Angeles City Sports Complex',
      'Various Barangay Halls',
    ],
    hospitals: [
      'Angeles University Foundation Medical Center',
      'Metro Clark Hospital',
      'Sacred Heart Medical Center',
    ],
    localGovernment: {
      name: 'Angeles City Government',
      hotline: '(045) 888-5555',
      address: 'City Hall, Angeles City',
    },
  },
  // Antipolo
  {
    city: 'Antipolo',
    province: 'Rizal',
    region: 'IV-A',
    coordinates: [14.5863, 121.1760],
    contacts: [
      {
        name: 'Antipolo City DRRMO',
        number: '(02) 8697-3484',
        type: 'DISASTER',
      },
      {
        name: 'Antipolo Fire Department',
        number: '(02) 8697-3333',
        type: 'FIRE',
      },
      {
        name: 'Antipolo City Police',
        number: '(02) 8697-2222',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Antipolo Sports Complex',
      'Various Barangay Covered Courts',
      'Public Schools',
    ],
    hospitals: [
      'Antipolo Doctors Hospital',
      'Unciano Medical Center',
      'Teresa Doctors Hospital',
    ],
    localGovernment: {
      name: 'Antipolo City Government',
      hotline: '(02) 8697-3484',
      address: 'City Hall, Antipolo City',
    },
  },
  // Butuan
  {
    city: 'Butuan',
    province: 'Agusan del Norte',
    region: 'XIII',
    coordinates: [8.9475, 125.5406],
    contacts: [
      {
        name: 'Butuan City DRRMO',
        number: '(085) 342-5555',
        type: 'DISASTER',
      },
      {
        name: 'Butuan Fire Department',
        number: '(085) 342-3333',
        type: 'FIRE',
      },
      {
        name: 'Butuan City Police',
        number: '(085) 342-2222',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Butuan City Sports Complex',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'Butuan Doctors Hospital',
      'Caraga Regional Hospital',
      'Maria Reyna Hospital',
    ],
    localGovernment: {
      name: 'Butuan City Government',
      hotline: '(085) 342-5555',
      address: 'City Hall, Butuan City',
    },
  },
  // Laoag (Ilocos Norte)
  {
    city: 'Laoag',
    province: 'Ilocos Norte',
    region: 'I',
    coordinates: [18.1987, 120.5937],
    contacts: [
      {
        name: 'Laoag City DRRMO',
        number: '(077) 771-2222',
        type: 'DISASTER',
      },
      {
        name: 'Laoag Fire Department',
        number: '(077) 771-3333',
        type: 'FIRE',
      },
      {
        name: 'Laoag City Police',
        number: '(077) 771-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Laoag City Centennial Arena',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Mariano Marcos Memorial Hospital',
      'Laoag City General Hospital',
      'Ilocos Norte Medical Center',
    ],
    localGovernment: {
      name: 'Laoag City Government',
      hotline: '(077) 771-2222',
      address: 'City Hall, Laoag City',
    },
  },
  // Tuguegarao (Cagayan)
  {
    city: 'Tuguegarao',
    province: 'Cagayan',
    region: 'II',
    coordinates: [17.6132, 121.7270],
    contacts: [
      {
        name: 'Tuguegarao City DRRMO',
        number: '(078) 844-1621',
        type: 'DISASTER',
      },
      {
        name: 'Tuguegarao Fire Department',
        number: '(078) 844-3333',
        type: 'FIRE',
      },
      {
        name: 'Tuguegarao City Police',
        number: '(078) 844-2222',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Tuguegarao City Gymnasium',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'Cagayan Valley Medical Center',
      'Tuguegarao General Hospital',
      'St. Paul Hospital',
    ],
    localGovernment: {
      name: 'Tuguegarao City Government',
      hotline: '(078) 844-1621',
      address: 'City Hall, Tuguegarao City',
    },
  },
  // San Fernando (La Union)
  {
    city: 'San Fernando',
    province: 'La Union',
    region: 'I',
    coordinates: [16.6163, 120.3170],
    contacts: [
      {
        name: 'San Fernando City DRRMO',
        number: '(072) 888-2222',
        type: 'DISASTER',
      },
      {
        name: 'San Fernando Fire Department',
        number: '(072) 888-3333',
        type: 'FIRE',
      },
      {
        name: 'San Fernando City Police',
        number: '(072) 888-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'San Fernando City Gymnasium',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Lorma Medical Center',
      'Bethany Hospital',
      'Ilocos Training and Regional Medical Center',
    ],
    localGovernment: {
      name: 'San Fernando City Government',
      hotline: '(072) 888-2222',
      address: 'City Hall, San Fernando City',
    },
  },
  // Olongapo (Zambales)
  {
    city: 'Olongapo',
    province: 'Zambales',
    region: 'III',
    coordinates: [14.8294, 120.2824],
    contacts: [
      {
        name: 'Olongapo City DRRMO',
        number: '(047) 222-2222',
        type: 'DISASTER',
      },
      {
        name: 'Olongapo Fire Department',
        number: '(047) 222-3333',
        type: 'FIRE',
      },
      {
        name: 'Olongapo City Police',
        number: '(047) 222-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Olongapo City Sports Complex',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'James L. Gordon Memorial Hospital',
      'Olongapo City General Hospital',
      'St. James Hospital',
    ],
    localGovernment: {
      name: 'Olongapo City Government',
      hotline: '(047) 222-2222',
      address: 'City Hall, Olongapo City',
    },
  },
  // Cabanatuan (Nueva Ecija)
  {
    city: 'Cabanatuan',
    province: 'Nueva Ecija',
    region: 'III',
    coordinates: [15.4860, 120.9670],
    contacts: [
      {
        name: 'Cabanatuan City DRRMO',
        number: '(044) 463-2222',
        type: 'DISASTER',
      },
      {
        name: 'Cabanatuan Fire Department',
        number: '(044) 463-3333',
        type: 'FIRE',
      },
      {
        name: 'Cabanatuan City Police',
        number: '(044) 463-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Cabanatuan City Sports Complex',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Paulino J. Garcia Memorial Research Medical Center',
      'Good Samaritan Hospital',
      'Dr. Paulino J. Garcia Memorial Hospital',
    ],
    localGovernment: {
      name: 'Cabanatuan City Government',
      hotline: '(044) 463-2222',
      address: 'City Hall, Cabanatuan City',
    },
  },
  // Batangas City (Batangas)
  {
    city: 'Batangas City',
    province: 'Batangas',
    region: 'IV-A',
    coordinates: [13.7565, 121.0583],
    contacts: [
      {
        name: 'Batangas City DRRMO',
        number: '(043) 980-2222',
        type: 'DISASTER',
      },
      {
        name: 'Batangas Fire Department',
        number: '(043) 980-3333',
        type: 'FIRE',
      },
      {
        name: 'Batangas City Police',
        number: '(043) 980-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Batangas City Sports Complex',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Batangas Medical Center',
      'Metro Batangas Hospital',
      'Our Lady of Lourdes Hospital',
    ],
    localGovernment: {
      name: 'Batangas City Government',
      hotline: '(043) 980-2222',
      address: 'City Hall, Batangas City',
    },
  },
  // Lucena (Quezon)
  {
    city: 'Lucena',
    province: 'Quezon',
    region: 'IV-A',
    coordinates: [13.9372, 121.6174],
    contacts: [
      {
        name: 'Lucena City DRRMO',
        number: '(042) 373-2222',
        type: 'DISASTER',
      },
      {
        name: 'Lucena Fire Department',
        number: '(042) 373-3333',
        type: 'FIRE',
      },
      {
        name: 'Lucena City Police',
        number: '(042) 373-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Lucena City Sports Complex',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'Quezon Medical Center',
      'Sacred Heart Hospital',
      'Lucena United Doctors Hospital',
    ],
    localGovernment: {
      name: 'Lucena City Government',
      hotline: '(042) 373-2222',
      address: 'City Hall, Lucena City',
    },
  },
  // Naga (Camarines Sur)
  {
    city: 'Naga',
    province: 'Camarines Sur',
    region: 'V',
    coordinates: [13.6192, 123.1814],
    contacts: [
      {
        name: 'Naga City DRRMO',
        number: '(054) 473-2222',
        type: 'DISASTER',
      },
      {
        name: 'Naga Fire Department',
        number: '(054) 473-3333',
        type: 'FIRE',
      },
      {
        name: 'Naga City Police',
        number: '(054) 473-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Jesse M. Robredo Coliseum',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'Bicol Medical Center',
      'Naga City Hospital',
      'Ago Medical and Educational Center',
    ],
    localGovernment: {
      name: 'Naga City Government',
      hotline: '(054) 473-2222',
      address: 'City Hall, Naga City',
    },
  },
  // Legazpi (Albay)
  {
    city: 'Legazpi',
    province: 'Albay',
    region: 'V',
    coordinates: [13.1391, 123.7436],
    contacts: [
      {
        name: 'Legazpi City DRRMO',
        number: '(052) 480-2222',
        type: 'DISASTER',
      },
      {
        name: 'Legazpi Fire Department',
        number: '(052) 480-3333',
        type: 'FIRE',
      },
      {
        name: 'Legazpi City Police',
        number: '(052) 480-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Legazpi City Astrodome',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'Aquinas University Hospital',
      'Bicol Regional Training Hospital',
      'Esteves Memorial Hospital',
    ],
    localGovernment: {
      name: 'Legazpi City Government',
      hotline: '(052) 480-2222',
      address: 'City Hall, Legazpi City',
    },
  },
  // Roxas (Capiz)
  {
    city: 'Roxas',
    province: 'Capiz',
    region: 'VI',
    coordinates: [11.5854, 122.7510],
    contacts: [
      {
        name: 'Roxas City DRRMO',
        number: '(036) 621-2222',
        type: 'DISASTER',
      },
      {
        name: 'Roxas Fire Department',
        number: '(036) 621-3333',
        type: 'FIRE',
      },
      {
        name: 'Roxas City Police',
        number: '(036) 621-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Roxas City Gymnasium',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Roxas Memorial Provincial Hospital',
      'Capiz Emmanuel Hospital',
      'St. Anthony Hospital',
    ],
    localGovernment: {
      name: 'Roxas City Government',
      hotline: '(036) 621-2222',
      address: 'City Hall, Roxas City',
    },
  },
  // Dumaguete (Negros Oriental)
  {
    city: 'Dumaguete',
    province: 'Negros Oriental',
    region: 'VII',
    coordinates: [9.3068, 123.3054],
    contacts: [
      {
        name: 'Dumaguete City DRRMO',
        number: '(035) 225-2222',
        type: 'DISASTER',
      },
      {
        name: 'Dumaguete Fire Department',
        number: '(035) 225-3333',
        type: 'FIRE',
      },
      {
        name: 'Dumaguete City Police',
        number: '(035) 225-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Lamberto Macias Sports Complex',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'Negros Oriental Provincial Hospital',
      'Holy Child Hospital',
      'Silliman University Medical Center',
    ],
    localGovernment: {
      name: 'Dumaguete City Government',
      hotline: '(035) 225-2222',
      address: 'City Hall, Dumaguete City',
    },
  },
  // Tagbilaran (Bohol)
  {
    city: 'Tagbilaran',
    province: 'Bohol',
    region: 'VII',
    coordinates: [9.6475, 123.8533],
    contacts: [
      {
        name: 'Tagbilaran City DRRMO',
        number: '(038) 411-2222',
        type: 'DISASTER',
      },
      {
        name: 'Tagbilaran Fire Department',
        number: '(038) 411-3333',
        type: 'FIRE',
      },
      {
        name: 'Tagbilaran City Police',
        number: '(038) 411-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Tagbilaran City Sports Complex',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Governor Celestino Gallares Memorial Hospital',
      'Ramiro Community Hospital',
      'Garcia Memorial Provincial Hospital',
    ],
    localGovernment: {
      name: 'Tagbilaran City Government',
      hotline: '(038) 411-2222',
      address: 'City Hall, Tagbilaran City',
    },
  },
  // Ormoc (Leyte)
  {
    city: 'Ormoc',
    province: 'Leyte',
    region: 'VIII',
    coordinates: [11.0059, 124.6074],
    contacts: [
      {
        name: 'Ormoc City DRRMO',
        number: '(053) 561-2222',
        type: 'DISASTER',
      },
      {
        name: 'Ormoc Fire Department',
        number: '(053) 561-3333',
        type: 'FIRE',
      },
      {
        name: 'Ormoc City Police',
        number: '(053) 561-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Ormoc City Superdome',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'Ormoc District Hospital',
      'Farmers Medical Hospital',
      'Western Leyte Provincial Hospital',
    ],
    localGovernment: {
      name: 'Ormoc City Government',
      hotline: '(053) 561-2222',
      address: 'City Hall, Ormoc City',
    },
  },
  // Dipolog (Zamboanga del Norte)
  {
    city: 'Dipolog',
    province: 'Zamboanga del Norte',
    region: 'IX',
    coordinates: [8.5833, 123.3417],
    contacts: [
      {
        name: 'Dipolog City DRRMO',
        number: '(065) 212-2222',
        type: 'DISASTER',
      },
      {
        name: 'Dipolog Fire Department',
        number: '(065) 212-3333',
        type: 'FIRE',
      },
      {
        name: 'Dipolog City Police',
        number: '(065) 212-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Dipolog City Sports Complex',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Zamboanga del Norte Medical Center',
      'Dipolog Medical Center',
      'Estaka Hospital',
    ],
    localGovernment: {
      name: 'Dipolog City Government',
      hotline: '(065) 212-2222',
      address: 'City Hall, Dipolog City',
    },
  },
  // Iligan (Lanao del Norte)
  {
    city: 'Iligan',
    province: 'Lanao del Norte',
    region: 'X',
    coordinates: [8.2280, 124.2452],
    contacts: [
      {
        name: 'Iligan City DRRMO',
        number: '(063) 221-2222',
        type: 'DISASTER',
      },
      {
        name: 'Iligan Fire Department',
        number: '(063) 221-3333',
        type: 'FIRE',
      },
      {
        name: 'Iligan City Police',
        number: '(063) 221-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Iligan City Sports Complex',
      'Various Barangay Centers',
      'Public Schools',
    ],
    hospitals: [
      'Adventist Medical Center Iligan',
      'Mercy Community Hospital',
      'Gregorio T. Lluch Memorial Hospital',
    ],
    localGovernment: {
      name: 'Iligan City Government',
      hotline: '(063) 221-2222',
      address: 'City Hall, Iligan City',
    },
  },
  // Cotabato City (Maguindanao)
  {
    city: 'Cotabato',
    province: 'Maguindanao',
    region: 'BARMM',
    coordinates: [7.2231, 124.2452],
    contacts: [
      {
        name: 'Cotabato City DRRMO',
        number: '(064) 421-2222',
        type: 'DISASTER',
      },
      {
        name: 'Cotabato Fire Department',
        number: '(064) 421-3333',
        type: 'FIRE',
      },
      {
        name: 'Cotabato City Police',
        number: '(064) 421-4444',
        type: 'POLICE',
      },
    ],
    evacuationCenters: [
      'Cotabato City Sports Complex',
      'Various Barangay Halls',
      'Public Schools',
    ],
    hospitals: [
      'Cotabato Regional Medical Center',
      'Notre Dame Hospital',
      'Cotabato Sanitarium',
    ],
    localGovernment: {
      name: 'Cotabato City Government',
      hotline: '(064) 421-2222',
      address: 'City Hall, Cotabato City',
    },
  },
];

export const searchCities = (query: string): CityEmergencyData[] => filterCities(philippinesCities, query);
