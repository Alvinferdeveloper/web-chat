import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, CircleDollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
export default function ProfileDropDownMenu() {
    const router = useRouter();
    const handleLogout = async () => {
        await signOut();
    }
    const handlePricing = () => {
        router.push('/plans');
    }
    return (
        <DropdownMenuContent align="end" className="w-56 bg-gray-900 text-gray-100 border-gray-800">
            <DropdownMenuItem
                onClick={handleLogout}
                className="flex cursor-pointer items-center py-3  data-[highlighted]:hover:bg-gray-800 data-[highlighted]:hover:text-white"
            >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={handlePricing}
                className="flex cursor-pointer items-center py-3  data-[highlighted]:hover:bg-gray-800 data-[highlighted]:hover:text-white"
            >
                <CircleDollarSign className="mr-3 h-4 w-4" />
                <span>Pricing</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    )
}