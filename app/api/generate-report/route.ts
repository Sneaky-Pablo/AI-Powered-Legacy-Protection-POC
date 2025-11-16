import { NextRequest, NextResponse } from 'next/server';
import { validateFormData, normalizeFormData } from '@/lib/normalizer';
import { legacyAgent } from '@/lib/agent';
import { generatePDF } from '@/lib/pdf-generator';
import { emailService } from '@/lib/email';

/**
 * POST /api/generate-report
 * 
 * Main endpoint to process form submission and generate complete report
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const language = body.language || 'es'; // Default to Spanish
    
    // Validate form data
    let formResponse;
    try {
      formResponse = validateFormData(body);
    } catch (validationError: any) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationError.errors || validationError.message 
        },
        { status: 400 }
      );
    }

    // Normalize data
    const normalizedData = normalizeFormData(formResponse);

    // Initialize and run AI agent
    await legacyAgent.initialize(language);
    const generatedReport = await legacyAgent.generateReport({ normalizedData, language });

    // Generate PDF
    const pdfBuffer = await generatePDF(normalizedData, generatedReport, language);
    
    // Send email with PDF attached
    await emailService.sendReport(
      formResponse.email,
      formResponse.fullName,
      pdfBuffer,
      generatedReport.riskLevel,
      generatedReport.riskScore,
      language
    );

    // Convert PDF to base64 for response (optional)
    const pdfBase64 = pdfBuffer.toString('base64');

    // Return success response
    return NextResponse.json({
      success: true,
      report: {
        riskScore: generatedReport.riskScore,
        riskLevel: generatedReport.riskLevel,
        riskExplanation: generatedReport.riskExplanation,
        actionRoadmap: generatedReport.actionRoadmap,
        generatedAt: generatedReport.generatedAt,
      },
      pdfBase64, // Include PDF data in response
      message: `Informe generado exitosamente. Se ha enviado una copia a ${formResponse.email}`,
    });

  } catch (error: any) {
    console.error('Error generating report:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate report', 
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
