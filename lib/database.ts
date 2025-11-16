import { createClient } from '@supabase/supabase-js';
import { DatabaseRecord, FormResponse, NormalizedData, GeneratedReport } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Database schema (for reference - run this SQL in Supabase):
 * 
 * CREATE TABLE legacy_reports (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id TEXT NOT NULL,
 *   email TEXT NOT NULL,
 *   country TEXT NOT NULL,
 *   form_response JSONB NOT NULL,
 *   normalized_data JSONB NOT NULL,
 *   generated_report JSONB NOT NULL,
 *   pdf_url TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_legacy_reports_email ON legacy_reports(email);
 * CREATE INDEX idx_legacy_reports_user_id ON legacy_reports(user_id);
 * CREATE INDEX idx_legacy_reports_created_at ON legacy_reports(created_at DESC);
 */

/**
 * Save a complete report to the database
 */
export async function saveReport(
  userId: string,
  formResponse: FormResponse,
  normalizedData: NormalizedData,
  generatedReport: GeneratedReport,
  pdfUrl?: string
): Promise<string> {
  const { data, error } = await supabase
    .from('legacy_reports')
    .insert({
      user_id: userId,
      email: formResponse.email,
      country: formResponse.country,
      form_response: formResponse,
      normalized_data: normalizedData,
      generated_report: generatedReport,
      pdf_url: pdfUrl,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving report:', error);
    throw new Error(`Failed to save report: ${error.message}`);
  }

  return data.id;
}

/**
 * Get a report by ID
 */
export async function getReport(id: string): Promise<DatabaseRecord | null> {
  const { data, error } = await supabase
    .from('legacy_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching report:', error);
    return null;
  }

  return data as DatabaseRecord;
}

/**
 * Get all reports for a user
 */
export async function getUserReports(userId: string): Promise<DatabaseRecord[]> {
  const { data, error } = await supabase
    .from('legacy_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user reports:', error);
    return [];
  }

  return data as DatabaseRecord[];
}

/**
 * Get reports by email
 */
export async function getReportsByEmail(email: string): Promise<DatabaseRecord[]> {
  const { data, error } = await supabase
    .from('legacy_reports')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports by email:', error);
    return [];
  }

  return data as DatabaseRecord[];
}

/**
 * Update PDF URL for a report
 */
export async function updatePdfUrl(id: string, pdfUrl: string): Promise<void> {
  const { error } = await supabase
    .from('legacy_reports')
    .update({ pdf_url: pdfUrl, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating PDF URL:', error);
    throw new Error(`Failed to update PDF URL: ${error.message}`);
  }
}

/**
 * Upload PDF to Supabase Storage
 */
export async function uploadPDF(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('legacy-reports')
    .upload(`pdfs/${filename}`, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading PDF:', error);
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from('legacy-reports')
    .getPublicUrl(data.path);

  return publicData.publicUrl;
}

/**
 * Delete a report
 */
export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase
    .from('legacy_reports')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting report:', error);
    throw new Error(`Failed to delete report: ${error.message}`);
  }
}

/**
 * Get statistics
 */
export async function getStatistics(): Promise<{
  totalReports: number;
  reportsByCountry: Record<string, number>;
  reportsByRiskLevel: Record<string, number>;
}> {
  const { data, error } = await supabase
    .from('legacy_reports')
    .select('country, generated_report');

  if (error) {
    console.error('Error fetching statistics:', error);
    return {
      totalReports: 0,
      reportsByCountry: {},
      reportsByRiskLevel: {},
    };
  }

  const reportsByCountry: Record<string, number> = {};
  const reportsByRiskLevel: Record<string, number> = {};

  data.forEach((report) => {
    // Count by country
    const country = report.country;
    reportsByCountry[country] = (reportsByCountry[country] || 0) + 1;

    // Count by risk level
    const riskLevel = report.generated_report?.riskLevel;
    if (riskLevel) {
      reportsByRiskLevel[riskLevel] = (reportsByRiskLevel[riskLevel] || 0) + 1;
    }
  });

  return {
    totalReports: data.length,
    reportsByCountry,
    reportsByRiskLevel,
  };
}
