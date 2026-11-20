import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Package, ShieldCheck, AlertTriangle, X } from "lucide-react";
import { useStore } from "../context/StoreContext";

export const Navbar = () => {
  const { role, setRole, cartCount, notification, setNotification, loadData } = useStore();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "nav-link active" : "nav-link");

  return (
    <>
      <header className="navbar">
        <div className="navbar-content">
          <Link to="/" className="brand">
            <ShoppingBag size={24} />
            <span>TechStore Web</span>
          </Link>

          <nav className="nav-links">
            <Link to="/" className={isActive("/")}>
              Catálogo
            </Link>

            {role === "CUSTOMER" ? (
              <>
                <Link to="/cart" className={isActive("/cart")}>
                  <ShoppingCart size={18} />
                  <span>Carrito ({cartCount})</span>
                </Link>
                <Link to="/orders" className={isActive("/orders")}>
                  <Package size={18} />
                  <span>Mis Pedidos</span>
                </Link>
              </>
            ) : (
              <Link to="/admin" className={isActive("/admin")}>
                <ShieldCheck size={18} />
                <span>Panel Admin</span>
              </Link>
            )}

            {/* Selector de perfil para demostrar ambos roles en la Entrega 1 */}
            <select
              className="select"
              style={{ width: "auto", padding: "0.35rem 0.6rem", fontSize: "0.85rem" }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Cambiar perfil de usuario"
            >
              <option value="CUSTOMER">Perfil: Cliente</option>
              <option value="ADMIN">Perfil: Administrador</option>
            </select>

            {/* Botón de prueba para demostrar manejo de error de red */}
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "0.35rem 0.6rem", fontSize: "0.8rem" }}
              onClick={() => loadData(true)}
              title="Simular fallo de conexión con el servidor"
            >
              <AlertTriangle size={15} />
              <span>Simular Error</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Banner global de confirmación o alerta */}
      {notification && (
        <div className="container" style={{ paddingBottom: 0 }}>
          <div className={`alert ${notification.type === "error" ? "alert-error" : "alert-success"}`}>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};