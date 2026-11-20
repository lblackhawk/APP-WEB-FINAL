import { createContext, useContext, useState, useEffect } from "react";
import { fetchInitialStoreData } from "../services/apiMock";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Perfil activo: 'CUSTOMER' (Cliente) o 'ADMIN' (Administrador de catálogo)
  const [role, setRole] = useState("CUSTOMER");

  // Estados de datos principales
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  // Estados de interfaz requeridos: carga, error y confirmación
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Cargar datos simulados al iniciar (permite simular fallo para pruebas)
  const loadData = async (forceError = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInitialStoreData(forceError);
      setCategories(data.categories);
      setProducts(data.products);
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  // --- FUNCIONES DEL CARRITO ---
  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      showNotification("Este producto está agotado.", "error");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          showNotification(`Solo hay ${product.stock} unidades disponibles.`, "error");
          return prev;
        }
        showNotification(`Cantidad actualizada en el carrito (${newQty}).`);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      showNotification(`"${product.name}" agregado al carrito.`);
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct && newQuantity > targetProduct.stock) {
      showNotification(`Stock máximo disponible: ${targetProduct.stock} unidades.`, "error");
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- CREAR PEDIDO (CLIENTE) ---
  const createOrder = (deliveryData) => {
    if (cart.length === 0) return false;

    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000),
      user_name: deliveryData.fullName,
      user_email: "cliente@tienda.com",
      total_amount: cartTotal,
      status: "CONFIRMED",
      delivery_address: deliveryData.address,
      delivery_city: deliveryData.city,
      delivery_phone: deliveryData.phone,
      created_at: new Date().toLocaleString("es-CO"),
      items: cart.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      })),
    };

    // Descontar stock simulado
    setProducts((prev) =>
      prev.map((prod) => {
        const bought = cart.find((c) => c.product.id === prod.id);
        return bought ? { ...prod, stock: prod.stock - bought.quantity } : prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    showNotification(`¡Pedido #${newOrder.id} registrado con éxito!`);
    return true;
  };

  // --- FUNCIONES DE ADMINISTRADOR ---
  const saveProduct = (productData) => {
    const categoryObj = categories.find((c) => c.id === Number(productData.category_id));
    const formatted = {
      ...productData,
      category_id: Number(productData.category_id),
      category_name: categoryObj ? categoryObj.name : "General",
      price: Number(productData.price),
      stock: Number(productData.stock),
    };

    if (productData.id) {
      setProducts((prev) => prev.map((p) => (p.id === productData.id ? formatted : p)));
      showNotification("Producto actualizado correctamente.");
    } else {
      const newProduct = { ...formatted, id: Date.now() };
      setProducts((prev) => [newProduct, ...prev]);
      showNotification("Producto creado en el catálogo.");
    }
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification("Producto eliminado del catálogo.");
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showNotification(`Estado del pedido #${orderId} actualizado.`);
  };

  return (
    <StoreContext.Provider
      value={{
        role,
        setRole,
        categories,
        products,
        orders,
        cart,
        loading,
        error,
        notification,
        setNotification,
        loadData,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        cartTotal,
        cartCount,
        createOrder,
        saveProduct,
        deleteProduct,
        updateOrderStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);