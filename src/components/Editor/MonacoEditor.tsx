import { useRef, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { useTheme } from '@/contexts/ThemeContext'

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
  language?: string
  fileName?: string
}

const MonacoEditor = ({ 
  value, 
  onChange, 
  onSave,
  language = 'python',
  fileName 
}: MonacoEditorProps) => {
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)

  // Check if file is an image
  const isImage = fileName && /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(fileName)
  
  // For image files, convert content to base64 data URL if needed
  const getImageSrc = () => {
    if (!isImage || !value) return ''
    
    // If content is already a data URL, use it
    if (value.startsWith('data:')) {
      return value
    }
    
    // If content looks like base64, convert it
    try {
      const extension = fileName!.split('.').pop()?.toLowerCase()
      const mimeType = extension === 'svg' ? 'image/svg+xml' : `image/${extension}`
      return `data:${mimeType};base64,${value}`
    } catch {
      return ''
    }
  }

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Add save keybinding
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.()
    })

    // Python specific configuration
    monaco.languages.setMonarchTokensProvider('python', {
      tokenizer: {
        root: [
          [/\b(def|class|if|elif|else|for|while|try|except|finally|with|import|from|as|return|yield|break|continue|pass|global|nonlocal|lambda|and|or|not|in|is|True|False|None)\b/, 'keyword'],
          [/\b(int|float|str|list|dict|tuple|set|bool|bytes|object)\b/, 'type'],
          [/\b\d+\b/, 'number'],
          [/["'].*?["']/, 'string'],
          [/#.*$/, 'comment'],
          [/\b[A-Z_][A-Z0-9_]*\b/, 'constant'],
          [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, 'identifier'],
        ]
      }
    })

    // Set editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Menlo, Monaco, monospace',
      lineNumbers: 'on',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        indentation: true,
        bracketPairs: true
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showFunctions: true,
        showVariables: true,
        showClasses: true,
        showModules: true
      }
    })

    // Add Python snippets
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if ${1:condition}:\n    ${2:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If statement'
          },
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop'
          },
          {
            label: 'def',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'def ${1:function_name}(${2:parameters}):\n    ${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Function definition'
          },
          {
            label: 'class',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'class ${1:ClassName}:\n    def __init__(self${2:, args}):\n        ${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Class definition'
          }
        ]
        return { suggestions }
      }
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  // Render image viewer for image files
  if (isImage) {
    const imageSrc = getImageSrc()
    return (
      <div className="h-full w-full flex items-center justify-center bg-white dark:bg-gray-900 p-4">
        <div className="text-center">
          {imageSrc ? (
            <div className="max-w-full max-h-full overflow-auto">
              <img 
                src={imageSrc} 
                alt={fileName}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                onError={() => {
                  console.error('Failed to load image:', fileName)
                }}
              />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                📷 {fileName}
              </p>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🖼️</div>
              <p>Görsel yüklenemedi</p>
              <p className="text-sm mt-2">{fileName}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8
          }
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      />
    </div>
  )
}

export default MonacoEditor
