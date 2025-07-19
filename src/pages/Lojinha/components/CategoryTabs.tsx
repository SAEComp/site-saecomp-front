interface CategoryTabsProps {
  selectedCategory: 'all' | 'doces' | 'salgados' | 'bebidas';
  onCategoryChange: (category: 'all' | 'doces' | 'salgados' | 'bebidas') => void;
}

const categories = [
  { id: 'all', name: 'Todos'},
  { id: 'doces', name: 'Doces'},
  { id: 'salgados', name: 'Salgados'},
  { id: 'bebidas', name: 'Bebidas'},
] as const;

const CategoryTabs = ({ selectedCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-center gap-1 sm:gap-2 overflow-x-auto px-2">
        {categories.map(category => (
          <button
            key={category.id}
            className={`flex items-center justify-center space-x-1 sm:space-x-2 px-4 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-base flex-1 sm:flex-initial min-w-0 ${
              selectedCategory === category.id
                ? 'bg-[#03B04B] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="text-sm sm:text-lg"></span>
            <span className="whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
