export interface Level {
  levelId: string
  name: string
  imageUrl?: string
}

export interface Topic {
  topicId: string
  name: string
  imageUrl?: string
}

export interface Section {
  ordinalNumber: number
  name: string
  sectionType: "PDF" | "video" | "text"
  content: string | null
  url: string | null
  fileName?: string | null
  file?: File | null
  isNewFile?: boolean // Đánh dấu file mới cần upload
  uploadProgress?: number // Theo dõi tiến trình upload
}

export interface Lecture {
  lectureId: string
  levelId: string
  topicId: string
  name: string
  ordinalNumber: number
  description: string
  sections: Section[]
}

export interface UploadedImage {
  id: string
  file: File
  url: string
  isNew: boolean
}

export interface PresignedUrlResponse {
  presignedUrl: string
  fileUrl: string
}
