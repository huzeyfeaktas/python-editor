import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Folder, 
  File, 
  Clock, 
  Calendar,
  Plus,
  Search,
  Code,
  Trash2,
  Edit3,
  ArrowLeft,
  FolderPlus,
  Upload,
  Download,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Layout/Header'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import NewProjectModal from '@/components/NewProjectModal'
import api from '@/utils/api'
import toast from 'react-hot-toast'

interface ProjectFile {
  id: string
  name: string
  type: 'file' | 'folder' | 'project'
  path: string
  parent_id?: string
  created_at: string
  updated_at?: string
}

const Projects = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [allFiles, setAllFiles] = useState<ProjectFile[]>([])
  const [currentProject, setCurrentProject] = useState<ProjectFile | null>(null)
  const [currentFiles, setCurrentFiles] = useState<ProjectFile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await api.get('/files')
      if (response.data.success) {
        const files = response.data.data.files || []
        setAllFiles(files)
        
        // Sadece project tipindeki dosyaları projeler olarak göster
        const projectsOnly = files.filter((file: ProjectFile) => file.type === 'project')
        setProjects(projectsOnly)
        
        if (!currentProject) {
          setCurrentFiles(projectsOnly)
        }
      }
    } catch (error) {
      console.error('Dosyalar yüklenirken hata:', error)
      toast.error('Projeler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const openProject = (project: ProjectFile) => {
    setCurrentProject(project)
    
    // Bu projeye ait dosyaları bul
    const projectFiles = allFiles.filter(file => 
      file.parent_id === project.id || file.id === project.id
    )
    setCurrentFiles(projectFiles)
  }

  const goBackToProjects = () => {
    setCurrentProject(null)
    setCurrentFiles(projects)
  }

  const openInEditor = (file?: ProjectFile) => {
    if (file && file.type === 'file') {
      // Dosyayı editörde aç
      localStorage.setItem('openFileId', file.id)
    } else if (currentProject) {
      // Proje klasörünü editörde aç
      localStorage.setItem('openProjectId', currentProject.id)
    }
    navigate('/editor')
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Bu projeyi ve içindeki tüm dosyaları silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      await api.delete(`/files/${projectId}`)
      toast.success('Proje silindi')
      loadFiles()
      
      if (currentProject?.id === projectId) {
        goBackToProjects()
      }
    } catch (error) {
      toast.error('Proje silinemedi')
    }
  }

  const filteredFiles = currentFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (file: ProjectFile) => {
    if (file.type === 'project') return '📁'
    if (file.type === 'folder') return '📂'
    if (file.name.endsWith('.py')) return '🐍'
    if (file.name.endsWith('.png') || file.name.endsWith('.jpg')) return '🖼️'
    return '📄'
  }

  const getProjectColor = (type: string) => {
    return 'bg-gradient-to-r from-blue-500 to-green-500'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {currentProject && (
                <Button
                  variant="ghost"
                  onClick={goBackToProjects}
                  className="p-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentProject ? (
                    <span className="flex items-center">
                      📁 {currentProject.name}
                    </span>
                  ) : (
                    'Projelerim 📁'
                  )}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentProject 
                    ? `${currentFiles.length - 1} dosya`
                    : `${user?.username}, ${projects.length} projeniz bulunuyor`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {currentProject ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => openInEditor()}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Editörde Aç
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {/* TODO: Dosya yükleme */}}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Dosya Yükle
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setShowNewProjectModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Yeni Proje Klasörü
                </Button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder={currentProject ? "Dosyalarda arayın..." : "Projelerinizde arayın..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              className="dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        </motion.div>

        {/* Files/Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredFiles.map((file) => (
            <motion.div
              key={file.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group"
              onClick={() => {
                if (file.type === 'project') {
                  // Proje klasörüne tıklayınca direkt editöre git
                  // Önce diğer state'leri temizle
                  localStorage.removeItem('newProjectCreated')
                  localStorage.removeItem('openFileId')
                  localStorage.removeItem('exampleFile')
                  // Proje ID'sini set et
                  localStorage.setItem('openProjectId', file.id)
                  navigate('/editor')
                } else if (file.type === 'file') {
                  openInEditor(file)
                }
              }}
            >
              <div className={`h-24 ${getProjectColor(file.type)} relative`}>
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span className="text-3xl">{getFileIcon(file)}</span>
                </div>
                
                {!currentProject && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Rename functionality
                        }}
                        className="p-1.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-40"
                      >
                        <Edit3 className="h-3 w-3 text-white" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteProject(file.id)
                        }}
                        className="p-1.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-40"
                      >
                        <Trash2 className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {file.name}
                </h3>
                
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(file.created_at)}
                  </div>
                  
                  {file.type === 'project' && (
                    <div className="flex items-center">
                      <File className="h-3 w-3 mr-1" />
                      {allFiles.filter(f => f.parent_id === file.id).length} dosya
                    </div>
                  )}
                </div>
                
                {file.type === 'project' && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Proje Klasörü
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredFiles.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm 
                ? 'Dosya bulunamadı' 
                : currentProject 
                  ? 'Klasör boş' 
                  : 'Henüz proje yok'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Arama kriterlerinizle eşleşen dosya bulunamadı'
                : currentProject
                  ? 'Bu klasörde henüz dosya yok. Editörde yeni dosyalar oluşturun.'
                  : 'İlk proje klasörünüzü oluşturun'
              }
            </p>
            
            {!searchTerm && !currentProject && (
              <Button 
                onClick={() => setShowNewProjectModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                İlk Projeyi Oluştur
              </Button>
            )}
          </motion.div>
        )}
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={(project) => {
          loadFiles()
          setShowNewProjectModal(false)
        }}
      />
    </div>
  )
}

export default Projects