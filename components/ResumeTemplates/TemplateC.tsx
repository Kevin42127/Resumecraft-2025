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

interface TemplateCProps {
  resumeData: ResumeData
  settings: ResumeSettings
}

export default function TemplateC({ resumeData, settings }: TemplateCProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, customSections } = resumeData

  const getColorClasses = () => {
    switch (settings?.colorScheme) {
      case 'blue':
        return { primary: 'text-blue-600', accent: 'bg-blue-50', border: 'border-blue-200' }
      case 'green':
        return { primary: 'text-green-600', accent: 'bg-green-50', border: 'border-green-200' }
      case 'purple':
        return { primary: 'text-purple-600', accent: 'bg-purple-50', border: 'border-purple-200' }
      case 'gray':
        return { primary: 'text-gray-600', accent: 'bg-gray-50', border: 'border-gray-200' }
      case 'red':
        return { primary: 'text-red-600', accent: 'bg-red-50', border: 'border-red-200' }
      default:
        return { primary: 'text-blue-600', accent: 'bg-blue-50', border: 'border-blue-200' }
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
        return 'space-y-3'
      case 'spacious':
        return 'space-y-8'
      default:
        return 'space-y-6'
    }
  }

  const colors = getColorClasses()

  return (
    <div className={`p-12 ${getFontSizeClasses()} ${getSpacingClasses()} font-${settings?.fontFamily || 'sans'} bg-white`}>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-wide">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.summary && (
              <p className="text-gray-600 leading-relaxed text-lg max-w-3xl font-light">
                {personalInfo.summary}
              </p>
            )}
          </div>
          {settings?.showPhoto && personalInfo?.photoUrl && (
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center ml-8">
              <img 
                src={personalInfo.photoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid gap-6 text-sm" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {personalInfo.email && (
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${colors.primary} bg-current`}></div>
              <a 
                href={`mailto:${personalInfo.email}`}
                className="text-gray-900 hover:text-gray-700 transition-colors"
              >
                {personalInfo.email}
              </a>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${colors.primary} bg-current`}></div>
              <span className="text-gray-900">{formatPhone(personalInfo.phone)}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${colors.primary} bg-current`}></div>
              <span className="text-gray-900">
                {formatAddress(personalInfo.address, personalInfo.city, personalInfo.state, personalInfo.zipCode)}
              </span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${colors.primary} bg-current`}></div>
              <a 
                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-gray-700 transition-colors"
              >
                {personalInfo.linkedin}
              </a>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${colors.primary} bg-current`}></div>
              <a 
                href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-gray-700 transition-colors"
              >
                {personalInfo.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-light mb-8 ${colors.primary} tracking-wide`}>
            工作經驗
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-gray-200 pl-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">{exp.position}</h3>
                    <p className="text-lg text-gray-600 mb-1">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.location}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{formatDate(exp.startDate)} - {exp.current ? '現在' : formatDate(exp.endDate)}</div>
                    <div className="text-xs">{formatDuration(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-4 leading-relaxed">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start space-x-3 text-gray-700">
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.primary} bg-current mt-2 flex-shrink-0`}></div>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-light mb-8 ${colors.primary} tracking-wide`}>
            教育背景
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-gray-200 pl-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">{edu.degree} - {edu.field}</h3>
                    <p className="text-lg text-gray-600 mb-1">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.location}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{formatDate(edu.startDate)} - {edu.current ? '現在' : formatDate(edu.endDate)}</div>
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="resume-section">
          <h2 className={`text-2xl font-light mb-8 ${colors.primary} tracking-wide`}>
            技能專長
          </h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  {skill.category && (
                    <span className="text-sm text-gray-500 ml-2">({skill.category})</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${getSkillLevelColor(skill.level)}`}>
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
          <h2 className={`text-2xl font-light mb-8 ${colors.primary} tracking-wide`}>專案作品</h2>
          <div className="border-l-2 border-gray-200 pl-8 space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <div className="text-sm text-gray-500">
                    {project.startDate && formatDate(project.startDate)}
                    {project.startDate && project.endDate && ' - '}
                    {project.endDate && formatDate(project.endDate)}
                  </div>
                </div>
                {project.description && (
                  <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                )}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex space-x-4 text-sm">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className={`${colors.primary} hover:underline`}>
                      專案網址
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className={`${colors.primary} hover:underline`}>
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
          <h2 className={`text-2xl font-light mb-8 ${colors.primary} tracking-wide`}>證照認證</h2>
          <div className="border-l-2 border-gray-200 pl-8 space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                  {cert.description && (
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">{cert.description}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  {cert.date && <span>{formatDate(cert.date)}</span>}
                  {cert.url && (
                    <div className="mt-1">
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className={`${colors.primary} hover:underline`}>
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
          <h2 className={`text-2xl font-light mb-8 ${colors.primary} tracking-wide`}>語言能力</h2>
          <div className="border-l-2 border-gray-200 pl-8">
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
        </div>
      )}

      {/* Custom Sections */}
      {customSections.length > 0 && customSections.map((section) => (
        <div key={section.id} className="resume-section">
          <h2 className={`text-2xl font-light mb-8 ${colors.primary} tracking-wide`}>
            {section.title}
          </h2>
          <div className="border-l-2 border-gray-200 pl-8">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {section.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 