
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategories, onCategoryToggle }) => {
    const isAllSelected = selectedCategories.length === 0;

    return (
        <div className="mb-12 flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
                onClick={() => onCategoryToggle('all')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 ${
                    isAllSelected 
                    ? 'bg-amber-500 text-white shadow-md' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                aria-pressed={isAllSelected}
            >
                Todas
            </button>
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onCategoryToggle(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 ${
                        selectedCategories.includes(category)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    aria-pressed={selectedCategories.includes(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
