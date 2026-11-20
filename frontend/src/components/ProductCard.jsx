import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { useStore } from "../context/StoreContext";

export const ProductCard = ({ product }) => {
  const { addToCart, role } = useStore();
  const isAvailable = product.stock > 0;

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <article className="card">
      <img
        src={product.image_url}
        alt={product.name}
        className="product-img"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x250?text=Sin+Imagen";
        }}
      />
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span className="badge badge-info">{product.category_name}</span>
          <span className={`badge ${isAvailable ? "badge-success" : "badge-danger"}`}>
            {isAvailable ? `Stock: ${product.stock}` : "Agotado"}
          </span>
        </div>

        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.4rem" }}>{product.name}</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem", flex: 1 }}>
          {product.description}
        </p>

        <div style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.9rem" }}>
          {formatPrice(product.price)}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to={`/product/${product.id}`} className="btn btn-outline" style={{ flex: 1 }}>
            <Eye size={16} />
            <span>Detalle</span>
          </Link>

          {role === "CUSTOMER" && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={!isAvailable}
              onClick={() => addToCart(product, 1)}
            >
              <ShoppingCart size={16} />
              <span>{isAvailable ? "Agregar" : "Sin stock"}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};