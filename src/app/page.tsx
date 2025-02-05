import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LlmProcessing from "@/app/components/llmProcessing"
export default async function Home() {
  const res = await fetch('http://localhost:3000/api/providers');
  const providers = await res.json();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-800 p-8">
      <Card className="max-w-4xl mx-auto bg-inherit border-none ">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-slate-100">Interfaz de Modelo de IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LlmProcessing
            providers={providers}
          />
        </CardContent>
      </Card>
    </div>
  )
}

