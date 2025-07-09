import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { X } from "lucide-react"

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-dark  backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl mx-auto">
                {/* Close button */}
                <button className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-96 mx-auto mb-4 bg-slate-700" />
                    <Skeleton className="h-6 w-80 mx-auto bg-slate-700" />
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Basic Plan Card */}
                    <Card className="relative bg-slate-800 border-slate-700 overflow-hidden">
                        {/* Popular badge skeleton */}
                        <div className="absolute top-4 right-4">
                            <Skeleton className="h-6 w-16 rounded-full bg-slate-600" />
                        </div>

                        <CardHeader className="pb-4">
                            <Skeleton className="h-6 w-20 mb-2 bg-slate-600" />
                            <Skeleton className="h-4 w-48 mb-6 bg-slate-600" />

                            {/* Price skeleton */}
                            <div className="flex items-baseline gap-1">
                                <Skeleton className="h-12 w-16 bg-slate-600" />
                                <Skeleton className="h-6 w-12 bg-slate-600" />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Features list skeleton */}
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-4 rounded-sm bg-slate-600" />
                                    <Skeleton className="h-4 flex-1 bg-slate-600" />
                                </div>
                            ))}

                            {/* Button skeleton */}
                            <div className="pt-6">
                                <Skeleton className="h-12 w-full rounded-md bg-slate-600" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Annual Plan Card */}
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-4">
                            <Skeleton className="h-6 w-16 mb-2 bg-slate-600" />
                            <Skeleton className="h-4 w-52 mb-6 bg-slate-600" />

                            {/* Price skeleton */}
                            <div className="flex items-baseline gap-1">
                                <Skeleton className="h-12 w-20 bg-slate-600" />
                                <Skeleton className="h-6 w-10 bg-slate-600" />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Features list skeleton */}
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-4 rounded-sm bg-slate-600" />
                                    <Skeleton className="h-4 flex-1 bg-slate-600" />
                                </div>
                            ))}

                            {/* Button skeleton */}
                            <div className="pt-6">
                                <Skeleton className="h-12 w-full rounded-md bg-slate-600" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Free Plan Card */}
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="pb-4">
                            <Skeleton className="h-6 w-12 mb-2 bg-slate-600" />
                            <Skeleton className="h-4 w-32 mb-6 bg-slate-600" />

                            {/* Price skeleton */}
                            <div className="flex items-baseline gap-1">
                                <Skeleton className="h-12 w-12 bg-slate-600" />
                                <Skeleton className="h-6 w-12 bg-slate-600" />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Features list skeleton - fewer items for free plan */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-4 rounded-sm bg-slate-600" />
                                    <Skeleton className="h-4 flex-1 bg-slate-600" />
                                </div>
                            ))}

                            {/* Empty space to match other cards height */}
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-6" />
                                ))}
                            </div>

                            {/* Button skeleton */}
                            <div className="pt-6">
                                <Skeleton className="h-12 w-full rounded-md bg-slate-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
