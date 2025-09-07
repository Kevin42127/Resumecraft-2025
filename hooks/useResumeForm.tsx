import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FormData, ResumeData, ResumeSettings } from '@/types/resume';
import { generateId } from '@/utils/formatter';

const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};

const defaultSettings: ResumeSettings = {
  template: 'template-a',
  fontSize: 'medium',
  spacing: 'normal',
  colorScheme: 'blue',
  fontFamily: 'sans',
  showPhoto: false,
  photoUrl: '',
};

// Context 型別
interface ResumeFormContextType {
  formData: FormData;
  isLoading: boolean;
  updatePersonalInfo: (field: keyof ResumeData['personalInfo'], value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: any) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: any) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: any) => void;
  removeSkill: (id: string) => void;
  addCustomSection: () => void;
  updateCustomSection: (id: string, field: string, value: any) => void;
  removeCustomSection: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, field: string, value: any) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, field: string, value: any) => void;
  removeCertification: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: any) => void;
  removeLanguage: (id: string) => void;
  updateSettings: (field: keyof ResumeSettings, value: any) => void;
  resetForm: () => void;
  loadSampleData: () => void;
}

const ResumeFormContext = createContext<ResumeFormContextType | undefined>(undefined);

export function ResumeFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    resumeData: defaultResumeData,
    settings: defaultSettings,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resumecraft-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('resumecraft-data', JSON.stringify(formData));
    }
  }, [formData, isLoading]);

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        personalInfo: {
          ...prev.resumeData.personalInfo,
          [field]: value,
        },
      },
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        experience: [...prev.resumeData.experience, newExperience],
      },
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        experience: prev.resumeData.experience.map(exp =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ),
      },
    }));
  };

  const removeExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        experience: prev.resumeData.experience.filter(exp => exp.id !== id),
      },
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: '',
    };
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        education: [...prev.resumeData.education, newEducation],
      },
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        education: prev.resumeData.education.map(edu =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ),
      },
    }));
  };

  const removeEducation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        education: prev.resumeData.education.filter(edu => edu.id !== id),
      },
    }));
  };

  const addSkill = () => {
    const newSkill = {
      id: generateId(),
      name: '',
      level: 'intermediate' as const,
      category: '',
    };
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        skills: [...prev.resumeData.skills, newSkill],
      },
    }));
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        skills: prev.resumeData.skills.map(skill =>
          skill.id === id ? { ...skill, [field]: value } : skill
        ),
      },
    }));
  };

  const removeSkill = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        skills: prev.resumeData.skills.filter(skill => skill.id !== id),
      },
    }));
  };

  const addCustomSection = () => {
    const newCustomSection = {
      id: generateId(),
      title: '',
      content: '',
      order: formData.resumeData.customSections.length,
    };
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        customSections: [...prev.resumeData.customSections, newCustomSection],
      },
    }));
  };

  const updateCustomSection = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        customSections: prev.resumeData.customSections.map(section =>
          section.id === id ? { ...section, [field]: value } : section
        ),
      },
    }));
  };

  const removeCustomSection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        customSections: prev.resumeData.customSections.filter(section => section.id !== id),
      },
    }));
  };

  const addProject = () => {
    const newProject = {
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: '',
    };
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        projects: [...prev.resumeData.projects, newProject],
      },
    }));
  };

  const updateProject = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        projects: prev.resumeData.projects.map(project =>
          project.id === id ? { ...project, [field]: value } : project
        ),
      },
    }));
  };

  const removeProject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        projects: prev.resumeData.projects.filter(project => project.id !== id),
      },
    }));
  };

  const addCertification = () => {
    const newCertification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      url: '',
      description: '',
    };
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        certifications: [...prev.resumeData.certifications, newCertification],
      },
    }));
  };

  const updateCertification = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        certifications: prev.resumeData.certifications.map(cert =>
          cert.id === id ? { ...cert, [field]: value } : cert
        ),
      },
    }));
  };

  const removeCertification = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        certifications: prev.resumeData.certifications.filter(cert => cert.id !== id),
      },
    }));
  };

  const addLanguage = () => {
    const newLanguage = {
      id: generateId(),
      name: '',
      level: 'conversational' as const,
    };
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        languages: [...prev.resumeData.languages, newLanguage],
      },
    }));
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        languages: prev.resumeData.languages.map(lang =>
          lang.id === id ? { ...lang, [field]: value } : lang
        ),
      },
    }));
  };

  const removeLanguage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        languages: prev.resumeData.languages.filter(lang => lang.id !== id),
      },
    }));
  };

  const updateSettings = (field: keyof ResumeSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  const resetForm = () => {
    setFormData({
      resumeData: defaultResumeData,
      settings: defaultSettings,
    });
  };

  const loadSampleData = () => {
    const sampleData: FormData = {
      resumeData: {
        personalInfo: {
          firstName: '王小明',
          lastName: '',
          email: 'xiaoming.wang@email.com',
          phone: '0912-345-678',
          address: '台北市信義區信義路五段7號',
          city: '台北市',
          state: '',
          zipCode: '110',
          country: '台灣',
          linkedin: 'linkedin.com/in/xiaoming-wang',
          website: 'xiaoming.dev',
          summary: '擁有5年軟體開發經驗，專精於前端技術與使用者體驗設計。曾參與多個大型專案開發，具備良好的團隊合作能力與問題解決能力。',
        },
        experience: [
          {
            id: generateId(),
            company: '科技公司',
            position: '資深前端工程師',
            location: '台北市',
            startDate: '2022-01-01',
            endDate: '',
            current: true,
            description: '負責公司主要產品的前端開發與維護，使用 React、TypeScript 等技術。',
            achievements: [
              '優化網站效能，提升載入速度 40%',
              '帶領 3 人團隊完成新功能開發',
              '建立前端開發規範與最佳實踐',
            ],
          },
        ],
        education: [
          {
            id: generateId(),
            institution: '台灣大學',
            degree: '學士',
            field: '資訊工程學系',
            location: '台北市',
            startDate: '2018-09-01',
            endDate: '2022-06-30',
            current: false,
            gpa: '3.8',
            description: '主修軟體工程，副修使用者體驗設計。',
          },
        ],
        skills: [
          {
            id: generateId(),
            name: 'React',
            level: 'advanced',
            category: '前端框架',
          },
          {
            id: generateId(),
            name: 'TypeScript',
            level: 'advanced',
            category: '程式語言',
          },
          {
            id: generateId(),
            name: 'Node.js',
            level: 'intermediate',
            category: '後端技術',
          },
        ],
        projects: [
          {
            id: generateId(),
            name: '電商平台前端重構',
            description: '使用 React + TypeScript 重構現有電商平台，提升使用者體驗和網站效能。負責前端架構設計、組件開發和效能優化。',
            technologies: ['React', 'TypeScript', 'Redux', 'Material-UI'],
            url: 'https://ecommerce-demo.com',
            github: 'https://github.com/xiaoming/ecommerce-frontend',
            startDate: '2023-03-01',
            endDate: '2023-08-31',
          },
          {
            id: generateId(),
            name: '個人作品集網站',
            description: '使用 Next.js 開發響應式作品集網站，展示個人專案和技能。包含動畫效果、深色模式切換和 SEO 優化。',
            technologies: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
            url: 'https://xiaoming.dev',
            github: 'https://github.com/xiaoming/portfolio',
            startDate: '2023-01-01',
            endDate: '2023-02-28',
          },
        ],
        certifications: [
          {
            id: generateId(),
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: '2023-06-15',
            url: 'https://aws.amazon.com/certification/',
            description: '雲端架構設計與部署認證，涵蓋 AWS 核心服務、安全性、成本優化等領域。',
          },
          {
            id: generateId(),
            name: 'Google Analytics Certified',
            issuer: 'Google',
            date: '2022-09-20',
            url: 'https://analytics.google.com/analytics/academy/',
            description: '網站分析與數據解讀認證，具備網站流量分析、轉換追蹤和報表製作能力。',
          },
          {
            id: generateId(),
            name: 'Scrum Master Certification',
            issuer: 'Scrum Alliance',
            date: '2021-12-10',
            url: 'https://www.scrumalliance.org/',
            description: '敏捷開發管理認證，具備 Scrum 框架實施、團隊協作和專案管理能力。',
          },
        ],
        languages: [
          {
            id: generateId(),
            name: '中文',
            level: 'native',
          },
          {
            id: generateId(),
            name: '英文',
            level: 'fluent',
          },
          {
            id: generateId(),
            name: '日文',
            level: 'basic',
          },
        ],
        customSections: [
          {
            id: generateId(),
            title: '開源貢獻',
            content: '• React 生態系統：參與多個開源專案，包括 React 相關工具和函式庫\n• 社群參與：在 GitHub 上維護多個開源專案，獲得 500+ stars\n• 技術分享：定期在技術社群分享前端開發經驗和最佳實踐',
            order: 0,
          },
        ],
      },
      settings: {
        ...defaultSettings,
        template: 'template-a',
      },
    };
    setFormData(sampleData);
  };

  return (
    <ResumeFormContext.Provider value={{
      formData,
      isLoading,
      updatePersonalInfo,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      addSkill,
      updateSkill,
      removeSkill,
      addCustomSection,
      updateCustomSection,
      removeCustomSection,
      addProject,
      updateProject,
      removeProject,
      addCertification,
      updateCertification,
      removeCertification,
      addLanguage,
      updateLanguage,
      removeLanguage,
      updateSettings,
      resetForm,
      loadSampleData,
    }}>
      {children}
    </ResumeFormContext.Provider>
  );
}

export function useResumeForm() {
  const ctx = useContext(ResumeFormContext);
  if (!ctx) throw new Error('useResumeForm must be used within ResumeFormProvider');
  return ctx;
}

