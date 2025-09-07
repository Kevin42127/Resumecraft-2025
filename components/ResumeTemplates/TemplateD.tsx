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

interface TemplateDProps {
  resumeData: ResumeData
  settings: ResumeSettings
}

export default function TemplateD({ resumeData, settings }: TemplateDProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, customSections } = resumeData

  const getColorClasses = () => {
    switch (settings?.colorScheme) {
      case 'blue':
        return { 
          primary: 'text-blue-600', 
          bg: 'bg-blue-600', 
          accent: 'bg-blue-50', 
          border: 'border-blue-200',
          gradient: 'from-blue-600 to-blue-700'
        }
      case 'green':
        return { 
          primary: 'text-green-600', 
          bg: 'bg-green-600', 
          accent: 'bg-green-50', 
          border: 'border-green-200',
          gradient: 'from-green-600 to-green-700'
        }
      case 'purple':
        return { 
          primary: 'text-purple-600', 
          bg: 'bg-purple-600', 
          accent: 'bg-purple-50', 
          border: 'border-purple-200',
          gradient: 'from-purple-600 to-purple-700'
        }
      case 'gray':
        return { 
          primary: 'text-gray-600', 
          bg: 'bg-gray-600', 
          accent: 'bg-gray-50', 
          border: 'border-gray-200',
          gradient: 'from-gray-600 to-gray-700'
        }
      case 'red':
        return { 
          primary: 'text-red-600', 
          bg: 'bg-red-600', 
          accent: 'bg-red-50', 
          border: 'border-red-200',
          gradient: 'from-red-600 to-red-700'
        }
      default:
        return { 
          primary: 'text-blue-600', 
          bg: 'bg-blue-600', 
          accent: 'bg-blue-50', 
          border: 'border-blue-200',
          gradient: 'from-blue-600 to-blue-700'
        }
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
    <div className={`${getFontSizeClasses()} ${getSpacingClasses()} font-${settings?.fontFamily || 'sans'} bg-white`}>
      {/* Creative Header */}
      <div className={`relative overflow-hidden ${colors.bg} text-white p-6`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="w-full h-full rounded-full border-4 border-white transform rotate-45"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
          <div className="w-full h-full border-2 border-white transform -rotate-12"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 tracking-tight">
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              {personalInfo.summary && (
                <p className="text-lg opacity-90 leading-relaxed max-w-2xl">
                  {personalInfo.summary}
                </p>
              )}
            </div>
            {settings?.showPhoto && personalInfo?.photoUrl && (
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex items-center justify-center ml-6 border-4 border-white/30">
                <img 
                  src={personalInfo.photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Bar */}
      <div className={`${colors.accent} p-4`}>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {personalInfo.email && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`}></div>
              <a 
                href={`mailto:${personalInfo.email}`}
                className="text-gray-900 font-medium truncate hover:text-gray-700 transition-colors"
              >
                {personalInfo.email}
              </a>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`}></div>
              <span className="text-gray-900 font-medium truncate">{formatPhone(personalInfo.phone)}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.address) && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`}></div>
              <span className="text-gray-900 font-medium truncate">
                {personalInfo.address ? formatAddress(personalInfo.address, personalInfo.city, personalInfo.state, personalInfo.zipCode) : personalInfo.city}
              </span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`}></div>
              <a 
                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 font-medium truncate hover:text-gray-700 transition-colors"
              >
                {personalInfo.linkedin}
              </a>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${colors.bg} flex-shrink-0`}></div>
              <a 
                href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 font-medium truncate hover:text-gray-700 transition-colors"
              >
                {personalInfo.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Left Column - Experience */}
        <div className="col-span-2">
          {/* Experience */}
          {experience.length > 0 && (
            <div className="resume-section mb-6">
              <h2 className={`text-2xl font-bold mb-6 ${colors.primary}`}>
                工作經驗
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className={`absolute left-0 top-0 w-1 h-full ${colors.bg} rounded-full`}></div>
                    <div className="pl-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                          <p className="text-lg text-gray-600 mb-1">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 font-medium">
                            {formatDate(exp.startDate)} - {exp.current ? '現在' : formatDate(exp.endDate)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDuration(exp.startDate, exp.endDate, exp.current)}
                          </div>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed">{exp.description}</p>
                      )}
                      {exp.achievements.length > 0 && (
                        <div className="space-y-2">
                          {exp.achievements.map((achievement, index) => (
                            <div key={index} className={`p-2 ${colors.accent} rounded-lg`}>
                              <p className="text-gray-700 text-sm leading-relaxed">{achievement}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="resume-section">
              <h2 className={`text-2xl font-bold mb-6 ${colors.primary}`}>
                教育背景
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className={`p-4 ${colors.accent} rounded-lg`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree} - {edu.field}</h3>
                        <p className="text-lg text-gray-600 mb-1">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 font-medium">
                          {formatDate(edu.startDate)} - {edu.current ? '現在' : formatDate(edu.endDate)}
                        </div>
                        {edu.gpa && <div className="text-xs text-gray-400">GPA: {edu.gpa}</div>}
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

          {/* Projects */}
          {projects?.length > 0 && (
            <div className="resume-section mt-6">
              <h2 className={`text-2xl font-bold mb-6 ${colors.primary}`}>專案作品</h2>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className={`p-4 ${colors.accent} rounded-lg`}>
                    <div className="flex items-start justify-between mb-3">
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
                          <span key={index} className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-4 text-sm">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className={`${colors.primary} hover:underline font-medium`}>
                          專案網址
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className={`${colors.primary} hover:underline font-medium`}>
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
            <div className="resume-section mt-6">
              <h2 className={`text-2xl font-bold mb-6 ${colors.primary}`}>證照認證</h2>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className={`p-4 ${colors.accent} rounded-lg`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuer}</p>
                        {cert.description && (
                          <p className="text-gray-700 text-sm mt-2 leading-relaxed">{cert.description}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {cert.date && <span>{formatDate(cert.date)}</span>}
                        {cert.url && (
                          <div className="mt-1">
                            <a href={cert.url} target="_blank" rel="noopener noreferrer" className={`${colors.primary} hover:underline font-medium`}>
                              查看證照
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <div className="resume-section mt-6">
              <h2 className={`text-2xl font-bold mb-6 ${colors.primary}`}>語言能力</h2>
              <div className={`p-4 ${colors.accent} rounded-lg`}>
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
            <div key={section.id} className="resume-section mt-6">
              <h2 className={`text-2xl font-bold mb-6 ${colors.primary}`}>
                {section.title}
              </h2>
              <div className={`p-4 ${colors.accent} rounded-lg`}>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Skills */}
        <div className="col-span-1">
          {skills.length > 0 && (
            <div className="resume-section">
              <h2 className={`text-xl font-bold mb-4 ${colors.primary}`}>
                技能專長
              </h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className={`p-3 bg-white border-l-4 ${colors.border} shadow-sm rounded-r-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{skill.name}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors.accent} ${colors.primary}`}>
                        {getSkillLevelText(skill.level)}
                      </span>
                    </div>
                    {skill.category && (
                      <p className="text-sm text-gray-500">{skill.category}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 