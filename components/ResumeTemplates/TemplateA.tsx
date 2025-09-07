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

interface TemplateAProps {
  resumeData: ResumeData
  settings: ResumeSettings
}

export default function TemplateA({ resumeData, settings }: TemplateAProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, customSections } = resumeData || {}

  const getColorClasses = () => {
    switch (settings?.colorScheme) {
      case 'blue':
        return 'text-blue-600'
      case 'green':
        return 'text-green-600'
      case 'purple':
        return 'text-purple-600'
      case 'gray':
        return 'text-gray-600'
      case 'red':
        return 'text-red-600'
      default:
        return 'text-blue-600'
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
    <div className={`p-8 ${getFontSizeClasses()} ${getSpacingClasses()} font-${settings?.fontFamily || 'sans'}`}>
      {/* Header */}
      <div className={`pb-4 mb-6 ${getColorClasses()}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {personalInfo?.firstName || ''} {personalInfo?.lastName || ''}
            </h1>
            {personalInfo?.summary && (
              <p className="text-gray-600 leading-relaxed max-w-2xl">
                {personalInfo?.summary}
              </p>
            )}
          </div>
          {settings?.showPhoto && personalInfo?.photoUrl && (
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <img 
                src={personalInfo?.photoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="space-y-1">
            {personalInfo?.email && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">電子郵件:</span>
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="text-gray-900 hover:text-gray-700 transition-colors"
                >
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">電話:</span>
                <span className="text-gray-900">{formatPhone(personalInfo?.phone || '')}</span>
              </div>
            )}
            {personalInfo?.address && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">地址:</span>
                <span className="text-gray-900">
                  {formatAddress(personalInfo?.address || '', personalInfo?.city || '', personalInfo?.state || '', personalInfo?.zipCode || '')}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            {personalInfo?.linkedin && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">LinkedIn:</span>
                <a
                  className="text-blue-600 underline break-all"
                  href={personalInfo?.linkedin?.startsWith('http') ? personalInfo?.linkedin : `https://${personalInfo?.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo?.linkedin}
                </a>
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">網站:</span>
                <a
                  className="text-blue-600 underline break-all"
                  href={personalInfo?.website?.startsWith('http') ? personalInfo?.website : `https://${personalInfo?.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo?.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-bold mb-6 ${getColorClasses()}`}>工作經驗</h2>
          <div className="space-y-4">
            {experience?.map((exp) => (
              <div key={exp.id} className={`pl-4 ${getColorClasses()}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{formatDate(exp.startDate)} - {exp.current ? '現在' : formatDate(exp.endDate)}</div>
                    <div>{exp.location}</div>
                    <div>{formatDuration(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-bold mb-6 ${getColorClasses()}`}>教育背景</h2>
          <div className="space-y-4">
            {education?.map((edu) => (
              <div key={edu.id} className={`pl-4 ${getColorClasses()}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree} - {edu.field}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{formatDate(edu.startDate)} - {edu.current ? '現在' : formatDate(edu.endDate)}</div>
                    <div>{edu.location}</div>
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-bold mb-6 ${getColorClasses()}`}>技能專長</h2>
          <div className="grid grid-cols-2 gap-4">
            {skills?.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  {skill.category && (
                    <span className="text-sm text-gray-500 ml-2">({skill.category})</span>
                  )}
                </div>
                <span className={`text-sm ${getSkillLevelColor(skill.level)}`}>
                  {getSkillLevelText(skill.level)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-bold mb-6 ${getColorClasses()}`}>專案作品</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="border-l-4 border-gray-200 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <div className="flex space-x-2 text-sm text-gray-500">
                    {project.startDate && (
                      <span>{formatDate(project.startDate)}</span>
                    )}
                    {project.startDate && project.endDate && <span>-</span>}
                    {project.endDate && (
                      <span>{formatDate(project.endDate)}</span>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className="text-gray-700 mb-2">{project.description}</p>
                )}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex space-x-4 text-sm">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className={`${getColorClasses()} hover:underline`}>
                      專案網址
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className={`${getColorClasses()} hover:underline`}>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-bold mb-6 ${getColorClasses()}`}>證照認證</h2>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                  {cert.description && (
                    <p className="text-gray-700 text-sm mt-1">{cert.description}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  {cert.date && <span>{formatDate(cert.date)}</span>}
                  {cert.url && (
                    <div className="mt-1">
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className={`${getColorClasses()} hover:underline`}>
                        查看證照
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages?.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-bold mb-6 ${getColorClasses()}`}>語言能力</h2>
          <div className="grid grid-cols-2 gap-4">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
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

      {/* Custom Sections */}
      {customSections?.length > 0 && customSections?.map((section) => (
        <div key={section.id} className="resume-section">
          <h2 className={`text-2xl font-bold mb-6 ${getColorClasses()}`}>{section.title}</h2>
          <div className={`pl-4 ${getColorClasses()}`}>
            <div className="text-gray-700 whitespace-pre-wrap">
              {section.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
