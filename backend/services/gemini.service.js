const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// gemini-1.5-flash was removed from the API; use current Flash model (override via GEMINI_MODEL in .env)
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
const FALLBACK_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.0-flash-lite', 'gemini-flash-latest'];

const isQuotaOrUnavailable = (msg) =>
  /429|quota|Too Many Requests|not found|404/i.test(String(msg));

const generateWithModel = async (modelName, request) => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(request);
  return result.response.text();
};

const generateWithFallback = async (request) => {
  const models = [GEMINI_MODEL, ...FALLBACK_MODELS.filter((m) => m !== GEMINI_MODEL)];
  let lastError;

  for (const modelName of models) {
    try {
      return await generateWithModel(modelName, request);
    } catch (error) {
      lastError = error;
      if (!isQuotaOrUnavailable(error.message)) throw error;
      console.warn(`Gemini model ${modelName} failed, trying next...`, error.message);
    }
  }

  throw lastError;
};

const getApiKey = () => {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  const placeholders = new Set(['', 'your_gemini_api_key_here', 'YOUR_GEMINI_API_KEY']);

  if (placeholders.has(key)) {
    throw new Error(
      'GEMINI_API_KEY is missing or still the template value. Put your key in medscan-ai/backend/.env (not frontend/.env). Create one at https://aistudio.google.com/app/apikey'
    );
  }
  if (!key.startsWith('AIza')) {
    throw new Error('GEMINI_API_KEY format is invalid. It should start with AIza.');
  }
  return key;
};

const getGeminiClient = () => new GoogleGenerativeAI(getApiKey());

const parseAnalysisJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new SyntaxError('AI response was not valid JSON');
  }
};

/**
 * Extract text from image using Gemini Vision
 */
const extractTextFromImage = async (imagePath, mimeType) => {
  try {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    const resolvedMime = (mimeType || 'image/jpeg').replace('image/jpg', 'image/jpeg');

    return await generateWithFallback({
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: resolvedMime,
                data: base64Image
              }
            },
            {
              text: 'Please extract ALL text from this medical document/image exactly as it appears. Include all numbers, values, units, medicine names, doctor notes, and any other text. Return only the extracted text without any commentary.'
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Gemini image OCR error:', error.message);
    if (String(error.message).includes('API_KEY_INVALID')) {
      throw new Error(
        'Invalid Gemini API key. Update GEMINI_API_KEY in backend/.env with a new key from https://aistudio.google.com/app/apikey, then restart the backend.'
      );
    }
    throw new Error(`Failed to extract text from image: ${error.message}`);
  }
};

/**
 * Analyze medical report with RAG context
 */
const analyzeMedicalReport = async (extractedText, ragContext) => {
  try {
    const ragSection = ragContext
      ? `\n\nRELEVANT MEDICAL KNOWLEDGE FOR CONTEXT:\n${ragContext}\n`
      : '';

    const prompt = `You are MedScan AI, a compassionate medical report explainer for non-medical people. 
Analyze the following medical report and explain it in very simple, easy-to-understand language that anyone can understand.
${ragSection}
MEDICAL REPORT/PRESCRIPTION TEXT:
${extractedText}

Respond ONLY with a valid JSON object (no markdown, no backticks, no extra text) with this EXACT structure:
{
  "reportType": "Type of report (e.g., Blood Test Report, Prescription, X-Ray Report, etc.)",
  "summary": "2-3 sentence simple summary of what this report shows, in plain language anyone can understand",
  "generalExplanation": "Detailed but simple explanation of the entire report in 3-4 paragraphs. Use simple words. Explain medical terms. Tell the person what this means for their health.",
  "patientInfo": {
    "name": "patient name if found, else empty string",
    "age": "age if found, else empty string",
    "gender": "gender if found, else empty string",
    "date": "report date if found, else empty string"
  },
  "diseases": [
    {
      "name": "Condition or disease name",
      "description": "Simple explanation of what this condition is",
      "severity": "mild/moderate/severe"
    }
  ],
  "medicines": [
    {
      "name": "Medicine name",
      "usage": "What this medicine is for in simple terms",
      "dosage": "How much and how often to take",
      "sideEffects": "Common side effects to watch for"
    }
  ],
  "abnormalValues": [
    {
      "parameter": "Test name",
      "value": "Patient's value with unit",
      "normalRange": "Normal range",
      "interpretation": "Simple explanation of what this means",
      "severity": "low/borderline/high/critical"
    }
  ],
  "precautions": ["List of specific precautions the patient should take"],
  "foodSuggestions": ["Specific foods to eat and avoid"],
  "lifestyleSuggestions": ["Specific lifestyle changes recommended"],
  "seriousWarnings": ["Any serious conditions or values that need immediate attention - empty array if none"],
  "doctorAdvice": "When to see a doctor and what to tell them"
}

Rules:
- Use very simple English. Imagine explaining to a 10-year-old.
- Be encouraging and not scary unless there is a genuinely serious issue.
- If medicines are listed, explain what each one does in simple terms.
- Identify ALL abnormal values from test results.
- Give practical, actionable suggestions.
- If this is a prescription, focus on medicines, their purposes, and how to take them.
- If no information is available for a field, use empty string or empty array.
- Ensure the JSON is valid and complete.`;

    let text = await generateWithFallback(prompt);

    text = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();

    const analysis = parseAnalysisJson(text);
    return analysis;
  } catch (error) {
    console.error('Gemini analysis error:', error.message);

    if (String(error.message).includes('API_KEY_INVALID')) {
      throw new Error(
        'Invalid Gemini API key. Update GEMINI_API_KEY in backend/.env with a new key from https://aistudio.google.com/app/apikey, then restart the backend.'
      );
    }
    if (error instanceof SyntaxError) {
      throw new Error('AI returned invalid response format. Please try again.');
    }
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

module.exports = { extractTextFromImage, analyzeMedicalReport, GEMINI_MODEL };
