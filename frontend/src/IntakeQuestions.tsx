// IntakeQuestions.tsx
export const INTAKE_QUESTIONS = [
  // =============================================
  // SECTION 1: INTRODUCTION 
  // =============================================
  {
    id: "intro_heading",
    section: "introduction",
    type: "heading",
    question_text: "INTRODUCTION",
    data_path: "introduction.heading",
    ai_extractable: false
  },
  {
    id: "intro_description",
    section: "introduction",
    type: "heading",
    question_text: "Designed and developed by Dr Anna Moran unplexiTM is a comprehensive and user-friendly tool created to empower individuals and their support teams in identifying, documenting, and addressing essential living needs.",
    data_path: "introduction.description",
    ai_extractable: false
  },
  {
    id: "today_date",
    section: "introduction", 
    type: "date",
    question_text: "Please enter today's date",
    data_path: "introduction.today_date",
    ai_extractable: true
  },
  {
    id: "who_completing",
    section: "introduction",
    type: "single_choice",
    question_text: "Who is completing this profile?",
    options: [
      "Participant/client/patient",
      "Family member/parent", 
      "Carer",
      "Participant AND family member together",
      "Legal guardian",
      "Support worker",
      "Intake team",
      "Allied health professional",
      "Teacher/educator",
      "Employer/workplace"
    ],
    data_path: "introduction.who_completing",
    ai_extractable: true
  },
  {
    id: "new_participant",
    section: "introduction",
    type: "single_choice",
    question_text: "Are you a new participant?",
    options: ["Yes", "No"],
    data_path: "introduction.new_participant",
    ai_extractable: true,
    branching_logic: {
      "Yes": "urgent_help"
    }
  },
  {
    id: "urgent_help",
    section: "introduction",
    type: "single_choice", 
    question_text: "Do you need help right away?",
    options: ["Yes", "No"],
    data_path: "introduction.urgent_help",
    ai_extractable: true
  },
  {
    id: "services_used",
    section: "introduction",
    type: "multiple_choice",
    question_text: "Do you use or want to use any of these services?",
    options: [
      "Active Community",
      "Supported Independent Living",
      "Specialist Disability Accommodation", 
      "Respite Care (STA, MTA)",
      "SLES Work Program",
      "Employment",
      "Allied Health"
    ],
    data_path: "introduction.services_used",
    ai_extractable: true,
    branching_logic: {
      "Active Community": "active_service_location"
    }
  },
  {
    id: "active_service_location",
    section: "introduction",
    type: "single_choice",
    question_text: "Would you like to access support at home, out in the community, or both?",
    options: ["Home", "Community", "Both"],
    data_path: "introduction.active_service_location", 
    ai_extractable: true
  },
  {
    id: "referral_source",
    section: "introduction",
    type: "multiple_choice",
    question_text: "Why did you come to our organisation? Who referred you?",
    options: [
      "Your COS",
      "Your school", 
      "Someone in your healthcare team",
      "Someone in your family", 
      "A friend",
      "Other"
    ],
    data_path: "introduction.referral_source",
    ai_extractable: true
  },
  {
    id: "motivation",
    section: "introduction",
    type: "text",
    question_text: "Tell us a little bit more about what motivated you to approach us for therapy, care and/or support.",
    data_path: "introduction.motivation",
    ai_extractable: true
  },
  {
    id: "funding_source",
    section: "introduction", 
    type: "multiple_choice",
    question_text: "If you currently receive funding for your therapy, care and/or support - where do you get your funding from?",
    options: [
      "NDIS",
      "Workcover",
      "Private/Self-funded",
      "Aged Care/DVA funding",
      "Other"
    ],
    data_path: "introduction.funding_source",
    ai_extractable: true,
    branching_logic: {
      "Other": "funding_source_other"
    }
  },
  {
    id: "funding_source_other",
    section: "introduction",
    type: "text",
    question_text: "Other: where do you get your funding from?",
    data_path: "introduction.funding_source_other",
    ai_extractable: true
  },
  {
    id: "funding_supports",
    section: "introduction",
    type: "multiple_choice",
    question_text: "What kinds of supports does your funding package pay for?",
    options: [
      "Capital Supports",
      "Capacity Building Supports",
      "Core Supports", 
      "Other"
    ],
    data_path: "introduction.funding_supports",
    ai_extractable: true,
    branching_logic: {
      "Other": "funding_supports_other"
    }
  },
  {
    id: "funding_supports_other", 
    section: "introduction",
    type: "text",
    question_text: "Other: what kinds of supports your funding package pay for?",
    data_path: "introduction.funding_supports_other",
    ai_extractable: true
  },

  // =============================================
  // SECTION 2: ABOUT ME
  // =============================================
  {
    id: "about_me_heading",
    section: "about_me",
    type: "heading", 
    question_text: "ABOUT ME",
    data_path: "about_me.heading",
    ai_extractable: false
  },
  {
    id: "about_me_description",
    section: "about_me",
    type: "heading",
    question_text: "This section gives us an opportunity to learn more about how we can support you.",
    data_path: "about_me.description",
    ai_extractable: false
  },
  {
    id: "year_of_birth",
    section: "about_me",
    type: "number",
    question_text: "What year were you born?",
    data_path: "about_me.year_of_birth",
    ai_extractable: true
  },
  {
    id: "postcode",
    section: "about_me",
    type: "number", 
    question_text: "What is your postcode?",
    data_path: "about_me.postcode",
    ai_extractable: true
  },
  {
    id: "gender",
    section: "about_me",
    type: "single_choice",
    question_text: "What gender do you identify as?",
    options: [
      "Female",
      "Male", 
      "Non-Binary",
      "Transgender Female",
      "Transgender Male",
      "Prefer Not To Say",
      "Other"
    ],
    data_path: "about_me.gender",
    ai_extractable: true,
    branching_logic: {
      "Other": "gender_other"
    }
  },
  {
    id: "gender_other",
    section: "about_me",
    type: "text",
    question_text: "OTHER: What gender do you identify as?",
    data_path: "about_me.gender_other", 
    ai_extractable: true
  },
  {
    id: "cultural_background",
    section: "about_me",
    type: "multiple_choice",
    question_text: "What is your cultural background?",
    options: [
      "Australian - from an English speaking, Anglo-Celtic background",
      "Australian - from a culturally and linguistically diverse background", 
      "Aboriginal",
      "Torres Strait Islander",
      "Other"
    ],
    data_path: "about_me.cultural_background",
    ai_extractable: true
  },
  {
    id: "living_arrangements",
    section: "about_me",
    type: "text",
    question_text: "What are your living arrangements? Please include details about the type of home they live in and the people they live with, such as their ages or relationship to the person",
    data_path: "about_me.living_arrangements",
    ai_extractable: true
  },
  {
    id: "things_love",
    section: "about_me", 
    type: "text",
    question_text: "What are the things you love, enjoy doing, or that bring you joy?",
    data_path: "about_me.things_love",
    ai_extractable: true
  },
  {
    id: "things_dislike",
    section: "about_me",
    type: "text",
    question_text: "What are the things you don't like, avoid, or that make you upset, angry, or sad?",
    data_path: "about_me.things_dislike",
    ai_extractable: true
  },
  {
    id: "friends_family_description", 
    section: "about_me",
    type: "text",
    question_text: "How would your friends and family describe you? [Enquire about their personality, what they value, how they interact with others.]",
    data_path: "about_me.friends_family_description",
    ai_extractable: true
  },

  // =============================================
  // SECTION 3: ABOUT MY FAMILY
  // =============================================
  {
    id: "about_family_heading",
    section: "about_family",
    type: "heading",
    question_text: "ABOUT MY FAMILY",
    data_path: "about_family.heading", 
    ai_extractable: false
  },
  {
    id: "about_family_description",
    section: "about_family",
    type: "heading",
    question_text: "This section gives us more information about your family and the current supports they provide.",
    data_path: "about_family.description",
    ai_extractable: false
  },
  {
    id: "family_members",
    section: "about_family",
    type: "text",
    question_text: "Who is in your family? List family members, like mum, dad, any siblings, children, grand children or other relatives",
    data_path: "about_family.family_members",
    ai_extractable: true
  },
  {
    id: "family_relationship",
    section: "about_family",
    type: "text",
    question_text: "What is your relationship like with your family?",
    data_path: "about_family.family_relationship",
    ai_extractable: true
  },
  {
    id: "legal_decision_maker",
    section: "about_family", 
    type: "single_choice",
    question_text: "Do you have someone who has been legally chosen or appointed to help make decisions for you? (This might be someone who is your guardian or enduring power of attorney.)",
    options: ["Yes", "No", "NA"],
    data_path: "about_family.legal_decision_maker",
    ai_extractable: true,
    branching_logic: {
      "Yes": "decision_maker_name"
    }
  },
  {
    id: "decision_maker_name",
    section: "about_family",
    type: "text",
    question_text: "What is the name of the person appointed to help make decisions for you?",
    data_path: "about_family.decision_maker_name",
    ai_extractable: true
  },
  {
    id: "family_activities",
    section: "about_family",
    type: "text", 
    question_text: "What kind of things do you love doing with your family?",
    data_path: "about_family.family_activities",
    ai_extractable: true
  },
  {
    id: "family_help",
    section: "about_family",
    type: "text",
    question_text: "What kind of things does your family help you with? Please list as many as possible.",
    data_path: "about_family.family_help",
    ai_extractable: true
  },
  {
    id: "family_impact_level",
    section: "about_family",
    type: "single_choice",
    question_text: "In the last 30 days, how much has your family been impacted because of your disability?",
    options: ["None", "Mild", "Moderate", "Severe", "Extreme"],
    data_path: "about_family.family_impact_level",
    ai_extractable: true
  },
  {
    id: "family_impact_ways",
    section: "about_family", 
    type: "text",
    question_text: "In what ways has your family been impacted?",
    data_path: "about_family.family_impact_ways",
    ai_extractable: true
  },
  {
    id: "personal_story",
    section: "about_family",
    type: "text",
    question_text: "What is your story? What in your past history has made an impact on you and how you are now?",
    data_path: "about_family.personal_story",
    ai_extractable: true
  }
];