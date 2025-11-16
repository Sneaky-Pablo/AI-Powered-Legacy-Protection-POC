# API Testing Examples

## Using cURL

### Generate Report (POST)

\`\`\`bash
curl -X POST http://localhost:3000/api/generate-report \\
  -H "Content-Type: application/json" \\
  -d @sample-request.json
\`\`\`

### Sample Request (save as sample-request.json)

\`\`\`json
{
  "fullName": "Juan Pérez García",
  "age": 45,
  "country": "ES",
  "email": "juan.perez@example.com",
  "maritalStatus": "casado",
  "hasChildren": true,
  "numberOfChildren": 2,
  "assets": [
    {
      "type": "propiedad",
      "description": "Vivienda principal en Madrid",
      "estimatedValue": 350000,
      "location": "Madrid, España"
    },
    {
      "type": "cuenta_bancaria",
      "description": "Cuenta de ahorros principal",
      "estimatedValue": 50000
    },
    {
      "type": "vehiculo",
      "description": "Toyota Camry 2020",
      "estimatedValue": 20000
    }
  ],
  "debts": [
    {
      "type": "hipoteca",
      "description": "Hipoteca de vivienda principal",
      "amount": 120000,
      "creditor": "Banco Santander"
    },
    {
      "type": "tarjeta_credito",
      "description": "Tarjeta de crédito",
      "amount": 5000,
      "creditor": "BBVA"
    }
  ],
  "heirs": [
    {
      "name": "María Pérez López",
      "relationship": "conyuge",
      "percentage": 50,
      "isMinor": false
    },
    {
      "name": "Carlos Pérez López",
      "relationship": "hijo",
      "percentage": 25,
      "isMinor": false
    },
    {
      "name": "Ana Pérez López",
      "relationship": "hija",
      "percentage": 25,
      "isMinor": true,
      "guardianName": "María Pérez López"
    }
  ],
  "hasWill": false,
  "hasExecutor": false,
  "executorName": null,
  "hasMajorIllness": false,
  "hasLifeInsurance": true,
  "hasDependents": true,
  "ownsRealEstate": true,
  "hasComplexFinances": false,
  "specialRequests": "Quiero asegurarme de que mis hijos reciban su herencia de manera equitativa y que mi esposa tenga los recursos necesarios.",
  "concerns": "Me preocupa no tener un testamento formal y que haya disputas familiares."
}
\`\`\`

### Get Report by ID (GET)

\`\`\`bash
curl http://localhost:3000/api/generate-report?id=YOUR_REPORT_ID_HERE
\`\`\`

## Using Postman

### Setup

1. Create a new collection: "Legacy Protection API"
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:3000`

### Request 1: Generate Report

- **Method**: POST
- **URL**: `{{baseUrl}}/api/generate-report`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON): Use the sample-request.json above

### Request 2: Get Report

- **Method**: GET
- **URL**: `{{baseUrl}}/api/generate-report?id={{reportId}}`
- **Headers**: None needed

## Using JavaScript/Fetch

\`\`\`javascript
// Generate Report
async function generateReport() {
  const response = await fetch('http://localhost:3000/api/generate-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: "Juan Pérez García",
      age: 45,
      country: "ES",
      email: "juan.perez@example.com",
      maritalStatus: "casado",
      hasChildren: true,
      numberOfChildren: 2,
      assets: [
        {
          type: "propiedad",
          description: "Vivienda principal",
          estimatedValue: 350000
        }
      ],
      debts: [
        {
          type: "hipoteca",
          description: "Hipoteca",
          amount: 120000
        }
      ],
      heirs: [
        {
          name: "María Pérez",
          relationship: "conyuge",
          percentage: 100
        }
      ],
      hasWill: false,
      hasExecutor: false
    })
  });

  const data = await response.json();
  console.log('Report:', data);
  return data;
}

// Get Report
async function getReport(reportId) {
  const response = await fetch(\`http://localhost:3000/api/generate-report?id=\${reportId}\`);
  const data = await response.json();
  console.log('Report:', data);
  return data;
}
\`\`\`

## Expected Response

\`\`\`json
{
  "success": true,
  "reportId": "550e8400-e29b-41d4-a716-446655440000",
  "pdfUrl": "https://xxxxx.supabase.co/storage/v1/object/public/legacy-reports/pdfs/report-xxx.pdf",
  "report": {
    "riskScore": 45,
    "riskLevel": "medio",
    "riskExplanation": "Su situación patrimonial presenta un nivel de riesgo medio...",
    "actionRoadmap": [
      {
        "step": 1,
        "title": "Formalizar testamento ante notario",
        "description": "Es prioritario establecer un testamento oficial...",
        "priority": "alta",
        "estimatedTime": "2-3 semanas"
      }
    ],
    "generatedAt": "2024-11-16T10:30:00.000Z"
  },
  "message": "Informe generado exitosamente. Recibirá un correo con el PDF completo."
}
\`\`\`

## Error Responses

### Validation Error (400)
\`\`\`json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["age"],
      "message": "Number must be greater than or equal to 18"
    }
  ]
}
\`\`\`

### Server Error (500)
\`\`\`json
{
  "error": "Failed to generate report",
  "message": "OpenAI API error: ...",
  "details": "..."
}
\`\`\`

### Not Found (404)
\`\`\`json
{
  "error": "Report not found"
}
\`\`\`

## Testing Different Countries

Test the system with different countries to see localized templates:

\`\`\`bash
# Spain
curl -X POST ... -d '{"country": "ES", ...}'

# Mexico
curl -X POST ... -d '{"country": "MX", ...}'

# Argentina
curl -X POST ... -d '{"country": "AR", ...}'

# Colombia
curl -X POST ... -d '{"country": "CO", ...}'
\`\`\`

## Performance Testing

Monitor API response times:

\`\`\`bash
time curl -X POST http://localhost:3000/api/generate-report -d @sample-request.json
\`\`\`

Expected times:
- Data validation: < 100ms
- AI processing: 10-30 seconds
- PDF generation: 1-2 seconds
- Total: 12-35 seconds
