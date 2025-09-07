'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  Globe,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  FolderOpen,
  Award as Certificate,
  Languages
} from 'lucide-react'
import { useResumeForm } from '@/hooks/useResumeForm'

export default function FormEditor() {
  const {
    formData,
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
    loadSampleData,
    resetForm,
  } = useResumeForm()

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
    custom: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const addAchievement = (experienceId: string) => {
    const experience = formData?.resumeData?.experience?.find(exp => exp.id === experienceId)
    if (experience) {
      updateExperience(experienceId, 'achievements', [...experience.achievements, ''])
    }
  }

  const updateAchievement = (experienceId: string, index: number, value: string) => {
    const experience = formData?.resumeData?.experience?.find(exp => exp.id === experienceId)
    if (experience) {
      const newAchievements = [...experience.achievements]
      newAchievements[index] = value
      updateExperience(experienceId, 'achievements', newAchievements)
    }
  }

  const removeAchievement = (experienceId: string, index: number) => {
    const experience = formData?.resumeData?.experience?.find(exp => exp.id === experienceId)
    if (experience) {
      const newAchievements = experience.achievements.filter((_, i) => i !== index)
      updateExperience(experienceId, 'achievements', newAchievements)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">履歷編輯器</h1>
        <div className="flex space-x-2">
          <button
            onClick={loadSampleData}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            載入範例
          </button>
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            重置
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => toggleSection('personal')}
          className="flex items-center justify-between w-full mb-4"
        >
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">個人資料</h2>
          </div>
          {expandedSections.personal ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {expandedSections.personal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                  <input
                    type="text"
                    value={formData?.resumeData?.personalInfo?.firstName || ''}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                    className="input-field"
                    placeholder="請輸入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件 *</label>
                  <input
                    type="email"
                    value={formData?.resumeData?.personalInfo?.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="input-field"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電話</label>
                  <input
                    type="tel"
                    value={formData?.resumeData?.personalInfo?.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="input-field"
                    placeholder="0912-345-678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">地址</label>
                  <input
                    type="text"
                    value={formData?.resumeData?.personalInfo?.address || ''}
                    onChange={(e) => updatePersonalInfo('address', e.target.value)}
                    className="input-field"
                    placeholder="請輸入地址"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={formData?.resumeData?.personalInfo?.linkedin || ''}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="input-field"
                    placeholder="linkedin.com/in/your-profile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">個人網站</label>
                  <input
                    type="url"
                    value={formData?.resumeData?.personalInfo?.website || ''}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    className="input-field"
                    placeholder="your-website.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">個人簡介</label>
                <textarea
                  value={formData?.resumeData?.personalInfo?.summary || ''}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="請簡述您的專業背景、技能特長和職業目標..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Work Experience */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection('experience')}
            className="flex items-center space-x-2"
          >
            <Briefcase className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">工作經驗</h2>
            {expandedSections.experience ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            onClick={addExperience}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增經驗
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.experience && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {formData?.resumeData?.experience?.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">工作經驗 {index + 1}</h3>
                    <button
                      onClick={() => removeExperience(experience.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">公司名稱 *</label>
                      <input
                        type="text"
                        value={experience.company}
                        onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                        className="input-field"
                        placeholder="請輸入公司名稱"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">職稱 *</label>
                      <input
                        type="text"
                        value={experience.position}
                        onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                        className="input-field"
                        placeholder="請輸入職稱"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">地點</label>
                      <input
                        type="text"
                        value={experience.location}
                        onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                        className="input-field"
                        placeholder="台北市"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">開始日期</label>
                        <input
                          type="date"
                          value={experience.startDate}
                          onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">結束日期</label>
                        <input
                          type="date"
                          value={experience.endDate}
                          onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                          className="input-field"
                          disabled={experience.current}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id={`current-${experience.id}`}
                        checked={experience.current}
                        onChange={(e) => updateExperience(experience.id, 'current', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600"
                      />
                      <label htmlFor={`current-${experience.id}`} className="text-sm text-gray-700">
                        目前在此工作
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">工作描述</label>
                    <textarea
                      value={experience.description}
                      onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="請描述您的工作內容和職責..."
                    />
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">主要成就</label>
                      <button
                        onClick={() => addAchievement(experience.id)}
                        className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                      >
                        <Plus className="w-4 h-4" />
                        新增成就
                      </button>
                    </div>
                    {experience.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => updateAchievement(experience.id, achievementIndex, e.target.value)}
                          className="input-field flex-1"
                          placeholder="請描述您的成就..."
                        />
                        <button
                          onClick={() => removeAchievement(experience.id, achievementIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Education */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection('education')}
            className="flex items-center space-x-2"
          >
            <GraduationCap className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">教育背景</h2>
            {expandedSections.education ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            onClick={addEducation}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增教育
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.education && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {formData?.resumeData?.education?.map((education, index) => (
                <motion.div
                  key={education.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">教育經歷 {index + 1}</h3>
                    <button
                      onClick={() => removeEducation(education.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">學校名稱 *</label>
                      <input
                        type="text"
                        value={education.institution}
                        onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                        className="input-field"
                        placeholder="請輸入學校名稱"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">學位 *</label>
                      <input
                        type="text"
                        value={education.degree}
                        onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                        className="input-field"
                        placeholder="學士、碩士、博士"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">主修科系</label>
                      <input
                        type="text"
                        value={education.field}
                        onChange={(e) => updateEducation(education.id, 'field', e.target.value)}
                        className="input-field"
                        placeholder="資訊工程學系"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">地點</label>
                      <input
                        type="text"
                        value={education.location}
                        onChange={(e) => updateEducation(education.id, 'location', e.target.value)}
                        className="input-field"
                        placeholder="台北市"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">開始日期</label>
                        <input
                          type="date"
                          value={education.startDate}
                          onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">結束日期</label>
                        <input
                          type="date"
                          value={education.endDate}
                          onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                          className="input-field"
                          disabled={education.current}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                      <input
                        type="text"
                        value={education.gpa}
                        onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                        className="input-field"
                        placeholder="3.8"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id={`current-edu-${education.id}`}
                        checked={education.current}
                        onChange={(e) => updateEducation(education.id, 'current', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600"
                      />
                      <label htmlFor={`current-edu-${education.id}`} className="text-sm text-gray-700">
                        目前在此就讀
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">相關描述</label>
                    <textarea
                      value={education.description}
                      onChange={(e) => updateEducation(education.id, 'description', e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="請描述您的學習經歷、研究領域或相關成就..."
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Skills */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection('skills')}
            className="flex items-center space-x-2"
          >
            <Code className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">技能專長</h2>
            {expandedSections.skills ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            onClick={addSkill}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增技能
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.skills && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {formData?.resumeData?.skills?.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      className="input-field"
                      placeholder="技能名稱"
                    />
                  </div>
                  <div className="w-32">
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                      className="input-field"
                    >
                      <option value="beginner">初級</option>
                      <option value="intermediate">中級</option>
                      <option value="advanced">進階</option>
                      <option value="expert">專家級</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      className="input-field"
                      placeholder="分類 (如: 程式語言)"
                    />
                  </div>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Projects */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection('projects')}
            className="flex items-center space-x-2"
          >
            <FolderOpen className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">專案作品</h2>
            {expandedSections.projects ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            onClick={addProject}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增專案
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.projects && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {formData?.resumeData?.projects?.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">專案 {index + 1}</h3>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">專案名稱 *</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                        className="input-field"
                        placeholder="請輸入專案名稱"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">專案網址</label>
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                        className="input-field"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub 連結</label>
                      <input
                        type="url"
                        value={project.github}
                        onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                        className="input-field"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">開始日期</label>
                        <input
                          type="date"
                          value={project.startDate}
                          onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">結束日期</label>
                        <input
                          type="date"
                          value={project.endDate}
                          onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">專案描述</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="請描述專案的功能、技術特色和您的貢獻..."
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">使用技術</label>
                    <input
                      type="text"
                      value={project.technologies.join(', ')}
                      onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                      className="input-field"
                      placeholder="React, TypeScript, Node.js (用逗號分隔)"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Certifications */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection('certifications')}
            className="flex items-center space-x-2"
          >
            <Certificate className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">證照認證</h2>
            {expandedSections.certifications ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            onClick={addCertification}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增證照
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.certifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {formData?.resumeData?.certifications?.map((certification, index) => (
                <motion.div
                  key={certification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">證照 {index + 1}</h3>
                    <button
                      onClick={() => removeCertification(certification.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">證照名稱 *</label>
                      <input
                        type="text"
                        value={certification.name}
                        onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                        className="input-field"
                        placeholder="請輸入證照名稱"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">發證機構 *</label>
                      <input
                        type="text"
                        value={certification.issuer}
                        onChange={(e) => updateCertification(certification.id, 'issuer', e.target.value)}
                        className="input-field"
                        placeholder="請輸入發證機構"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">取得日期</label>
                      <input
                        type="date"
                        value={certification.date}
                        onChange={(e) => updateCertification(certification.id, 'date', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">證照網址</label>
                      <input
                        type="url"
                        value={certification.url}
                        onChange={(e) => updateCertification(certification.id, 'url', e.target.value)}
                        className="input-field"
                        placeholder="https://example.com/certificate"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">證照描述</label>
                    <textarea
                      value={certification.description}
                      onChange={(e) => updateCertification(certification.id, 'description', e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="請描述證照的內容、技能要求或相關成就..."
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Languages */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection('languages')}
            className="flex items-center space-x-2"
          >
            <Languages className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">語言能力</h2>
            {expandedSections.languages ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            onClick={addLanguage}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增語言
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.languages && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {formData?.resumeData?.languages?.map((language, index) => (
                <motion.div
                  key={language.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={language.name}
                      onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                      className="input-field"
                      placeholder="語言名稱"
                    />
                  </div>
                  <div className="w-40">
                    <select
                      value={language.level}
                      onChange={(e) => updateLanguage(language.id, 'level', e.target.value)}
                      className="input-field"
                    >
                      <option value="basic">基礎</option>
                      <option value="conversational">會話</option>
                      <option value="fluent">流利</option>
                      <option value="native">母語</option>
                    </select>
                  </div>
                  <button
                    onClick={() => removeLanguage(language.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Custom Sections */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection('custom')}
            className="flex items-center space-x-2"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">自訂欄位</h2>
            {expandedSections.custom ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            onClick={addCustomSection}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增欄位
          </button>
        </div>

        <AnimatePresence>
          {expandedSections.custom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {formData?.resumeData?.customSections?.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 border border-gray-200 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-gray-900">自訂欄位 {index + 1}</h3>
                    <button
                      onClick={() => removeCustomSection(section.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">欄位標題</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                      className="input-field"
                      placeholder="例如：獲獎經歷、志工服務、興趣愛好..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">欄位內容</label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                      className="input-field"
                      rows={4}
                      placeholder="請輸入詳細內容，支援換行..."
                    />
                  </div>
                </motion.div>
              ))}
              
              {formData?.resumeData?.customSections?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>還沒有自訂欄位</p>
                  <p className="text-sm">點擊「新增欄位」來添加自訂內容</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
