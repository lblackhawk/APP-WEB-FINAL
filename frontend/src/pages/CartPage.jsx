import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";

export const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, createOrder } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      newErrors.fullName = "Ingresa el nombre completo de quien recibe (mínimo 3 caracteres).";
    }
    if (!form.address.trim() || form.address.trim().length < 6) {
      newErrors.address = "Ingresa una dirección de entrega válida (ej. Calle 5 # 10-24).";
    }
    if (!form.city.trim()) {
      newErrors.city = "La ciudad de entrega es obligatoria.";
    }
    if (!/^\d{7,15}$/.test(form.phone.trim())) {
      newErrors.phone = "Ingresa un teléfono válido de solo números (entre 7 y 15 dígitos).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = createOrder(form);
    if (success) {
      navigate("/orders");
    }
  };

  if (cart.length === 0) {
    return (
      <main className="container">
        <div className="empty-state">
          <ShoppingBag size={40} style={{ marginBottom: "0.5rem" }} />
          <h2>Tu carrito está vacío</h2>
          <p style={{ margin: "0.5rem 0 1.25rem" }}>
            Explora nuestro catálogo y agrega productos antes de realizar un pedido.
          </p>
          <Link to="/" className="btn btn-primary">
            Ir al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 style={{ fontSize: "1.6rem", marginBottom: "1.5rem" }}>Carrito de Compras y Entrega</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
        {/* Lista de productos en el carrito */}
        <section className="card" style={{ padding: "1.25rem" }}>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Productos seleccionados</h2>

          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                padding: "0.9rem 0",
                borderBottom: "1px solid var(--border)",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "160px" }}>
                <h4 style={{ fontSize: "0.95rem" }}>{product.name}</h4>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {formatPrice(product.price)} c/u (Stock: {product.stock})
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: "0.3rem 0.5rem" }}
                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: "28px", textAlign: "center", fontWeight: 600 }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: "0.3rem 0.5rem" }}
                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div style={{ fontWeight: 700, minWidth: "95px", textAlign: "right" }}>
                {formatPrice(product.price * quantity)}
              </div>

              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: "0.35rem 0.5rem", color: "var(--danger)" }}
                onClick={() => removeFromCart(product.id)}
                title="Quitar producto"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.25rem", fontSize: "1.2rem", fontWeight: 700 }}>
            <span>Total a pagar:</span>
            <span style={{ color: "var(--primary)" }}>{formatPrice(cartTotal)}</span>
          </div>
        </section>

        {/* Formulario de datos de entrega */}
        <section className="card" style={{ padding: "1.25rem" }}>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Datos de Entrega</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="fullName">Nombre completo del destinatario *</label>
              <input
                id="fullName"
                type="text"
                className="input"
                placeholder="Ej. Camila Manquillo"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Dirección de entrega *</label>
              <input
                id="address"
                type="text"
                className="input"
                placeholder="Ej. Carrera 9 # 14N-20"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="city">Ciudad *</label>
              <input
                id="city"
                type="text"
                className="input"
                placeholder="Ej. Popayán"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono de contacto *</label>
              <input
                id="phone"
                type="tel"
                className="input"
                placeholder="Ej. 3104567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <button type="submit" className="btn btn-success" style={{ width: "100%", marginTop: "0.5rem" }}>
              <CheckCircle size={18} />
              <span>Confirmar Pedido ({formatPrice(cartTotal)})</span>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};