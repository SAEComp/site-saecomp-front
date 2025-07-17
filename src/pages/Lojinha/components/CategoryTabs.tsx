interface CategoryTabsProps {
  selectedCategory: 'all' | 'doces' | 'salgados' | 'bebidas';
  onCategoryChange: (category: 'all' | 'doces' | 'salgados' | 'bebidas') => void;
}

const categories = [
  { id: 'all', name: 'Todos', icon: '🛍️' },
  { id: 'doces', name: 'Doces', icon: '🍰' },
  { id: 'salgados', name: 'Salgados', icon: '🥪' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
] as const;

const CategoryTabs = ({ selectedCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
      <div className="flex space-x-2 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-[#03B04B] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
