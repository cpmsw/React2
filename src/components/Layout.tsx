import React, { ReactNode } from 'react';
import Sidebar1 from './sidebar1'; // Adjust path if needed

interface LayoutProps {
    children: ReactNode;
    onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
    return (
        <div className="flex h-screen">
            <Sidebar1 onLogout={onLogout} />
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;