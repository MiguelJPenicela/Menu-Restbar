
import React from 'react';
import { PhotoView } from 'react-photo-view';
import type { MenuItem } from '../types';
import { PencilIcon, TrashIcon, WhatsAppIcon, SparklesIcon, SpinnerIcon } from './icons';

interface MenuItemCardProps {
    item: MenuItem;
    isAdmin: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onGenerateImage: () => void;
    isGenerating: boolean;
    whatsappNumber: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, isAdmin, onEdit, onDelete, onGenerateImage, isGenerating, whatsappNumber }) => {
    const whatsappMessage = encodeURIComponent(`Olá, gostaria de pedir um(a) ${item.name}.`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 duration-300">
             <PhotoView src={item.image}>
                <img className="w-full h-48 object-cover cursor-pointer" src={item.image} alt={item.name} />
            </PhotoView>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-amber-300">{item.name}</h3>
                {item.description && <p className="text-gray-400 mt-1 text-sm flex-grow">{item.description}</p>}
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">{item.price.toFixed(2)} MZN</span>
                    {!isAdmin && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
                        >
                           <WhatsAppIcon />
                           <span>Pedir</span>
                        </a>
                    )}
                </div>
            </div>
            {isAdmin && (
                <div className="bg-gray-700 p-2 flex justify-end space-x-2">
                    <button 
                        onClick={onGenerateImage} 
                        className="p-2 text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                        aria-label="Gerar Imagem com IA"
                        disabled={isGenerating}
                    >
                        {isGenerating ? <SpinnerIcon /> : <SparklesIcon />}
                    </button>
                    <button onClick={onEdit} className="p-2 text-blue-400 hover:text-blue-300" aria-label="Editar item">
                        <PencilIcon />
                    </button>
                    <button onClick={onDelete} className="p-2 text-red-400 hover:text-red-300" aria-label="Excluir item">
                        <TrashIcon />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuItemCard;