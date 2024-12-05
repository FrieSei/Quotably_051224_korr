export interface QuestionContext {
  audioTimestamp: number
  transcriptSegment: string
  metadata: PodcastMetadata
  previousQA?: QAInteraction[]
}

export interface QAInteraction {
  id: string
  question: string
  response: {
    text: string
    audioUrl?: string
  }
  timestamp: number
  context: QuestionContext
}