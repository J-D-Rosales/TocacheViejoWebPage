export type Page = 'home' | 'about' | 'contact' | 'admin'

export type MediaType = 'image' | 'video'

export type ApiMediaType = 'PHOTO' | 'VIDEO'

export interface GalleryItem {
  id: number | string
  year: number
  title: string
  category: string
  date: string
  desc: string
  img: string
  mediaType?: MediaType
  mediaUrl?: string
}

export interface GalleryMediaItem {
  id: string | number
  url: string
  type: MediaType
}

export interface Milestone {
  year: string
  title: string
  desc: string
}

export interface FaqItem {
  id: string
  q: string
  a: string
}

export type GradeLevel = 'inicial' | 'primaria' | 'secundaria'

export interface ContactFormData {
  fullName: string
  email: string
  phone: string
  gradeLevel: GradeLevel | ''
  studentName: string
  message: string
}

export interface CognitoConfig {
  region: string
  userPoolId: string
  userPoolClientId: string
  cognitoDomain: string
  redirectUri: string
  responseType: string
  scope: string
}

export interface AuthUser {
  email: string
  name?: string
  accessToken?: string
  idToken?: string
  isAuthenticated: boolean
}

// ─── API Models (per README API spec) ────────────────────────────────────────

export interface EventMediaItem {
  id?: string
  eventId?: string
  s3Key: string
  type: ApiMediaType
  title?: string
  url?: string
}

export interface SchoolEvent {
  id: string
  name: string
  description?: string
  year: number
  eventDate?: string
  createdAt?: string
  media?: EventMediaItem[]
}

export interface SchoolAward {
  id: string
  name: string
  description?: string
  year: number
  place?: string
  createdAt?: string
}

export interface UploadTarget {
  s3Key: string
  uploadUrl: string
  fileName: string
}

export interface MediaUploadFile {
  fileName: string
  fileType: string
}

export interface EventMediaItemInput {
  s3Key: string
  type: ApiMediaType
  title?: string
}

export interface CreateEventPayload {
  id?: string
  name: string
  description?: string
  year: number
  eventDate?: string
  mediaItems: EventMediaItemInput[]
}

export interface CreateAwardPayload {
  name: string
  description?: string
  year: number
  place?: string
}
