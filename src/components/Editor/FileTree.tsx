import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  File, 
  Folder, 
  FolderOpen,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  Image,
  FileText,
  Code,
  Upload,
  Download
} from 'lucide-react'
import { FileItem } from '@/types'
import { useEditor } from '@/contexts/EditorContext'
import Button from '@/components/ui/Button'
import FileTypeModal from '@/components/FileTypeModal'

interface FileTreeProps {
  files: FileItem[]
  onFileSelect: (file: FileItem) => void
  activeFileId?: string
}

const FileTree = ({ files, onFileSelect, activeFileId }: FileTreeProps) => {
  const { createFile, createFolder, deleteFile, renameFile, currentProject } = useEditor()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showFileTypeModal, setShowFileTypeModal] = useState(false)
  const [newFileParentId, setNewFileParentId] = useState<string | undefined>(undefined)

  // Proje açıldığında root proje klasörünü seçili yap
  useEffect(() => {
    if (currentProject) {
      setSelectedFolder(currentProject.id)
      // Root proje klasörünü expand et
      const newExpanded = new Set<string>()
      newExpanded.add(currentProject.id)
      setExpandedFolders(newExpanded)
    }
  }, [currentProject])
  const [contextMenu, setContextMenu] = useState<{
    file: FileItem
    x: number
    y: number
  } | null>(null)
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  
  const handleDownloadFile = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/files/${file.id}/download`, {
        method: 'GET',
        credentials: 'include'
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'python':
        return '🐍'
      case 'html':
        return '🌐'
      case 'css':
        return '🎨'
      case 'javascript':
        return '⚡'
      default:
        return '📄'
    }
  }

  const getFileIcon = (filename: string, isFolder: boolean, language?: string) => {
    if (isFolder) return null
    
    // Language-based icons first
    if (language) {
      switch (language) {
        case 'python':
          return <Code className="h-4 w-4 text-green-500" />
        case 'html':
          return <Code className="h-4 w-4 text-orange-500" />
        case 'css':
          return <Code className="h-4 w-4 text-blue-500" />
        case 'javascript':
          return <Code className="h-4 w-4 text-yellow-500" />
      }
    }
    
    // Extension-based fallback
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'py':
        return <Code className="h-4 w-4 text-green-500" />
      case 'html':
        return <Code className="h-4 w-4 text-orange-500" />
      case 'css':
        return <Code className="h-4 w-4 text-blue-500" />
      case 'js':
        return <Code className="h-4 w-4 text-yellow-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return <Image className="h-4 w-4 text-blue-500" />
      case 'txt':
      case 'md':
        return <FileText className="h-4 w-4 text-yellow-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const content = e.target?.result as string
        await createFile(file.name, undefined, content, file.type.startsWith('image/') ? 'image' : 'file')
      }
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    }
    
    // Reset input
    event.target.value = ''
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
    // Klasörü seçili yap
    setSelectedFolder(folderId)
  }

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      file,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleRename = (file: FileItem) => {
    setEditingFile(file.id)
    setNewName(file.name)
    setContextMenu(null)
  }

  const handleRenameSubmit = (fileId: string) => {
    if (newName.trim() && newName !== files.find(f => f.id === fileId)?.name) {
      renameFile(fileId, newName.trim())
    }
    setEditingFile(null)
    setNewName('')
  }

  const handleDelete = (file: FileItem) => {
    if (window.confirm(`"${file.name}" dosyasını silmek istediğinizden emin misiniz?`)) {
      deleteFile(file.id)
    }
    setContextMenu(null)
  }

  const renderFileItem = (file: FileItem, level = 0) => {
    const isExpanded = expandedFolders.has(file.id)
    const isActive = activeFileId === file.id
    const isSelected = selectedFolder === file.id && (file.type === 'folder' || file.type === 'project')
    const isEditing = editingFile === file.id
    
    return (
      <div key={`${file.id}-${file.name}-${file.type}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center py-1 px-2 rounded cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive ? 'bg-blue-100 dark:bg-blue-900' : 
            isSelected ? 'bg-green-100 dark:bg-green-900' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (file.type === 'folder' || file.type === 'project') {
              toggleFolder(file.id)
            } else {
              onFileSelect(file)
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, file)}
        >
          {(file.type === 'folder' || file.type === 'project') && (
            <div className="mr-1 text-gray-500">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
          
          <div className="mr-2">
            {file.type === 'folder' || file.type === 'project' ? (
              isExpanded ? (
                <FolderOpen className={`h-4 w-4 ${file.type === 'project' ? 'text-blue-500' : 'text-yellow-500'}`} />
              ) : (
                <Folder className={`h-4 w-4 ${file.type === 'project' ? 'text-blue-600' : 'text-yellow-600'}`} />
              )
            ) : (
              getFileIcon(file.name, false, file.language) || <File className="h-4 w-4 text-gray-500" />
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => handleRenameSubmit(file.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit(file.id)
                } else if (e.key === 'Escape') {
                  setEditingFile(null)
                  setNewName('')
                }
              }}
              className="flex-1 bg-transparent border-b border-blue-500 outline-none text-sm"
              autoFocus
            />
          ) : (
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 flex items-center gap-1">
              {file.name}
              {file.type === 'file' && file.language && (
                <span className="text-xs" title={`${file.language} dosyası`}>
                  {getLanguageIcon(file.language)}
                </span>
              )}
            </span>
          )}

          <button
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={(e) => {
              e.stopPropagation()
              handleContextMenu(e, file)
            }}
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </motion.div>

        {(file.type === 'folder' || file.type === 'project') && isExpanded && file.children && file.children.length > 0 && (
          <div>
            {file.children.map(child => renderFileItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderRootFiles = () => {
    // Artık files zaten hierarşik yapıda geliyor
    return files.map(file => renderFileItem(file))
  }

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dosya Gezgini
            </h3>
            {currentProject && (
              <div className="text-xs mt-1">
                <p className="text-blue-600 dark:text-blue-400">
                  📁 {currentProject.name}
                </p>
                {selectedFolder && selectedFolder !== currentProject.id && (
                  <p className="text-green-600 dark:text-green-400">
                    ➤ Seçili klasör
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".py,.txt,.md,.jpg,.jpeg,.png,.gif,.bmp,.svg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="p-1"
              title="Dosya Yükle"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                // Seçili klasör varsa onun içine, yoksa proje root'a ekle
                const targetParent = selectedFolder || currentProject?.id
                setNewFileParentId(targetParent)
                setShowFileTypeModal(true)
              }}
              className="p-1"
              title={selectedFolder 
                ? `Seçili klasöre yeni dosya ekle` 
                : currentProject 
                  ? `${currentProject.name} projesine yeni dosya ekle` 
                  : "Yeni Dosya"
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                // Seçili klasör varsa onun içine, yoksa proje root'a ekle
                const targetParent = selectedFolder || currentProject?.id
                createFolder('yeni_klasor', targetParent)
              }}
              className="p-1"
              title={selectedFolder 
                ? `Seçili klasöre yeni klasör ekle` 
                : currentProject 
                  ? `${currentProject.name} projesine yeni klasör ekle` 
                  : "Yeni Klasör"
              }
            >
              <Folder className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-2 overflow-auto flex-1">
        {files.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Henüz dosya yok
            </p>
            <Button
              size="sm"
              onClick={() => createFile('main.py')}
            >
              İlk Dosyayı Oluştur
            </Button>
          </div>
        ) : (
          renderRootFiles()
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setContextMenu(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed z-20 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y
            }}
          >
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleRename(contextMenu.file)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Yeniden Adlandır
            </button>
            
            {(contextMenu.file.type === 'folder' || contextMenu.file.type === 'project') && (
              <>
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setNewFileParentId(contextMenu.file.id)
                    setShowFileTypeModal(true)
                    setContextMenu(null)
                  }}
                >
                  <File className="h-4 w-4 mr-2" />
                  Yeni Dosya
                </button>
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    createFolder('yeni_klasor', contextMenu.file.id)
                    setContextMenu(null)
                  }}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Yeni Klasör
                </button>
              </>
            )}
            
            {contextMenu.file.type === 'file' && (
              <button
                className="flex items-center w-full px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  handleDownloadFile(contextMenu.file)
                  setContextMenu(null)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                İndir
              </button>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
            
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleDelete(contextMenu.file)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </button>
          </motion.div>
        </>
      )}

      <FileTypeModal
        isOpen={showFileTypeModal}
        onClose={() => setShowFileTypeModal(false)}
        onConfirm={(fileName: string, language: string) => {
          createFile(fileName, newFileParentId, undefined, 'file', language)
        }}
        title="Yeni Dosya Oluştur"
      />
    </div>
  )
}

export default FileTree
