export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  linkedin: string;
  website: string;
  summary: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  github: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  className: string;
}

export interface ResumeSettings {
  template: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
  colorScheme: 'blue' | 'green' | 'purple' | 'gray' | 'red';
  fontFamily: 'sans' | 'serif';
  showPhoto: boolean;
  photoUrl: string;
}

export interface FormData {
  resumeData: ResumeData;
  settings: ResumeSettings;
}

export interface FeedbackForm {
  name: string;
  email: string;
  content: string;
  rating: number;
}
