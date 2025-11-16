import { FormResponse, NormalizedData, Asset, Debt, Heir } from './types';

/**
 * Normalize form responses into structured data for AI processing
 */
export function normalizeFormData(formResponse: FormResponse): NormalizedData {
  const financialSummary = calculateFinancialSummary(formResponse.assets, formResponse.debts);
  const familySituation = analyzeFamilySituation(formResponse);
  const riskFactors = assessRiskFactors(formResponse, financialSummary);

  return {
    personalInfo: {
      fullName: formResponse.fullName,
      age: formResponse.age,
      country: formResponse.country,
      email: formResponse.email,
      maritalStatus: formResponse.maritalStatus,
      hasChildren: formResponse.hasChildren,
      numberOfChildren: formResponse.numberOfChildren,
    },
    
    financialSummary,
    familySituation,
    riskFactors,
    
    rawData: formResponse,
  };
}

/**
 * Calculate financial summary from assets and debts
 */
function calculateFinancialSummary(assets: Asset[], debts: Debt[]) {
  const totalAssets = assets.reduce((sum, asset) => sum + (asset.estimatedValue || 0), 0);
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const netWorth = totalAssets - totalDebts;

  const hasRealEstate = assets.some(asset => asset.type === 'propiedad');
  const hasBusinessOwnership = assets.some(asset => asset.type === 'negocio');

  return {
    totalAssets,
    totalDebts,
    netWorth,
    assetsCount: assets.length,
    debtsCount: debts.length,
    hasRealEstate,
    hasBusinessOwnership,
  };
}

/**
 * Analyze family situation from form data
 */
function analyzeFamilySituation(formResponse: FormResponse) {
  const heirs = formResponse.heirs;
  const hasMinorHeirs = heirs.some(heir => heir.isMinor === true);
  const hasGuardianDesignated = heirs.some(heir => heir.isMinor && heir.guardianName);

  return {
    heirsCount: heirs.length,
    hasMinorHeirs,
    hasGuardianDesignated,
    hasExecutor: formResponse.hasExecutor,
    executorName: formResponse.executorName,
  };
}

/**
 * Assess risk factors
 */
function assessRiskFactors(formResponse: FormResponse, financialSummary: ReturnType<typeof calculateFinancialSummary>) {
  // Debt is significant if it's more than 50% of assets
  const significantDebt = financialSummary.totalDebts > (financialSummary.totalAssets * 0.5);

  return {
    hasNoWill: !formResponse.hasWill,
    hasMajorIllness: formResponse.hasMajorIllness || false,
    hasNoLifeInsurance: !formResponse.hasLifeInsurance,
    hasDependents: formResponse.hasDependents || false,
    hasComplexFinances: formResponse.hasComplexFinances || false,
    significantDebt,
  };
}

/**
 * Validate form data before processing
 */
export function validateFormData(data: unknown): FormResponse {
  const { FormResponseSchema } = require('./types');
  return FormResponseSchema.parse(data);
}

/**
 * Calculate inheritance distribution percentages
 */
export function calculateInheritanceDistribution(heirs: Heir[]): Map<string, number> {
  const distribution = new Map<string, number>();
  
  // If percentages are already specified, use them
  const hasPercentages = heirs.some(heir => heir.percentage !== undefined);
  
  if (hasPercentages) {
    heirs.forEach(heir => {
      if (heir.percentage) {
        distribution.set(heir.name, heir.percentage);
      }
    });
  } else {
    // Equal distribution
    const percentage = 100 / heirs.length;
    heirs.forEach(heir => {
      distribution.set(heir.name, percentage);
    });
  }
  
  return distribution;
}

/**
 * Generate a summary text for the user
 */
export function generateSummaryText(normalized: NormalizedData): string {
  const { personalInfo, financialSummary, familySituation, riskFactors } = normalized;
  
  let summary = `Resumen para ${personalInfo.fullName}\n\n`;
  
  // Financial
  summary += `💰 SITUACIÓN FINANCIERA\n`;
  summary += `- Patrimonio neto: €${financialSummary.netWorth.toLocaleString()}\n`;
  summary += `- Activos: €${financialSummary.totalAssets.toLocaleString()}\n`;
  summary += `- Deudas: €${financialSummary.totalDebts.toLocaleString()}\n\n`;
  
  // Family
  summary += `👨‍👩‍👧‍👦 SITUACIÓN FAMILIAR\n`;
  summary += `- Herederos designados: ${familySituation.heirsCount}\n`;
  summary += `- Estado civil: ${personalInfo.maritalStatus}\n`;
  summary += `- Hijos: ${personalInfo.hasChildren ? personalInfo.numberOfChildren : 0}\n\n`;
  
  // Risks
  summary += `⚠️ FACTORES DE RIESGO IDENTIFICADOS\n`;
  const risks: string[] = [];
  if (riskFactors.hasNoWill) risks.push('Sin testamento');
  if (riskFactors.hasMajorIllness) risks.push('Enfermedad grave');
  if (riskFactors.hasNoLifeInsurance) risks.push('Sin seguro de vida');
  if (riskFactors.hasDependents) risks.push('Personas dependientes');
  if (riskFactors.significantDebt) risks.push('Deuda significativa');
  
  if (risks.length === 0) {
    summary += '- Ninguno identificado\n';
  } else {
    risks.forEach(risk => {
      summary += `- ${risk}\n`;
    });
  }
  
  return summary;
}
