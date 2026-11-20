# TechStore Web — Tienda Virtual de Catálogo y Pedidos

Aplicación web desarrollada para la asignatura **Desarrollo de Aplicaciones Web** (Proyecto 2: Tienda virtual de catálogo y pedidos). Permite a los clientes explorar productos, filtrar por presupuesto o categoría, gestionar un carrito de compras y registrar pedidos, mientras que el administrador gestiona el catálogo y supervisa las órdenes.

---

## 1. Stack Tecnológico y Justificación

* **Frontend — React (con Vite):** Elegido por su arquitectura modular basada en componentes reutilizables, su facilidad para gestionar estados reactivos en tiempo real (carrito de compras, filtros combinados y alertas de interfaz) y su rápida integración futura con APIs REST.
* **Backend (Entrega 2) — API REST:** Encargado de centralizar las reglas de negocio, autenticación y cálculo seguro de totales.
* **Persistencia (Entrega 2) — PostgreSQL:** Seleccionado por garantizar integridad referencial mediante claves primarias y foráneas, restricciones de dominio (`CHECK`) y transacciones seguras al descontar inventario.

---

## 2. Perfiles de Usuario Implementados

1. **Cliente (`CUSTOMER`):** Explora el catálogo, consulta detalles y stock, administra cantidades en el carrito, diligencia el formulario de entrega y consulta su historial de pedidos.
2. **Administrador de catálogo (`ADMIN`):** Crea, edita y elimina productos del catálogo, y actualiza el estado de los pedidos registrados.

*(En la Entrega 1, ambos perfiles pueden alternarse desde el selector en la barra superior para facilitar la demostración).*

---

## 3. Funcionalidades y Estados de Interfaz (Entrega 1)

* **Catálogo responsivo:** Adaptable a escritorio y dispositivos móviles.
* **Búsqueda y filtros:** Filtrado combinado por nombre, categoría y rango de precios (mínimo y máximo).
* **Carrito y Checkout:** Control de stock máximo al sumar unidades, cálculo de subtotales y formulario de entrega validado en cliente.
* **Estados de interfaz:** Manejo explícito de estado de **carga** (simulación asíncrona), **ausencia de resultados** (filtros sin coincidencias o carrito vacío), **confirmación** (alertas de éxito) y **error** (botón de simulación de fallo de red).

---

## 4. Datos Simulados y Supuestos Utilizados

Los datos iniciales se encuentran en `frontend/src/mocks/mockData.js`:
* **Categorías:** 3 categorías base (*Computadores y Portátiles*, *Accesorios*, *Monitores*).
* **Productos:** 5 productos de prueba, incluyendo artículos con inventario disponible y 1 producto con `stock: 0` (*Monitor IPS de 27 pulgadas*) para validar el bloqueo de compra en artículos agotados.
* **Pedidos:** 1 pedido histórico precargado (`#1001`) y generación dinámica de nuevos pedidos en memoria descontando el stock temporalmente.
* **Supuestos:** Los precios se expresan en pesos colombianos (COP). En esta etapa no hay persistencia en base de datos ni pasarela de pagos; al recargar el navegador se restablecen los datos iniciales.

---

## 5. Modelo Entidad-Relación (Previsto para Entrega 2)

```text
categories (1) ──────< (N) products (1) ──────< (N) order_items (N) >────── (1) orders (N) >────── (1) users
```

* **users:** `id (PK)`, `full_name`, `email (UNIQUE)`, `password_hash`, `role` (`ADMIN` | `CUSTOMER`)
* **categories:** `id (PK)`, `name (UNIQUE)`, `description`
* **products:** `id (PK)`, `category_id (FK)`, `name`, `description`, `price`, `stock`, `image_url`, `is_active`
* **orders:** `id (PK)`, `user_id (FK)`, `total_amount`, `status`, `delivery_address`, `delivery_city`, `delivery_phone`, `created_at`
* **order_items:** `id (PK)`, `order_id (FK)`, `product_id (FK)`, `quantity`, `unit_price`

---

## 6. Contratos de Endpoints API REST (Previstos para Entrega 2)

| Método | Ruta | Perfil | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registro de cliente |
| `POST` | `/api/auth/login` | Público | Autenticación y emisión de token |
| `GET` | `/api/categories` | Público | Listado de categorías |
| `GET` | `/api/products` | Público | Catálogo con filtros (`search`, `categoryId`, `minPrice`, `maxPrice`) |
| `GET` | `/api/products/:id` | Público | Detalle de un producto |
| `POST` / `PUT` / `DELETE` | `/api/products` | Admin | Gestión CRUD del catálogo |
| `POST` | `/api/orders` | Cliente | Creación de pedido (validación de stock y cálculo de total en servidor) |
| `GET` | `/api/orders/my-orders` | Cliente | Historial de pedidos del usuario |
| `GET` | `/api/orders` | Admin | Listado general de pedidos |

---

## 7. Instrucciones de Ejecución (Frontend)

### Requisitos previos
* Node.js (v18 o superior) y npm instalados.

### Pasos para ejecutar
1. Abrir una terminal en la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador la URL indicada (por defecto `http://localhost:5173`).