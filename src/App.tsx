import { Toaster } from "sonner"
import { InfluencersTable } from "@/modules/influencers/components/influencers-table"

export function App() {
  return (
    <div className="flex min-h-svh bg-background p-6">
      <div className="flex w-full flex-col gap-4">
        <InfluencersTable />
        <Toaster position="top-right" />
      </div>
    </div>
  )
}

export default App