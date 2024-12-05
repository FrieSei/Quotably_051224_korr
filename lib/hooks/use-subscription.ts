"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface Subscription {
  id: string
  status: "active" | "canceled" | "past_due"
  plan: {
    id: string
    name: string
    price: number
  }
  currentPeriodEnd: string
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const { toast } = useToast()

  const createCheckoutSession = async () => {
    try {
      const response = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      })
    }
  }

  const createPortalSession = async () => {
    try {
      const response = await fetch("/api/subscriptions/create-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive",
      })
    }
  }

  return {
    subscription,
    createCheckoutSession,
    createPortalSession,
  }
}