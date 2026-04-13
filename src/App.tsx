import { Toaster } from "sonner"
import { InfluencerRegisterForm } from "@/modules/influencers/components/influencer-register-form"

export function App() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex w-full flex-col gap-4">
        <div className="mb-6">
          <h1 className="text-2xl font-medium">Registro de Influencers</h1>
          <p className="text-muted-foreground">
            Crowdposting - Gestión de influencers
          </p>
        </div>
        <InfluencerRegisterForm />
        <Toaster position="top-right" />
      </div>
    </div>
  )
}

export default App
