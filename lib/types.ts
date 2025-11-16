import { z } from 'zod';

// Country enum for Spain and Latin American countries
export const CountrySchema = z.enum([
  'ES', // Spain
  'MX', // Mexico
  'AR', // Argentina
  'CO', // Colombia
  'CL', // Chile
  'PE', // Peru
  'VE', // Venezuela
  'EC', // Ecuador
  'GT', // Guatemala
  'CU', // Cuba
  'BO', // Bolivia
  'DO', // Dominican Republic
  'HN', // Honduras
  'PY', // Paraguay
  'SV', // El Salvador
  'NI', // Nicaragua
  'CR', // Costa Rica
  'PA', // Panama
  'UY', // Uruguay
]);

export type Country = z.infer<typeof CountrySchema>;

// Asset types
export const AssetSchema = z.object({
  type: z.enum(['propiedad', 'vehiculo', 'cuenta_bancaria', 'inversion', 'negocio', 'otro']),
  description: z.string(),
  estimatedValue: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type Asset = z.infer<typeof AssetSchema>;

// Debt types
export const DebtSchema = z.object({
  type: z.enum(['hipoteca', 'prestamo_personal', 'tarjeta_credito', 'prestamo_vehicular', 'otro']),
  description: z.string(),
  amount: z.number(),
  creditor: z.string().optional(),
  notes: z.string().optional(),
});

export type Debt = z.infer<typeof DebtSchema>;

// Heir information
export const HeirSchema = z.object({
  name: z.string(),
  relationship: z.enum(['conyuge', 'hijo', 'hija', 'padre', 'madre', 'hermano', 'hermana', 'otro']),
  percentage: z.number().min(0).max(100).optional(),
  specificAssets: z.array(z.string()).optional(),
  isMinor: z.boolean().optional(),
  guardianName: z.string().optional(),
});

export type Heir = z.infer<typeof HeirSchema>;

// Form response schema
export const FormResponseSchema = z.object({
  // Personal Information
  fullName: z.string(),
  age: z.number().min(18),
  country: CountrySchema,
  email: z.string().email(),
  maritalStatus: z.enum(['soltero', 'casado', 'divorciado', 'viudo', 'union_libre']),
  hasChildren: z.boolean(),
  numberOfChildren: z.number().optional(),
  
  // Assets and Debts
  assets: z.array(AssetSchema),
  debts: z.array(DebtSchema),
  totalEstimatedWealth: z.number().optional(),
  
  // Heirs and Beneficiaries
  heirs: z.array(HeirSchema),
  hasWill: z.boolean(),
  hasExecutor: z.boolean(),
  executorName: z.string().optional(),
  
  // Risk Assessment Questions
  hasMajorIllness: z.boolean().optional(),
  hasLifeInsurance: z.boolean().optional(),
  hasDependents: z.boolean().optional(),
  ownsRealEstate: z.boolean().optional(),
  hasComplexFinances: z.boolean().optional(),
  
  // Additional Notes
  specialRequests: z.string().optional(),
  concerns: z.string().optional(),
});

export type FormResponse = z.infer<typeof FormResponseSchema>;

// Risk levels
export type RiskLevel = 'bajo' | 'medio' | 'alto' | 'critico';

// Normalized data structure for AI processing
export const NormalizedDataSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    age: z.number(),
    country: CountrySchema,
    email: z.string().email(),
    maritalStatus: z.string(),
    hasChildren: z.boolean(),
    numberOfChildren: z.number().optional(),
  }),
  
  financialSummary: z.object({
    totalAssets: z.number(),
    totalDebts: z.number(),
    netWorth: z.number(),
    assetsCount: z.number(),
    debtsCount: z.number(),
    hasRealEstate: z.boolean(),
    hasBusinessOwnership: z.boolean(),
  }),
  
  familySituation: z.object({
    heirsCount: z.number(),
    hasMinorHeirs: z.boolean(),
    hasGuardianDesignated: z.boolean(),
    hasExecutor: z.boolean(),
    executorName: z.string().optional(),
  }),
  
  riskFactors: z.object({
    hasNoWill: z.boolean(),
    hasMajorIllness: z.boolean(),
    hasNoLifeInsurance: z.boolean(),
    hasDependents: z.boolean(),
    hasComplexFinances: z.boolean(),
    significantDebt: z.boolean(),
  }),
  
  rawData: FormResponseSchema,
});

export type NormalizedData = z.infer<typeof NormalizedDataSchema>;

// AI Generated Report
export interface GeneratedReport {
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  riskExplanation: string;
  actionRoadmap: ActionStep[];
  willDraft: string;
  countryGuidance: CountryGuidance;
  generatedAt: string;
}

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  estimatedTime: string;
}

export interface CountryGuidance {
  country: Country;
  legalRequirements: string[];
  notaryProcess: string;
  estimatedCost: string;
  estimatedTimeframe: string;
  importantNotes: string[];
  resources: string[];
}

// Database record
export interface DatabaseRecord {
  id: string;
  userId: string;
  email: string;
  country: Country;
  formResponse: FormResponse;
  normalizedData: NormalizedData;
  generatedReport: GeneratedReport;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}
