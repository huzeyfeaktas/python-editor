import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Terminal, 
  Play, 
  Square, 
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { useEditor } from '@/contexts/EditorContext'
import Button from '@/components/ui/Button'

const OutputPanel = () => {
  const { output, isRunning, runCode, activeFile, clearOutput } = useEditor()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMaximized, setIsMaximized] = useState(false)

  const handleRunCode = () => {
    if (activeFile && activeFile.content) {
      runCode(activeFile.content)
    }
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
    setIsExpanded(true)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Terminal
          </span>
          {isRunning && (
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              <span className="text-xs">Çalışıyor...</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRunCode}
            disabled={isRunning || !activeFile}
            className="p-1"
            title="Kodu Çalıştır"
          >
            {isRunning ? (
              <Square className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={clearOutput}
            className="p-1"
            title="Terminal Temizle"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleMaximize}
            className="p-1"
            title={isMaximized ? "Normal Boyut" : "Tam Ekran"}
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
            title={isExpanded ? "Terminal Gizle" : "Terminal Göster"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Output Content */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? (isMaximized ? '70vh' : '300px') : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className={`${isMaximized ? 'h-full' : 'h-72'} overflow-auto bg-gray-900 text-green-400 font-mono text-sm`}>
          {output ? (
            <pre className="p-4 whitespace-pre-wrap leading-relaxed">
              {output}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Kodu çalıştırmak için <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl+Enter</kbd> tuşlarını kullanın
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      {isExpanded && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Hızlı Komutlar:</span>
            <button
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              onClick={() => runCode('print("Merhaba Dünya!")')}
            >
              Hello World
            </button>
            <span className="text-gray-300">•</span>
            <button
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              onClick={() => runCode('import sys\nprint(sys.version)')}
            >
              Python Sürümü
            </button>
            <span className="text-gray-300">•</span>
            <button
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              onClick={() => runCode('import numpy as np\nprint(f"NumPy version: {np.__version__}")')}
            >
              NumPy Test
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OutputPanel
