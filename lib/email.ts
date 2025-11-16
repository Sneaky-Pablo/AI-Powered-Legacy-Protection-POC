import nodemailer from 'nodemailer';

/**
 * Email service using Gmail credentials from .env
 */
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  /**
   * Send PDF report via email
   */
  async sendReport(
    to: string,
    fullName: string,
    pdfBuffer: Buffer,
    riskLevel: string,
    riskScore: number,
    language: string = 'es'
  ): Promise<void> {
    const translations = {
      es: {
        from: 'Agente de Protección del Legado',
        subject: '🛡️ Tu Informe de Protección del Legado',
        headerTitle: 'Informe de Protección del Legado',
        headerSubtitle: 'Tu análisis personalizado está listo',
        greeting: 'Hola',
        intro: 'Hemos completado el análisis de tu situación patrimonial. Tu informe personalizado está adjunto a este correo en formato PDF.',
        summaryTitle: 'Resumen de tu evaluación:',
        riskLabel: 'Nivel de Riesgo',
        includesTitle: 'El informe incluye:',
        includes: [
          'Evaluación completa de riesgo patrimonial',
          'Plan de acción personalizado',
          'Borrador de testamento',
          'Guía legal para tu país',
          'Pasos para formalizar con notario'
        ],
        warningTitle: 'Importante:',
        warningText: 'Este documento es un kit educativo y NO constituye asesoramiento legal oficial. Debe ser revisado por un abogado especializado antes de cualquier acción legal.',
        recommendations: 'El PDF adjunto contiene toda la información detallada. Te recomendamos:',
        steps: [
          'Leer el informe completo cuidadosamente',
          'Revisar el plan de acción sugerido',
          'Consultar con un abogado especializado',
          'Contactar a un notario en tu localidad'
        ],
        questions: 'Si tienes alguna pregunta, no dudes en contactarnos.',
        closing: 'Protege tu legado hoy.',
        team: 'Equipo de Protección del Legado',
        footer1: 'Este correo fue generado automáticamente. Por favor no respondas a este mensaje.',
        footer2: 'Agente de Protección del Legado - Todos los derechos reservados'
      },
      en: {
        from: 'Legacy Protection Agent',
        subject: '🛡️ Your Legacy Protection Report',
        headerTitle: 'Legacy Protection Report',
        headerSubtitle: 'Your personalized analysis is ready',
        greeting: 'Hello',
        intro: 'We have completed the analysis of your estate situation. Your personalized report is attached to this email in PDF format.',
        summaryTitle: 'Your evaluation summary:',
        riskLabel: 'Risk Level',
        includesTitle: 'The report includes:',
        includes: [
          'Complete estate risk assessment',
          'Personalized action plan',
          'Will draft',
          'Legal guide for your country',
          'Steps to formalize with a notary'
        ],
        warningTitle: 'Important:',
        warningText: 'This document is an educational kit and does NOT constitute official legal advice. It must be reviewed by a specialized lawyer before any legal action.',
        recommendations: 'The attached PDF contains all detailed information. We recommend:',
        steps: [
          'Read the full report carefully',
          'Review the suggested action plan',
          'Consult with a specialized lawyer',
          'Contact a notary in your area'
        ],
        questions: 'If you have any questions, please feel free to contact us.',
        closing: 'Protect your legacy today.',
        team: 'Legacy Protection Team',
        footer1: 'This email was generated automatically. Please do not reply to this message.',
        footer2: 'Legacy Protection Agent - All rights reserved'
      }
    };

    const t = translations[language as keyof typeof translations] || translations.es;
    const mailOptions = {
      from: `"${t.from}" <${process.env.GMAIL_MAIL}>`,
      to,
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .risk-badge { display: inline-block; padding: 10px 20px; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .risk-bajo { background: #d4edda; color: #155724; }
            .risk-medio { background: #fff3cd; color: #856404; }
            .risk-alto { background: #f8d7da; color: #721c24; }
            .risk-critico { background: #f8d7da; color: #721c24; border: 2px solid #721c24; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ ${t.headerTitle}</h1>
              <p>${t.headerSubtitle}</p>
            </div>
            
            <div class="content">
              <h2>${t.greeting} ${fullName},</h2>
              
              <p>${t.intro}</p>
              
              <h3>${t.summaryTitle}</h3>
              
              <div class="risk-badge risk-${riskLevel}">
                ${t.riskLabel}: ${riskLevel.toUpperCase()} (${riskScore}/100)
              </div>
              
              <p>${t.includesTitle}</p>
              <ul>
                ${t.includes.map(item => `<li>✓ ${item}</li>`).join('\n                ')}
              </ul>
              
              <div class="warning">
                <strong>⚠️ ${t.warningTitle}</strong> ${t.warningText}
              </div>
              
              <p>${t.recommendations}</p>
              <ol>
                ${t.steps.map(step => `<li>${step}</li>`).join('\n                ')}
              </ol>
              
              <p>${t.questions}</p>
              
              <p style="margin-top: 30px;">
                <strong>${t.closing}</strong><br>
                ${t.team}
              </p>
            </div>
            
            <div class="footer">
              <p>${t.footer1}</p>
              <p>© ${new Date().getFullYear()} ${t.footer2}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `informe-legado-${fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email configuration error:', error);
      return false;
    }
  }
}

// Singleton instance
export const emailService = new EmailService();
