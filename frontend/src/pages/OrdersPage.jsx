import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useStore } from "../context/StoreContext";

export const OrdersPage = () => {
  const { orders } = useStore();

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return <span className="badge badge-success">Entregado</span>;
      case "CONFIRMED":
        return <span className="badge badge-info">Confirmado</span>;
      case "CANCELLED":
        return <span className="badge badge-danger">Cancelado</span>;
      default:
        return <span className="badge badge-warning">Pendiente</span>;
    }
  };

  return (
    <main className="container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Mis Pedidos</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Consulta el historial y el estado de tus compras registradas.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={40} style={{ marginBottom: "0.5rem" }} />
          <h3>Aún no tienes pedidos registrados</h3>
          <p style={{ margin: "0.5rem 0 1rem" }}>Cuando confirmes una compra aparecerá aquí.</p>
          <Link to="/" className="btn btn-primary">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {orders.map((order) => (
            <article key={order.id} className="card" style={{ padding: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                  paddingBottom: "0.85rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: "1.05rem", marginRight: "0.75rem" }}>
                    Pedido #{order.id}
                  </span>
                  {getStatusBadge(order.status)}
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Fecha: {order.created_at} • Entrega: {order.delivery_address}, {order.delivery_city}
                  </div>
                </div>

                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)" }}>
                  Total: {formatPrice(order.total_amount)}
                </div>
              </div>

              <div style={{ marginTop: "0.85rem" }}>
                <strong style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Detalle de artículos:
                </strong>
                <ul style={{ listStyle: "none", marginTop: "0.5rem" }}>
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.9rem",
                        padding: "0.3rem 0",
                      }}
                    >
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>{formatPrice(item.unit_price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};