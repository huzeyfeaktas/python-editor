import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface FileTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (fileName: string, language: string) => void
  title: string
}

const FileTypeModal = ({ isOpen, onClose, onConfirm, title }: FileTypeModalProps) => {
  const [fileName, setFileName] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('python')

  const languages = [
    { value: 'python', label: 'Python', icon: '🐍', extension: '.py' },
    { value: 'html', label: 'HTML', icon: '🌐', extension: '.html' },
    { value: 'css', label: 'CSS', icon: '🎨', extension: '.css' },
    { value: 'javascript', label: 'JavaScript', icon: '⚡', extension: '.js' },
  ]

  const handleConfirm = () => {
    if (!fileName.trim()) return
    
    const selectedLang = languages.find(lang => lang.value === selectedLanguage)
    const extension = selectedLang?.extension || '.py'
    
    // Eğer dosya adında extension yoksa ekle
    const finalFileName = fileName.includes('.') ? fileName : fileName + extension
    
    onConfirm(finalFileName, selectedLanguage)
    setFileName('')
    setSelectedLanguage('python')
    onClose()
  }

  const handleClose = () => {
    setFileName('')
    setSelectedLanguage('python')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dosya Adı
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              placeholder="Dosya adını girin..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dosya Türü
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setSelectedLanguage(lang.value)}
                  className={`p-3 rounded-lg border-2 transition-colors flex items-center space-x-2 ${
                    selectedLanguage === lang.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="text-lg">{lang.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {lang.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {lang.extension}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!fileName.trim()}
            className="flex-1"
          >
            Oluştur
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default FileTypeModal
