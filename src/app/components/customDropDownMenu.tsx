"use client"
import { DropdownMenuTrigger, DropdownMenu } from "@/components/ui/dropdown-menu";

interface DropdownMenuProps {
  trigger: React.ReactNode,
  children: React.ReactNode
}

export default function CustomDropdownMenu({ trigger, children }: DropdownMenuProps) {
  return (
    <div className="w-full max-w-md p-6">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {trigger}
          </DropdownMenuTrigger>
          {children}
        </DropdownMenu>
      </div>
    </div>
  )
}

