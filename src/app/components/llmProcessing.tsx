import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Zap } from "lucide-react"
import CredentialsForm from "./credentialsForm"

type provider = {
    id: string,
    name: string,
    iconSrc: string
}

interface Props {
    providers: provider[]
}
export default function LlmProcessing({ providers }: Props) { 
    return (
        <>
        <CredentialsForm providers={providers}/>
        </>
    )
}