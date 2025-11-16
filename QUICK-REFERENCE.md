# 📚 Quick Reference - Legacy Protection Agent

## 🏗️ Architecture Overview

\`\`\`
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     Next.js API Route           │
│  /api/generate-report/route.ts  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Data Normalizer               │
│   lib/normalizer.ts             │
│   - Validates form data         │
│   - Calculates risk factors     │
│   - Structures for AI           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   AI Agent                      │
│   lib/agent.ts                  │
│   - OpenAI GPT-4                │
│   - Assistants API              │
│   - Risk assessment             │
│   - Content generation          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   PDF Generator                 │
│   lib/pdf-generator.ts          │
│   - jsPDF library               │
│   - Formatted report            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Database & Storage            │
│   lib/database.ts               │
│   - Supabase PostgreSQL         │
│   - Supabase Storage            │
└─────────────────────────────────┘
\`\`\`

## 📁 File Structure

\`\`\`
visualcare/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── demo/page.tsx            # Interactive demo
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/
│       └── generate-report/
│           └── route.ts         # ⭐ Main API endpoint
│
├── lib/                         # Core business logic
│   ├── types.ts                 # 📋 TypeScript types & Zod schemas
│   ├── agent.ts                 # 🤖 OpenAI Agent integration
│   ├── normalizer.ts            # 🔄 Data normalization
│   ├── will-templates.ts        # 📝 Will templates by country
│   ├── country-guidance.ts      # ⚖️ Legal guidance by country
│   ├── pdf-generator.ts         # 📄 PDF generation
│   └── database.ts              # 💾 Supabase integration
│
├── public/                      # Static assets
│
├── .env.example                 # Environment template
├── .env.local                   # Your credentials (create this)
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
│
├── README.md                    # Project overview
├── SETUP.md                     # Detailed setup guide
└── API-TESTS.md                 # API testing examples
\`\`\`

## 🔑 Key Types

### FormResponse
The raw input from the user form:
\`\`\`typescript
{
  fullName: string;
  age: number;
  country: Country;
  email: string;
  assets: Asset[];
  debts: Debt[];
  heirs: Heir[];
  hasWill: boolean;
  // ... more fields
}
\`\`\`

### NormalizedData
Structured data for AI processing:
\`\`\`typescript
{
  personalInfo: { ... };
  financialSummary: {
    totalAssets: number;
    totalDebts: number;
    netWorth: number;
  };
  familySituation: { ... };
  riskFactors: { ... };
}
\`\`\`

### GeneratedReport
AI-generated output:
\`\`\`typescript
{
  riskScore: number;        // 0-100
  riskLevel: RiskLevel;     // bajo | medio | alto | critico
  riskExplanation: string;
  actionRoadmap: ActionStep[];
  willDraft: string;
  countryGuidance: CountryGuidance;
}
\`\`\`

## 🌍 Supported Countries

| Code | Country | Has Detailed Template |
|------|---------|---------------------|
| ES | España | ✅ |
| MX | México | ✅ |
| AR | Argentina | ✅ |
| CO | Colombia | ⚠️ Generic |
| CL | Chile | ⚠️ Generic |
| PE | Perú | ⚠️ Generic |
| + 13 more | Various | ⚠️ Generic |

## 🎯 Core Functions

### 1. Validate & Normalize
\`\`\`typescript
import { validateFormData, normalizeFormData } from '@/lib/normalizer';

const formResponse = validateFormData(rawData);
const normalized = normalizeFormData(formResponse);
\`\`\`

### 2. Generate with AI
\`\`\`typescript
import { legacyAgent } from '@/lib/agent';

await legacyAgent.initialize();
const report = await legacyAgent.generateReport({ normalizedData });
\`\`\`

### 3. Create PDF
\`\`\`typescript
import { generatePDF } from '@/lib/pdf-generator';

const pdfBuffer = await generatePDF(normalizedData, report);
\`\`\`

### 4. Save to Database
\`\`\`typescript
import { saveReport, uploadPDF } from '@/lib/database';

const pdfUrl = await uploadPDF(pdfBuffer, filename);
const reportId = await saveReport(userId, formResponse, normalized, report, pdfUrl);
\`\`\`

## 🔧 Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| OPENAI_API_KEY | OpenAI authentication | ✅ Yes |
| OPENAI_ASSISTANT_ID | Pre-created assistant | ⚠️ Optional |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | ✅ Yes |
| SUPABASE_SERVICE_KEY | Supabase service role | ✅ Yes |

## 📊 Risk Calculation

Risk factors that increase score:
- ❌ No will: +30 points
- 🏥 Major illness: +20 points
- 💼 No life insurance: +15 points
- 👨‍👩‍👧 Dependents: +10 points
- 💰 Complex finances: +15 points
- 💳 Significant debt: +10 points

Risk levels:
- 0-29: 🟢 Bajo (Low)
- 30-49: 🟡 Medio (Medium)
- 50-69: 🟠 Alto (High)
- 70+: 🔴 Crítico (Critical)

## 🚦 API Endpoints

### POST /api/generate-report
Generate a new report
- **Input**: FormResponse JSON
- **Output**: Report + PDF URL
- **Time**: ~15-30 seconds

### GET /api/generate-report?id={id}
Retrieve existing report
- **Input**: Report ID (UUID)
- **Output**: Full DatabaseRecord
- **Time**: <1 second

## 🧪 Testing Checklist

- [ ] OpenAI API key is valid and has credits
- [ ] Supabase project is created
- [ ] Database table exists
- [ ] Storage bucket exists
- [ ] Environment variables are set
- [ ] Dependencies are installed
- [ ] Dev server runs without errors
- [ ] Demo page loads
- [ ] Can generate a report
- [ ] PDF is created and accessible

## 💡 Customization Points

### Change AI Behavior
Edit `lib/agent.ts` → `SYSTEM_PROMPT`

### Modify Will Templates
Edit `lib/will-templates.ts` → country-specific functions

### Update Legal Guidance
Edit `lib/country-guidance.ts` → guidance data

### Customize PDF Design
Edit `lib/pdf-generator.ts` → styling and layout

### Adjust Risk Scoring
Edit `lib/agent.ts` → `calculateBasicRiskScore()`

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Invalid API key" | Check OPENAI_API_KEY format |
| "No credits" | Add funds to OpenAI account |
| "Database connection failed" | Verify Supabase credentials |
| "Module not found" | Run \`npm install\` |
| "PDF upload failed" | Check storage bucket exists |
| "Assistant not found" | Clear OPENAI_ASSISTANT_ID |

## 📈 Performance Tips

1. **Caching**: Cache country guidance data
2. **Batch Processing**: Process multiple reports async
3. **Optimize Prompts**: Shorter prompts = faster responses
4. **PDF Compression**: Optimize jsPDF settings
5. **Database Indexes**: Already created in schema

## 🔐 Security Considerations

- ✅ Use service_role key only server-side
- ✅ Validate all inputs with Zod
- ✅ Sanitize user-provided text
- ✅ Enable RLS on Supabase tables
- ✅ Use environment variables for secrets
- ⚠️ Never expose API keys in client code

## 📞 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [jsPDF Docs](https://github.com/parallax/jsPDF)
- [Zod Docs](https://zod.dev)

---

**Quick Reference v1.0** | Last updated: November 2024
