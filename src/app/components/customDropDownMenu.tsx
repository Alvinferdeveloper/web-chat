"use client"
import { DropdownMenuTrigger, DropdownMenu } from "@/components/ui/dropdown-menu";

interface DropdownMenuProps {
  trigger: React.ReactNode,
  children: React.ReactNode
}

export default function CustomDropdownMenu({ trigger, children }: DropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  )
}

