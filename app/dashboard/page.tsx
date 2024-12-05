import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { HighlightsList } from "@/components/highlights-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Highlights"
        text="Create and manage your audio highlights."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Highlight
        </Button>
      </DashboardHeader>
      <div className="grid gap-8">
        <HighlightsList />
      </div>
    </DashboardShell>
  )
}