import { FormResponse, Country, Heir } from './types';

/**
 * Base will template structure that can be customized by AI
 */
export interface WillTemplate {
  country: Country;
  introduction: string;
  identification: string;
  revocation: string;
  heirsDesignation: string;
  assetDistribution: string;
  executor: string;
  specialClauses: string[];
  closing: string;
}

/**
 * Generate a base will template for a specific country
 */
export function generateBaseWillTemplate(formResponse: FormResponse): string {
  const countryTemplates: Record<Country, () => string> = {
    ES: () => generateSpainWillTemplate(formResponse),
    MX: () => generateMexicoWillTemplate(formResponse),
    AR: () => generateArgentinaWillTemplate(formResponse),
    CO: () => generateColombiaWillTemplate(formResponse),
    CL: () => generateChileWillTemplate(formResponse),
    PE: () => generatePeruWillTemplate(formResponse),
    VE: () => generateVenezuelaWillTemplate(formResponse),
    EC: () => generateEcuadorWillTemplate(formResponse),
    GT: () => generateGuatemalaWillTemplate(formResponse),
    CU: () => generateCubaWillTemplate(formResponse),
    BO: () => generateBoliviaWillTemplate(formResponse),
    DO: () => generateDominicanRepublicWillTemplate(formResponse),
    HN: () => generateHondurasWillTemplate(formResponse),
    PY: () => generateParaguayWillTemplate(formResponse),
    SV: () => generateElSalvadorWillTemplate(formResponse),
    NI: () => generateNicaraguaWillTemplate(formResponse),
    CR: () => generateCostaRicaWillTemplate(formResponse),
    PA: () => generatePanamaWillTemplate(formResponse),
    UY: () => generateUruguayWillTemplate(formResponse),
  };

  const generator = countryTemplates[formResponse.country];
  return generator ? generator() : generateGenericWillTemplate(formResponse);
}

/**
 * Spain will template (following Spanish Civil Code)
 */
function generateSpainWillTemplate(data: FormResponse): string {
  return `TESTAMENTO

IDENTIFICACIÓN DEL TESTADOR
Yo, ${data.fullName}, mayor de edad, de ${data.age} años, con domicilio en España, en pleno uso de mis facultades mentales y sin coacción alguna, otorgo mi TESTAMENTO conforme a las siguientes cláusulas:

PRIMERA - REVOCACIÓN
Revoco todos los testamentos, codicilos y demás disposiciones testamentarias que haya otorgado con anterioridad a la fecha del presente testamento.

SEGUNDA - ESTADO CIVIL Y FAMILIA
Declaro mi estado civil como ${data.maritalStatus}${data.hasChildren ? `, y tengo ${data.numberOfChildren} hijo(s)` : ''}.

TERCERA - INSTITUCIÓN DE HEREDEROS
Instituyo como heredero(s) de todos mis bienes, derechos y acciones, presentes y futuros, a:

${data.heirs.map((heir, idx) => 
  `${idx + 1}. ${heir.name} (${heir.relationship})${heir.percentage ? ` - ${heir.percentage}% de mi herencia` : ''}`
).join('\n')}

${data.heirs.some(h => h.isMinor) ? `
CUARTA - TUTELA DE MENORES
Para el caso de que alguno de mis herederos sea menor de edad al momento de mi fallecimiento, designo como tutor legal a ${data.heirs.find(h => h.isMinor)?.guardianName || '[ESPECIFICAR TUTOR]'}.
` : ''}

${data.hasExecutor ? `
QUINTA - ALBACEA
Nombro como albacea ejecutor de este testamento a ${data.executorName}, con las más amplias facultades que en derecho procedan, para el cumplimiento de mis últimas voluntades.
` : ''}

SEXTA - NORMAS SUPLETORIAS
Para todo lo no previsto en este testamento, se aplicará lo dispuesto en el Código Civil español y sus normas complementarias.

SÉPTIMA - DECLARACIÓN
Declaro que este testamento refleja mi última voluntad y que lo otorgo sin vicio alguno de consentimiento.

⚠️ IMPORTANTE: Este es un BORRADOR de testamento que debe ser revisado y validado por un notario español. No tiene validez legal hasta que sea formalizado ante notario conforme al Código Civil español.

Fecha: ${new Date().toLocaleDateString('es-ES')}
Firma: _______________________
${data.fullName}`;
}

/**
 * Mexico will template
 */
function generateMexicoWillTemplate(data: FormResponse): string {
  return `TESTAMENTO PÚBLICO ABIERTO

IDENTIFICACIÓN DEL TESTADOR
Yo, ${data.fullName}, de ${data.age} años de edad, con domicilio en México, en pleno uso de mis facultades mentales y actuando de manera libre y voluntaria, otorgo el presente TESTAMENTO conforme a las siguientes cláusulas:

PRIMERA - REVOCACIÓN
Revoco cualquier testamento o disposición testamentaria anterior a la presente fecha.

SEGUNDA - DATOS PERSONALES
Declaro ser de estado civil ${data.maritalStatus}${data.hasChildren ? ` y tener ${data.numberOfChildren} hijo(s)` : ''}.

TERCERA - INSTITUCIÓN DE HEREDEROS
Instituyo como mis herederos universales a:

${data.heirs.map((heir, idx) => 
  `${idx + 1}. ${heir.name} (${heir.relationship})${heir.percentage ? ` - ${heir.percentage}%` : ''}`
).join('\n')}

${data.heirs.some(h => h.isMinor) ? `
CUARTA - TUTELA
Designo como tutor de mis hijos menores de edad a ${data.heirs.find(h => h.isMinor)?.guardianName || '[ESPECIFICAR TUTOR]'}.
` : ''}

${data.hasExecutor ? `
QUINTA - ALBACEA
Nombro como albacea a ${data.executorName}, con las más amplias facultades para ejecutar este testamento.
` : ''}

SEXTA - DISPOSICIONES FINALES
Este testamento se rige por las disposiciones del Código Civil aplicable en México.

⚠️ ADVERTENCIA LEGAL: Este es un BORRADOR que debe ser formalizado ante Notario Público en México. No tiene validez legal hasta su protocolización notarial.

Fecha: ${new Date().toLocaleDateString('es-MX')}
Firma: _______________________
${data.fullName}`;
}

/**
 * Generic template for other Latin American countries
 */
function generateGenericWillTemplate(data: FormResponse): string {
  const countryName = getCountryName(data.country);
  
  return `TESTAMENTO

En ${countryName}, a ${new Date().toLocaleDateString('es')}

DATOS DEL TESTADOR
Yo, ${data.fullName}, de ${data.age} años de edad, en pleno uso de mis facultades mentales, declaro lo siguiente:

1. REVOCACIÓN
Revoco todo testamento anterior.

2. ESTADO CIVIL
Mi estado civil es: ${data.maritalStatus}
${data.hasChildren ? `Tengo ${data.numberOfChildren} hijo(s).` : 'No tengo hijos.'}

3. HEREDEROS
Designo como herederos a:
${data.heirs.map((heir, idx) => 
  `   ${idx + 1}. ${heir.name} - ${heir.relationship}${heir.percentage ? ` (${heir.percentage}%)` : ''}`
).join('\n')}

${data.heirs.some(h => h.isMinor) ? `
4. TUTELA
Designo como tutor de menores a: ${data.heirs.find(h => h.isMinor)?.guardianName || '[ESPECIFICAR]'}
` : ''}

${data.hasExecutor ? `
${data.heirs.some(h => h.isMinor) ? '5' : '4'}. ALBACEA
Nombro como albacea a: ${data.executorName}
` : ''}

⚠️ IMPORTANTE: Este es un BORRADOR educativo. Debe ser revisado por un abogado local y formalizado ante notario público en ${countryName} según las leyes vigentes.

Firma: _______________________
${data.fullName}`;
}

// Simplified templates for other countries
const generateArgentinaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateColombiaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateChileWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generatePeruWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateVenezuelaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateEcuadorWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateGuatemalaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateCubaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateBoliviaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateDominicanRepublicWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateHondurasWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateParaguayWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateElSalvadorWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateNicaraguaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateCostaRicaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generatePanamaWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);
const generateUruguayWillTemplate = (data: FormResponse) => generateGenericWillTemplate(data);

function getCountryName(code: Country): string {
  const names: Record<Country, string> = {
    ES: 'España', MX: 'México', AR: 'Argentina', CO: 'Colombia',
    CL: 'Chile', PE: 'Perú', VE: 'Venezuela', EC: 'Ecuador',
    GT: 'Guatemala', CU: 'Cuba', BO: 'Bolivia', DO: 'República Dominicana',
    HN: 'Honduras', PY: 'Paraguay', SV: 'El Salvador', NI: 'Nicaragua',
    CR: 'Costa Rica', PA: 'Panamá', UY: 'Uruguay',
  };
  return names[code];
}
