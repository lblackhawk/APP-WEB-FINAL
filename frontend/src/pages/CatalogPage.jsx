import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "../components/ProductCard";

export const CatalogPage = () => {
  const { products, categories, loading, error, loadData } = useStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  // Filtrado por nombre, categoría y rango de precio
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.category_id === Number(selectedCategory);
    const matchesMin = minPrice === "" || product.price >= Number(minPrice);
    const matchesMax = maxPrice === "" || product.price <= Number(maxPrice);
    return matchesName && matchesCategory && matchesMin && matchesMax;
  });

  if (loading) {
    return (
      <main className="container">
        <div className="loading-state">
          <h3>Cargando catálogo de productos...</h3>
          <p>Obteniendo disponibilidad y precios actualizados.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="empty-state" style={{ borderColor: "var(--danger)" }}>
          <h3 style={{ color: "var(--danger)", marginBottom: "0.5rem" }}>Ocurrió un problema</h3>
          <p style={{ marginBottom: "1rem" }}>{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => loadData(false)}>
            Reintentar carga
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Catálogo de Productos</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Explora nuestros equipos disponibles, filtra por categoría o rango de presupuesto.
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <section className="filters-bar" aria-label="Filtros de productos">
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="input"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="input"
          placeholder="Precio mínimo ($)"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          className="input"
          placeholder="Precio máximo ($)"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button type="button" className="btn btn-outline" onClick={resetFilters}>
          <RotateCcw size={16} />
          <span>Limpiar</span>
        </button>
      </section>

      {/* Listado de productos o estado vacío */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <Search size={36} style={{ marginBottom: "0.5rem" }} />
          <h3>No se encontraron productos</h3>
          <p style={{ marginBottom: "1rem" }}>
            Ningún producto coincide con los filtros seleccionados.
          </p>
          <button type="button" className="btn btn-primary" onClick={resetFilters}>
            Ver todos los productos
          </button>
        </div>
      ) : (
        <section className="grid-products">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
};