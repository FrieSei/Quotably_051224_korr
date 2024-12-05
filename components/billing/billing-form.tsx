"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"

export function BillingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onSubmit() {
    setIsLoading(true)

    try {
      // Stripe integration will go here
      toast({
        title: "Success",
        description: "Your subscription has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Subscription Plans</h2>
        <p className="text-muted-foreground">Choose the plan that works for you</p>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Free Plan</h3>
            <p className="text-sm text-muted-foreground">Basic features included</p>
          </div>
          <Button variant="outline" disabled>Current Plan</Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Pro Plan</h3>
            <p className="text-sm text-muted-foreground">Advanced features and support</p>
          </div>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upgrade
          </Button>
        </div>
      </div>
    </Card>
  )
}