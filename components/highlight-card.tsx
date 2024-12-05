import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Highlight } from '@/lib/types'

interface HighlightCardProps {
  highlight: Highlight
}

export function HighlightCard({ highlight }: HighlightCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {new Date(highlight.timestamp).toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{highlight.content}</p>
        {highlight.notes && (
          <p className="text-muted-foreground mt-2">{highlight.notes}</p>
        )}
      </CardContent>
    </Card>
  )
}