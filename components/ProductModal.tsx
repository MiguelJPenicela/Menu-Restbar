
import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../types';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: MenuItem) => void;
    itemToEdit: MenuItem | null;
    categories: string[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, itemToEdit, categories }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        if (itemToEdit) {
            setName(itemToEdit.name);
            setPrice(itemToEdit.price);
            setDescription(itemToEdit.description || '');
            setCategory(itemToEdit.category);
            setImage(itemToEdit.image);
        } else {
            setName('');
            setPrice(0);
            setDescription('');
            setCategory(categories.length > 0 ? categories[0] : '');
            setImage('');
        }
    }, [itemToEdit, isOpen, categories]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: itemToEdit?.id || '', // ID is handled in App.tsx for new items
            name,
            price,
            description,
            category,
            image: image || `https://source.unsplash.com/400x300/?${encodeURIComponent(name)},food,drink`,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-amber-400">{itemToEdit ? 'Editar Item' : 'Adicionar Novo Item'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome do Prato</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500" />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">Preço (MZN)</label>
                        <input type="number" id="price" value={price} onChange={e => setPrice(Number(e.target.value))} required min="0" step="0.01" className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descrição</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"></textarea>
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Categoria</label>
                        <input list="category-list" id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500" />
                        <datalist id="category-list">
                            {categories.map(cat => <option key={cat} value={cat} />)}
                        </datalist>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-300">Imagem</label>
                        <input type="file" id="image" onChange={handleImageChange} accept="image/*" className="w-full mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"/>
                        {image && <img src={image} alt="Preview" className="mt-2 rounded-md w-32 h-32 object-cover"/>}
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-md font-medium">Cancelar</button>
                        <button type="submit" className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
