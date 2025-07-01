"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useSession } from "next-auth/react";
import { User2 } from "lucide-react";
import { orbitron } from "../../font";
import CustomDropdownMenu from "../customDropDownMenu";
import ProfileDropDownMenu from "../chat/profileDropDownMenu";
import PlansDropDownMenu from "../chat/plansDropDownMenu";

export default function Header() {
    const { data: session } = useSession();
    return (
        <header className="w-full h-10 left-0 fixed flex justify-between px-7 pt-6 items-center z-30">
            <CustomDropdownMenu trigger={<div className={`${orbitron.className} text-2xl text-white cursor-pointer hover:opacity-80`}>Mi logo </div>}>
                <PlansDropDownMenu />
            </CustomDropdownMenu>
            <CustomDropdownMenu trigger={
                <Avatar className="cursor-pointer hover:opacity-80">
                    {session?.user?.image && <AvatarImage src={session?.user?.image} />}
                    <AvatarFallback className="bg-gray-200">
                        <User2 className="h-5 w-5 text-gray-600" />
                    </AvatarFallback>
                </Avatar>
            }>
                <ProfileDropDownMenu />
            </CustomDropdownMenu>
        </header>
    )
}