"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useSubscription } from "@/lib/hooks/use-subscription"

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { subscription, createCheckoutSession, createPortalSession } = useSubscription()
  const { toast } = useToast()

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      await createCheckoutSession()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start subscription process",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      await createPortalSession()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription portal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage your subscription and billing information."
      />
      <div className="grid gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {subscription ? "Current Plan" : "Choose a Plan"}
          </h3>
          {subscription ? (
            <div className="space-y-4">
              <p>
                You are currently on the{" "}
                <strong>{subscription.plan.name}</strong> plan.
              </p>
              <Button onClick={handleManageSubscription} disabled={isLoading}>
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-6">
                  <h4 className="text-lg font-bold mb-2">Basic</h4>
                  <p className="text-2xl font-bold mb-4">$9/month</p>
                  <ul className="space-y-2 mb-6">
                    <li>✓ 100 highlights per month</li>
                    <li>✓ Basic metadata detection</li>
                    <li>✓ 7-day history</li>
                  </ul>
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Subscribe
                  </Button>
                </Card>
                <Card className="p-6 border-primary">
                  <h4 className="text-lg font-bold mb-2">Pro</h4>
                  <p className="text-2xl font-bold mb-4">$19/month</p>
                  <ul className="space-y-2 mb-6">
                    <li>✓ Unlimited highlights</li>
                    <li>✓ Advanced metadata detection</li>
                    <li>✓ 30-day history</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Subscribe
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  )
}