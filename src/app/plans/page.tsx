import PricingHeader from "./pricingHeader"
import PricingCards from "./pricingCards"

export default function PricingPage() {
    return (
        <div className="container max-w-7xl mx-auto h-screen">
            <PricingHeader />
            <PricingCards />
        </div>
    )
}

