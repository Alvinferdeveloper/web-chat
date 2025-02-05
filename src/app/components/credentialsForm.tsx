"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Zap, Loader2, ChevronDown } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


type provider = {
  id: string,
  name: string,
  iconSrc: string
}

interface Props {
  providers: provider[],
  getWebSummary: (provider: string, apiKey: string) => void,
  error: string,
  isProcessing: boolean,
  answer: string,
  setProvider: Dispatch<SetStateAction<string>>
  provider: string,
  setApiKey: Dispatch<SetStateAction<string>>,
  apiKey: string
}

export default function CredentialsForm({ providers, getWebSummary, error, isProcessing, answer, setApiKey, setProvider, apiKey, provider }: Props) {
  const handleClick = () => {
    getWebSummary(provider, apiKey)
  }
  return (
    <form className="grid grid-cols-1 md:grid-cols-1 gap-4 bg-white rounded-md">
      <Accordion type="single" collapsible className="border-b border-gray-700">
        <AccordionItem value="model-settings" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-xl font-semibold w-full text-black hover:text-slate-700 flex justify-between items-center">
            <span>Credenciales</span>
            <ChevronDown className="h-5 w-5" />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor de IA</label>
              <Select name="provider" value={provider} onValueChange={(value) => setProvider(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center">
                        <Image src={provider.iconSrc} width={20} height={20} alt="provider icon" />
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
              name="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className="flex space-x-2">
              <Input placeholder="Ingresa una URL" name="url" />
              <Button onClick={handleClick} type="button">
                {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                {isProcessing ? "Procesando..." : "Procesar URL"}
              </Button>
            </div>
            <AnimatePresence>
              {error && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <div className="text-lg mb-2 bg-blue-700 p-2 rounded-sm text-white">Resumen de la web</div>
            {answer}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </form>
  )
}