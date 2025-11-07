import PropertyFilters from '../PropertyFilters';

export default function PropertyFiltersExample() {
  return (
    <div className="p-6">
      <PropertyFilters 
        language="ar" 
        onFilterChange={(filters) => console.log('Filters changed:', filters)} 
      />
    </div>
  );
}
