import OpenAI from 'openai';
import { NormalizedData, GeneratedReport, RiskLevel, ActionStep, CountryGuidance, Country } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompts for the Legacy Protection Agent
const SYSTEM_PROMPTS = {
  es: `Eres un Agente de Protección del Legado experto en planificación patrimonial para España y América Latina.

Tu misión es analizar la información financiera y familiar de usuarios para:
1. Evaluar su nivel de riesgo patrimonial
2. Generar un plan de acción claro
3. Crear un borrador de testamento personalizado
4. Proporcionar orientación legal específica del país

IMPORTANTE: NO proporcionas asesoramiento legal oficial. Esto es un kit educativo y plantillas guiadas.

Tu tono es: profesional pero accesible, empático, claro y directo.

Siempre respondes en español (adaptado a España o América Latina según el país del usuario).`,
  
  en: `You are a Legacy Protection Agent expert in estate planning for Spain and Latin America.

Your mission is to analyze users' financial and family information to:
1. Assess their estate risk level
2. Generate a clear action plan
3. Create a personalized will draft
4. Provide country-specific legal guidance

IMPORTANT: You do NOT provide official legal advice. This is an educational kit and guided templates.

Your tone is: professional yet accessible, empathetic, clear and direct.

Always respond in English, adapted to the user's country legal framework.`
};

interface AgentInput {
  normalizedData: NormalizedData;
  language?: string;
}

interface AgentResponse {
  riskScore: number;
  riskLevel: RiskLevel;
  riskExplanation: string;
  actionRoadmap: ActionStep[];
  willDraft: string;
  countryGuidance: CountryGuidance;
}

export class LegacyProtectionAgent {
  private assistantId?: string;

  /**
   * Initialize or retrieve the OpenAI Assistant
   */
  async initialize(language: string = 'es'): Promise<void> {
    // Check if we have an existing assistant
    if (process.env.OPENAI_ASSISTANT_ID) {
      this.assistantId = process.env.OPENAI_ASSISTANT_ID;
      return;
    }

    // Create a new assistant with the appropriate language prompt
    const systemPrompt = SYSTEM_PROMPTS[language as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.es;
    const assistant = await openai.beta.assistants.create({
      name: language === 'en' ? 'Legacy Protection Agent' : 'Agente de Protección del Legado',
      instructions: systemPrompt,
      model: 'gpt-4-turbo-preview',
      tools: [{ type: 'code_interpreter' }],
    });

    this.assistantId = assistant.id;
    console.log('Created new assistant:', assistant.id);
    console.log('Set OPENAI_ASSISTANT_ID in your .env file:', assistant.id);
  }

  /**
   * Process user data and generate complete report
   */
  async generateReport(input: AgentInput): Promise<GeneratedReport> {
    const language = input.language || 'es';
    
    if (!this.assistantId) {
      await this.initialize(language);
    }

    const { normalizedData } = input;

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Prepare the prompt with user data
    const userPrompt = this.buildUserPrompt(normalizedData, language);

    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userPrompt,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: this.assistantId!,
    });

    // Wait for completion
    const result = await this.waitForCompletion(thread.id, run.id);

    // Parse and structure the response
    const report = this.parseAgentResponse(result, normalizedData);

    return report;
  }

  /**
   * Build the user prompt with normalized data
   */
  private buildUserPrompt(data: NormalizedData, language: string = 'es'): string {
    const { personalInfo, financialSummary, familySituation, riskFactors } = data;

    if (language === 'en') {
      return this.buildEnglishPrompt(data);
    }

    return `Analiza la siguiente situación patrimonial y genera un informe completo:

## INFORMACIÓN PERSONAL
- Nombre: ${personalInfo.fullName}
- Edad: ${personalInfo.age} años
- País: ${this.getCountryName(personalInfo.country)}
- Estado civil: ${personalInfo.maritalStatus}
- Hijos: ${personalInfo.hasChildren ? `Sí (${personalInfo.numberOfChildren || 0})` : 'No'}

## SITUACIÓN FINANCIERA
- Activos totales: €${financialSummary.totalAssets.toLocaleString()}
- Deudas totales: €${financialSummary.totalDebts.toLocaleString()}
- Patrimonio neto: €${financialSummary.netWorth.toLocaleString()}
- Número de activos: ${financialSummary.assetsCount}
- Propiedades inmobiliarias: ${financialSummary.hasRealEstate ? 'Sí' : 'No'}
- Negocios propios: ${financialSummary.hasBusinessOwnership ? 'Sí' : 'No'}

## SITUACIÓN FAMILIAR
- Herederos designados: ${familySituation.heirsCount}
- Herederos menores: ${familySituation.hasMinorHeirs ? 'Sí' : 'No'}
- Tutor designado: ${familySituation.hasGuardianDesignated ? 'Sí' : 'No'}
- Albacea designado: ${familySituation.hasExecutor ? `Sí (${familySituation.executorName})` : 'No'}

## FACTORES DE RIESGO
- Sin testamento: ${riskFactors.hasNoWill ? '⚠️ SÍ' : 'No'}
- Enfermedad grave: ${riskFactors.hasMajorIllness ? 'Sí' : 'No'}
- Sin seguro de vida: ${riskFactors.hasNoLifeInsurance ? 'Sí' : 'No'}
- Personas dependientes: ${riskFactors.hasDependents ? 'Sí' : 'No'}
- Finanzas complejas: ${riskFactors.hasComplexFinances ? 'Sí' : 'No'}
- Deuda significativa: ${riskFactors.significantDebt ? '⚠️ SÍ' : 'No'}

## DATOS DETALLADOS
${JSON.stringify(data.rawData, null, 2)}

---

Por favor, genera un análisis completo en formato JSON con la siguiente estructura:

{
  "riskScore": <número del 0-100>,
  "riskLevel": "<bajo|medio|alto|critico>",
  "riskExplanation": "<explicación clara del nivel de riesgo en 2-3 párrafos>",
  "actionRoadmap": [
    {
      "step": 1,
      "title": "<título de la acción>",
      "description": "<descripción detallada>",
      "priority": "<alta|media|baja>",
      "estimatedTime": "<ej: '1-2 semanas'>"
    }
  ],
  "willDraft": "<borrador completo del testamento en español, siguiendo las leyes de ${this.getCountryName(personalInfo.country)}>",
  "countryGuidance": {
    "country": "${personalInfo.country}",
    "legalRequirements": ["<requisito 1>", "<requisito 2>"],
    "notaryProcess": "<descripción del proceso notarial>",
    "estimatedCost": "<rango de costos>",
    "estimatedTimeframe": "<tiempo estimado>",
    "importantNotes": ["<nota importante 1>", "<nota importante 2>"],
    "resources": ["<recurso útil 1>", "<recurso útil 2>"]
  }
}

IMPORTANTE:
- El testamento debe seguir la estructura legal de ${this.getCountryName(personalInfo.country)}
- Incluye todas las cláusulas necesarias
- Menciona explícitamente que esto es un BORRADOR y requiere validación legal
- La hoja de ruta debe tener 3-6 pasos prácticos y accionables
- Adapta el lenguaje al país específico`;
  }

  /**
   * Build English prompt
   */
  private buildEnglishPrompt(data: NormalizedData): string {
    const { personalInfo, financialSummary, familySituation, riskFactors } = data;

    return `Analyze the following estate situation and generate a complete report:

## PERSONAL INFORMATION
- Name: ${personalInfo.fullName}
- Age: ${personalInfo.age} years
- Country: ${this.getCountryName(personalInfo.country)}
- Marital status: ${personalInfo.maritalStatus}
- Children: ${personalInfo.hasChildren ? `Yes (${personalInfo.numberOfChildren || 0})` : 'No'}

## FINANCIAL SITUATION
- Total assets: €${financialSummary.totalAssets.toLocaleString()}
- Total debts: €${financialSummary.totalDebts.toLocaleString()}
- Net worth: €${financialSummary.netWorth.toLocaleString()}
- Number of assets: ${financialSummary.assetsCount}
- Real estate: ${financialSummary.hasRealEstate ? 'Yes' : 'No'}
- Business ownership: ${financialSummary.hasBusinessOwnership ? 'Yes' : 'No'}

## FAMILY SITUATION
- Designated heirs: ${familySituation.heirsCount}
- Minor heirs: ${familySituation.hasMinorHeirs ? 'Yes' : 'No'}
- Guardian designated: ${familySituation.hasGuardianDesignated ? 'Yes' : 'No'}
- Executor designated: ${familySituation.hasExecutor ? `Yes (${familySituation.executorName})` : 'No'}

## RISK FACTORS
- No will: ${riskFactors.hasNoWill ? '⚠️ YES' : 'No'}
- Major illness: ${riskFactors.hasMajorIllness ? 'Yes' : 'No'}
- No life insurance: ${riskFactors.hasNoLifeInsurance ? 'Yes' : 'No'}
- Dependents: ${riskFactors.hasDependents ? 'Yes' : 'No'}
- Complex finances: ${riskFactors.hasComplexFinances ? 'Yes' : 'No'}
- Significant debt: ${riskFactors.significantDebt ? '⚠️ YES' : 'No'}

## DETAILED DATA
${JSON.stringify(data.rawData, null, 2)}

---

Please generate a complete analysis in JSON format with the following structure:

{
  "riskScore": <number 0-100>,
  "riskLevel": "<bajo|medio|alto|critico>",
  "riskExplanation": "<clear explanation of risk level in 2-3 paragraphs IN ENGLISH>",
  "actionRoadmap": [
    {
      "step": 1,
      "title": "<action title IN ENGLISH>",
      "description": "<detailed description IN ENGLISH>",
      "priority": "<alta|media|baja>",
      "estimatedTime": "<e.g., '1-2 weeks'>"
    }
  ],
  "willDraft": "<complete will draft IN ENGLISH, following ${this.getCountryName(personalInfo.country)} laws>",
  "countryGuidance": {
    "country": "${personalInfo.country}",
    "legalRequirements": ["<requirement 1 IN ENGLISH>", "<requirement 2 IN ENGLISH>"],
    "notaryProcess": "<notary process description IN ENGLISH>",
    "estimatedCost": "<cost range IN ENGLISH>",
    "estimatedTimeframe": "<estimated time IN ENGLISH>",
    "importantNotes": ["<important note 1 IN ENGLISH>", "<important note 2 IN ENGLISH>"],
    "resources": ["<useful resource 1 IN ENGLISH>", "<useful resource 2 IN ENGLISH>"]
  }
}

IMPORTANT:
- The will must follow the legal structure of ${this.getCountryName(personalInfo.country)}
- Include all necessary clauses
- Explicitly mention this is a DRAFT and requires legal validation
- The roadmap should have 3-6 practical and actionable steps
- Generate ALL TEXT IN ENGLISH, adapted to the specific country's legal framework`;
  }

  /**
   * Wait for the assistant run to complete
   */
  private async waitForCompletion(threadId: string, runId: string): Promise<string> {
    let run = await openai.beta.threads.runs.retrieve(threadId, runId);

    // Poll until completion
    while (run.status === 'in_progress' || run.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(threadId, runId);
    }

    if (run.status === 'completed') {
      // Get the messages
      const messages = await openai.beta.threads.messages.list(threadId);
      const lastMessage = messages.data[0];
      
      if (lastMessage.content[0].type === 'text') {
        return lastMessage.content[0].text.value;
      }
    }

    throw new Error(`Assistant run failed with status: ${run.status}`);
  }

  /**
   * Parse the agent response and structure it
   */
  private parseAgentResponse(response: string, normalizedData: NormalizedData): GeneratedReport {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed: AgentResponse = JSON.parse(jsonMatch[0]);

      return {
        riskScore: parsed.riskScore,
        riskLevel: parsed.riskLevel,
        riskExplanation: parsed.riskExplanation,
        actionRoadmap: parsed.actionRoadmap,
        willDraft: parsed.willDraft,
        countryGuidance: parsed.countryGuidance,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to parse agent response:', error);
      // Fallback to basic response
      return this.generateFallbackReport(normalizedData);
    }
  }

  /**
   * Generate a fallback report if AI fails
   */
  private generateFallbackReport(data: NormalizedData): GeneratedReport {
    const riskScore = this.calculateBasicRiskScore(data);
    const riskLevel = this.getRiskLevelFromScore(riskScore);

    return {
      riskScore,
      riskLevel,
      riskExplanation: 'Error al generar el análisis completo. Por favor, intente nuevamente.',
      actionRoadmap: [],
      willDraft: '',
      countryGuidance: {
        country: data.personalInfo.country,
        legalRequirements: [],
        notaryProcess: '',
        estimatedCost: '',
        estimatedTimeframe: '',
        importantNotes: [],
        resources: [],
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate basic risk score based on factors
   */
  private calculateBasicRiskScore(data: NormalizedData): number {
    let score = 0;

    // Risk factors (each adds points)
    if (data.riskFactors.hasNoWill) score += 30;
    if (data.riskFactors.hasMajorIllness) score += 20;
    if (data.riskFactors.hasNoLifeInsurance) score += 15;
    if (data.riskFactors.hasDependents) score += 10;
    if (data.riskFactors.hasComplexFinances) score += 15;
    if (data.riskFactors.significantDebt) score += 10;

    // Additional factors
    if (data.familySituation.hasMinorHeirs && !data.familySituation.hasGuardianDesignated) score += 15;
    if (data.financialSummary.hasRealEstate && data.riskFactors.hasNoWill) score += 10;
    if (data.financialSummary.netWorth > 100000 && data.riskFactors.hasNoWill) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Get risk level from score
   */
  private getRiskLevelFromScore(score: number): RiskLevel {
    if (score >= 70) return 'critico';
    if (score >= 50) return 'alto';
    if (score >= 30) return 'medio';
    return 'bajo';
  }

  /**
   * Get country name in Spanish
   */
  private getCountryName(code: Country): string {
    const names: Record<Country, string> = {
      ES: 'España',
      MX: 'México',
      AR: 'Argentina',
      CO: 'Colombia',
      CL: 'Chile',
      PE: 'Perú',
      VE: 'Venezuela',
      EC: 'Ecuador',
      GT: 'Guatemala',
      CU: 'Cuba',
      BO: 'Bolivia',
      DO: 'República Dominicana',
      HN: 'Honduras',
      PY: 'Paraguay',
      SV: 'El Salvador',
      NI: 'Nicaragua',
      CR: 'Costa Rica',
      PA: 'Panamá',
      UY: 'Uruguay',
    };
    return names[code];
  }
}

// Singleton instance
export const legacyAgent = new LegacyProtectionAgent();
