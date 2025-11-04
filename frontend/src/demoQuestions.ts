// demoQuestions.ts
export const DEMO_QUESTIONS = [
  {
    id: "new_participant",
    section: "introduction",
    type: "single_choice",
    question_text: "Are you a new participant?",
    options: ["Yes", "No"],
    data_path: "introduction.new_participant",
    ai_extractable: true
  },
    {
    id: "diagnoses",
    section: "icf_impairment", 
    type: "text",
    question_text: "What diagnoses or conditions do you have?",
    data_path: "icf_impairment.diagnoses",
    ai_extractable: true
  },    
  {
    id: "wellbeing_frequency",
    section: "icf_wellbeing",
    type: "single_choice", 
    question_text: "How often do you get upset, angry, anxious, withdrawn?",
    options: ["Never", "Rarely", "Occasionally", "Often", "Almost always"],
    data_path: "wellbeing.frequency",
    ai_extractable: true
  },
  {
    id: "mobility_support_level",
    section: "icf_impairment",
    type: "scale",
    question_text: "How much support do you need to manage physical challenges? (0-10 scale)",
    scale_range: { min: 0, max: 10, step: 1 },
    data_path: "icf_impairment.mobility_support_level",
    ai_extractable: true
  },
  {
    id: "living_situation",
    section: "about_you", 
    type: "text",
    question_text: "What are your living arrangements?",
    data_path: "about_you.living_situation",
    ai_extractable: true
  },    
  {
    id: "carer_wellbeing",
    section: "about_family",
    type: "single_choice",
    question_text: "In the last 30 days, how much was your family impacted because of your disability?",
    options: ["None", "Mild", "Moderate", "Severe", "Extreme", "Not Applicable"],
    data_path: "family.carer_wellbeing", 
    ai_extractable: true
  },
  {
    id: "impairment_score",
    section: "icf_impairment",
    type: "scale",
    question_text: "If we were to score your impairment restrictions (0-5 scale)",
    scale_range: { min: 0, max: 5, step: 0.5 },
    data_path: "icf_impairment.score",
    ai_extractable: false
  }
];