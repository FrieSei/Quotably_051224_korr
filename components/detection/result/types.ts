export interface ResultCardProps {
  title: string
  episode?: string
  timestamp: string
  onDismiss: () => void
  onTimeAdjust: (seconds: number) => void
  onShare?: () => void
}

export interface TimeControlsProps {
  onTimeAdjust: (seconds: number) => void
}

export interface HeaderProps {
  title: string
  timestamp: string
  onDismiss: () => void
}

export interface ContentProps {
  episode?: string
  onTimeAdjust: (seconds: number) => void
  onShare?: () => void
}