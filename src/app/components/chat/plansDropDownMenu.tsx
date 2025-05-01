"use client"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const models = [
    {
        id: "webChatPlus",
        name: "Web Chat Plus",
        description: "Our best tool and more",
        isPremium: true,
        isSelected: true,
    },
    {
        id: "webChat",
        name: "Web Chat",
        description: "Great for easy task",
        isPremium: false,
        isSelected: false,
    },
]

export default function PlansDropDownMenu() {
    return (
        <DropdownMenuContent align="start" className="w-[280px] rounded-xl  bg-gray-900 text-gray-100 border-gray-800 p-0">
            <div className="flex flex-col space-y-1 p-1">
                {models.map((model) => (
                    <DropdownMenuItem
                        key={model.id}
                        className={cn(
                            "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2  data-[highlighted]:hover:bg-gray-800 data-[highlighted]:hover:text-white",
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {model.isPremium ? <Sparkles className="h-5 w-5 text-yellow-400" /> : <div className="h-5 w-5" />}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">{model.name}</span>
                                <span className="text-xs text-zinc-400">{model.description}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {model.isPremium && !model.isSelected && (
                                <Button size="sm" variant="secondary" className="mr-2 h-7 rounded-md px-2 text-xs">
                                    Upgrade
                                </Button>
                            )}
                            {model.isSelected && <Check className="h-5 w-5 text-green-500" />}
                        </div>
                    </DropdownMenuItem>
                ))}
            </div>
        </DropdownMenuContent>
    )
}