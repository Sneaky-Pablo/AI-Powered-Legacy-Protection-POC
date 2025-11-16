'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Country } from '@/lib/types';

type Language = 'es' | 'en';

const translations = {
  es: {
    title: 'Agente de Protección del Legado',
    subtitle: 'Analiza tu situación patrimonial y genera recomendaciones personalizadas',
    languageButton: 'English',
    editButton: 'Editar Información',
    saveButton: 'Guardar Cambios',
    generateButton: 'Generar Reporte',
    generating: 'Generando reporte...',
    emailLabel: 'Tu Correo Electrónico',
    emailPlaceholder: 'tu@email.com',
    personalInfo: 'Información Personal',
    fullName: 'Nombre Completo',
    age: 'Edad',
    country: 'País',
    maritalStatus: 'Estado Civil',
    numberOfChildren: 'Número de Hijos',
    assets: 'Activos',
    addAsset: 'Agregar Activo',
    description: 'Descripción',
    estimatedValue: 'Valor Estimado (€)',
    debts: 'Deudas',
    addDebt: 'Agregar Deuda',
    amount: 'Monto (€)',
    heirs: 'Herederos',
    addHeir: 'Agregar Heredero',
    name: 'Nombre',
    relationship: 'Relación',
    percentage: 'Porcentaje (%)',
    remove: 'Eliminar',
    report: 'Reporte Generado',
    downloadPDF: 'Descargar PDF',
    emailSent: 'También se ha enviado a tu correo electrónico',
    maritalStatuses: {
      soltero: 'Soltero/a',
      casado: 'Casado/a',
      divorciado: 'Divorciado/a',
      viudo: 'Viudo/a',
      union_libre: 'Unión Libre'
    },
    relationships: {
      conyuge: 'Cónyuge',
      hijo: 'Hijo/a',
      padre: 'Padre/Madre',
      hermano: 'Hermano/a',
      otro: 'Otro'
    }
  },
  en: {
    title: 'Legacy Protection Agent',
    subtitle: 'Analyze your estate situation and generate personalized recommendations',
    languageButton: 'Español',
    editButton: 'Edit Information',
    saveButton: 'Save Changes',
    generateButton: 'Generate Report',
    generating: 'Generating report...',
    emailLabel: 'Your Email Address',
    emailPlaceholder: 'your@email.com',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    age: 'Age',
    country: 'Country',
    maritalStatus: 'Marital Status',
    numberOfChildren: 'Number of Children',
    assets: 'Assets',
    addAsset: 'Add Asset',
    description: 'Description',
    estimatedValue: 'Estimated Value (€)',
    debts: 'Debts',
    addDebt: 'Add Debt',
    amount: 'Amount (€)',
    heirs: 'Heirs',
    addHeir: 'Add Heir',
    name: 'Name',
    relationship: 'Relationship',
    percentage: 'Percentage (%)',
    remove: 'Remove',
    report: 'Generated Report',
    downloadPDF: 'Download PDF',
    emailSent: 'Also sent to your email',
    maritalStatuses: {
      soltero: 'Single',
      casado: 'Married',
      divorciado: 'Divorced',
      viudo: 'Widowed',
      union_libre: 'Common Law'
    },
    relationships: {
      conyuge: 'Other',
      hijo: 'Child',
      padre: 'Parent',
      hermano: 'Sibling',
      otro: 'Other'
    },
    riskLevels: {
      bajo: 'Low',
      medio: 'Medium',
      alto: 'High',
      critico: 'Critical'
    },
    priorities: {
      alta: 'High',
      media: 'Medium',
      baja: 'Low'
    }
  }
};

// Helper function to translate risk levels and priorities
const translateRiskLevel = (level: string, language: string): string => {
  if (language === 'en') {
    const mapping: Record<string, string> = {
      bajo: 'Low',
      medio: 'Medium',
      alto: 'High',
      critico: 'Critical'
    };
    return mapping[level.toLowerCase()] || level;
  }
  return level;
};

const translatePriority = (priority: string, language: string): string => {
  if (language === 'en') {
    const mapping: Record<string, string> = {
      alta: 'High',
      media: 'Medium',
      baja: 'Low'
    };
    return mapping[priority.toLowerCase()] || priority;
  }
  return priority;
};

function DemoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>('es');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
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
        router.replace(`/demo?${params.toString()}`, { scroll: false });
      } else {
        // Set default language in URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('lang', 'es');
        router.replace(`/demo?${params.toString()}`, { scroll: false });
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
    router.replace(`/demo?${params.toString()}`, { scroll: false });
  };
  
  const [formData, setFormData] = useState({
    fullName: 'Juan Pérez García',
    age: 45,
    country: 'ES' as Country,
    email: 'juan.perez@example.com',
    maritalStatus: 'casado',
    hasChildren: true,
    numberOfChildren: 2,
    
    assets: [
      {
        type: 'propiedad',
        description: 'Vivienda principal en Madrid',
        estimatedValue: 350000,
        location: 'Madrid',
      },
      {
        type: 'cuenta_bancaria',
        description: 'Cuenta de ahorros',
        estimatedValue: 50000,
      },
    ],
    
    debts: [
      {
        type: 'hipoteca',
        description: 'Hipoteca vivienda',
        amount: 120000,
        creditor: 'Banco Santander',
      },
    ],
    
    heirs: [
      {
        name: 'María Pérez López',
        relationship: 'conyuge',
        percentage: 50,
      },
      {
        name: 'Carlos Pérez López',
        relationship: 'hijo',
        percentage: 25,
      },
      {
        name: 'Ana Pérez López',
        relationship: 'hija',
        percentage: 25,
      },
    ],
    
    hasWill: false,
    hasExecutor: false,
    hasMajorIllness: false,
    hasLifeInsurance: true,
    hasDependents: true,
    ownsRealEstate: true,
    hasComplexFinances: false,
    
    specialRequests: 'Quiero asegurarme de que mis hijos reciban su herencia de manera equitativa.',
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        setStep(3);
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
        console.error('Error details:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el informe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t.title}
            </h1>
            <p className="text-gray-600">
              {t.subtitle}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">{language === 'es' ? 'Datos' : 'Data'}</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">{language === 'es' ? 'Generando' : 'Generating'}</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className={`flex items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">{language === 'es' ? 'Resultado' : 'Result'}</span>
              </div>
            </div>
          </div>

          {/* Step 1: Form Data Preview */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? t.editButton : (language === 'es' ? 'Datos de Ejemplo' : 'Sample Data')}
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  {isEditing ? `👁️ ${language === 'es' ? 'Ver Resumen' : 'View Summary'}` : `✏️ ${t.editButton}`}
                </button>
              </div>

              {/* Email Field - Always Visible */}
              <div className="mb-6 bg-indigo-50 border-2 border-indigo-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  📧 {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder={t.emailPlaceholder}
                  required
                />
              </div>

              {!isEditing ? (
                // Preview Mode
                <div className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.personalInfo}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-900">
                    <p><strong>{t.fullName}:</strong> {formData.fullName}</p>
                    <p><strong>{t.age}:</strong> {formData.age} {language === 'es' ? 'años' : 'years'}</p>
                    <p><strong>{t.country}:</strong> {language === 'es' ? 'España' : 'Spain'}</p>
                    <p><strong>{t.maritalStatus}:</strong> {t.maritalStatuses[formData.maritalStatus as keyof typeof t.maritalStatuses]}</p>
                    <p><strong>{t.numberOfChildren}:</strong> {formData.numberOfChildren}</p>
                  </div>
                </div>

                {/* Assets */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.assets}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-900">
                    {formData.assets.map((asset, idx) => (
                      <div key={idx} className="border-l-4 border-green-500 pl-3">
                        <p><strong>{asset.description}</strong></p>
                        <p>{t.estimatedValue}: €{asset.estimatedValue?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Debts */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.debts}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-900">
                    {formData.debts.map((debt, idx) => (
                      <div key={idx} className="border-l-4 border-red-500 pl-3">
                        <p><strong>{debt.description}</strong></p>
                        <p>{t.amount}: €{debt.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heirs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.heirs}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-900">
                    {formData.heirs.map((heir, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-3">
                        <p><strong>{heir.name}</strong> ({t.relationships[heir.relationship as keyof typeof t.relationships]})</p>
                        <p>{t.percentage}: {heir.percentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{language === 'es' ? 'Factores de Riesgo' : 'Risk Factors'}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm text-gray-900">
                    <p>❌ {language === 'es' ? 'Sin testamento actual' : 'No current will'}</p>
                    <p>✓ {language === 'es' ? 'Tiene seguro de vida' : 'Has life insurance'}</p>
                    <p>✓ {language === 'es' ? 'Tiene personas dependientes' : 'Has dependents'}</p>
                    <p>✓ {language === 'es' ? 'Propietario de inmuebles' : 'Property owner'}</p>
                  </div>
                </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.personalInfo}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">{t.fullName}</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">{t.age}</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                          min="18"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">{t.country}</label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value as Country})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                        >
                          <option value="ES">🇪🇸 España</option>
                          <option value="MX">🇲🇽 México</option>
                          <option value="AR">🇦🇷 Argentina</option>
                          <option value="CO">🇨🇴 Colombia</option>
                          <option value="CL">🇨🇱 Chile</option>
                          <option value="PE">🇵🇪 Perú</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">{t.maritalStatus}</label>
                        <select
                          value={formData.maritalStatus}
                          onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                        >
                          <option value="soltero">{t.maritalStatuses.soltero}</option>
                          <option value="casado">{t.maritalStatuses.casado}</option>
                          <option value="divorciado">{t.maritalStatuses.divorciado}</option>
                          <option value="viudo">{t.maritalStatuses.viudo}</option>
                          <option value="union_libre">{t.maritalStatuses.union_libre}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">{t.numberOfChildren}</label>
                        <input
                          type="number"
                          value={formData.numberOfChildren}
                          onChange={(e) => setFormData({...formData, numberOfChildren: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assets */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.assets}</h3>
                    {formData.assets.map((asset, idx) => (
                      <div key={idx} className="mb-4 p-4 bg-white rounded border border-gray-200">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">{t.description}</label>
                            <input
                              type="text"
                              value={asset.description}
                              onChange={(e) => {
                                const newAssets = [...formData.assets];
                                newAssets[idx].description = e.target.value;
                                setFormData({...formData, assets: newAssets});
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">{t.estimatedValue}</label>
                            <input
                              type="number"
                              value={asset.estimatedValue}
                              onChange={(e) => {
                                const newAssets = [...formData.assets];
                                newAssets[idx].estimatedValue = parseInt(e.target.value);
                                setFormData({...formData, assets: newAssets});
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Debts */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.debts}</h3>
                    {formData.debts.map((debt, idx) => (
                      <div key={idx} className="mb-4 p-4 bg-white rounded border border-gray-200">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">{t.description}</label>
                            <input
                              type="text"
                              value={debt.description}
                              onChange={(e) => {
                                const newDebts = [...formData.debts];
                                newDebts[idx].description = e.target.value;
                                setFormData({...formData, debts: newDebts});
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">{t.amount}</label>
                            <input
                              type="number"
                              value={debt.amount}
                              onChange={(e) => {
                                const newDebts = [...formData.debts];
                                newDebts[idx].amount = parseInt(e.target.value);
                                setFormData({...formData, debts: newDebts});
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Heirs */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.heirs}</h3>
                    {formData.heirs.map((heir, idx) => (
                      <div key={idx} className="mb-4 p-4 bg-white rounded border border-gray-200">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">{t.name}</label>
                            <input
                              type="text"
                              value={heir.name}
                              onChange={(e) => {
                                const newHeirs = [...formData.heirs];
                                newHeirs[idx].name = e.target.value;
                                setFormData({...formData, heirs: newHeirs});
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">{t.relationship}</label>
                            <select
                              value={heir.relationship}
                              onChange={(e) => {
                                const newHeirs = [...formData.heirs];
                                newHeirs[idx].relationship = e.target.value as any;
                                setFormData({...formData, heirs: newHeirs});
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                            >
                              <option value="conyuge">{t.relationships.conyuge}</option>
                              <option value="hijo">{t.relationships.hijo}</option>
                              <option value="hija">{t.relationships.hijo}</option>
                              <option value="padre">{t.relationships.padre}</option>
                              <option value="madre">{t.relationships.padre}</option>
                              <option value="hermano">{t.relationships.hermano}</option>
                              <option value="hermana">{t.relationships.hermano}</option>
                              <option value="otro">{t.relationships.otro}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">{t.percentage}</label>
                            <input
                              type="number"
                              value={heir.percentage}
                              onChange={(e) => {
                                const newHeirs = [...formData.heirs];
                                newHeirs[idx].percentage = parseInt(e.target.value);
                                setFormData({...formData, heirs: newHeirs});
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Switches */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{language === 'es' ? 'Información Adicional' : 'Additional Information'}</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.hasWill}
                          onChange={(e) => setFormData({...formData, hasWill: e.target.checked})}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-gray-700">{language === 'es' ? '¿Tiene testamento actual?' : 'Do you have a current will?'}</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.hasLifeInsurance || false}
                          onChange={(e) => setFormData({...formData, hasLifeInsurance: e.target.checked})}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-gray-700">{language === 'es' ? '¿Tiene seguro de vida?' : 'Do you have life insurance?'}</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.hasDependents || false}
                          onChange={(e) => setFormData({...formData, hasDependents: e.target.checked})}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-gray-700">{language === 'es' ? '¿Tiene personas dependientes?' : 'Do you have dependents?'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setStep(2);
                    handleSubmit();
                  }}
                  disabled={loading}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-colors text-lg disabled:opacity-50"
                >
                  {loading ? t.generating : t.generateButton}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Loading */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t.generating}
              </h2>
              <p className="text-gray-600">
                {language === 'es' ? 'El agente de IA está analizando tu información' : 'The AI agent is analyzing your information'}
              </p>
              <div className="mt-8 space-y-2 text-sm text-gray-500">
                <p>✓ {language === 'es' ? 'Normalizando datos...' : 'Normalizing data...'}</p>
                <p>✓ {language === 'es' ? 'Evaluando riesgos...' : 'Evaluating risks...'}</p>
                <p>✓ {language === 'es' ? 'Generando testamento...' : 'Generating will...'}</p>
                <p>✓ {language === 'es' ? 'Creando PDF...' : 'Creating PDF...'}</p>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {language === 'es' ? '¡Informe Generado!' : 'Report Generated!'}
                </h2>
                <p className="text-gray-600">
                  {language === 'es' ? 'Tu informe de protección del legado está listo' : 'Your legacy protection report is ready'}
                </p>
              </div>

              {/* Risk Score */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {language === 'es' ? 'Nivel de Riesgo' : 'Risk Level'}
                    </h3>
                    <p className="text-3xl font-bold text-red-600">
                      {result.report.riskScore}/100
                    </p>
                    <p className="text-sm text-gray-600 uppercase font-semibold mt-1">
                      {translateRiskLevel(result.report.riskLevel, language)}
                    </p>
                  </div>
                  <div className="text-5xl">
                    {result.report.riskLevel === 'critico' ? '🚨' : 
                     result.report.riskLevel === 'alto' ? '⚠️' :
                     result.report.riskLevel === 'medio' ? '⚡' : '✓'}
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {language === 'es' ? 'Explicación del Riesgo' : 'Risk Explanation'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {result.report.riskExplanation}
                </p>
              </div>

              {/* Action Roadmap */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {language === 'es' ? 'Plan de Acción Recomendado' : 'Recommended Action Plan'}
                </h3>
                <div className="space-y-4">
                  {result.report.actionRoadmap.map((action: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900">
                        {action.step}. {action.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>
                      <div className="flex gap-2 mt-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          action.priority === 'alta' ? 'bg-red-100 text-red-700' :
                          action.priority === 'media' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {language === 'es' ? 'Prioridad' : 'Priority'}: {translatePriority(action.priority, language)}
                        </span>
                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
                          {action.estimatedTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download PDF */}
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={() => {
                    // Convert base64 to blob and download
                    const byteCharacters = atob(result.pdfBase64);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `informe-legado-${formData.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
                    link.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
                >
                  📄 {t.downloadPDF}
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setResult(null);
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  {language === 'es' ? 'Generar Otro Informe' : 'Generate Another Report'}
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ✉️ {t.emailSent}: <strong>{formData.email}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Back Button */}
          {step === 1 && (
            <div className="text-center mt-8">
              <a href={`/?lang=${language}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                ← {language === 'es' ? 'Volver al inicio' : 'Back to home'}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Cargando...</div>
    </div>}>
      <DemoPageContent />
    </Suspense>
  );
}
