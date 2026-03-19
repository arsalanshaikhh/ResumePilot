import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface ParseResult {
  success: boolean
  text?: string
  error?: string
  metadata?: {
    pageCount?: number
    wordCount: number
    characterCount: number
  }
}

export class FileParserService {
  static async parseFile(file: File): Promise<ParseResult> {
    const fileType = this.getFileType(file.name)

    switch (fileType) {
      case 'pdf':
        return this.parsePDF(file)
      case 'docx':
        return this.parseDOCX(file)
      case 'txt':
        return this.parseTXT(file)
      default:
        return {
          success: false,
          error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.',
        }
    }
  }

  private static getFileType(fileName: string): 'pdf' | 'docx' | 'txt' | null {
    const extension = fileName.toLowerCase().split('.').pop()
    switch (extension) {
      case 'pdf':
        return 'pdf'
      case 'docx':
        return 'docx'
      case 'txt':
        return 'txt'
      default:
        return null
    }
  }

  private static async parsePDF(file: File): Promise<ParseResult> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ''
      const pageCount = pdf.numPages

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item) => (item as { str: string }).str)
          .join(' ')
        fullText += pageText + '\n'
      }

      const wordCount = fullText.split(/\s+/).filter((word) => word.length > 0).length
      const characterCount = fullText.length

      return {
        success: true,
        text: fullText.trim(),
        metadata: {
          pageCount,
          wordCount,
          characterCount,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  private static async parseDOCX(file: File): Promise<ParseResult> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })

      const text = result.value
      const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
      const characterCount = text.length

      return {
        success: true,
        text: text.trim(),
        metadata: {
          wordCount,
          characterCount,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  private static async parseTXT(file: File): Promise<ParseResult> {
    try {
      const text = await file.text()
      const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
      const characterCount = text.length

      return {
        success: true,
        text: text.trim(),
        metadata: {
          wordCount,
          characterCount,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse TXT: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ]

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit',
      }
    }

    if (!allowedTypes.includes(file.type) && !this.getFileType(file.name)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload PDF, DOCX, or TXT files.',
      }
    }

    return { valid: true }
  }
}
