import type { ReactNode } from 'react';
import SidebarLayout from './SidebarLayout';


interface MainLayoutProps {
    children: ReactNode;
    title: string;
}

/**
 * Main application layout
 */
const MainLayout = ({ children, title }: MainLayoutProps) => {
    return (
        <SidebarLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h1>
                {children}
            </div>
        </SidebarLayout>
    );
};

export default MainLayout;