"use client"

import { Library } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LibraryLink() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/50 transition-all duration-200">
      <div className="w-full max-w-md mx-auto">
        <Link href="/library" className="block">
          <Button
            variant="outline"
            className="w-full min-h-[44px] hover:bg-primary/5 transition-colors gap-2 font-medium"
          >
            <Library className="h-5 w-5" />
            View Library
          </Button>
        </Link>
      </div>
    </div>
  )
}