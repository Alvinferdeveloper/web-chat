"use client"
import { LogOut, CircleDollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DropdownMenuProps {
  trigger: React.ReactNode
}

export default function CustomDropdownMenu({ trigger }: DropdownMenuProps) {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
  }
  const handlePricing = ()=>{
    router.push('/plans')
  }

  return (
    <div className="w-full max-w-md p-6">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {trigger}
          </DropdownMenuTrigger>
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
        </DropdownMenu>
      </div>
    </div>
  )
}

