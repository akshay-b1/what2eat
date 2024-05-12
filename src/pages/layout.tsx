import { Toaster } from "@/components/ui/toaster"

interface LayoutProps {
    children: React.ReactNode;    
}

const Layout = ({ children }: LayoutProps) => {

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex flex-col w-full">
                {children}
            </main>
            <Toaster />
        </div>
    );
}

export default Layout;