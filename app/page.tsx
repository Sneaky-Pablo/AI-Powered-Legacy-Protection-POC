'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Language = 'es' | 'en';

const translations = {
  es: {
    title: 'Agente de Protección del Legado',
    subtitle: 'Sistema POC impulsado por IA que genera informes personalizados de protección patrimonial, borradores de testamento y guías legales para España y América Latina.',
    whatOffers: '¿Qué ofrece este sistema?',
    riskEval: 'Evaluación de Riesgo',
    riskEvalDesc: 'Análisis personalizado de tu situación patrimonial',
    willDraft: 'Borrador de Testamento',
    willDraftDesc: 'Generado según las leyes de tu país',
    actionPlan: 'Plan de Acción',
    actionPlanDesc: 'Pasos claros y prácticos a seguir',
    legalGuide: 'Guía Legal',
    legalGuideDesc: 'Información para formalizar con notario',
    important: 'Importante:',
    disclaimer: 'Este es un kit educativo y NO constituye asesoramiento legal oficial. Los documentos generados deben ser revisados por un abogado especializado.',
    tryDemo: 'Probar Demo Interactiva',
    techStack: 'Stack Técnico',
    frontend: 'Frontend',
    backendAI: 'Backend & IA',
    database: 'Database',
    featuresImpl: 'Características Implementadas',
    features: [
      'Sistema de normalización de datos de formularios',
      'Agente de IA con OpenAI Assistants API',
      'Evaluación de riesgo automatizada',
      'Generación de testamentos por país (19 países)',
      'Guías legales específicas por país',
      'Generación de PDF profesional',
      'Integración con Supabase (database + storage)',
      'API REST completa'
    ]
  },
  en: {
    title: 'Legacy Protection Agent',
    subtitle: 'AI-powered POC system that generates personalized estate protection reports, will drafts, and legal guides for Spain and Latin America.',
    whatOffers: 'What does this system offer?',
    riskEval: 'Risk Assessment',
    riskEvalDesc: 'Personalized analysis of your estate situation',
    willDraft: 'Will Draft',
    willDraftDesc: 'Generated according to your country\'s laws',
    actionPlan: 'Action Plan',
    actionPlanDesc: 'Clear and practical steps to follow',
    legalGuide: 'Legal Guide',
    legalGuideDesc: 'Information for notary formalization',
    important: 'Important:',
    disclaimer: 'This is an educational kit and does NOT constitute official legal advice. Generated documents must be reviewed by a specialized lawyer.',
    tryDemo: 'Try Interactive Demo',
    techStack: 'Technical Stack',
    frontend: 'Frontend',
    backendAI: 'Backend & AI',
    database: 'Database',
    featuresImpl: 'Implemented Features',
    features: [
      'Form data normalization system',
      'AI agent with OpenAI Assistants API',
      'Automated risk assessment',
      'Country-specific will generation (19 countries)',
      'Country-specific legal guides',
      'Professional PDF generation',
      'Supabase integration (database + storage)',
      'Complete REST API'
    ]
  }
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>('es');
  const t = translations[language];

  // Load language from URL params or localStorage on mount
  useEffect(() => {
    const langParam = searchParams.get('lang') as Language;
    if (langParam === 'en' || langParam === 'es') {
      setLanguage(langParam);
      localStorage.setItem('language', langParam);
    } else {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage) {
        setLanguage(savedLanguage);
        // Update URL to reflect saved language
        const params = new URLSearchParams(searchParams.toString());
        params.set('lang', savedLanguage);
        router.replace(`/?${params.toString()}`, { scroll: false });
      } else {
        // Set default language in URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('lang', 'es');
        router.replace(`/?${params.toString()}`, { scroll: false });
      }
    }
  }, [searchParams, router]);

  // Save language to localStorage and URL when it changes
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Update URL query param
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLanguage);
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm border border-indigo-200">
              <span className={`text-sm font-medium transition-colors ${language === 'es' ? 'text-indigo-600' : 'text-gray-400'}`}>
                Español
              </span>
              <button
                onClick={() => handleLanguageChange(language === 'es' ? 'en' : 'es')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                style={{ backgroundColor: language === 'en' ? '#4F46E5' : '#E5E7EB' }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    language === 'en' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${language === 'en' ? 'text-indigo-600' : 'text-gray-400'}`}>
                English
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🛡️ {t.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.whatOffers}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.riskEval}</h3>
                    <p className="text-sm text-gray-600">{t.riskEvalDesc}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.willDraft}</h3>
                    <p className="text-sm text-gray-600">{t.willDraftDesc}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.actionPlan}</h3>
                    <p className="text-sm text-gray-600">{t.actionPlanDesc}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.legalGuide}</h3>
                    <p className="text-sm text-gray-600">{t.legalGuideDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>{t.important}</strong> {t.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href={`/demo?lang=${language}`}
                className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-colors text-lg"
              >
                {t.tryDemo}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Technical Stack */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.techStack}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t.frontend}</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Next.js 15</li>
                  <li>• React 19</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t.backendAI}</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• OpenAI GPT-4</li>
                  <li>• Assistants API</li>
                  <li>• Zod {language === 'es' ? '(validación)' : '(validation)'}</li>
                  <li>• jsPDF</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t.database}</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Supabase</li>
                  <li>• PostgreSQL</li>
                  <li>• Storage API</li>
                  <li>• Real-time sync</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.featuresImpl}</h2>
            <div className="space-y-3">
              {t.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Cargando...</div>
    </div>}>
      <HomeContent />
    </Suspense>
  );
}
