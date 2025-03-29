"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useSession } from "next-auth/react";
import { User2 } from "lucide-react";
import { orbitron } from "../font";
import CustomDropdownMenu from "./customDropDownMenu";

export default function Header() {
    const { data: session } = useSession();
    return (
        <header className="w-full h-10 left-0 fixed flex justify-between px-7 y- items-center">
            <p className={`${orbitron.className} text-2xl text-white`}>Mi logo </p>
            <CustomDropdownMenu trigger={
                <Avatar className="cursor-pointer hover:opacity-80">
                    { session?.user?.image && <AvatarImage src={session?.user?.image} />}
                    <AvatarFallback className="bg-gray-200">
                        <User2 className="h-5 w-5 text-gray-600" />
                    </AvatarFallback>
                </Avatar>
            } />
        </header>
    )
}