"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface WaveformVisualizerProps {
  className?: string
}

export function WaveformVisualizer({ className }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Draw waveform
    const drawWaveform = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "hsl(var(--primary))"
      ctx.lineWidth = 2

      const width = canvas.width / dpr
      const height = canvas.height / dpr
      const segments = 50
      const segmentWidth = width / segments

      ctx.beginPath()
      ctx.moveTo(0, height / 2)

      for (let i = 0; i < segments; i++) {
        const x = i * segmentWidth
        const amplitude = Math.sin(i * 0.2) * 20
        const y = (height / 2) + amplitude
        ctx.lineTo(x, y)
      }

      ctx.stroke()
    }

    drawWaveform()

    // Animate waveform
    let animationFrame: number
    const animate = () => {
      drawWaveform()
      animationFrame = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("relative rounded-md overflow-hidden bg-muted/30", className)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </motion.div>
  )
}