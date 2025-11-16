# 🚀 Setup Guide - Legacy Protection Agent POC

Complete step-by-step guide to get the POC running locally.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ Git installed
- ✅ OpenAI API account ([Sign up](https://platform.openai.com/))
- ✅ Supabase account ([Sign up](https://supabase.com/))

## 🔧 Step 1: OpenAI Configuration

### 1.1 Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to **API Keys** section
3. Click **Create new secret key**
4. Copy the key (starts with `sk-...`)
5. **Important**: Add credits to your account (minimum $5 recommended for testing)

### 1.2 Initial Assistant Setup (Optional)

The system will automatically create an OpenAI Assistant on first run. However, you can pre-create one:

1. Go to [OpenAI Assistants](https://platform.openai.com/assistants)
2. Click **Create**
3. Name: "Agente de Protección del Legado"
4. Model: `gpt-4-turbo-preview`
5. Instructions: (Copy from `lib/agent.ts` - SYSTEM_PROMPT)
6. Save and copy the Assistant ID (starts with `asst_...`)

## 🗄️ Step 2: Supabase Configuration

### 2.1 Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **New Project**
3. Fill in:
   - **Name**: legacy-protection-poc
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to your location
4. Wait for project creation (~2 minutes)

### 2.2 Get Your Supabase Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: (for NEXT_PUBLIC_SUPABASE_URL if needed)
   - **service_role key**: (for SUPABASE_SERVICE_KEY) ⚠️ Keep secret!

### 2.3 Create Database Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste and run this SQL:

\`\`\`sql
CREATE TABLE legacy_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  form_response JSONB NOT NULL,
  normalized_data JSONB NOT NULL,
  generated_report JSONB NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_legacy_reports_email ON legacy_reports(email);
CREATE INDEX idx_legacy_reports_user_id ON legacy_reports(user_id);
CREATE INDEX idx_legacy_reports_created_at ON legacy_reports(created_at DESC);

-- Optional: Add Row Level Security (RLS) policies
ALTER TABLE legacy_reports ENABLE ROW LEVEL SECURITY;
\`\`\`

### 2.4 Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **Create a new bucket**
3. Name: `legacy-reports`
4. Set as **Public** (or configure custom policies)
5. Click **Create bucket**

### 2.5 Configure Storage Policies (if using private bucket)

If you made the bucket private, add this policy:

\`\`\`sql
-- Allow service role to upload
CREATE POLICY "Service role can upload PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'legacy-reports');

-- Allow public to download PDFs
CREATE POLICY "Public can download PDFs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'legacy-reports');
\`\`\`

## 💻 Step 3: Local Setup

### 3.1 Install Dependencies

\`\`\`bash
cd /path/to/visualcare
npm install
\`\`\`

### 3.2 Configure Environment Variables

1. Copy the example file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Edit `.env.local` with your credentials:
\`\`\`env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxx  # Your OpenAI API key
OPENAI_ASSISTANT_ID=           # Optional - will auto-create if empty

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...  # Your service_role key (NOT anon key)
\`\`\`

### 3.3 Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Step 4: Test the System

### Option 1: Use the Demo Page

1. Go to http://localhost:3000
2. Click **"Probar Demo Interactiva"**
3. Review the pre-filled sample data
4. Click **"Generar Informe con IA"**
5. Wait ~30-60 seconds for AI processing
6. View and download the generated PDF

### Option 2: Test API Directly

Use curl or Postman:

\`\`\`bash
curl -X POST http://localhost:3000/api/generate-report \\
  -H "Content-Type: application/json" \\
  -d '{
    "fullName": "Test User",
    "age": 40,
    "country": "ES",
    "email": "test@example.com",
    "maritalStatus": "casado",
    "hasChildren": true,
    "numberOfChildren": 2,
    "assets": [{
      "type": "propiedad",
      "description": "Casa",
      "estimatedValue": 300000
    }],
    "debts": [{
      "type": "hipoteca",
      "description": "Hipoteca",
      "amount": 100000
    }],
    "heirs": [{
      "name": "Spouse",
      "relationship": "conyuge",
      "percentage": 100
    }],
    "hasWill": false,
    "hasExecutor": false
  }'
\`\`\`

## 🐛 Troubleshooting

### Issue: "Failed to initialize OpenAI Assistant"
**Solution**: 
- Check your `OPENAI_API_KEY` is correct
- Verify you have credits in your OpenAI account
- Make sure you're using `gpt-4-turbo-preview` model

### Issue: "Database connection failed"
**Solution**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Make sure you used the **service_role** key, not the anon key
- Check that the `legacy_reports` table exists

### Issue: "PDF upload failed"
**Solution**:
- Verify the `legacy-reports` storage bucket exists
- Check bucket policies allow uploads
- Ensure bucket is public or has correct policies

### Issue: "Module not found" errors
**Solution**:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Issue: TypeScript errors
**Solution**:
\`\`\`bash
npm run build
\`\`\`
This will show compilation errors that need fixing.

## 📊 Monitoring & Debugging

### Check OpenAI Usage
1. Go to [OpenAI Usage](https://platform.openai.com/usage)
2. Monitor API calls and costs

### Check Supabase Logs
1. Go to your Supabase project
2. Navigate to **Logs** → **API**
3. Filter by table or function

### Check Database Records
\`\`\`sql
-- View all reports
SELECT id, email, country, created_at FROM legacy_reports ORDER BY created_at DESC;

-- View generated reports count
SELECT COUNT(*) FROM legacy_reports;

-- View reports by country
SELECT country, COUNT(*) as count FROM legacy_reports GROUP BY country;
\`\`\`

## 🚀 Next Steps

Once everything is working:

1. **Customize Content**: Edit will templates in `lib/will-templates.ts`
2. **Adjust AI Prompts**: Modify system prompt in `lib/agent.ts`
3. **Enhance PDF**: Update styling in `lib/pdf-generator.ts`
4. **Add Email**: Integrate SendGrid or Resend for email delivery
5. **Deploy**: Consider Vercel for easy deployment

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Review the troubleshooting section above
3. Check OpenAI and Supabase documentation
4. Verify all environment variables are set correctly

## 💰 Costs Estimate

Typical costs per report generation:
- **OpenAI API**: $0.10 - $0.30 per report (depending on complexity)
- **Supabase**: Free tier covers testing (50,000 rows, 1GB storage)

For production, budget accordingly based on expected volume.

---

**Setup complete! 🎉**

You now have a fully functional AI-powered Legacy Protection Agent.
