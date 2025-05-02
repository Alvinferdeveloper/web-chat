import { Layers, Sparkles, CalendarCheck } from "lucide-react"

export default function getPlanIcon(planType: string) {
  switch (planType) {
    case "FREE":
      return <Layers className="h-5 w-5 text-blue-400" />
    case "Basico":
      return <Sparkles className="h-5 w-5 text-yellow-400" />
    case "Anual":
      return <CalendarCheck className="h-5 w-5 text-green-400" />
    default:
      return <div className="h-5 w-5" />
  }
}
