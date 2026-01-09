
import React, { useState, useMemo } from 'react';
import { PhotoProvider } from 'react-photo-view';
import { initialMenuData } from './data/initialData';
import type { MenuItem } from './types';
import Header from './components/Header';
import MenuItemCard from './components/MenuItemCard';
import ProductModal from './components/ProductModal';
import CategoryFilter from './components/CategoryFilter';
import { PlusIcon, SearchIcon } from './components/icons';
import { generateImageFromPrompt } from './lib/gemini';

const WHATSAPP_NUMBER = "258840000000"; // Substitua pelo número de WhatsApp do restaurante

const App: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuData);
    const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [generatingImages, setGeneratingImages] = useState<Record<string, boolean>>({});

    const categoryOrder = [
        "Entradas",
        "Pratos Principais",
        "Petiscos",
        "Saladas",
        "Extras",
        "Bebidas",
        "Vinhos",
        "Cocktails",
        "Caipirinhas",
        "Mojitos",
        "Shooters",
        "Destilados e Licores",
    ];

    const menuItemsByCategory = useMemo(() => {
        return menuItems.reduce((acc, item) => {
            const category = item.category || 'Outros';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, MenuItem[]>);
    }, [menuItems]);
    
    const allCategories = useMemo(() => {
        const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
        return categoryOrder.filter(cat => uniqueCategories.includes(cat));
    }, [menuItems]);

    const handleOpenModal = (item: MenuItem | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = (item: MenuItem) => {
        if (editingItem) {
            // Update
            setMenuItems(menuItems.map(i => i.id === item.id ? item : i));
        } else {
            // Add new
            setMenuItems([...menuItems, { ...item, id: crypto.randomUUID() }]);
        }
        handleCloseModal();
    };

    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            setMenuItems(menuItems.filter(i => i.id !== itemId));
        }
    };

    const handleCategoryToggle = (category: string) => {
        if (category === 'all') {
            setSelectedCategories([]);
            return;
        }
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleGenerateImage = async (itemToUpdate: MenuItem) => {
        setGeneratingImages(prev => ({ ...prev, [itemToUpdate.id]: true }));
        try {
          const prompt = `Fotografia de alta qualidade de um prato de restaurante: "${itemToUpdate.name}". ${itemToUpdate.description || ''}. Foco na comida, aparência deliciosa, em um ambiente de restaurante.`;
          const base64Data = await generateImageFromPrompt(prompt);
          const imageUrl = `data:image/png;base64,${base64Data}`;
    
          setMenuItems(prevItems =>
            prevItems.map(item =>
              item.id === itemToUpdate.id ? { ...item, image: imageUrl } : item
            )
          );
        } catch (error) {
          console.error('Erro ao gerar imagem:', error);
          alert('Falha ao gerar a imagem. Verifique o console para mais detalhes.');
        } finally {
          setGeneratingImages(prev => ({ ...prev, [itemToUpdate.id]: false }));
        }
      };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Header isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-amber-400">Nosso Cardápio</h1>
                    <p className="text-lg text-gray-300 mt-2">Sabores autênticos para todos os momentos.</p>
                </div>
                
                <div className="mb-8 max-w-lg mx-auto">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar no cardápio..."
                            className="w-full bg-gray-800 border border-gray-600 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <CategoryFilter
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                />
                <PhotoProvider>
                    <div className="space-y-12">
                        {categoryOrder.map(category => {
                            const itemsInCategory = menuItemsByCategory[category] || [];
                            const filteredItems = itemsInCategory.filter(item =>
                                item.name.toLowerCase().includes(searchQuery.toLowerCase())
                            );

                            if (filteredItems.length > 0 && (selectedCategories.length === 0 || selectedCategories.includes(category))) {
                                return (
                                    <section key={category} id={category.toLowerCase().replace(/\s/g, '-')}>
                                        <h2 className="text-3xl font-bold text-amber-300 border-b-2 border-amber-400/30 pb-2 mb-6">
                                            {category}
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredItems.map(item => (
                                                <MenuItemCard
                                                    key={item.id}
                                                    item={item}
                                                    isAdmin={isAdminMode}
                                                    onEdit={() => handleOpenModal(item)}
                                                    onDelete={() => handleDeleteItem(item.id)}
                                                    onGenerateImage={() => handleGenerateImage(item)}
                                                    isGenerating={generatingImages[item.id] || false}
                                                    whatsappNumber={WHATSAPP_NUMBER}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                );
                            }
                            return null;
                        })}
                    </div>
                </PhotoProvider>
            </main>

            {isAdminMode && (
                <div className="fixed bottom-8 right-8">
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
                        aria-label="Adicionar novo item"
                    >
                        <PlusIcon />
                    </button>
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveItem}
                itemToEdit={editingItem}
                categories={[...new Set(menuItems.map(item => item.category))]}
            />
        </div>
    );
};

export default App;