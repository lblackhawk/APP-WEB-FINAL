import { useState } from "react";
import { ShieldAlert, Plus, Edit, Trash2 } from "lucide-react";
import { useStore } from "../context/StoreContext";

export const AdminPage = () => {
  const {
    role,
    products,
    categories,
    orders,
    saveProduct,
    deleteProduct,
    updateOrderStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState("products");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const initialForm = {
    name: "",
    category_id: categories[0]?.id || 1,
    description: "",
    price: "",
    stock: "",
    image_url: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600",
  };

  const [form, setForm] = useState(initialForm);

  // Protección de rol para demostrar caso límite de falta de permisos
  if (role !== "ADMIN") {
    return (
      <main className="container">
        <div className="empty-state" style={{ borderColor: "var(--danger)" }}>
          <ShieldAlert size={42} color="var(--danger)" style={{ marginBottom: "0.5rem" }} />
          <h2 style={{ color: "var(--danger)" }}>Acceso Restringido</h2>
          <p style={{ marginTop: "0.5rem" }}>
            Esta vista es exclusiva para el perfil <strong>Administrador de catálogo</strong>. Cambia tu perfil en la barra superior para acceder.
          </p>
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

  const validateProductForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre del producto es obligatorio.";
    if (!form.description.trim()) newErrors.description = "Agrega una descripción breve.";
    if (form.price === "" || Number(form.price) <= 0) {
      newErrors.price = "El precio debe ser mayor a 0.";
    }
    if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      newErrors.stock = "El stock debe ser un número entero igual o mayor a 0.";
    }
    if (!form.image_url.trim()) newErrors.image_url = "La URL de la imagen es obligatoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    saveProduct(editingId ? { ...form, id: editingId } : form);
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
  };

  return (
    <main className="container">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem" }}>Panel Administrativo</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Administra el inventario del catálogo y supervisa los pedidos de clientes.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className={`btn ${activeTab === "products" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("products")}
          >
            Catálogo ({products.length})
          </button>
          <button
            type="button"
            className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("orders")}
          >
            Pedidos ({orders.length})
          </button>
        </div>
      </div>

      {activeTab === "products" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
          {/* Formulario de creación/edición de producto */}
          <section className="card" style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>
              {editingId ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            <form onSubmit={handleProductSubmit} noValidate>
              <div className="form-group">
                <label>Nombre del producto *</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  className="select"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label>Precio (COP) *</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                  {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label>Stock disponible *</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                  {errors.stock && <span className="error-text">{errors.stock}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>URL de imagen *</label>
                <input
                  type="url"
                  className="input"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
                {errors.image_url && <span className="error-text">{errors.image_url}</span>}
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  className="textarea"
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Plus size={16} />
                  <span>{editingId ? "Guardar Cambios" : "Crear Producto"}</span>
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Tabla de gestión de productos */}
          <section className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td style={{ fontWeight: 600 }}>{prod.name}</td>
                    <td>{prod.category_name}</td>
                    <td>{formatPrice(prod.price)}</td>
                    <td>
                      <span className={`badge ${prod.stock > 0 ? "badge-success" : "badge-danger"}`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: "0.3rem 0.5rem" }}
                          onClick={() => startEdit(prod)}
                          title="Editar"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: "0.3rem 0.5rem" }}
                          onClick={() => deleteProduct(prod.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        /* Vista administrativa de pedidos */
        <section className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Entrega</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700 }}>#{order.id}</td>
                  <td>
                    <div>{order.user_name}</div>
                    <small style={{ color: "var(--text-muted)" }}>{order.delivery_phone}</small>
                  </td>
                  <td>
                    {order.delivery_address}, {order.delivery_city}
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(order.total_amount)}</td>
                  <td>
                    <select
                      className="select"
                      style={{ width: "auto", padding: "0.3rem 0.5rem" }}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="CONFIRMED">Confirmado</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
};