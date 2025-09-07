import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { EditorContextType, FileItem, ExecutionResult } from '@/types'
import api from '@/utils/api'
import toast from 'react-hot-toast'

const EditorContext = createContext<EditorContextType | null>(null)

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}

interface EditorProviderProps {
  children: ReactNode
}

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [allFiles, setAllFiles] = useState<FileItem[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [activeFile, setActiveFile] = useState<FileItem | null>(null)
  const [openFiles, setOpenFiles] = useState<FileItem[]>([])
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [currentProject, setCurrentProject] = useState<FileItem | null>(null)

  useEffect(() => {
    // localStorage'dan proje/dosya kontrol et
    const openProjectId = localStorage.getItem('openProjectId')
    const openFileId = localStorage.getItem('openFileId')
    const exampleFile = localStorage.getItem('exampleFile')
    const newProjectCreated = localStorage.getItem('newProjectCreated')
    
    if (exampleFile) {
      try {
        const file = JSON.parse(exampleFile)
        setActiveFile(file)
        setOpenFiles([file])
        setFiles([file])
        setCurrentProject(null) // Clear current project for examples
        localStorage.removeItem('exampleFile')
        return // Sadece example file varsa loadFiles'ı çağırma
      } catch (error) {
        console.error('Error loading example file:', error)
      }
    }
    
    // Yeni proje oluşturulduysa flag'i temizle
    if (newProjectCreated) {
      localStorage.removeItem('newProjectCreated')
    }
    
    console.log('📍 EditorContext initial useEffect triggered')
    // Normal durumda dosyaları yükle
    loadFiles()
  }, [])

  // Proje değiştiğinde dosyaları yeniden yükle - KALDIRIYORUZ çünkü çakışma yapıyor
  // useEffect(() => {
  //   if (currentProject) {
  //     loadFiles()
  //   }
  // }, [currentProject?.id])

  const loadFiles = async (projectId?: string) => {
    try {
      // localStorage'dan proje kontrolü - sadece ilk çağrıda
      const openProjectId = projectId || localStorage.getItem('openProjectId')
      
      let apiUrl = '/files'
      let targetProjectId = null
      
      if (openProjectId) {
        // Belirli proje için backend'den filtrelenmiş dosyalar al
        targetProjectId = openProjectId
        apiUrl = `/files?project_id=${openProjectId}`
        console.log('🎯 API CALL: Loading files for project:', openProjectId)
      } else if (currentProject) {
        // Mevcut proje için backend'den filtrelenmiş dosyalar al
        targetProjectId = currentProject.id
        apiUrl = `/files?project_id=${currentProject.id}`
        console.log('🔄 API CALL: Reloading current project files:', currentProject.id)
      } else {
        console.log('📂 API CALL: Loading all files (no project selected)')
      }
      
      console.log('🌐 API URL:', apiUrl)
      console.log('🎯 Target Project ID:', targetProjectId)
      
      const response = await api.get(apiUrl)
      if (response.data.success) {
        const filesData = response.data.data.files || []
        console.log(`📁 Backend returned ${filesData.length} files`)
        console.log('📋 Files received from backend:', filesData.map(f => `${f.name} (${f.type})`).join(', '))
        
        // Tüm dosyaları güncelle
        setAllFiles(filesData)
        
        if (openProjectId) {
          // Proje seçildi - backend zaten filtreledi
          const project = filesData.find((f: FileItem) => f.id === openProjectId && f.type === 'project')
          if (project) {
            setCurrentProject(project)
            
            // Hierarşik yapı oluştur
            const hierarchicalFiles = buildHierarchy(filesData)
            setFiles(hierarchicalFiles)
            
            // Açık dosyaları ve aktif dosyayı temizle
            setOpenFiles([])
            setActiveFile(null)
            
            // Ana dosyayı aç (main.py varsa)
            const mainFile = filesData.find((f: FileItem) => 
              f.name === 'main.py' && f.type === 'file'
            )
            if (mainFile) {
              setActiveFile(mainFile)
              setOpenFiles([mainFile])
            }
          }
        } else if (currentProject) {
          // Mevcut proje var - backend zaten filtreledi
          const hierarchicalFiles = buildHierarchy(filesData)
          setFiles(hierarchicalFiles)
          
          // Açık dosyaları filtrele
          setOpenFiles(prev => prev.filter(openFile => 
            filesData.some(file => file.id === openFile.id)
          ))
          
          // Aktif dosya kontrolü
          if (activeFile && !filesData.some(file => file.id === activeFile.id)) {
            setActiveFile(null)
          }
        } else {
          // Hiç proje seçili değil - tüm dosyaları göster
          const hierarchicalFiles = buildHierarchy(filesData)
          setFiles(hierarchicalFiles)
        }
      }
      
      // localStorage temizle
      if (openProjectId === localStorage.getItem('openProjectId')) {
        console.log('🧹 Cleaning up openProjectId from localStorage')
        localStorage.removeItem('openProjectId')
      }
      
    } catch (error) {
      console.error('Error loading files:', error)
      toast.error('Dosyalar yüklenirken hata oluştu')
    }
  }

  // Hierarşik dosya yapısı oluşturur (parent-child ilişkileri)
  const buildHierarchy = (files: FileItem[]): FileItem[] => {
    const fileMap = new Map<string, FileItem>()
    const rootFiles: FileItem[] = []

    // Önce tüm dosyaları map'e koy
    files.forEach(file => {
      fileMap.set(file.id, { ...file, children: [] })
    })

    // Parent-child ilişkilerini kur
    files.forEach(file => {
      const fileWithChildren = fileMap.get(file.id)!
      
      if (file.parent_id && fileMap.has(file.parent_id)) {
        // Parent varsa, child olarak ekle
        const parent = fileMap.get(file.parent_id)!
        if (!parent.children) parent.children = []
        parent.children.push(fileWithChildren)
      } else {
        // Parent yoksa root level
        rootFiles.push(fileWithChildren)
      }
    })

    return rootFiles
  }

  const createFile = async (name: string, parent_id?: string, content?: string, fileType?: string, language?: string) => {
    try {
      // Language'a göre default content belirle
      const getDefaultContent = (lang: string) => {
        switch (lang) {
          case 'html':
            return '<!DOCTYPE html>\n<html lang="tr">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Yeni HTML Sayfası</title>\n</head>\n<body>\n    <h1>Merhaba Dünya!</h1>\n</body>\n</html>'
          case 'css':
            return '/* Yeni CSS Dosyası */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f5f5f5;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}'
          case 'javascript':
            return '// Yeni JavaScript dosyası\nconsole.log("Merhaba Dünya!");\n\n// DOM yüklendiğinde çalış\ndocument.addEventListener("DOMContentLoaded", function() {\n    console.log("Sayfa hazır!");\n});'
          case 'python':
          default:
            return '# Yeni Python dosyası\nprint("Merhaba Dünya!")\n'
        }
      }

      const actualLanguage = language || 'python'
      const defaultContent = content || getDefaultContent(actualLanguage)
      
      // Eğer currentProject varsa, yeni dosyayı o projeye bağla
      const actualParentId = parent_id || currentProject?.id
      
      const response = await api.post('/files', {
        name,
        type: 'file',
        parent_id: actualParentId,
        content: defaultContent,
        language: actualLanguage
      })
      
      if (response.data.success) {
        // Proje varsa sadece o projenin dosyalarını yeniden yükle
        if (currentProject) {
          await loadFiles(currentProject.id)
        } else {
          await loadFiles()
        }
        toast.success('Dosya oluşturuldu')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dosya oluşturulamadı')
    }
  }

  const createFolder = async (name: string, parent_id?: string) => {
    try {
      // Eğer currentProject varsa, yeni klasörü o projeye bağla
      const actualParentId = parent_id || currentProject?.id
      
      const response = await api.post('/files', {
        name,
        type: 'folder',
        parent_id: actualParentId
      })
      
      if (response.data.success) {
        // Proje varsa sadece o projenin dosyalarını yeniden yükle
        if (currentProject) {
          await loadFiles(currentProject.id)
        } else {
          await loadFiles()
        }
        toast.success('Klasör oluşturuldu')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Klasör oluşturulamadı')
    }
  }

  const openFile = async (file: FileItem) => {
    if (file.type === 'folder') return
    
    try {
      const response = await api.get(`/files/${file.id}`)
      if (response.data.success) {
        const fileWithContent = { ...file, content: response.data.data.content }
        setActiveFile(fileWithContent)
        
        // Add to open files if not already open
        setOpenFiles(prev => {
          const existing = prev.find(f => f.id === file.id)
          if (existing) {
            return prev.map(f => f.id === file.id ? fileWithContent : f)
          }
          return [...prev, fileWithContent]
        })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dosya açılamadı')
    }
  }

  const closeFile = (fileId: string) => {
    setOpenFiles(prev => prev.filter(f => f.id !== fileId))
    
    // If closing active file, switch to another open file
    if (activeFile?.id === fileId) {
      const remaining = openFiles.filter(f => f.id !== fileId)
      setActiveFile(remaining.length > 0 ? remaining[remaining.length - 1] : null)
    }
  }

  const saveFile = async (fileId: string, content: string) => {
    try {
      const response = await api.put(`/files/${fileId}`, { content })
      if (response.data.success) {
        // Update the file content in state
        setActiveFile(prev => prev ? { ...prev, content } : null)
        setOpenFiles(prev => prev.map(f => f.id === fileId ? { ...f, content } : f))
        toast.success('Dosya kaydedildi')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dosya kaydedilemedi')
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      const response = await api.delete(`/files/${fileId}`)
      if (response.data.success) {
        // Proje varsa sadece o projenin dosyalarını yeniden yükle
        if (currentProject) {
          await loadFiles(currentProject.id)
        } else {
          await loadFiles()
        }
        
        // Close file if it's open
        closeFile(fileId)
        
        toast.success('Dosya silindi')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dosya silinemedi')
    }
  }

  const renameFile = async (fileId: string, newName: string) => {
    try {
      const response = await api.put(`/files/${fileId}/rename`, { name: newName })
      if (response.data.success) {
        // Proje varsa sadece o projenin dosyalarını yeniden yükle
        if (currentProject) {
          await loadFiles(currentProject.id)
        } else {
          await loadFiles()
        }
        
        // Update open files
        setOpenFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f))
        if (activeFile?.id === fileId) {
          setActiveFile(prev => prev ? { ...prev, name: newName } : null)
        }
        
        toast.success('Dosya yeniden adlandırıldı')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dosya yeniden adlandırılamadı')
    }
  }

  const clearOutput = () => {
    setOutput('')
  }

  const runCode = async (code: string, language: string = 'python') => {
    if (isRunning) return
    
    setIsRunning(true)
    const timestamp = new Date().toLocaleTimeString()
    
    try {
      const response = await api.post('/execute', { code, language })
      const result: ExecutionResult = response.data.data
      
      let outputText = ''
      
      // Sadece gerçek çıktı varsa ekle
      if (result.output && result.output.trim()) {
        outputText += `[${timestamp}]\n${result.output}\n`
      }
      
      // Hata varsa ekle
      if (result.error && result.error.trim()) {
        outputText += `[${timestamp}] ❌ Hata:\n${result.error}\n`
      }
      
      // Çıktı veya hata varsa ayıraç ekle
      if (outputText) {
        outputText += '─'.repeat(40) + '\n'
        setOutput(prev => prev + outputText)
      }
      
      // Hata durumunda toast göster
      if (!result.success && result.error) {
        toast.error('Kod çalıştırılırken hata oluştu')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Kod çalıştırılamadı'
      setOutput(prev => prev + `[${timestamp}] ❌ Bağlantı hatası: ${errorMessage}\n` + '─'.repeat(40) + '\n')
      toast.error(errorMessage)
    } finally {
      setIsRunning(false)
    }
  }

  // Force refresh function for external calls
  const refreshEditor = async () => {
    console.log('🔄 Editor force refresh triggered')
    console.log('🔍 Current project at start:', currentProject?.name || 'none')
    
    // localStorage'dan proje ID'sini kontrol et
    const openProjectId = localStorage.getItem('openProjectId')
    const newProjectCreated = localStorage.getItem('newProjectCreated')
    
    if (openProjectId || newProjectCreated) {
      console.log('🎯 Refresh with project ID:', openProjectId)
      
      // State'i tamamen temizle - yeni proje açılacak
      setCurrentProject(null)
      setActiveFile(null)
      setOpenFiles([])
      setFiles([])
      setAllFiles([])
      setOutput('')
      
      // localStorage temizle
      localStorage.removeItem('newProjectCreated')
      
      // Dosyaları yeniden yükle - openProjectId varken loadFiles bu projeyi seçecek
      setTimeout(async () => {
        await loadFiles()
      }, 100)
    } else {
      console.log('🧹 Simple refresh without project change')
      console.log('🔍 currentProject exists?', !!currentProject)
      
      // SADECE dosyaları yeniden yükle - state'i değiştirme!
      if (currentProject) {
        console.log('🔄 Refreshing current project:', currentProject.id)
        await loadFiles(currentProject.id)
      } else {
        console.log('📂 No current project, loading all files')
        await loadFiles()
      }
    }
  }

  const value: EditorContextType = {
    files,
    activeFile,
    openFiles,
    output,
    isRunning,
    currentProject,
    createFile,
    createFolder,
    openFile,
    closeFile,
    saveFile,
    deleteFile,
    runCode,
    loadFiles,
    renameFile,
    clearOutput,
    refreshEditor
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
