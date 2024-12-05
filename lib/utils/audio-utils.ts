"use client"

import { debounce } from './debounce'

export class AudioProcessor {
  private context: AudioContext | null = null
  private analyzer: AnalyserNode | null = null
  private source: MediaStreamAudioSourceNode | null = null
  private stream: MediaStream | null = null

  async initialize() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.context = new AudioContext()
      this.analyzer = this.context.createAnalyser()
      this.source = this.context.createMediaStreamSource(this.stream)
      this.source.connect(this.analyzer)
      
      // Optimize for voice detection
      this.analyzer.fftSize = 2048
      this.analyzer.smoothingTimeConstant = 0.8
      
      return true
    } catch (error) {
      console.error('Audio initialization failed:', error)
      return false
    }
  }

  getAudioLevel(): number {
    if (!this.analyzer) return 0
    
    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount)
    this.analyzer.getByteFrequencyData(dataArray)
    
    // Focus on voice frequency range (85-255 Hz)
    const voiceRange = dataArray.slice(2, 6)
    return voiceRange.reduce((a, b) => a + b, 0) / voiceRange.length
  }

  cleanup() {
    this.stream?.getTracks().forEach(track => track.stop())
    this.context?.close()
    this.source?.disconnect()
    this.analyzer?.disconnect()
    
    this.stream = null
    this.context = null
    this.source = null
    this.analyzer = null
  }
}

export const createAudioProcessor = () => new AudioProcessor()