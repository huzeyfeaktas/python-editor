import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  Play, 
  Settings,
  Sidebar,
  X
} from 'lucide-react'
import { useEditor } from '@/contexts/EditorContext'
import Header from '@/components/Layout/Header'
import FileTree from '@/components/Editor/FileTree'
import MonacoEditor from '@/components/Editor/MonacoEditor'
import OutputPanel from '@/components/Editor/OutputPanel'
import Button from '@/components/ui/Button'
import SettingsModal from '@/components/SettingsModal'
import toast from 'react-hot-toast'

const Editor = () => {
  const { 
    files, 
    activeFile, 
    openFiles, 
    isRunning,
    openFile, 
    closeFile, 
    saveFile, 
    runCode,
    loadFiles,
    refreshEditor
  } = useEditor()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editorContent, setEditorContent] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  useEffect(() => {
    console.log('🖥️ Editor.tsx useEffect triggered')
    
    // URL'den gelen proje parametrelerini kontrol et
    const checkForProjectUpdate = async () => {
      const openProjectId = localStorage.getItem('openProjectId')
      const newProjectCreated = localStorage.getItem('newProjectCreated')
      
      console.log('🔍 Editor.tsx flags:', { openProjectId, newProjectCreated })
      
      // ARTIK HİÇBİR ZAMAN refreshEditor çağırmayacağız
      // EditorContext'teki loadFiles zaten her şeyi hallediyor
      console.log('📂 Editor.tsx calling loadFiles (no refresh needed)')
      await loadFiles()
    }
    
    checkForProjectUpdate()
  }, [])

  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content || '')
      setHasUnsavedChanges(false)
    }
  }, [activeFile])

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
    setHasUnsavedChanges(content !== (activeFile?.content || ''))
  }

  const handleSave = async () => {
    if (activeFile && hasUnsavedChanges) {
      await saveFile(activeFile.id, editorContent)
      setHasUnsavedChanges(false)
    }
  }

  const handleRunCode = async () => {
    if (hasUnsavedChanges) {
      await handleSave()
    }
    if (editorContent) {
      const language = activeFile?.language || 'python'
      await runCode(editorContent, language)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault()
          handleSave()
        } else if (e.key === 'Enter') {
          e.preventDefault()
          handleRunCode()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editorContent, hasUnsavedChanges, activeFile])

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={true}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ 
            width: sidebarOpen ? 280 : 0,
            opacity: sidebarOpen ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {sidebarOpen && (
            <FileTree
              files={files}
              onFileSelect={openFile}
              activeFileId={activeFile?.id}
            />
          )}
        </motion.div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4 py-2 space-x-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <Sidebar className="h-4 w-4" />
              </button>

              <div className="flex-1 flex items-center space-x-1 overflow-x-auto">
                {openFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-t-lg cursor-pointer border-b-2 ${
                      activeFile?.id === file.id
                        ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'
                    }`}
                    onClick={() => openFile(file)}
                  >
                    <span className="text-sm font-medium">
                      {file.name}
                      {activeFile?.id === file.id && hasUnsavedChanges && (
                        <span className="ml-1 text-orange-500">•</span>
                      )}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        closeFile(file.id)
                      }}
                      className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || !activeFile}
                  className="p-2"
                >
                  <Save className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  onClick={handleRunCode}
                  disabled={isRunning || !activeFile}
                  loading={isRunning}
                  className="px-3"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Çalıştır
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="p-2"
                  onClick={() => setShowSettingsModal(true)}
                  title="Ayarlar"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeFile ? (
              <div className="flex-1 bg-white dark:bg-gray-900">
                <MonacoEditor
                  value={editorContent}
                  onChange={handleEditorChange}
                  onSave={handleSave}
                  language="python"
                  fileName={activeFile?.name}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Editöre Hoş Geldiniz
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Kodlamaya başlamak için bir dosya seçin veya yeni dosya oluşturun
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Klavye Kısayolları:</p>
                    <div className="text-xs space-y-1 text-gray-400">
                      <div><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Ctrl+S</kbd> Kaydet</div>
                      <div><kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Ctrl+Enter</kbd> Çalıştır</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Output Panel */}
            <OutputPanel />
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  )
}

export default Editor
