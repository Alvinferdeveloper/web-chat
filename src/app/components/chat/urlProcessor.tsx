"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Zap, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface Props {
  getWebSummary: (url: string) => void,
  error: string,
  isProcessing: boolean,
  summary: string,
}

export default function UrlProcessor({ getWebSummary, summary, error, isProcessing }: Props) {
  const handleClick = () => {
    getWebSummary(url);
  }

  const [isOpen, setIsOpen] = useState(true)
  const [url, setUrl] = useState("")

  return (
    <div className="flex sticky top-0 z-20">
      <Card className="w-full max-w-5xl bg-[#111827]/80 border-[#2d3748] backdrop-blur-sm">
        <CardHeader className="border-b border-[#2d3748] pb-3">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <CardTitle className="text-white text-xl">Credenciales</CardTitle>
            {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </div>
        </CardHeader>
        {isOpen && (
          <CardContent className="pt-4 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Ingresa una URL"
                  className="bg-[#1a2035] border-[#2d3748] text-white placeholder:text-gray-400 pr-10 h-11 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-[#0a0e1a]"
                />
              </div>
              <Button className="bg-[#111827] hover:bg-[#1a2035] text-white border border-[#2d3748] h-11 px-4 transition-all duration-200 hover:border-[#3b82f6]" onClick={handleClick}>
                <Zap className="mr-2 h-4 w-4" />
                {
                  !isProcessing ? 'Procesar URL' : 'Procesando...'
                }
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
            <div className="bg-[#3b82f6] text-white p-4 rounded-md">
              <h3 className="font-medium mb-2">Resumen de la web</h3>
              <p className="text-sm text-white/80">
                {
                  summary ? summary : 'El contenido del resumen aparecerá aquí después de procesar la URL.'
                }
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}