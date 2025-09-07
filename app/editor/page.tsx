'use client'

import { motion } from 'framer-motion'
import FormEditor from '@/components/FormEditor'
import PreviewPanel from '@/components/PreviewPanel'
import Header from '@/components/Header'
import { ResumeFormProvider } from '@/hooks/useResumeForm'

export default function EditorPage() {

  return (
    <ResumeFormProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-row min-h-screen">
          {/* Form Editor */}
          <motion.div
            className="w-1/2 bg-white border-r border-gray-200"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FormEditor />
          </motion.div>
          {/* Preview Panel */}
          <motion.div
            className="w-1/2 bg-gray-100"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PreviewPanel />
          </motion.div>
        </div>
      </div>
    </ResumeFormProvider>
  )
} 