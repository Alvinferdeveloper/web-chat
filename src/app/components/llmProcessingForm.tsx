import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Zap } from "lucide-react"

type provider = {
    id: string,
    name: string,
    iconSrc: string
}

interface Props {
    providers: provider[]
}
export default function LlmProcessingForm({ providers }: Props) {
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
                        <Image src={provider.iconSrc} width={24} height={24} alt="provider icon" />
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