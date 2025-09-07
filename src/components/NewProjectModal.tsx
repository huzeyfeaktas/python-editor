import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, FolderPlus, FileCode, Database, Gamepad2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import api from '@/utils/api'
import toast from 'react-hot-toast'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreated: (project: any) => void
}

// Proje tipleri kaldırıldı - tüm kütüphaneler zaten yüklü

const NewProjectModal = ({ isOpen, onClose, onProjectCreated }: NewProjectModalProps) => {
  const [projectName, setProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectName.trim()) {
      toast.error('Proje klasör adı gerekli')
      return
    }

    // Klasör adı kontrolü - sadece geçerli karakterler
    const folderName = projectName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '')
    if (!folderName) {
      toast.error('Geçerli bir klasör adı girin')
      return
    }

    setIsCreating(true)
    try {
      const response = await api.post('/projects', {
        name: folderName,
        type: 'python'
      })

      if (response.data.success) {
        toast.success(`"${folderName}" klasörü oluşturuldu!`)
        onProjectCreated(response.data.data)
        setProjectName('')
        onClose()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Proje klasörü oluşturulamadı')
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FolderPlus className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Yeni Proje Klasörü Oluştur
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Proje Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Klasör Adı
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Örnek: benim-projesi, oyun-projesi..."
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Bu klasörde projenizin tüm dosyaları saklanacak
            </p>
          </div>

          {/* Bilgi */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              🐍 Tüm Python kütüphaneleri önceden yüklenmiş!<br/>
              NumPy, Pandas, Matplotlib, OpenCV, Pygame ve daha fazlası...
            </p>
          </div>

          {/* Butonlar */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              type="submit"
              loading={isCreating}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Proje Oluştur
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default NewProjectModal
