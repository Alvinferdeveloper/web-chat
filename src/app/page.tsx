import { Card, CardContent } from "@/components/ui/card"
import LlmProcessing from "@/app/components/llmProcessing"
import Header from "./components/header"

export default async function Home() {
  return (
    <div className="min-h-screen bg-dark p-8">
      <Header />
      <Card className="max-w-4xl mx-auto bg-inherit border-none ">
        <CardContent className="space-y-6">
          <LlmProcessing />
        </CardContent>
      </Card>
    </div>
  )
}

