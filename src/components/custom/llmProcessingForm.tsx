import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sparkles, Cloud, Bot, Zap } from "lucide-react"
const providers = [
    { name: "OpenAI", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Google Cloud", icon: <Cloud className="w-4 h-4" /> },
    { name: "Gemini", icon: <Bot className="w-4 h-4" /> },
]

const modelsByProvider = {
    OpenAI: ["GPT-4", "GPT-3.5", "o1", "o1-mini"],
    "Google Cloud": ["PaLM", "BERT", "T5"],
    Gemini: ["Gemini Pro", "Gemini Ultra"],
}
export default function LlmProcessingForm() {
    return (
        <form className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor de IA</label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                        {providers.map((provider) => (
                            <SelectItem key={provider.name} value={provider.name}>
                                <div className="flex items-center">
                                    <Image src="/groq-logo.webp" alt="" width={20} height={20} />
                                    <span className="ml-2">{provider.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Input
                placeholder="Ingresa tu API Key"
                type="password"
            />
            <div className="flex space-x-2">
                <Input placeholder="Ingresa una URL" />
                <Button >
                    <Zap className="w-4 h-4 mr-2" />
                    Procesar URL
                </Button>
            </div>

        </form>
    )
}