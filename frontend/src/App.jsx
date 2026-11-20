import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { Navbar } from "./components/Navbar";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AdminPage } from "./pages/AdminPage";

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="*"
            element={
              <main className="container">
                <div className="empty-state">
                  <h2>Página no encontrada (404)</h2>
                  <p style={{ margin: "0.5rem 0 1rem" }}>La ruta que intentas abrir no existe.</p>
                  <Link to="/" className="btn btn-primary">
                    Volver al inicio
                  </Link>
                </div>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;