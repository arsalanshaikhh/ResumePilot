export interface Resume {
  id: string
  fileName: string
  fileType: 'pdf' | 'docx' | 'txt'
  fileSize: number
  uploadedAt: Date
  textContent: string
  metadata: ResumeMetadata
}

export interface ResumeMetadata {
  pageCount?: number
  wordCount: number
  characterCount: number
  sections: string[]
  contactInfo: ContactInfo
}

export interface ContactInfo {
  email?: string
  phone?: string
  linkedIn?: string
  location?: string
}

export interface ResumeSection {
  title: string
  content: string
  startIndex: number
  endIndex: number
}
