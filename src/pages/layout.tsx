import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

interface LayoutProps {
    children: React.ReactNode;    
}

const Layout = ({ children }: LayoutProps) => {

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex flex-col w-full">
                {children}
                <Analytics />
            </main>
            <Toaster />
        </div>
    );
}

export default Layout;