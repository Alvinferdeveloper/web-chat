"use client"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
export default function PricingHeader() {
    const router = useRouter()
    const handleCloseWindow = () => {
        router.back();
    }
    return (
        <div className="text-center mt h-[20%] mb-4 flex justify-center flex-col">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">Planes simples y transparentes</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto relative top-0 right-0">
                Elija el plan perfecto para su negocio. Al crear tu cuenta obtienes el plan gratuito.
            </p>
            <X className="absolute top-8 right-8 cursor-pointer text-muted-foreground hover:text-white" onClick={handleCloseWindow} />
        </div>
    )
}

