import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  User, 
  Settings, 
  Trash2, 
  AlertTriangle,
  Shield,
  Moon,
  Sun,
  Monitor,
  Save,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import Button from '@/components/ui/Button'
import api from '@/utils/api'
import toast from 'react-hot-toast'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== user?.username) {
      toast.error('Kullanıcı adını doğru yazmanız gerekiyor!')
      return
    }

    setIsDeleting(true)
    try {
      await api.delete('/auth/account')
      toast.success('Hesabınız başarıyla silindi')
      logout()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Hesap silinirken bir hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  const resetDeleteForm = () => {
    setShowDeleteConfirm(false)
    setDeleteConfirmText('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ayarlar
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profil</span>
              </button>
              
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span>Görünüm</span>
              </button>
              
              <button
                onClick={() => setActiveTab('danger')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'danger'
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Güvenlik</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Profil Bilgileri
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {user?.username}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          Hesabınız aktif ve doğrulanmış
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Tema Ayarları
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'light'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                        <div className="text-sm font-medium">Açık</div>
                      </button>
                      
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Moon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-sm font-medium">Koyu</div>
                      </button>
                      
                      <button
                        onClick={() => setTheme('system')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'system'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Monitor className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                        <div className="text-sm font-medium">Sistem</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                    Tehlikeli Bölge
                  </h3>
                  
                  {!showDeleteConfirm ? (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                            Hesabı Sil
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                            Hesabınızı sildiğinizde, tüm verileriniz (projeler, dosyalar) kalıcı olarak silinecektir. 
                            Bu işlem geri alınamaz!
                          </p>
                          <Button
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hesabı Sil
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                            Hesap Silme Onayı
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                            Bu işlemi onaylamak için kullanıcı adınızı yazın: <strong>{user?.username}</strong>
                          </p>
                          
                          <div className="space-y-4">
                            <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder="Kullanıcı adınızı yazın"
                              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:border-red-600"
                            />
                            
                            <div className="flex space-x-3">
                              <Button
                                variant="solid"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== user?.username || isDeleting}
                                loading={isDeleting}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hesabı Kalıcı Olarak Sil
                              </Button>
                              
                              <Button
                                variant="outline"
                                onClick={resetDeleteForm}
                                disabled={isDeleting}
                              >
                                İptal
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Python Web Editor v1.0
          </div>
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsModal
