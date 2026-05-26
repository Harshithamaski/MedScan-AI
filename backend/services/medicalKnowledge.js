const medicalKnowledge = [
  {
    id: "diabetes",
    keywords: ["glucose", "sugar", "hba1c", "insulin", "diabetes", "diabetic", "fasting glucose", "blood sugar", "glycated"],
    context: `Diabetes is a condition where blood sugar levels are too high. Normal fasting glucose is 70-100 mg/dL. Pre-diabetes is 100-125 mg/dL. Diabetes is 126+ mg/dL. HbA1c below 5.7% is normal, 5.7-6.4% is pre-diabetes, 6.5%+ is diabetes. Key medicines include Metformin, Glipizide, Januvia, insulin. Patients should avoid sugary foods, refined carbs. Recommended: whole grains, vegetables, lean proteins. Exercise 30 min daily. Check feet regularly. Monitor blood sugar at home.`
  },
  {
    id: "hypertension",
    keywords: ["blood pressure", "hypertension", "systolic", "diastolic", "bp", "mmhg", "antihypertensive"],
    context: `Blood pressure above 130/80 mmHg is considered high (hypertension). Normal is below 120/80. Stage 1 hypertension: 130-139/80-89. Stage 2: 140+/90+. Common medicines: Amlodipine, Lisinopril, Losartan, Metoprolol, Hydrochlorothiazide. Patients should reduce salt intake (less than 2300mg/day), avoid alcohol, quit smoking, exercise regularly, manage stress. DASH diet is recommended. Untreated hypertension can lead to heart attack, stroke, kidney disease.`
  },
  {
    id: "cholesterol",
    keywords: ["cholesterol", "ldl", "hdl", "triglycerides", "lipid", "lipids", "dyslipidemia", "total cholesterol"],
    context: `Cholesterol levels: Total cholesterol desirable is below 200 mg/dL. LDL (bad) should be below 100 mg/dL. HDL (good) should be above 60 mg/dL. Triglycerides should be below 150 mg/dL. High cholesterol increases heart disease and stroke risk. Medicines: Atorvastatin, Rosuvastatin, Simvastatin. Diet: avoid saturated fats, trans fats. Eat oats, nuts, fatty fish, olive oil. Exercise helps raise HDL.`
  },
  {
    id: "thyroid",
    keywords: ["thyroid", "tsh", "t3", "t4", "hypothyroid", "hyperthyroid", "thyroxine", "triiodothyronine"],
    context: `Thyroid hormones regulate metabolism. TSH normal range: 0.4-4.0 mIU/L. High TSH indicates hypothyroidism (underactive thyroid). Low TSH indicates hyperthyroidism (overactive). T4 normal: 5-12 mcg/dL. T3 normal: 80-200 ng/dL. Hypothyroidism symptoms: fatigue, weight gain, cold intolerance, constipation. Treatment: Levothyroxine. Hyperthyroidism symptoms: weight loss, rapid heartbeat, anxiety. Treatments: Methimazole, Propylthiouracil.`
  },
  {
    id: "anemia",
    keywords: ["hemoglobin", "hematocrit", "rbc", "iron", "ferritin", "anemia", "anaemia", "red blood cell", "mcv", "mchc"],
    context: `Anemia is low hemoglobin. Normal hemoglobin: Men 13.5-17.5 g/dL, Women 12-15.5 g/dL. Iron deficiency anemia is most common. Normal ferritin: 20-250 ng/mL. Low MCV indicates iron deficiency. High MCV indicates B12/folate deficiency. Treatments: Iron supplements, B12 injections, folate supplements. Eat iron-rich foods: red meat, spinach, lentils, beans. Vitamin C helps iron absorption. Avoid tea/coffee with meals.`
  },
  {
    id: "kidney",
    keywords: ["creatinine", "urea", "bun", "gfr", "egfr", "kidney", "renal", "uric acid", "proteinuria", "urinalysis"],
    context: `Kidney function tests: Creatinine normal: Men 0.7-1.3 mg/dL, Women 0.6-1.1 mg/dL. BUN normal: 7-20 mg/dL. eGFR above 60 is normal kidney function. Below 60 for 3 months indicates chronic kidney disease. Uric acid high levels cause gout. Normal uric acid: Men 3.4-7.0 mg/dL, Women 2.4-6.0 mg/dL. Kidney disease: reduce protein intake, avoid NSAIDs, control blood pressure, stay hydrated. Warning signs: swelling in legs, foamy urine, decreased urination.`
  },
  {
    id: "liver",
    keywords: ["liver", "sgot", "sgpt", "ast", "alt", "bilirubin", "alkaline phosphatase", "albumin", "hepatitis", "jaundice"],
    context: `Liver function tests: ALT normal: 7-56 U/L. AST normal: 10-40 U/L. Bilirubin normal: 0.1-1.2 mg/dL. Alkaline Phosphatase normal: 44-147 U/L. Elevated liver enzymes indicate liver stress. Causes: fatty liver, alcohol, medications, hepatitis. Fatty liver: lose weight, exercise, avoid alcohol. Hepatitis: antiviral medications. Avoid alcohol completely with liver issues. Eat low-fat diet, avoid processed foods, stay hydrated.`
  },
  {
    id: "infection",
    keywords: ["wbc", "white blood cell", "neutrophil", "lymphocyte", "infection", "bacteria", "viral", "antibiotic", "fever", "inflammation", "crp", "esr"],
    context: `White blood cells fight infection. Normal WBC: 4,500-11,000 cells/mcL. High WBC indicates infection or inflammation. CRP elevated indicates inflammation/infection. Normal CRP below 10 mg/L. ESR elevated in infection, inflammation, autoimmune. Bacterial infections need antibiotics. Viral infections need rest and supportive care. Common antibiotics: Amoxicillin, Azithromycin, Ciprofloxacin. Complete full antibiotic course to prevent resistance.`
  },
  {
    id: "heart",
    keywords: ["ecg", "ekg", "cardiac", "heart", "echocardiogram", "troponin", "bnp", "ejection fraction", "arrhythmia", "angina"],
    context: `Heart health markers: Troponin elevated indicates heart muscle damage. Normal troponin: below 0.04 ng/mL. BNP elevated in heart failure. Normal BNP below 100 pg/mL. Ejection fraction normal: 55-70%. Below 40% indicates heart failure. Symptoms to watch: chest pain, shortness of breath, palpitations, ankle swelling. Medicines: Beta-blockers, ACE inhibitors, diuretics, statins. Diet: Mediterranean diet, reduce salt, avoid saturated fats.`
  },
  {
    id: "vitamins",
    keywords: ["vitamin d", "vitamin b12", "folate", "calcium", "magnesium", "zinc", "deficiency", "supplement"],
    context: `Common vitamin deficiencies: Vitamin D normal: 30-100 ng/mL. Below 20 is deficiency. Take Vitamin D3 supplements, get sunlight. Vitamin B12 normal: 200-900 pg/mL. Below 200 is deficiency, causes nerve damage. Take B12 supplements or injections. Calcium normal: 8.5-10.2 mg/dL. Low calcium causes muscle cramps, bone loss. Eat dairy, leafy greens. Magnesium normal: 1.7-2.2 mg/dL. Low magnesium causes muscle cramps, anxiety.`
  },
  {
    id: "prescription",
    keywords: ["tablet", "capsule", "mg", "dose", "twice daily", "once daily", "before food", "after food", "syrup", "injection", "ointment"],
    context: `Common prescription instructions: OD = Once daily, BD = Twice daily, TDS = Three times daily, QID = Four times daily. Before food means 30 minutes before eating. After food means within 30 minutes of eating. Complete full course even if feeling better. Store medicines at room temperature away from sunlight unless specified. Do not crush or chew extended-release tablets. Check for allergies before starting new medicines. Report side effects to doctor immediately.`
  },
  {
    id: "blood_count",
    keywords: ["platelet", "cbc", "complete blood count", "thrombocyte", "hemoglobin", "hematocrit", "differential"],
    context: `Complete Blood Count (CBC) normal values: RBC: Men 4.7-6.1 million/mcL, Women 4.2-5.4 million/mcL. Hemoglobin: Men 13.5-17.5 g/dL, Women 12-15.5 g/dL. Hematocrit: Men 41-53%, Women 36-46%. WBC: 4,500-11,000/mcL. Platelets: 150,000-400,000/mcL. Low platelets risk bleeding. High platelets risk clotting. Neutrophils should be 40-60% of WBC. Lymphocytes 20-40%.`
  }
];

module.exports = medicalKnowledge;
