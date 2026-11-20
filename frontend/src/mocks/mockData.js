export const MOCK_CATEGORIES = [
  { id: 1, name: "Computadores y Portátiles", description: "Equipos de alto rendimiento y oficina" },
  { id: 2, name: "Accesorios", description: "Periféricos, teclados, ratones y audio" },
  { id: 3, name: "Monitores", description: "Pantallas Full HD y 4K" }
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    category_id: 2,
    category_name: "Accesorios",
    name: "Teclado Mecánico Inalámbrico",
    description: "Switches táctiles silenciosos, retroiluminación blanca y batería de larga duración.",
    price: 185000,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"
  },
  {
    id: 2,
    category_id: 2,
    category_name: "Accesorios",
    name: "Mouse Ergonómico Pro",
    description: "Sensor óptico de alta precisión con 6 botones programables.",
    price: 95000,
    stock: 15,
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600"
  },
  {
    id: 3,
    category_id: 1,
    category_name: "Computadores y Portátiles",
    name: "Portátil Ultrabook 14\"",
    description: "Procesador rápido, 16GB RAM, 512GB SSD y chasis ligero de aluminio.",
    price: 3200000,
    stock: 3,
    image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
  },
  {
    id: 4,
    category_id: 3,
    category_name: "Monitores",
    name: "Monitor IPS 27 Pulgadas",
    description: "Resolución QHD, bordes ultradelgados y protección ocular.",
    price: 890000,
    stock: 0, // Producto agotado para demostrar validación de disponibilidad
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"
  },
  {
    id: 5,
    category_id: 2,
    category_name: "Accesorios",
    name: "Audífonos Diadema Cancelación de Ruido",
    description: "Sonido envolvente con micrófono integrado para videollamadas.",
    price: 240000,
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
  }
];

export const MOCK_ORDERS = [
  {
    id: 1001,
    user_name: "Camila Cliente",
    user_email: "cliente@tienda.com",
    total_amount: 280000,
    status: "DELIVERED",
    delivery_address: "Calle 5 # 10-24, Barrio Centro",
    delivery_city: "Popayán",
    delivery_phone: "3104567890",
    created_at: "2026-11-10 14:30",
    items: [
      { product_id: 1, name: "Teclado Mecánico Inalámbrico", quantity: 1, unit_price: 185000 },
      { product_id: 2, name: "Mouse Ergonómico Pro", quantity: 1, unit_price: 95000 }
    ]
  }
];