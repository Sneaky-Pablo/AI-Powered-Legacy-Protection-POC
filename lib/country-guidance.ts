import { Country, CountryGuidance } from './types';

/**
 * Get country-specific legal guidance for will execution
 */
export function getCountryGuidance(country: Country): CountryGuidance {
  const guidanceMap: Record<Country, CountryGuidance> = {
    ES: {
      country: 'ES',
      legalRequirements: [
        'Ser mayor de 14 años y estar en pleno uso de facultades mentales',
        'El testamento debe otorgarse ante notario público',
        'Se requieren dos testigos si el testador no sabe firmar',
        'Debe incluir identificación completa del testador (DNI/NIE)',
        'Revocación expresa de testamentos anteriores',
      ],
      notaryProcess: `1. Solicitar cita con notario de su elección
2. Llevar DNI/NIE original
3. Explicar sus voluntades al notario
4. El notario redactará el testamento conforme a la ley
5. Lectura del documento ante el notario
6. Firma del testamento y del notario
7. El notario incorpora el testamento al Registro General de Actos de Última Voluntad`,
      estimatedCost: '€50 - €200 (según complejidad y notario)',
      estimatedTimeframe: '1-2 semanas desde la solicitud de cita',
      importantNotes: [
        'El testamento notarial es la forma más segura en España',
        'Queda registrado en el Registro de Últimas Voluntades',
        'Puede modificarse en cualquier momento otorgando uno nuevo',
        'No es obligatorio informar a los herederos',
        'Respete la legítima de los herederos forzosos (hijos, padres)',
      ],
      resources: [
        'Consejo General del Notariado: www.notariado.org',
        'Registro de Últimas Voluntades - Ministerio de Justicia',
        'Código Civil español - Libro III, Título III',
      ],
    },
    
    MX: {
      country: 'MX',
      legalRequirements: [
        'Ser mayor de 16 años',
        'Estar en pleno juicio y memoria',
        'Testamento público abierto ante notario (recomendado)',
        'Identificación oficial vigente',
        'Testigos en ciertos casos',
      ],
      notaryProcess: `1. Acudir a notaría pública de su localidad
2. Presentar identificación oficial (INE, pasaporte)
3. Manifestar su última voluntad ante el notario
4. El notario redacta el testamento
5. Lectura en voz alta del documento
6. Firma del testador, notario y testigos (si aplica)
7. Inscripción en el Archivo General de Notarías`,
      estimatedCost: '$1,000 - $5,000 MXN (varía por estado)',
      estimatedTimeframe: '1-3 semanas',
      importantNotes: [
        'El testamento público abierto es el más común y seguro',
        'Existe también el testamento ológrafo (escrito a mano)',
        'Cada estado tiene su propio Código Civil',
        'Se recomienda actualizarlo cada 3-5 años',
        'En septiembre suele haber campañas de testamentos gratuitos',
      ],
      resources: [
        'Colegio Nacional del Notariado Mexicano',
        'Secretaría de Gobernación - Trámites testamentarios',
        'Instituto Mexicano del Notariado',
      ],
    },

    AR: {
      country: 'AR',
      legalRequirements: [
        'Ser mayor de 18 años',
        'Capacidad mental plena',
        'Testamento por acto público ante escribano',
        'DNI vigente',
        'Dos testigos mayores de edad',
      ],
      notaryProcess: `1. Concurrir a escribanía pública
2. Llevar DNI y documentación de bienes
3. Expresar su voluntad al escribano
4. El escribano elabora el acta testamentaria
5. Lectura del documento completo
6. Firma ante dos testigos
7. Protocolarización en el registro notarial`,
      estimatedCost: 'ARS $50,000 - $150,000 (aproximado)',
      estimatedTimeframe: '2-4 semanas',
      importantNotes: [
        'Regido por el Código Civil y Comercial argentino',
        'Debe respetar la legítima hereditaria',
        'Puede revocarse en cualquier momento',
        'Se recomienda guardar copia certificada',
      ],
      resources: [
        'Colegio de Escribanos de la provincia correspondiente',
        'Código Civil y Comercial - Libro Quinto',
        'Registro de Testamentos',
      ],
    },

    // Simplified guidance for other countries
    CO: generateGenericGuidance('CO', 'Colombia', 'COP $200,000 - $800,000'),
    CL: generateGenericGuidance('CL', 'Chile', 'CLP $50,000 - $200,000'),
    PE: generateGenericGuidance('PE', 'Perú', 'PEN 200 - 800'),
    VE: generateGenericGuidance('VE', 'Venezuela', 'Variable según tipo de cambio'),
    EC: generateGenericGuidance('EC', 'Ecuador', 'USD $100 - $400'),
    GT: generateGenericGuidance('GT', 'Guatemala', 'GTQ 500 - 2,000'),
    CU: generateGenericGuidance('CU', 'Cuba', 'Consultar notaría local'),
    BO: generateGenericGuidance('BO', 'Bolivia', 'BOB 300 - 1,200'),
    DO: generateGenericGuidance('DO', 'República Dominicana', 'DOP 5,000 - 20,000'),
    HN: generateGenericGuidance('HN', 'Honduras', 'HNL 2,000 - 8,000'),
    PY: generateGenericGuidance('PY', 'Paraguay', 'PYG 500,000 - 2,000,000'),
    SV: generateGenericGuidance('SV', 'El Salvador', 'USD $100 - $400'),
    NI: generateGenericGuidance('NI', 'Nicaragua', 'NIO 1,000 - 4,000'),
    CR: generateGenericGuidance('CR', 'Costa Rica', 'CRC 50,000 - 200,000'),
    PA: generateGenericGuidance('PA', 'Panamá', 'USD $150 - $500'),
    UY: generateGenericGuidance('UY', 'Uruguay', 'UYU 3,000 - 12,000'),
  };

  return guidanceMap[country];
}

/**
 * Generate generic guidance for countries with similar processes
 */
function generateGenericGuidance(code: Country, name: string, cost: string): CountryGuidance {
  return {
    country: code,
    legalRequirements: [
      'Ser mayor de edad según las leyes locales',
      'Capacidad mental y jurídica plena',
      'Testamento ante notario público (recomendado)',
      'Documento de identidad vigente',
      'Testigos según lo requiera la ley local',
    ],
    notaryProcess: `1. Acudir a notaría pública en ${name}
2. Presentar documento de identidad oficial
3. Expresar su última voluntad al notario
4. El notario redacta el testamento conforme a la ley
5. Lectura del documento ante testigos (si se requiere)
6. Firma del testador, notario y testigos
7. Registro y protocolización según normativa local`,
    estimatedCost: cost,
    estimatedTimeframe: '2-4 semanas (aproximado)',
    importantNotes: [
      'Consulte el Código Civil vigente en su país',
      'Respete las cuotas hereditarias obligatorias',
      'Puede modificarse otorgando un nuevo testamento',
      'Guarde copia del documento en lugar seguro',
      'Informe a persona de confianza sobre su existencia',
    ],
    resources: [
      `Colegio de Notarios de ${name}`,
      'Asesoría legal especializada en derecho sucesorio',
      'Registro Nacional de Testamentos (si existe)',
    ],
  };
}

/**
 * Get specific legal requirements by country
 */
export function getLegalRequirements(country: Country): string[] {
  return getCountryGuidance(country).legalRequirements;
}

/**
 * Get notary process steps by country
 */
export function getNotaryProcess(country: Country): string {
  return getCountryGuidance(country).notaryProcess;
}

/**
 * Get estimated costs by country
 */
export function getEstimatedCost(country: Country): string {
  return getCountryGuidance(country).estimatedCost;
}

/**
 * Check if country has specific guidance
 */
export function hasDetailedGuidance(country: Country): boolean {
  return ['ES', 'MX', 'AR'].includes(country);
}
