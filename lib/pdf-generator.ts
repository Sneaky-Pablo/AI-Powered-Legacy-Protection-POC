import { jsPDF } from 'jspdf';
import { GeneratedReport, NormalizedData } from './types';

/**
 * Generate a PDF report from the AI-generated content
 */
export async function generatePDF(
  normalizedData: NormalizedData,
  report: GeneratedReport,
  language: string = 'es'
): Promise<Buffer> {
  const translations = {
    es: {
      title: 'INFORME DE PROTECCIÓN DEL LEGADO',
      disclaimer1: '⚠️ IMPORTANTE: Este documento es un KIT EDUCATIVO y NO constituye',
      disclaimer2: 'asesoramiento legal oficial. Debe ser revisado por un abogado especializado.',
      section1: '1. INFORMACIÓN PERSONAL',
      name: 'Nombre',
      age: 'Edad',
      years: 'años',
      country: 'País',
      maritalStatus: 'Estado civil',
      reportDate: 'Fecha del informe',
      section2: '2. EVALUACIÓN DE RIESGO',
      section3: '3. PLAN DE ACCIÓN RECOMENDADO',
      step: 'Paso',
      priority: 'Prioridad',
      estimatedTime: 'Tiempo estimado',
      section4: '4. RESUMEN FINANCIERO',
      netWorth: 'Patrimonio neto',
      totalAssets: 'Total activos',
      totalDebts: 'Total deudas',
      heirsCount: 'Número de herederos designados',
      section5: '5. BORRADOR DE TESTAMENTO',
      willDisclaimer: 'Este borrador debe ser revisado por un abogado y formalizado ante notario',
      section6: '6. GUÍA PARA FORMALIZACIÓN LEGAL',
      legalRequirements: 'Requisitos legales:',
      notaryProcess: 'Proceso notarial:',
      estimatedCost: 'Costos estimados:',
      estimatedTimeframe: 'Tiempo estimado:',
      importantNotes: 'Notas importantes:',
      resources: 'Recursos útiles:',
      page: 'Página',
      of: 'de',
      generatedOn: 'Generado el'
    },
    en: {
      title: 'LEGACY PROTECTION REPORT',
      disclaimer1: '⚠️ IMPORTANT: This document is an EDUCATIONAL KIT and does NOT constitute',
      disclaimer2: 'official legal advice. It must be reviewed by a specialized lawyer.',
      section1: '1. PERSONAL INFORMATION',
      name: 'Name',
      age: 'Age',
      years: 'years',
      country: 'Country',
      maritalStatus: 'Marital status',
      reportDate: 'Report date',
      section2: '2. RISK ASSESSMENT',
      section3: '3. RECOMMENDED ACTION PLAN',
      step: 'Step',
      priority: 'Priority',
      estimatedTime: 'Estimated time',
      section4: '4. FINANCIAL SUMMARY',
      netWorth: 'Net worth',
      totalAssets: 'Total assets',
      totalDebts: 'Total debts',
      heirsCount: 'Number of designated heirs',
      section5: '5. WILL DRAFT',
      willDisclaimer: 'This draft must be reviewed by a lawyer and formalized before a notary',
      section6: '6. LEGAL FORMALIZATION GUIDE',
      legalRequirements: 'Legal requirements:',
      notaryProcess: 'Notary process:',
      estimatedCost: 'Estimated costs:',
      estimatedTimeframe: 'Estimated timeframe:',
      importantNotes: 'Important notes:',
      resources: 'Useful resources:',
      page: 'Page',
      of: 'of',
      generatedOn: 'Generated on'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.es;
  const locale = language === 'es' ? 'es' : 'en-US';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  // Helper function to add text with automatic page breaks
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, maxWidth);
    
    for (const line of lines) {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    }
    
    yPosition += 3;
  };

  const addSection = (title: string) => {
    yPosition += 5;
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }
    doc.setFillColor(41, 128, 185);
    doc.rect(margin, yPosition - 5, maxWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 2, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 8;
  };

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Disclaimer
  doc.setFillColor(243, 156, 18);
  doc.rect(margin, yPosition, maxWidth, 15, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(t.disclaimer1, margin + 2, yPosition + 5);
  doc.text(t.disclaimer2, margin + 2, yPosition + 10);
  doc.setTextColor(0, 0, 0);
  yPosition += 20;

  // Personal Information
  addSection(t.section1);
  addText(`${t.name}: ${normalizedData.personalInfo.fullName}`);
  addText(`${t.age}: ${normalizedData.personalInfo.age} ${t.years}`);
  addText(`${t.country}: ${normalizedData.personalInfo.country}`);
  addText(`${t.maritalStatus}: ${normalizedData.personalInfo.maritalStatus}`);
  addText(`${t.reportDate}: ${new Date(report.generatedAt).toLocaleDateString(locale)}`);

  // Risk Assessment
  addSection(t.section2);
  
  // Risk score with color
  const riskColor = getRiskColor(report.riskLevel);
  doc.setFillColor(riskColor.r, riskColor.g, riskColor.b);
  doc.rect(margin, yPosition, 40, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(report.riskScore.toString(), margin + 20, yPosition + 12, { align: 'center' });
  doc.setFontSize(10);
  doc.text(report.riskLevel.toUpperCase(), margin + 20, yPosition + 20, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition += 30;

  addText(report.riskExplanation, 10, false);

  // Action Roadmap
  addSection(t.section3);
  report.actionRoadmap.forEach((action) => {
    addText(`${t.step} ${action.step}: ${action.title}`, 11, true);
    addText(`${t.priority}: ${action.priority.toUpperCase()} | ${t.estimatedTime}: ${action.estimatedTime}`, 9);
    addText(action.description, 10);
    yPosition += 2;
  });

  // Financial Summary
  addSection(t.section4);
  addText(`${t.netWorth}: €${normalizedData.financialSummary.netWorth.toLocaleString()}`);
  addText(`${t.totalAssets}: €${normalizedData.financialSummary.totalAssets.toLocaleString()}`);
  addText(`${t.totalDebts}: €${normalizedData.financialSummary.totalDebts.toLocaleString()}`);
  addText(`${t.heirsCount}: ${normalizedData.familySituation.heirsCount}`);

  // Will Draft
  if (report.willDraft) {
    doc.addPage();
    yPosition = margin;
    addSection(t.section5);
    
    doc.setFillColor(255, 240, 240);
    doc.rect(margin, yPosition, maxWidth, 10, 'F');
    doc.setFontSize(9);
    doc.setTextColor(200, 0, 0);
    doc.text(t.willDisclaimer, margin + 2, yPosition + 6);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    addText(report.willDraft, 9, false);
  }

  // Country Guidance
  doc.addPage();
  yPosition = margin;
  addSection(t.section6);
  
  addText(t.legalRequirements, 11, true);
  report.countryGuidance.legalRequirements.forEach((req) => {
    addText(`• ${req}`, 9);
  });

  yPosition += 3;
  addText(t.notaryProcess, 11, true);
  addText(report.countryGuidance.notaryProcess, 9);

  yPosition += 3;
  addText(t.estimatedCost, 11, true);
  addText(report.countryGuidance.estimatedCost, 9);

  yPosition += 3;
  addText(t.estimatedTimeframe, 11, true);
  addText(report.countryGuidance.estimatedTimeframe, 9);

  if (report.countryGuidance.importantNotes.length > 0) {
    yPosition += 3;
    addText(t.importantNotes, 11, true);
    report.countryGuidance.importantNotes.forEach((note) => {
      addText(`• ${note}`, 9);
    });
  }

  if (report.countryGuidance.resources.length > 0) {
    yPosition += 3;
    addText(t.resources, 11, true);
    report.countryGuidance.resources.forEach((resource) => {
      addText(`• ${resource}`, 9);
    });
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `${t.page} ${i} ${t.of} ${totalPages} | ${t.generatedOn} ${new Date().toLocaleDateString(locale)}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

/**
 * Get color based on risk level
 */
function getRiskColor(level: string): { r: number; g: number; b: number } {
  switch (level) {
    case 'bajo':
      return { r: 46, g: 204, b: 113 }; // Green
    case 'medio':
      return { r: 241, g: 196, b: 15 }; // Yellow
    case 'alto':
      return { r: 230, g: 126, b: 34 }; // Orange
    case 'critico':
      return { r: 231, g: 76, b: 60 }; // Red
    default:
      return { r: 149, g: 165, b: 166 }; // Gray
  }
}

/**
 * Save PDF to file system (for testing)
 */
export async function savePDFToFile(
  buffer: Buffer,
  filename: string = 'report.pdf'
): Promise<string> {
  const fs = require('fs').promises;
  const path = require('path');
  const filePath = path.join('/tmp', filename);
  
  await fs.writeFile(filePath, buffer);
  return filePath;
}
