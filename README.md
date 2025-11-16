# Legacy Protection Agent 🛡️

**AI-powered legacy protection system for Spanish-speaking families worldwide**

## 📖 About The Project

**Legacy Protection Agent** is an innovative artificial intelligence solution designed to democratize access to legacy planning and legal guidance across Spanish-speaking communities. Built with cutting-edge AI technology, this system addresses a critical need in regions where professional legal advisory services are often expensive, inaccessible, or unavailable, particularly in rural areas and underserved communities throughout Spain and Latin America.

The platform leverages OpenAI's advanced GPT-4 language model to conduct comprehensive risk assessments and generate personalized, country-specific legal recommendations. Users complete an intuitive bilingual questionnaire that evaluates multiple dimensions of their family situation—including asset distribution, guardianship arrangements, healthcare directives, end-of-life preferences, and digital legacy management. The AI engine processes these responses through specialized prompts tailored for each of the 19 supported Spanish-speaking countries, ensuring recommendations align with local legal frameworks, cultural norms, and regulatory requirements.

What distinguishes this system is its holistic approach to legacy protection. Beyond generating basic will templates, the AI provides nuanced guidance on complex scenarios such as international asset holdings, blended family dynamics, special needs dependents, business succession planning, and charitable giving strategies. Each generated report includes risk assessments with priority levels, actionable next steps, and professionally formatted documentation ready for legal review.

The fully bilingual interface (Spanish/English) ensures accessibility for diverse user populations, including Spanish-speaking immigrants in English-speaking countries and international families managing cross-border estates. The system maintains language consistency throughout the entire user journey—from questionnaire completion through AI analysis, PDF generation, and email delivery—providing a seamless experience regardless of the user's preferred language.

By combining artificial intelligence, legal knowledge engineering, and user-centered design, Legacy Protection Agent empowers families to take control of their legacy planning with confidence, clarity, and cultural sensitivity. This POC demonstrates the potential for AI to address critical social needs while respecting the complexity and importance of family legacy decisions.

---

## ✨ Key Features

### 🌍 **19-Country Coverage**
Specialized legal guidance and will templates for Spain and 18 Latin American countries, each with country-specific legal requirements and cultural considerations.

### 🤖 **Advanced AI Analysis**
Powered by OpenAI GPT-4 with custom system prompts that analyze family dynamics, asset complexity, and risk factors to generate personalized recommendations.

### 📋 **Comprehensive Risk Assessment**
Multi-dimensional evaluation covering asset distribution, guardianship, healthcare directives, end-of-life wishes, digital legacy, and international considerations.

### 🌐 **Full Bilingual Support**
Complete Spanish/English interface with language persistence across navigation, AI-generated content in selected language, and bilingual PDF reports and email delivery.

### ✏️ **Interactive Editable Form**
Review and modify all questionnaire responses before report generation, with real-time validation and user-friendly editing interface.

### 📄 **Professional PDF Reports**
Beautifully formatted PDF documents with executive summaries, detailed risk analysis, prioritized recommendations, and country-specific will templates.

### 📧 **Automated Email Delivery**
Instant email delivery of generated reports via Gmail SMTP, with professional bilingual email templates and secure PDF attachments.

### 🎨 **Modern UI/UX**
Clean, accessible interface built with Tailwind CSS 4, featuring responsive design, high-contrast forms, and intuitive navigation.

### 🔒 **Privacy-First Design**
No database storage—all data processed in memory and delivered securely via email, ensuring maximum user privacy and data protection.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- **Node.js 18+** and npm installed
- **OpenAI API key** with GPT-4 access ([get one here](https://platform.openai.com/api-keys))
- **Gmail account** with App Password enabled
- Git for cloning the repository

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/legacy-protection-agent.git
cd legacy-protection-agent
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following configuration:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...your-key-here...
OPENAI_MODEL=gpt-4-turbo-preview

# Gmail SMTP Configuration
GMAIL_MAIL=your.email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

4. **Get Gmail App Password:**

Since Google discontinued "Less secure app access," you need an App Password:

- Navigate to [Google Account Security](https://myaccount.google.com/security)
- Enable **2-Step Verification** if not already enabled
- Go to [App Passwords](https://myaccount.google.com/apppasswords)
- Select **Mail** and your device
- Click **Generate** and copy the 16-character password
- Paste it into your `.env.local` file (spaces are optional)

5. **Run the development server:**

```bash
npm run dev
```

6. **Open the application:**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

The application is now running! The homepage will display in Spanish by default. Use the language toggle to switch to English.

---

## 📘 How To Use

### For End Users

1. **Select Language:** Use the toggle switch in the top-right corner to choose Spanish or English.
2. **Start Assessment:** Click "Comenzar Evaluación" (or "Start Assessment") on the homepage.
3. **Complete Questionnaire:** Fill out the comprehensive risk assessment form covering:
   - Personal information (name, country, email)
   - Family situation and dependents
   - Asset holdings and distribution preferences
   - Guardianship arrangements
   - Healthcare directives
   - End-of-life wishes
   - Digital legacy management
4. **Review & Edit:** After submission, review all responses in the editable form and make any corrections.
5. **Generate Report:** Click "Generar Informe" to create your personalized legacy protection report.
6. **Receive Via Email:** The PDF report will be automatically emailed to the address you provided.

### Report Contents

Each generated report includes:

- **Executive Summary:** Overview of your family situation and key recommendations
- **Risk Analysis:** Detailed assessment of legal, financial, and family protection risks
- **Priority Matrix:** Color-coded priorities (High/Medium/Low) with specific action items
- **Country-Specific Will Template:** Professionally formatted will draft aligned with local laws
- **Legal Guidance:** Jurisdiction-specific requirements, notarization steps, and legal considerations
- **Next Steps:** Actionable recommendations with timeline and professional referral suggestions

---

## 🏗️ Technical Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Server-side rendering, API routes, modern React patterns |
| **Language** | TypeScript 5 | Type safety, improved developer experience |
| **AI Engine** | OpenAI GPT-4 Turbo | Natural language processing, legal content generation |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design |
| **PDF Generation** | jsPDF | Client-side PDF document creation |
| **Email Delivery** | Nodemailer | Gmail SMTP integration |
| **Validation** | Zod | Runtime type checking and data validation |
| **UI Components** | React 19 | Modern component architecture |

### System Flow

```
User Input → Data Normalization → AI Analysis → PDF Generation → Email Delivery
     ↓              ↓                  ↓               ↓              ↓
 Validation    JSON Schema      OpenAI GPT-4     jsPDF Format    Gmail SMTP
```

### Key Components

**Frontend:**
- `app/page.tsx` - Landing page with language toggle and feature overview
- `app/demo/page.tsx` - Interactive questionnaire and editable results form
- `app/globals.css` - Global styles and Tailwind configuration

**Backend API:**
- `app/api/generate-report/route.ts` - Main orchestration endpoint

**Core Libraries:**
- `lib/agent.ts` - OpenAI integration with bilingual system prompts
- `lib/pdf-generator.ts` - PDF creation with full Spanish/English templates
- `lib/email.ts` - SMTP email service with bilingual templates
- `lib/normalizer.ts` - Data validation and normalization
- `lib/will-templates.ts` - 19 country-specific will templates
- `lib/country-guidance.ts` - Legal guidance for each jurisdiction
- `lib/types.ts` - TypeScript interfaces and type definitions

### Language Implementation

The bilingual system operates at every layer:

1. **UI Layer:** Translation objects in React components with language state management
2. **API Layer:** Language parameter extracted from requests and passed to all services
3. **AI Layer:** Separate Spanish/English system prompts for OpenAI
4. **PDF Layer:** Complete translation sets for all report sections
5. **Email Layer:** Bilingual subject lines, body content, and formatting

Language persistence uses both:
- **localStorage:** Maintains preference across browser sessions
- **URL parameters:** `?lang=en` enables direct linking and sharing

---

## 🌎 Supported Countries

| Country | Will Template | Legal Guidance | Special Considerations |
|---------|--------------|----------------|----------------------|
| 🇪🇸 Spain | ✅ | ✅ | EU succession regulations, regional laws |
| 🇲🇽 Mexico | ✅ | ✅ | Notarial requirements, community property |
| 🇦🇷 Argentina | ✅ | ✅ | Civil law system, forced heirship |
| 🇨🇴 Colombia | ✅ | ✅ | Notarization mandatory, witness requirements |
| 🇨🇱 Chile | ✅ | ✅ | Testamentary freedom, digital assets |
| 🇵🇪 Peru | ✅ | ✅ | Holographic wills, indigenous considerations |
| 🇻🇪 Venezuela | ✅ | ✅ | Civil Code provisions, consular wills |
| 🇪🇨 Ecuador | ✅ | ✅ | Public wills, marital property |
| 🇧🇴 Bolivia | ✅ | ✅ | Plurinational legal system, cultural factors |
| 🇵🇾 Paraguay | ✅ | ✅ | Bilateral inheritance, simplified procedures |
| 🇺🇾 Uruguay | ✅ | ✅ | Progressive legal framework, LGBT rights |
| 🇨🇷 Costa Rica | ✅ | ✅ | Stable legal system, expat considerations |
| 🇵🇦 Panama | ✅ | ✅ | International financial center, dual residency |
| 🇬🇹 Guatemala | ✅ | ✅ | Notarial emphasis, indigenous communities |
| 🇭🇳 Honduras | ✅ | ✅ | Traditional procedures, rural challenges |
| 🇸🇻 El Salvador | ✅ | ✅ | Digital modernization, emigrant focus |
| 🇳🇮 Nicaragua | ✅ | ✅ | Civil law tradition, property reforms |
| 🇩🇴 Dominican Republic | ✅ | ✅ | Tourism-related estates, real estate |
| 🇨🇺 Cuba | ✅ | ✅ | Socialist legal system, unique constraints |

---

## ⚖️ Legal Disclaimer

**Important Notice:**

This system is a **proof-of-concept technology demonstration** and does **NOT** constitute legal advice. The AI-generated content is for informational and educational purposes only.

### User Responsibilities

- **Consult Qualified Professionals:** Always seek advice from licensed attorneys in your jurisdiction before making legal decisions.
- **Verify Information:** Laws change frequently; confirm all guidance with current legal authorities.
- **No Attorney-Client Relationship:** Use of this system does not create any legal representation or fiduciary relationship.
- **Not a Substitute:** This tool supplements but does not replace professional legal counsel.

### Limitations

- AI-generated content may contain errors or omissions
- Legal requirements vary by jurisdiction and change over time
- Complex situations require individualized human expertise
- International laws may differ from what is presented

**By using this system, you acknowledge these limitations and agree to use the information responsibly.**

---

## 🛠️ Development Guide

### Project Structure

```
legacy-protection-agent/
├── app/
│   ├── page.tsx                    # Landing page with feature overview
│   ├── demo/page.tsx               # Interactive questionnaire & form
│   ├── layout.tsx                  # Root layout with metadata
│   ├── globals.css                 # Global styles
│   └── api/
│       └── generate-report/route.ts # Main API endpoint
├── lib/
│   ├── agent.ts                    # OpenAI integration
│   ├── pdf-generator.ts            # PDF creation logic
│   ├── email.ts                    # Email delivery service
│   ├── normalizer.ts               # Data validation
│   ├── will-templates.ts           # Country-specific templates
│   ├── country-guidance.ts         # Legal guidance data
│   └── types.ts                    # TypeScript definitions
├── public/                         # Static assets
├── .env.local                      # Environment variables (not committed)
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── tailwind.config.ts              # Tailwind CSS settings
```

### Adding a New Country

To add support for a new country:

1. **Update `lib/will-templates.ts`:**
   - Add country code to `Country` type
   - Create will template following existing format
   - Include jurisdiction-specific legal language

2. **Update `lib/country-guidance.ts`:**
   - Add detailed legal guidance for the country
   - Include notarization requirements
   - Document witness requirements and special considerations

3. **Update both UI pages:**
   - Add country to dropdown options in `app/page.tsx`
   - Add country to dropdown options in `app/demo/page.tsx`
   - Include translations for both Spanish and English

4. **Test thoroughly:**
   - Generate reports for the new country
   - Verify PDF formatting and content
   - Confirm email delivery works correctly

### Extending AI Capabilities

The OpenAI integration in `lib/agent.ts` can be customized:

- **Modify System Prompts:** Edit `SYSTEM_PROMPTS.es` or `SYSTEM_PROMPTS.en` for different AI behavior
- **Adjust Temperature:** Change creativity level in `generateReport()` method
- **Add Context:** Extend `buildUserPrompt()` with additional data points
- **Fine-tune Output:** Modify response parsing in the agent class

### Customizing PDF Reports

PDF generation in `lib/pdf-generator.ts` offers extensive customization:

- **Branding:** Add logos, custom colors, fonts
- **Layout:** Modify section ordering, spacing, page breaks
- **Content:** Add/remove sections, change formatting
- **Localization:** Extend translation objects for more languages

---

## 🤝 Contributing

Contributions are welcome! This is a proof-of-concept with room for enhancement.

### Areas for Contribution

- **Additional Countries:** Expand beyond 19 current countries
- **More Languages:** Add Portuguese, French, indigenous languages
- **Enhanced AI:** Improve prompts, add specialized legal reasoning
- **UI/UX:** Modernize interface, add accessibility features
- **Testing:** Add unit tests, integration tests, E2E tests
- **Documentation:** Improve guides, add video tutorials
- **Security:** Enhance data protection, add encryption

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request with detailed description

Please ensure:
- Code follows existing style patterns
- TypeScript types are properly defined
- Comments explain complex logic
- No sensitive data is committed

---

## 📚 Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Next.js App Router](https://nextjs.org/docs/app) - Modern routing and data fetching
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub](https://github.com/vercel/next.js) - Official repository

### OpenAI Resources

- [OpenAI API Documentation](https://platform.openai.com/docs) - Complete API reference
- [GPT-4 Guide](https://platform.openai.com/docs/guides/gpt) - Understanding GPT-4 capabilities
- [Best Practices](https://platform.openai.com/docs/guides/prompt-engineering) - Prompt engineering tips

### Related Technologies

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Nodemailer Guide](https://nodemailer.com/about/)

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `GMAIL_MAIL`
   - `GMAIL_APP_PASSWORD`
4. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/legacy-protection-agent)

### Other Deployment Options

- **Netlify:** Supports Next.js with Edge Functions
- **AWS Amplify:** Full-stack deployment with AWS integration
- **Docker:** Create container for self-hosted deployment
- **Railway:** Simple deployment with environment management

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.

---

## 📄 License

This project is a proof-of-concept demonstration. Please consult appropriate legal counsel before using in production or for actual legal advice purposes.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API access and AI capabilities
- **Next.js Team** for the excellent framework
- **Vercel** for hosting and deployment platform
- **Legal Professionals** who reviewed country-specific guidance
- **Spanish-speaking Communities** for cultural insights and feedback

---

## 📧 Contact & Support

For questions, suggestions, or issues:

- **GitHub Issues:** [Report bugs or request features](https://github.com/yourusername/legacy-protection-agent/issues)
- **Discussions:** [Join community conversations](https://github.com/yourusername/legacy-protection-agent/discussions)

---

**Made with ❤️ for Spanish-speaking families worldwide**
