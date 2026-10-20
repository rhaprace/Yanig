export interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  type: string;
}

export interface GovernmentAgency {
  name: string;
  description: string;
  url: string;
  type: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  language: string;
  emergencyNumbers: EmergencyContact[];
  agencies: GovernmentAgency[];
  /** Where Yanig gets its earthquake data. This is the same for every country. */
  dataSource: {
    name: string;
    url: string;
  };
}

/**
 * Yanig gets earthquake data from USGS, GeoNet (New Zealand) and BMKG (Indonesia) for every country.
 * The agencies below are official contacts. They are not data sources unless the type says so.
 */
const YANIG_DATA_SOURCE: CountryConfig['dataSource'] = {
  name: 'USGS, GeoNet and BMKG',
  url: 'https://earthquake.usgs.gov/',
};

export const countries: Record<string, CountryConfig> = {
  US: {
    code: 'US',
    name: 'United States',
    language: 'en',
    emergencyNumbers: [
      {
        name: 'Emergency Services',
        number: '911',
        description: 'Police, Fire, Medical emergencies',
        type: 'EMERGENCY',
      },
      {
        name: 'FEMA Helpline',
        number: '1-800-621-3362',
        description: 'Federal disaster assistance and information',
        type: 'DISASTER',
      },
      {
        name: 'Red Cross',
        number: '1-800-733-2767',
        description: 'Disaster relief and emergency assistance',
        type: 'RELIEF',
      },
      {
        name: 'Poison Control',
        number: '1-800-222-1222',
        description: 'Poison emergency hotline',
        type: 'MEDICAL',
      },
    ],
    agencies: [
      {
        name: 'U.S. Geological Survey (USGS)',
        description: 'Earthquake monitoring and science. Yanig uses USGS earthquake data.',
        url: 'https://www.usgs.gov/programs/earthquake-hazards',
        type: 'DATA SOURCE',
      },
      {
        name: 'Federal Emergency Management Agency (FEMA)',
        description: 'Emergency preparedness guidelines and best practices',
        url: 'https://www.fema.gov',
        type: 'PREPAREDNESS GUIDELINES',
      },
      {
        name: 'Ready.gov',
        description: 'National preparedness campaign resources',
        url: 'https://www.ready.gov/earthquakes',
        type: 'EDUCATIONAL CONTENT',
      },
    ],
    dataSource: YANIG_DATA_SOURCE,
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    language: 'ja',
    emergencyNumbers: [
      {
        name: '警察 (Police)',
        number: '110',
        description: '警察への緊急通報',
        type: '緊急',
      },
      {
        name: '消防・救急 (Fire/Ambulance)',
        number: '119',
        description: '火災・救急医療の緊急通報',
        type: '緊急',
      },
      {
        name: '災害用伝言ダイヤル',
        number: '171',
        description: '災害時の安否確認サービス',
        type: '災害',
      },
    ],
    agencies: [
      {
        name: '気象庁 (Japan Meteorological Agency)',
        description: '地震情報と津波警報の発表',
        url: 'https://www.jma.go.jp/jma/indexe.html',
        type: '政府機関',
      },
      {
        name: '防災科学技術研究所 (NIED)',
        description: '地震観測ネットワークと研究',
        url: 'https://www.bosai.go.jp/e/',
        type: '研究機関',
      },
      {
        name: '内閣府防災情報',
        description: '政府の防災情報と対策',
        url: 'http://www.bousai.go.jp/',
        type: '政府機関',
      },
    ],
    dataSource: YANIG_DATA_SOURCE,
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    language: 'es',
    emergencyNumbers: [
      {
        name: 'Emergencias',
        number: '911',
        description: 'Policía, bomberos, emergencias médicas',
        type: 'EMERGENCIA',
      },
      {
        name: 'Cruz Roja Mexicana',
        number: '065',
        description: 'Asistencia médica de emergencia',
        type: 'MÉDICO',
      },
      {
        name: 'Protección Civil',
        number: '5683-2222',
        description: 'Información y asistencia en desastres',
        type: 'DESASTRE',
      },
    ],
    agencies: [
      {
        name: 'Servicio Sismológico Nacional (SSN)',
        description: 'Monitoreo sísmico de México',
        url: 'http://www.ssn.unam.mx/',
        type: 'MONITOREO SÍSMICO',
      },
      {
        name: 'CENAPRED',
        description: 'Centro Nacional de Prevención de Desastres',
        url: 'https://www.gob.mx/cenapred',
        type: 'PREVENCIÓN',
      },
      {
        name: 'Protección Civil Nacional',
        description: 'Coordinación nacional de emergencias',
        url: 'https://www.gob.mx/segob/acciones-y-programas/proteccion-civil',
        type: 'GOBIERNO',
      },
    ],
    dataSource: YANIG_DATA_SOURCE,
  },
  CL: {
    code: 'CL',
    name: 'Chile',
    language: 'es',
    emergencyNumbers: [
      {
        name: 'Emergencias',
        number: '131',
        description: 'Ambulancia y emergencias médicas',
        type: 'EMERGENCIA',
      },
      {
        name: 'Bomberos',
        number: '132',
        description: 'Servicio de bomberos',
        type: 'EMERGENCIA',
      },
      {
        name: 'Carabineros',
        number: '133',
        description: 'Policía de Chile',
        type: 'EMERGENCIA',
      },
    ],
    agencies: [
      {
        name: 'Centro Sismológico Nacional',
        description: 'Monitoreo sísmico de Chile',
        url: 'https://www.sismologia.cl/',
        type: 'MONITOREO SÍSMICO',
      },
      {
        name: 'SENAPRED',
        description: 'Servicio Nacional de Prevención y Respuesta ante Desastres (antes ONEMI)',
        url: 'https://senapred.cl/',
        type: 'GOBIERNO',
      },
      {
        name: 'SHOA',
        description: 'Servicio Hidrográfico y Oceanográfico (Tsunamis)',
        url: 'https://www.shoa.cl/',
        type: 'ALERTA DE TSUNAMI',
      },
    ],
    dataSource: YANIG_DATA_SOURCE,
  },
  ID: {
    code: 'ID',
    name: 'Indonesia',
    language: 'en',
    emergencyNumbers: [
      {
        name: 'Emergency Services',
        number: '112',
        description: 'Police, fire, medical emergencies',
        type: 'EMERGENCY',
      },
      {
        name: 'Ambulance',
        number: '118',
        description: 'Medical emergency services',
        type: 'MEDICAL',
      },
      {
        name: 'Disaster Management',
        number: '117',
        description: 'BNPB disaster hotline',
        type: 'DISASTER',
      },
    ],
    agencies: [
      {
        name: 'BMKG (Meteorology Agency)',
        description: 'Earthquake and tsunami monitoring. Yanig uses BMKG earthquake data.',
        url: 'https://www.bmkg.go.id/',
        type: 'DATA SOURCE',
      },
      {
        name: 'BNPB',
        description: 'National Disaster Management Agency',
        url: 'https://bnpb.go.id/',
        type: 'DISASTER MANAGEMENT',
      },
      {
        name: 'Indonesian Red Cross (PMI)',
        description: 'Disaster relief and emergency response',
        url: 'https://pmi.or.id/',
        type: 'RELIEF',
      },
    ],
    dataSource: YANIG_DATA_SOURCE,
  },
  PH: {
    code: 'PH',
    name: 'Philippines',
    language: 'tl',
    emergencyNumbers: [
      {
        name: 'Emergency Hotline',
        number: '911',
        description: 'National emergency hotline for police, fire, and medical',
        type: 'EMERGENCY',
      },
      {
        name: 'NDRRMC Hotline',
        number: '(02) 8911-1406',
        description: 'National Disaster Risk Reduction and Management Council',
        type: 'DISASTER',
      },
      {
        name: 'Philippine Red Cross',
        number: '143',
        description: 'Emergency medical services and disaster response',
        type: 'RELIEF',
      },
      {
        name: 'Coast Guard',
        number: '(02) 8527-8481',
        description: 'Maritime emergencies and search and rescue',
        type: 'EMERGENCY',
      },
    ],
    agencies: [
      {
        name: 'PHIVOLCS',
        description:
          'Philippine Institute of Volcanology and Seismology. The official Philippine agency for earthquakes, volcanoes and tsunami warnings.',
        url: 'https://www.phivolcs.dost.gov.ph',
        type: 'OFFICIAL AGENCY',
      },
      {
        name: 'NDRRMC',
        description: 'National Disaster Risk Reduction and Management Council',
        url: 'https://ndrrmc.gov.ph/',
        type: 'DISASTER MANAGEMENT',
      },
      {
        name: 'PAGASA',
        description: 'Philippine Atmospheric, Geophysical and Astronomical Services Administration',
        url: 'https://www.pagasa.dost.gov.ph/',
        type: 'WEATHER & CLIMATE',
      },
      {
        name: 'Philippine Red Cross',
        description: 'Humanitarian services and disaster response',
        url: 'https://redcross.org.ph/',
        type: 'RELIEF',
      },
    ],
    dataSource: YANIG_DATA_SOURCE,
  },
};

export const getCountryConfig = (countryCode: string): CountryConfig => {
  return countries[countryCode] || countries.US;
};

export const getCountryByLanguage = (language: string): CountryConfig => {
  const countryEntry = Object.entries(countries).find(
    ([, config]) => config.language === language
  );
  return countryEntry ? countryEntry[1] : countries.US;
};

