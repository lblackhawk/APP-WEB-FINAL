import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useStore } from "../context/StoreContext";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { products, addToCart, role } = useStore();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  // Caso límite: recurso inexistente
  if (!product) {
    return (
      <main className="container">
        <div className="empty-state">
          <h2>Producto no encontrado</h2>
          <p style={{ margin: "0.5rem 0 1rem" }}>
            El producto que buscas no existe o fue retirado del catálogo.
          </p>
          <Link to="/" className="btn btn-primary">
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const isAvailable = product.stock > 0;

  return (
    <main className="container">
      <Link to="/" className="btn btn-outline" style={{ marginBottom: "1.5rem" }}>
        <ArrowLeft size={16} />
        <span>Volver al catálogo</span>
      </Link>

      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          padding: "1.5rem",
          gap: "2rem",
        }}
      >
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: "100%", maxHeight: "360px", objectFit: "cover", borderRadius: "8px" }}
        />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span className="badge badge-info">{product.category_name}</span>
            <span className={`badge ${isAvailable ? "badge-success" : "badge-danger"}`}>
              {isAvailable ? `${product.stock} unidades disponibles` : "Agotado"}
            </span>
          </div>

          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{product.name}</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem", fontSize: "1rem" }}>
            {product.description}
          </p>

          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "var(--primary)", marginBottom: "1.5rem" }}>
            {formatPrice(product.price)}
          </div>

          {role === "CUSTOMER" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <label htmlFor="qty" style={{ fontWeight: 600 }}>Cantidad:</label>
                <input
                  id="qty"
                  type="number"
                  className="input"
                  style={{ width: "80px" }}
                  min="1"
                  max={product.stock || 1}
                  disabled={!isAvailable}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!isAvailable}
                onClick={() => addToCart(product, quantity)}
              >
                <ShoppingCart size={18} />
                <span>{isAvailable ? "Agregar al carrito" : "Sin stock disponible"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};