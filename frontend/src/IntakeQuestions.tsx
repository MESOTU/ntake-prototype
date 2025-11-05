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
    type: "subheading",
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
    type: "subheading",
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
    type: "subheading",
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
  },
  // =============================================
// SECTION 4: ICF PROFILE - INTRODUCTION
// =============================================
{
  id: "icf_main_heading",
  section: "icf_introduction",
  type: "heading",
  question_text: "MY ICF PROFILE",
  data_path: "icf_introduction.heading",
  ai_extractable: false
},
{
  id: "icf_main_description",
  section: "icf_introduction",
  type: "subheading",
  question_text: "To help you to live your best life now—and adapt as things change—we would like to gather information that helps to tell your support story in a way that your support network can understand. To do this, we use the \"ICF framework\", which is a global standard for understanding the impact health and disability have on someone's life.\n\nYour care story looks at everything from the physical, emotional, and cognitive challenges you might face, to the support you might need for day-to-day tasks and taking part in work or learning, socialising, getting out and about, doing the things you enjoy and forming and maintaining relationships and friendships.\n\nIt also includes the things that help you feel safe, calm, and okay, especially when it comes to managing strong emotions.",
  data_path: "icf_introduction.description",
  ai_extractable: false
},

// =============================================
// SECTION 5: ICF IMPAIRMENT 
// =============================================
{
  id: "icf_impairment_heading",
  section: "icf_impairment",
  type: "heading",
  question_text: "MY ICF PROFILE - IMPAIRMENT",
  data_path: "icf_impairment.main_heading",
  ai_extractable: false
},
{
  id: "icf_impairment_definition",
  section: "icf_impairment",
  type: "subheading",
  question_text: "Impairment means problems with how the body works or is built.\n\n• These can include issues with muscles, bones, joints, the heart, brain, memory, senses, stomach, lungs, blood or other parts of the body.\n\n• These problems are usually caused by an underlying health condition or disability.\n\nThe following questions will help to understand all the things your body struggles with because of your diagnosed health condition or disability.",
  data_path: "icf_impairment.definition",
  ai_extractable: false
},

// =============================================
// IMPAIRMENT - DIAGNOSES/CONDITIONS
// =============================================
{
  id: "impairment_diagnoses",
  section: "icf_impairment",
  type: "multiple_choice",
  question_text: "What diagnoses or conditions do you have? You can choose more than one option from the list below.",
  options: [
    "Brain Injury/Head Injury",
    "Anorexia",
    "Anxiety Disorder",
    "Attention Deficit Hyperactivity Disorder (ADHD)",
    "Autism",
    "Bipolar Affective Disorder (Schizophrenia)",
    "Cerebral Palsy",
    "Chronic Fatigue/ME",
    "Chronic Obstructive Pulmonary Disease (COPD)",
    "Congenital abnormality/deformity",
    "Developmental Language Disorder",
    "Dementia",
    "Depression",
    "Diabetes",
    "Downs Syndrome",
    "Dysarthria (challenges with the physical ability to form words/weak muscles causing difficulty speaking)",
    "Dysfluency (challenges with the fluency of spoken word e.g. stammering, stuttering)",
    "Dysphagia (difficulty swallowing)",
    "Dysphasia/Aphasia (language disorder - challenges selecting words to be spoken forming sentences or phrases)",
    "Dyspraxia/Developmental Coordination Difficulties",
    "Epilepsy",
    "Hearing Impairment/Deafness",
    "Incontinence",
    "Insulin Dependent Diabetes (Type 1)",
    "Learning Disability",
    "Neurological disorder/progressive neurological disorders (MS, MD, MND, Parkinson's)",
    "Non Insulin Dependent Diabetes (Type 2)",
    "Post Traumatic Stress Disorder (PTSD)",
    "Sensory Processing Disorder",
    "Stroke",
    "RET Syndrome",
    "Spinal Injury (quadriplegia/paraplegia)",
    "Tourette's Syndrome",
    "Vision impairment",
    "Fragile X",
    "Obesity"
  ],
  data_path: "icf_impairment.diagnoses",
  ai_extractable: true
},

// =============================================
// IMPAIRMENT - PHYSICAL CHALLENGES SECTION
// =============================================
{
  id: "physical_challenges_heading",
  section: "icf_impairment",
  type: "heading",
  question_text: "Physical Challenges",
  data_path: "icf_impairment.physical.heading",
  ai_extractable: false
},
{
  id: "physical_challenges_description",
  section: "icf_impairment",
  type: "text",
  question_text: "Because of your health condition(s) and/or disability, what specific physical challenges do you have? Please describe the physical issues, not the help that is needed. If you don't have any, please write NA.\n\nEXAMPLE: I have tremors in my hands and arms, weak arms and shoulders (I have difficulty lifting arms above my head), reduced functional strength in my hands, difficulty with fine motor control of my fingers for both hands, I hold my hands in a tight grip / clenched fist, weak chewing and swallowing muscles, my balance is impaired on uneven surfaces when sitting and standing, my depth of perception is compromised, I have a weak trunk.",
  data_path: "icf_impairment.physical.challenges_description",
  ai_extractable: true
},
{
  id: "physical_challenges_worsened",
  section: "icf_impairment",
  type: "single_choice",
  question_text: "Have your physical challenges gotten worse in the last three years, or do they change from day to day?",
  options: ["Yes", "No"],
  data_path: "icf_impairment.physical.challenges_worsened",
  ai_extractable: true,
  branching_logic: {
    "Yes": "physical_changes_description"
  }
},
{
  id: "physical_changes_description",
  section: "icf_impairment",
  type: "text",
  question_text: "How have your physical challenges gotten worse in the last three years, or how do they change from day to day? Have they gotten worse in certain areas, like their arms, legs, or joints? How much have they changed? Just a little, a lot, or something in between?\n\nEXAMPLE: Since my stroke 3 years ago I have no movement in my left arm or leg, and I cannot chew or swallow.",
  data_path: "icf_impairment.physical.changes_description",
  ai_extractable: true
},
{
  id: "physical_monitoring_needs",
  section: "icf_impairment",
  type: "text",
  question_text: "Which of these changing physical challenges do we need to monitor closely? What are the main things we need to monitor.",
  data_path: "icf_impairment.physical.monitoring_needs",
  ai_extractable: true
},
// =============================================
// IMPAIRMENT - CHALLENGES WITH BODY SYSTEMS SECTION
// =============================================
{
  id: "body_systems_heading",
  section: "icf_impairment",
  type: "heading",
  question_text: "Challenges With Your Body Systems",
  data_path: "icf_impairment.body_systems.heading",
  ai_extractable: false
},
{
  id: "body_systems_challenges",
  section: "icf_impairment",
  type: "text",
  question_text: "Because of your health condition(s) and/or disability, what specific challenges do you have with how your body systems work? Please describe the body system issues, not the help that is needed. If you don't have any, please write NA.\n\nEXAMPLE: trouble with breathing, blood/clotting, digestion, incontinence, seizures, or their senses like vision or hearing.",
  data_path: "icf_impairment.body_systems.challenges",
  ai_extractable: true
},
{
  id: "body_systems_worsened",
  section: "icf_impairment",
  type: "single_choice",
  question_text: "Have your body system challenges gotten worse in the last three years, or do they change from day to day?",
  options: ["Yes", "No"],
  data_path: "icf_impairment.body_systems.worsened",
  ai_extractable: true,
  branching_logic: {
    "Yes": "body_systems_changes_description"
  }
},
{
  id: "body_systems_changes_description",
  section: "icf_impairment",
  type: "text",
  question_text: "How have the problems with your body systems gotten worse in the last three years, or how do they change day to day? Have they gotten worse in certain areas, like your digestion and breathing? How much have they changed? Just a little, a lot, or something in between?\n\nEXAMPLE: Since my asthma got worse, I have trouble breathing when I exercise or when it's cold outside. It has gotten a lot worse over the past year.",
  data_path: "icf_impairment.body_systems.changes_description",
  ai_extractable: true
},
{
  id: "body_systems_monitoring_needs",
  section: "icf_impairment",
  type: "text",
  question_text: "Which of these changing body system challenges do we need to monitor closely? What are the main things we need to monitor.",
  data_path: "icf_impairment.body_systems.monitoring_needs",
  ai_extractable: true
},
// =============================================
// IMPAIRMENT - EMOTIONAL/COGNITIVE CHALLENGES SECTION
// =============================================
{
  id: "cognitive_emotional_heading",
  section: "icf_impairment",
  type: "heading",
  question_text: "Challenges with your emotions, thinking, memory, concentration",
  data_path: "icf_impairment.cognitive_emotional.heading",
  ai_extractable: false
},
{
  id: "cognitive_emotional_challenges",
  section: "icf_impairment",
  type: "text",
  question_text: "Because of your health condition(s) and/or disability, what specific challenges do you have with how your mind works? Please describe the challenges with emotions, thinking, concentrating, memory, not the help that is needed. If you don't have any, please write NA.\n\nDo you have trouble with memory, concentration, or learning new things? Do you experience intense emotions like anxiety or anger, or have difficulty managing your behaviour, social interactions, or relationships?\n\nEXAMPLE: I have trouble remembering things, concentrating, and solving problems. I struggle to manage my emotions and when I am distressed, I can act in ways that might be seen as disruptive or harmful. I sometimes avoid social situations and find it hard to maintain relationships.",
  data_path: "icf_impairment.cognitive_emotional.challenges",
  ai_extractable: true
},
{
  id: "cognitive_emotional_worsened",
  section: "icf_impairment",
  type: "single_choice",
  question_text: "Have these emotions, thinking and/or memory challenges gotten worse in the last three years, or do they change from day to day?",
  options: ["Yes", "No"],
  data_path: "icf_impairment.cognitive_emotional.worsened",
  ai_extractable: true,
  branching_logic: {
    "Yes": "cognitive_emotional_changes_description"
  }
},
{
  id: "cognitive_emotional_changes_description",
  section: "icf_impairment",
  type: "text",
  question_text: "How have your emotional, thinking and behaviour challenges gotten worse in the last three years, or how do they change day to day? Have they gotten worse in certain areas, like social settings, relationships, self harm cycles? How much have they changed? Just a little, a lot, or something in between?\n\nEXAMPLE: Since my diagnosis with PTSD, my emotions have been harder to manage. I get triggered more easily, and my reactions are more intense than before. This has changed a lot over the last three years.",
  data_path: "icf_impairment.cognitive_emotional.changes_description",
  ai_extractable: true
},
{
  id: "cognitive_emotional_monitoring_needs",
  section: "icf_impairment",
  type: "text",
  question_text: "Which of these changing challenges with your emotions, thinking, memory and concentration do we need to monitor closely? What are the main things we need to monitor.",
  data_path: "icf_impairment.cognitive_emotional.monitoring_needs",
  ai_extractable: true
},
// =============================================
// IMPAIRMENT - SUPPORTS & NEEDS SECTION
// =============================================
{
  id: "supports_needs_heading",
  section: "icf_impairment",
  type: "heading",
  question_text: "Medical, therapy, environmental, dietary, sensory, equipment needs + supports",
  data_path: "icf_impairment.supports_needs.heading",
  ai_extractable: false
},
{
  id: "current_medications",
  section: "icf_impairment",
  type: "text",
  question_text: "List all the medications you currently take that help you with your impairment challenges. Include dosage and schedule.",
  data_path: "icf_impairment.supports_needs.current_medications",
  ai_extractable: true
},
{
  id: "medication_supports",
  section: "icf_impairment",
  type: "text",
  question_text: "What supports do you need to be able to take, renew or review your medications? For example, reminders for taking medications, asking your family to fill prescriptions, support to renew or review prescriptions, help taking your medications.",
  data_path: "icf_impairment.supports_needs.medication_supports",
  ai_extractable: true
},
{
  id: "medical_specialists",
  section: "icf_impairment",
  type: "text",
  question_text: "What medical Specialists do you need access to to help you with your impairment challenges? How frequently do you see them? Do you have a regular appointment schedule, if so please describe. What are their details?",
  data_path: "icf_impairment.supports_needs.medical_specialists",
  ai_extractable: true
},
{
  id: "specialist_appointment_supports",
  section: "icf_impairment",
  type: "text",
  question_text: "What support do you need to attend these medical specialist appointments / recommendations? For example transport to and from appointments; someone to go with you to the appointments; someone to hand over information from the appointments to your family/carers.",
  data_path: "icf_impairment.supports_needs.specialist_appointment_supports",
  ai_extractable: true
},
{
  id: "therapists_therapies",
  section: "icf_impairment",
  type: "text",
  question_text: "What therapists + therapies do you need to access to help you with these impairment challenges? How frequently do you see them? Do you have a regular appointment schedule, if so please describe. What are their details?",
  data_path: "icf_impairment.supports_needs.therapists_therapies",
  ai_extractable: true
},
{
  id: "therapy_appointment_supports",
  section: "icf_impairment",
  type: "text",
  question_text: "What supports do you need to attend and undertake these therapist appointments / recommendations? For example transport to and from appointments; someone to go with you to the appointments; someone to hand over information from the appointments to your family/carers; someone to help you undertake the recommendations/advice provided.",
  data_path: "icf_impairment.supports_needs.therapy_appointment_supports",
  ai_extractable: true
},
{
  id: "special_diet",
  section: "icf_impairment",
  type: "text",
  question_text: "If you have a specific diet that helps you, tell us about it.",
  data_path: "icf_impairment.supports_needs.special_diet",
  ai_extractable: true
},
{
  id: "diet_supports",
  section: "icf_impairment",
  type: "text",
  question_text: "What supports do you need to help you with your special diet? E.g. going to particular shops or planning meals for yourself",
  data_path: "icf_impairment.supports_needs.diet_supports",
  ai_extractable: true
},
{
  id: "environmental_supports",
  section: "icf_impairment",
  type: "text",
  question_text: "What environmental supports or adjustments do you need to help you with these challenges?",
  data_path: "icf_impairment.supports_needs.environmental_supports",
  ai_extractable: true
},
{
  id: "equipment_needs",
  section: "icf_impairment",
  type: "text",
  question_text: "What specific equipment do you need to use or have access to to help you with your impairment challenges?",
  data_path: "icf_impairment.supports_needs.equipment_needs",
  ai_extractable: true
},
{
  id: "equipment_usage_supports",
  section: "icf_impairment",
  type: "text",
  question_text: "What support do you need to be able to use your equipment correctly? For example, do your carers need to understand how to use or adjust your equipment? When you need it reviewed etc?",
  data_path: "icf_impairment.supports_needs.equipment_usage_supports",
  ai_extractable: true
},
{
  id: "sensory_supports",
  section: "icf_impairment",
  type: "text",
  question_text: "If you need access to sensory supports or equipment, tell us here.",
  data_path: "icf_impairment.supports_needs.sensory_supports",
  ai_extractable: true
},
{
  id: "sensory_supports_usage",
  section: "icf_impairment",
  type: "text",
  question_text: "When you need to use your sensory supports, what support do you need to help you?",
  data_path: "icf_impairment.supports_needs.sensory_supports_usage",
  ai_extractable: true
},
// =============================================
// IMPAIRMENT - UNMET NEEDS SECTION
// =============================================
{
  id: "unmet_needs_heading",
  section: "icf_impairment",
  type: "heading",
  question_text: "My ICF Profile - Unmet Needs",
  data_path: "icf_impairment.unmet_needs.heading",
  ai_extractable: false
},
{
  id: "unmet_support_needs",
  section: "icf_impairment",
  type: "text",
  question_text: "Now that we have discussed the medical, therapy, equipment, dietary, sensory and environmental supports you need to help you with your impairment challenges, are there any of these supports that you do not have access to and are not recognised or funded by your care package that you feel you would benefit from?",
  data_path: "icf_impairment.unmet_needs.support_needs",
  ai_extractable: true
},
// =============================================
// IMPAIRMENT - IMPAIRMENT SCORE SECTION
// =============================================
{
  id: "impairment_score_heading",
  section: "icf_impairment",
  type: "heading",
  question_text: "My ICF Profile - Impairment Score",
  data_path: "icf_impairment.impairment_score.heading",
  ai_extractable: false
},
{
  id: "impairment_score",
  section: "icf_impairment",
  type: "scale",
  question_text: "If we were to score your impairment restrictions on a validated scale, they would be considered:\n\nThink about the challenges you have with your body, mind, or senses. How many challenges do you have, and how hard are they for you? Use the scale below to choose the level that feels right for you.\n\nSelect the level (0 to 5, with half points allowed) that best describes their situation.\n\n0-0.5 Profound (I have profound limitations with my body, mind and/or senses):\nI have little or no control over my body or mind. I may not be able to respond to things around me, move, or talk much. Movement and/or control of my arms, hands, feet, legs, trunk and neck may be very limited. I may have significant trouble with breathing, digestion, swallowing, or bladder and bowel control. I might have significant pain. I might feel profound distress, see or hear things that aren't real, or have no control over my body or mind. I may not be able to respond or communicate.\n\n1-1.5 Severe (I have severe limitations with my body, mind and/or senses):\nI have some control over my body or mind, but this is very limited. I can move or respond a little, but I might need a lot of help. Movement and/or control of my arms, hands, feet, legs, trunk and neck may be quite limited. I may have trouble with breathing, digestion, swallowing, or bladder and bowel control. I might feel pain. I might feel very distressed, see or hear things that aren't real. I can respond or communicate, but this is very challenging and/or inconsistent and/or not age appropriate.\n\n2-2.5 Moderate to Severe (I have some significant challenges with my body, mind and/or senses):\nI have some control over my body or mind. I have some moderate to severe limitations with the movement and/or control of my arms, hands, feet, legs, trunk and neck. I may have moderately severe trouble with breathing, digestion, swallowing, or bladder and bowel control. I might feel pain sometimes. I might sometimes feel moderate to severe levels of distress, see or hear things that aren't real. I can usually respond or communicate but may need adjustments/support.\n\n3-3.5 Moderate (I have some considerable challenges with my body, mind and/or senses):\nI mostly have control over my body and mind but have some limitations. Movement and/or control of my arms, hands, feet, legs, trunk and neck is somewhat limited. I may have trouble with breathing, digestion, swallowing, or bladder and bowel control. I might feel pain sometimes. I might sometimes feel some distressed. I can usually respond or communicate but may need some adjustments/support.\n\n4-4.5 Mild (I have small challenges with my body, mind and/or senses):\nI usually have control over my body and mind but have some mild limitations. Movement and/or control of my arms, hands, feet, legs, trunk and neck is a little limited. I may have some mild trouble with breathing, digestion, swallowing, or bladder and bowel control. I might feel pain sometimes. I might sometimes feel mild distress. I can respond and communicate.\n\n5 None (I don't have any challenges with my body, mind, or senses. Everything works as it should for my age):",
  scale_range: { min: 0, max: 5, step: 0.5 },
  data_path: "icf_impairment.impairment_score.score",
  ai_extractable: false
},
// =============================================
// SECTION 6: ICF ACTIVITY - INTRODUCTION
// =============================================
{
  id: "icf_activity_heading",
  section: "icf_activity",
  type: "heading",
  question_text: "MY ICF PROFILE - ACTIVITY",
  data_path: "icf_activity.main_heading",
  ai_extractable: false
},
{
  id: "icf_activity_definition",
  section: "icf_activity",
  type: "subheading",
  question_text: "Activity relates to your ability to complete daily activities.\n\nActivity means the everyday tasks you do in life like understanding & communicating, moving & getting around, self care, doing household responsibilities and getting along with others.\n\nActivity limitations happen when it's harder to do these tasks because of problems caused by your health condition or disability (impairments).\n\nEXAMPLES:\nPhysical: If your legs hurt or you have weak muscles, walking might be tricky.\nSensory: If you have a hearing impairment, it might be hard to understand someone talking.\nBody Systems: If you have a problem with your heart and get tired often, you might forget to do a task.\nEmotional: If you have anxiety, it might make it hard to talk to new people & form new relationships.\n\nThe following questions will help to understand all the activities this participant may struggle with and might need some help to do.",
  data_path: "icf_activity.definition",
  ai_extractable: false
},
// =============================================
// ACTIVITY - UNDERSTANDING AND COMMUNICATING SECTION
// =============================================
{
  id: "activity_understanding_communicating_heading",
  section: "icf_activity",
  type: "heading",
  question_text: "Activity - Understanding and Communicating",
  data_path: "icf_activity.understanding_communicating.heading",
  ai_extractable: false
},
{
  id: "support_understanding_communicating",
  section: "icf_activity",
  type: "single_choice",
  question_text: "Do you need any support to help you with understanding and communicating?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_activity.understanding_communicating.needs_support",
  ai_extractable: true,
  branching_logic: {
    "Yes": "concentration_difficulty",
    "Unsure": "concentration_difficulty"
  }
},
{
  id: "concentration_difficulty",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have concentrating on doing something for ten minutes?\n\nAsk how well they can concentrate for a short time, like 10 minutes. Most people understand this question, but if someone needs help, remind them to think about their usual concentration, not times when they are worried or in a very noisy place. If needed, suggest they think about times when they were doing things like schoolwork, reading, writing, drawing, playing music, or building something.",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_activity.understanding_communicating.concentration_difficulty",
  ai_extractable: true
},
{
  id: "support_concentration",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to help you concentrate on doing something for ten minutes?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_activity.understanding_communicating.support_concentration",
  ai_extractable: true,
  branching_logic: {
    "Yes": "concentration_supports",
    "Unsure": "concentration_supports"
  }
},
{
  id: "concentration_supports",
  section: "icf_activity",
  type: "text",
  question_text: "What do you find difficult? What supports help you to concentrate on doing something for ten minutes and who usually provides those supports?",
  data_path: "icf_activity.understanding_communicating.concentration_supports",
  ai_extractable: true
},
{
  id: "remembering_difficulty",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have in remembering to do important things?\n\nAsk how well important things in daily life are remembered.\n\nThis is not about remembering small details or things from a long time ago. Think about how well important tasks for home or family are remembered. If notes, phone alarms, or help from others are used, think about how well things are remembered with those reminders.",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_activity.understanding_communicating.remembering_difficulty",
  ai_extractable: true
},
{
  id: "support_remembering",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support with remembering to do important things?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_activity.understanding_communicating.support_remembering",
  ai_extractable: true,
  branching_logic: {
    "Yes": "remembering_supports",
    "Unsure": "remembering_supports"
  }
},
{
  id: "remembering_supports",
  section: "icf_activity",
  type: "text",
  question_text: "What do you find difficult? What supports help you to remember to do important things?",
  data_path: "icf_activity.understanding_communicating.remembering_supports",
  ai_extractable: true
},
{
  id: "problem_solving_difficulty",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have with analysing and finding solutions to problems in day-to-day life?\n\nAsk how well problems that need a lot of thinking are solved. If the concept is unclear, consider a problem faced in the last 30 days. Then, assess how well the individual:\n• Noticed there was a problem\n• Broke it into smaller parts\n• Thought of different ways to solve it\n• Decided what was good and bad about each option\n• Picked the best solution\n• Tried it out and checked if it worked\n• Chose a different solution if the first one didn't work.",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_activity.understanding_communicating.problem_solving_difficulty",
  ai_extractable: true
},
{
  id: "support_problem_solving",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to analyse and find solutions to problems in day-to-day life?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_activity.understanding_communicating.support_problem_solving",
  ai_extractable: true,
  branching_logic: {
    "Yes": "problem_solving_supports",
    "Unsure": "problem_solving_supports"
  }
},
{
  id: "problem_solving_supports",
  section: "icf_activity",
  type: "text",
  question_text: "What do you find difficult? What supports help you to analyse and find solutions to problems in day-to-day life?",
  data_path: "icf_activity.understanding_communicating.problem_solving_supports",
  ai_extractable: true
},
{
  id: "learning_difficulty",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have learning a new task?\n\nAsk how well new things are learned. The question gives learning a new route as an example, but it is not just about finding a new place. Consider other times in the past month when something new had to be learned, such as:\n• A new task at work (like a new rule or project)\n• A new lesson at school\n• A new skill at home (like fixing something)\n• A new hobby (like a game or craft).\nWhen thinking about your answer, consider how easily you learned, if you needed help or practice, and how well you remembered what you learned.",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_activity.understanding_communicating.learning_difficulty",
  ai_extractable: true
},
{
  id: "support_learning",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to learn a new task?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_activity.understanding_communicating.support_learning",
  ai_extractable: true,
  branching_logic: {
    "Yes": "learning_supports",
    "Unsure": "learning_supports"
  }
},
{
  id: "learning_supports",
  section: "icf_activity",
  type: "text",
  question_text: "What do you find difficult? What supports help you to learn a new task?",
  data_path: "icf_activity.understanding_communicating.learning_supports",
  ai_extractable: true
},
{
  id: "understanding_difficulty",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have generally understanding what people say?\n\nAsk how well others are understood when they communicate in the usual way (such as speaking, sign language, or using a hearing aid). Consider how difficult it has been over the past 30 days in different situations, such as:\n• When someone talks fast\n• When there is background noise\n• When there are distractions.\n\nDo not include times when it was hard to understand because someone spoke a different language.",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_activity.understanding_communicating.understanding_difficulty",
  ai_extractable: true
},
{
  id: "support_understanding",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to understand what people say?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_activity.understanding_communicating.support_understanding",
  ai_extractable: true,
  branching_logic: {
    "Yes": "understanding_supports",
    "Unsure": "understanding_supports"
  }
},
{
  id: "understanding_supports",
  section: "icf_activity",
  type: "text",
  question_text: "What do you find difficult? What supports help you to generally understand what people say?",
  data_path: "icf_activity.understanding_communicating.understanding_supports",
  ai_extractable: true
},
{
  id: "conversation_difficulty",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have starting and maintaining conversations?\n\nAsk how well conversations are started and kept going. If one is harder than the other, consider the overall difficulty of both together. Conversation can happen in different ways, such as speaking, writing, sign language, or gestures.\n\nIf a communication aid, like a hearing device, is used, think about how conversations feel when using it. Also, consider any health-related challenges that might make talking harder, such as hearing loss, language difficulties (like after a stroke), stuttering, or anxiety.",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_activity.understanding_communicating.conversation_difficulty",
  ai_extractable: true
},
{
  id: "support_conversation",
  section: "icf_activity",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to start and maintain a conversation?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_activity.understanding_communicating.support_conversation",
  ai_extractable: true,
  branching_logic: {
    "Yes": "conversation_supports",
    "Unsure": "conversation_supports"
  }
},
{
  id: "conversation_supports",
  section: "icf_activity",
  type: "text",
  question_text: "What do you find difficult? What supports help you to start and maintain a conversation?",
  data_path: "icf_activity.understanding_communicating.conversation_supports",
  ai_extractable: true
},
{
  id: "unmet_communication_supports",
  section: "icf_activity",
  type: "text",
  question_text: "Now that we have discussed the help you need with understanding and communicating, do you have any unmet or unfunded supports that you feel you would benefit from?",
  data_path: "icf_activity.understanding_communicating.unmet_supports",
  ai_extractable: true
},
// =============================================
// SECTION 7: ICF PARTICIPATION - INTRODUCTION
// =============================================
{
  id: "icf_participation_heading",
  section: "icf_participation",
  type: "heading",
  question_text: "MY ICF PROFILE - PARTICIPATION",
  data_path: "icf_participation.main_heading",
  ai_extractable: false
},
{
  id: "icf_participation_definition",
  section: "icf_participation",
  type: "subheading",
  question_text: "Participation means being part of activities and things that happen in everyday life. It's about how you join in with the world around you, like at school, with friends, at work, or in your community.\n\nParticipation describes how you play, learn, communicate, socialise, work and take part in things with other people.\n\nImportantly participation is also used to describe someone's ability to make choices and have control over their lives and environment. It extends to an individual's self-awareness, integration into age-appropriate activities, and achievement of potential.\n\nParticipation restrictions are things that might make it hard for an individual to participate in everyday life.\n\nThe following questions will help to understand the participation challenges this participant may need support to do.",
  data_path: "icf_participation.definition",
  ai_extractable: false
},
// =============================================
// PARTICIPATION - SCHOOL, WORK OR STRUCTURED LEARNING SECTION
// =============================================
{
  id: "participation_school_work_heading",
  section: "icf_participation",
  type: "heading",
  question_text: "Participation - School, Work or Structured Learning",
  data_path: "icf_participation.school_work.heading",
  ai_extractable: false
},
{
  id: "participate_school_work",
  section: "icf_participation",
  type: "single_choice",
  question_text: "Do you participate in school, work or a structured learning program (e.g. attend a day program)?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_participation.school_work.participates",
  ai_extractable: true,
  branching_logic: {
    "Yes": "school_work_difficulty",
    "Unsure": "school_work_difficulty"
  }
},
{
  id: "school_work_difficulty",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have doing your day to day work / school work / learning?",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_participation.school_work.daily_difficulty",
  ai_extractable: true
},
{
  id: "support_school_work",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to do your day to day work / school work / learning?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_participation.school_work.support_daily",
  ai_extractable: true,
  branching_logic: {
    "Yes": "school_work_supports",
    "Unsure": "school_work_supports"
  }
},
{
  id: "school_work_supports",
  section: "icf_participation",
  type: "text",
  question_text: "What do you find difficult? What supports help you to do your day to day work / school work?",
  data_path: "icf_participation.school_work.daily_supports",
  ai_extractable: true
},
{
  id: "important_tasks_difficulty",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have doing your most important work/school/learning tasks well?",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_participation.school_work.important_tasks_difficulty",
  ai_extractable: true
},
{
  id: "support_important_tasks",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to do your most important work/school tasks well?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_participation.school_work.support_important_tasks",
  ai_extractable: true,
  branching_logic: {
    "Yes": "important_tasks_supports",
    "Unsure": "important_tasks_supports"
  }
},
{
  id: "important_tasks_supports",
  section: "icf_participation",
  type: "text",
  question_text: "What do you find difficult? What supports help you to do your most important work/school tasks well?",
  data_path: "icf_participation.school_work.important_tasks_supports",
  ai_extractable: true
},
{
  id: "completing_work_difficulty",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have Getting all of your work /school work / learning done that you need to do?",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_participation.school_work.completing_difficulty",
  ai_extractable: true
},
{
  id: "support_completing_work",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to get all of the work / school work / learning done that you need to do?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_participation.school_work.support_completing",
  ai_extractable: true,
  branching_logic: {
    "Yes": "completing_work_supports",
    "Unsure": "completing_work_supports"
  }
},
{
  id: "completing_work_supports",
  section: "icf_participation",
  type: "text",
  question_text: "What do you find difficult? What supports help you to get all of the work / school work / learning done that you need to do?",
  data_path: "icf_participation.school_work.completing_supports",
  ai_extractable: true
},
{
  id: "work_speed_difficulty",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much difficulty did you have getting your work / school work / learning done as quickly as needed?",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_participation.school_work.speed_difficulty",
  ai_extractable: true
},
{
  id: "support_work_speed",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to get your work / school work / learning done as quickly as needed?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_participation.school_work.support_speed",
  ai_extractable: true,
  branching_logic: {
    "Yes": "work_speed_supports",
    "Unsure": "work_speed_supports"
  }
},
{
  id: "work_speed_supports",
  section: "icf_participation",
  type: "text",
  question_text: "What do you find difficult? What supports help you to get your work / school work / learning done as quickly as needed?",
  data_path: "icf_participation.school_work.speed_supports",
  ai_extractable: true
},
{
  id: "unmet_school_work_supports",
  section: "icf_participation",
  type: "text",
  question_text: "Now that we have discussed the help you need with school, work or structured learning (group activities), do you have any unmet or unfunded supports that you feel you would benefit from?",
  data_path: "icf_participation.school_work.unmet_supports",
  ai_extractable: true
},
// =============================================
// PARTICIPATION - JOINING IN COMMUNITY ACTIVITIES SECTION
// =============================================
{
  id: "participation_community_heading",
  section: "icf_participation",
  type: "heading",
  question_text: "Participation - Joining in Community Activities",
  data_path: "icf_participation.community.heading",
  ai_extractable: false
},
{
  id: "problems_community_activities",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you had problems with or needed support to join in with community activities?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_participation.community.problems_support",
  ai_extractable: true,
  branching_logic: {
    "Yes": "community_joining_difficulty",
    "Unsure": "community_joining_difficulty"
  }
},
{
  id: "community_joining_difficulty",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, how much of a problem did you have in joining community activities in the same way as anyone else can?\n\nAsk how easy or difficult it is to take part in community activities such as:\n• Attending town meetings\n• Going to fairs / cafes / the movies / the park\n• Joining leisure or sporting activities in the town, neighbourhood, or community.\n• Attending festivities\n• Attending religious events or activities\n\nThe key question is whether participation is possible or if there are barriers preventing it.\n\nIf there is confusion about the phrase \"in the same way anyone else can,\" ask for a judgement on:\n• How easily most people in the community can take part in these activities.\n• How personal challenges compare to that standard when joining community activities.",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_participation.community.joining_difficulty",
  ai_extractable: true
},
{
  id: "community_supports",
  section: "icf_participation",
  type: "text",
  question_text: "What challenges or barriers have you encountered? What supports help you to join in community activities in the same way as anyone else can?",
  data_path: "icf_participation.community.supports",
  ai_extractable: true
},
{
  id: "unmet_community_supports",
  section: "icf_participation",
  type: "text",
  question_text: "Now that we have discussed the help you need with joining in community activities, do you have any unmet or unfunded supports that you feel you would benefit from?",
  data_path: "icf_participation.community.unmet_supports",
  ai_extractable: true
},
// =============================================
// PARTICIPATION - RELAXATION SECTION
// =============================================
{
  id: "participation_relaxation_heading",
  section: "icf_participation",
  type: "heading",
  question_text: "Participation - Relaxation",
  data_path: "icf_participation.relaxation.heading",
  ai_extractable: false
},
{
  id: "relaxation_difficulty",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, how much of a problem did you have doing things by yourself for relaxation or pleasure?\n\nHow easy or difficult it is to take part in leisure activities. Consider both activities that are currently enjoyed and those that would be pursued but cannot be due to a health condition /disability or societal barriers.\n\nExamples include:\n• Wanting to read novels but being unable to because the local library does not carry large-print books.\n• Enjoying movies but being unable to watch them because few are produced with subtitles for the deaf.\n\nProvide an overall rating of the difficulties experienced in accessing leisure activities -",
  options: ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe", "4 - Extreme", "5 - Not Applicable"],
  data_path: "icf_participation.relaxation.difficulty",
  ai_extractable: true
},
{
  id: "support_relaxation",
  section: "icf_participation",
  type: "single_choice",
  question_text: "In the last 30 days, because of your impairments, have you needed support to do things by yourself for relaxation or pleasure?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_participation.relaxation.support",
  ai_extractable: true,
  branching_logic: {
    "Yes": "relaxation_supports",
    "Unsure": "relaxation_supports"
  }
},
{
  id: "relaxation_supports",
  section: "icf_participation",
  type: "text",
  question_text: "What do you find difficult / what were the barriers for you? What supports help you to do things by yourself for relaxation or pleasure?",
  data_path: "icf_participation.relaxation.supports",
  ai_extractable: true
},
{
  id: "unmet_relaxation_supports",
  section: "icf_participation",
  type: "text",
  question_text: "Now that we have discussed the help you need with doing things by yourself for relaxation or pleasure do you have any unmet or unfunded supports that you feel you would benefit from?",
  data_path: "icf_participation.relaxation.unmet_supports",
  ai_extractable: true
},

// =============================================
// PARTICIPATION - OTHER SECTION
// =============================================
{
  id: "participation_other_heading",
  section: "icf_participation",
  type: "heading",
  question_text: "Participation - Other",
  data_path: "icf_participation.other.heading",
  ai_extractable: false
},
{
  id: "other_participation_limitations",
  section: "icf_participation",
  type: "single_choice",
  question_text: "Do you have any other participation limitations that you haven't told us about yet?",
  options: ["Yes", "No", "Unsure"],
  data_path: "icf_participation.other.limitations",
  ai_extractable: true,
  branching_logic: {
    "Yes": "other_limitations_details",
    "Unsure": "other_limitations_details"
  }
},
{
  id: "other_limitations_details",
  section: "icf_participation",
  type: "text",
  question_text: "Could you please tell us about the participation limitations you haven't told us about yet? What do you find difficult / what were the barriers for you? What supports help you?",
  data_path: "icf_participation.other.limitations_details",
  ai_extractable: true
},

// =============================================
// PARTICIPATION - PARTICIPATION SCORE SECTION
// =============================================
{
  id: "participation_score_heading",
  section: "icf_participation",
  type: "heading",
  question_text: "My ICF Profile - Participation - Participation Score",
  data_path: "icf_participation.score.heading",
  ai_extractable: false
},
{
  id: "participation_score",
  section: "icf_participation",
  type: "scale",
  question_text: "If we were to score your participation restrictions on a validated scale, they would be considered:\n\nThink about how much you can join in with making decisions, spending time with family, friends, or at school/work. Use the scale below to pick the level that feels right for you. How much can you join in with family, social, and school activities?\n\nSelect the level (0 to 5, with half points allowed) that best describes their situation.\n\n0-0.5 I Need Complete Support to Participate (I Cannot Join In):\nI feel completely isolated and cannot take part in family, social, or school/work activities. I don't have capacity to have control over decisions about my life.\n\n1-1.5 I Need Full Support to Participate (I Can Join In a Little):\nI can only join in a little with simple things. I need full support from others to join in. I can only be involved in small decisions or easy social situations in controlled, supported environments.\n\n2-2.5 I Need Significant Support to Participate (I Can Join In Sometimes):\nI can join in with some decisions and take part in activities with people I know or in familiar places, but I need adaptations or support to help me do so.\n\n3-3.5 I Need Moderate Support to Participate (I Can Join In Often):\nI can make decisions about some things with moderate levels of support. I can take part in family, social, or school/work activities with encouragement, adaptations or some help.\n\n4-4.5 I Need Occasional Support to Participate (I Can Join In Most of the Time):\nI can join in with most activities and am usually independent in my decision making. I might need help with these things sometimes.\n\n5 I Don't Need Support to Participate (I Can Fully Join In):\nI can join in with all family, social, school/work activities and make my own decisions independently. I take part in life like others my age.",
  scale_range: { min: 0, max: 5, step: 0.5 },
  data_path: "icf_participation.score.score",
  ai_extractable: false
},
// =============================================
// SECTION 8: ICF WELL-BEING - INTRODUCTION
// =============================================
{
  id: "icf_wellbeing_heading",
  section: "icf_wellbeing",
  type: "heading",
  question_text: "MY ICF PROFILE - WELLBEING",
  data_path: "icf_wellbeing.main_heading",
  ai_extractable: false
},
{
  id: "icf_wellbeing_definition",
  section: "icf_wellbeing",
  type: "subheading",
  question_text: "Wellbeing refers to an individual's emotional health. Wellbeing is concerned with emotions, feelings, the burden of upset, concern and anxiety and level of life satisfaction.\n\nThere are two concepts related to Wellbeing -\n1. the severity of upset, concern, anger, anxiety and/or detachment an individual experiences as a consequence of their impairment and\n2. the frequency of experiencing this e.g. all the time, frequently, often.\n\nThe following questions will help to understand your wellbeing",
  data_path: "icf_wellbeing.definition",
  ai_extractable: false
},

// =============================================
// WELL-BEING - EMOTIONAL EXPERIENCES
// =============================================
{
  id: "emotional_frequency",
  section: "icf_wellbeing",
  type: "single_choice",
  question_text: "How often do you get upset, angry, anxious, withdrawn?\n\n0. Never – Not at all.\n1. Rarely – Once in a while.\n2. Sometimes – On some days.\n3. Often – Most days.\n4. Very often – Nearly every day.\n5. All the time – Constantly.",
  options: ["0 - Never", "1 - Rarely", "2 - Sometimes", "3 - Often", "4 - Very often", "5 - All the time"],
  data_path: "icf_wellbeing.emotional_frequency",
  ai_extractable: true
},
{
  id: "emotional_intensity",
  section: "icf_wellbeing",
  type: "single_choice",
  question_text: "When you get upset, angry, anxious or withdraw, how bad is that experience for you?\n\n0. No intensity – I feel calm and in control.\n1. Mild – I notice the feelings but they don't stop me from coping.\n2. Moderate – The feelings are uncomfortable and sometimes hard to manage.\n3. High – The feelings are strong and often take over. I need some support to cope.\n4. Very high – The feelings are overwhelming. I usually can't cope without support.\n5. Extreme – The feelings are constant and completely take over. I cannot manage them at all.",
  options: ["0 - No intensity", "1 - Mild", "2 - Moderate", "3 - High", "4 - Very high", "5 - Extreme"],
  data_path: "icf_wellbeing.emotional_intensity",
  ai_extractable: true
},
{
  id: "emotional_experience_description",
  section: "icf_wellbeing",
  type: "text",
  question_text: "Can you describe what happens when you get upset, angry, anxious or withdraw?",
  data_path: "icf_wellbeing.emotional_experience",
  ai_extractable: true
},
{
  id: "emotional_triggers",
  section: "icf_wellbeing",
  type: "text",
  question_text: "What environments or situations make you get upset, angry, anxious or withdrawn?\n\n- currently we have the \"dislikes\" section auto-populated into this section, to help the response. You have indicated that these are the things you dislike – are there any other environments or situations that make you upset, angry, anxious or withdrawn?\n- Which of these is the most aggravating/triggering for you?",
  data_path: "icf_wellbeing.emotional_triggers",
  ai_extractable: true
},
{
  id: "emotional_supports",
  section: "icf_wellbeing",
  type: "text",
  question_text: "What supports do you need to help you when you feel upset, angry, frustrated, anxious or withdrawn?",
  data_path: "icf_wellbeing.emotional_supports",
  ai_extractable: true
},
{
  id: "unmet_emotional_supports",
  section: "icf_wellbeing",
  type: "text",
  question_text: "Now that we have discussed the help you need when you feel upset, angry, anxious or withdrawn, do you have any unmet or unfunded supports that you feel you would benefit from?",
  data_path: "icf_wellbeing.unmet_supports",
  ai_extractable: true
},

// =============================================
// WELL-BEING - WELLBEING SCORE SECTION
// =============================================
{
  id: "wellbeing_score_heading",
  section: "icf_wellbeing",
  type: "heading",
  question_text: "My ICF Profile - Wellbeing - Wellbeing Score",
  data_path: "icf_wellbeing.score.heading",
  ai_extractable: false
},
{
  id: "wellbeing_score",
  section: "icf_wellbeing",
  type: "scale",
  question_text: "If we were to score your wellbeing/distress on a validated scale, it would be considered:\n\nThink about how often and how much you feel upset, frustrated, or worried. Use the scale below to pick the level that feels right for you.\n\nSelect the level (0 to 5, with half points allowed) that best describes their situation.\n\n0-0.5 I Need Complete Support to Feel Well (I Am Constantly Upset):\nI feel significant levels of upset or distress all the time. I cannot control my feelings, and I need full support to help me manage them.\n\n1-1.5 I Need Full Support to Feel Well (I Am Often Very Upset):\nI feel very upset or frustrated a lot of the time. I need a lot of help to calm down and manage my feelings.\n\n2-2.5 I Need Significant Support to Feel Well (I Am Often Upset):\nI feel upset or frustrated often, especially in new or unfamiliar situations. I need regular emotional support and encouragement to feel better.\n\n3-3.5 I Need Some Support to Feel Well (I Am Sometimes Upset):\nI feel upset or frustrated sometimes, but I can usually control my feelings with some help.\n\n4-4.5 I Need Occasional Support to Feel Well (I Am Rarely Upset):\nI feel calm most of the time, but I might need help in stressful situations. I can manage my feelings well most of the time.\n\n5 I Don't Need Support to Feel Well (I Am Calm and In Control):\nI feel calm and handle my emotions well. I can cope with most situations and understand my own feelings.",
  scale_range: { min: 0, max: 5, step: 0.5 },
  data_path: "icf_wellbeing.score.score",
  ai_extractable: false
},
];