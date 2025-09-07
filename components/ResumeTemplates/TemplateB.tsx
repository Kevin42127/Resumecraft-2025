'use client'

import { ResumeData, ResumeSettings } from '@/types/resume'
import { 
  formatDate, 
  formatPhone, 
  formatAddress,
  formatDuration, 
  getInitials,
  getSkillLevelText,
  getSkillLevelColor
} from '@/utils/formatter'

interface TemplateBProps {
  resumeData: ResumeData
  settings: ResumeSettings
}

export default function TemplateB({ resumeData, settings }: TemplateBProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, customSections } = resumeData || {}

  const getColorClasses = () => {
    switch (settings?.colorScheme) {
      case 'blue':
        return 'text-blue-700'
      case 'green':
        return 'text-green-700'
      case 'purple':
        return 'text-purple-700'
      case 'gray':
        return 'text-gray-700'
      case 'red':
        return 'text-red-700'
      default:
        return 'text-blue-700'
    }
  }

  const getFontSizeClasses = () => {
    switch (settings?.fontSize) {
      case 'small':
        return 'text-sm'
      case 'large':
        return 'text-lg'
      default:
        return 'text-base'
    }
  }

  const getSpacingClasses = () => {
    switch (settings?.spacing) {
      case 'compact':
        return 'space-y-2'
      case 'spacious':
        return 'space-y-6'
      default:
        return 'space-y-4'
    }
  }

  return (
    <div className={`p-8 ${getFontSizeClasses()} ${getSpacingClasses()} font-${settings?.fontFamily || 'sans'} bg-white`}>
      {/* Header - ATS Optimized */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo?.firstName || ''} {personalInfo?.lastName || ''}
        </h1>
        
        {/* Contact Information - Single line for ATS */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
          {personalInfo?.email && (
            <span>電子郵件: <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:text-blue-800 underline">{personalInfo.email}</a></span>
          )}
          {personalInfo?.phone && (
            <span>電話: <a href={`tel:${personalInfo?.phone || ''}`} className="text-blue-600 hover:text-blue-800 underline">{formatPhone(personalInfo?.phone || '')}</a></span>
          )}
          {personalInfo?.address && (
            <span>地址: {formatAddress(personalInfo?.address || '', personalInfo?.city || '', personalInfo?.state || '', personalInfo?.zipCode || '')}</span>
          )}
          {personalInfo?.linkedin && (
            <span>LinkedIn: <a href={personalInfo?.linkedin?.startsWith('http') ? personalInfo?.linkedin : `https://${personalInfo?.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{personalInfo?.linkedin}</a></span>
          )}
          {personalInfo?.website && (
            <span>網站: <a href={personalInfo?.website?.startsWith('http') ? personalInfo?.website : `https://${personalInfo?.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{personalInfo?.website}</a></span>
          )}
        </div>

        {/* Professional Summary - ATS Keyword Rich */}
        {personalInfo?.summary && (
          <div className="mt-4 text-center">
            <h2 className={`text-lg font-semibold mb-2 ${getColorClasses()}`}>個人簡介</h2>
            <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
              {personalInfo?.summary}
            </p>
          </div>
        )}
      </div>

      {/* Skills Section - ATS Optimized with Keywords */}
      {skills?.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className={`text-xl font-bold mb-4 ${getColorClasses()} border-b border-gray-300 pb-2`}>
            技能專長
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {skills?.map((skill) => (
              <div key={skill.id} className="text-sm">
                <span className="font-semibold text-gray-900">{skill.name}</span>
                {skill.category && (
                  <span className="text-gray-600 ml-1">({skill.category})</span>
                )}
                <span className={`ml-2 text-xs ${getSkillLevelColor(skill.level)}`}>
                  {getSkillLevelText(skill.level)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section - ATS Optimized */}
      {experience?.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className={`text-xl font-bold mb-4 ${getColorClasses()} border-b border-gray-300 pb-2`}>
            工作經驗
          </h2>
          <div className="space-y-4">
            {experience?.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-600">{exp.location}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{formatDate(exp.startDate)} - {exp.current ? '現在' : formatDate(exp.endDate)}</div>
                    <div>{formatDuration(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                </div>
                
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section - ATS Optimized */}
      {education?.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className={`text-xl font-bold mb-4 ${getColorClasses()} border-b border-gray-300 pb-2`}>
            教育背景
          </h2>
          <div className="space-y-4">
            {education?.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-700 font-medium">{edu.institution}</p>
                    <p className="text-sm text-gray-600">{edu.location}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{formatDate(edu.startDate)} - {edu.current ? '現在' : formatDate(edu.endDate)}</div>
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-700 text-sm">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section - ATS Optimized */}
      {projects?.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className={`text-xl font-bold mb-4 ${getColorClasses()} border-b border-gray-300 pb-2`}>
            專案作品
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <div className="text-sm text-gray-600">
                    {project.startDate && formatDate(project.startDate)}
                    {project.startDate && project.endDate && ' - '}
                    {project.endDate && formatDate(project.endDate)}
                  </div>
                </div>
                
                {project.description && (
                  <p className="text-gray-700 mb-2">{project.description}</p>
                )}
                
                {project.technologies?.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">使用技術: </span>
                    <span className="text-sm text-gray-700">{project.technologies.join(', ')}</span>
                  </div>
                )}
                
                <div className="flex space-x-4 text-sm">
                  {project.url && (
                    <span className="text-blue-600">專案網址: <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{project.url}</a></span>
                  )}
                  {project.github && (
                    <span className="text-blue-600">GitHub: <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{project.github}</a></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section - ATS Optimized */}
      {certifications?.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className={`text-xl font-bold mb-4 ${getColorClasses()} border-b border-gray-300 pb-2`}>
            證照認證
          </h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer}</p>
                  {cert.description && (
                    <p className="text-gray-600 text-sm mt-1">{cert.description}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  {cert.date && <span>{formatDate(cert.date)}</span>}
                  {cert.url && (
                    <div className="mt-1">
                      <span className="text-blue-600">驗證: <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{cert.url}</a></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages Section - ATS Optimized */}
      {languages?.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className={`text-xl font-bold mb-4 ${getColorClasses()} border-b border-gray-300 pb-2`}>
            語言能力
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  lang.level === 'native' ? 'bg-green-100 text-green-800' :
                  lang.level === 'fluent' ? 'bg-blue-100 text-blue-800' :
                  lang.level === 'conversational' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {lang.level === 'native' && '母語'}
                  {lang.level === 'fluent' && '流利'}
                  {lang.level === 'conversational' && '會話'}
                  {lang.level === 'basic' && '基礎'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections - ATS Optimized */}
      {customSections?.length > 0 && customSections?.map((section) => (
        <div key={section.id} className="resume-section mb-6">
          <h2 className={`text-xl font-bold mb-4 ${getColorClasses()} border-b border-gray-300 pb-2`}>
            {section.title.toUpperCase()}
          </h2>
          <div className="text-gray-700 whitespace-pre-wrap">
            {section.content}
          </div>
        </div>
      ))}

    </div>
  )
}
