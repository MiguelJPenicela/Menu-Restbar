
import React from 'react';

interface HeaderProps {
    isAdminMode: boolean;
    setIsAdminMode: (isAdmin: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isAdminMode, setIsAdminMode }) => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                <h1 className="text-xl font-bold text-amber-400">
                    <a href="#">Restbar</a>
                </h1>
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-300">Modo Admin</span>
                    <label htmlFor="admin-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="admin-toggle"
                            className="sr-only peer"
                            checked={isAdminMode}
                            onChange={() => setIsAdminMode(!isAdminMode)}
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>
            </div>
        </header>
    );
};

export default Header;
