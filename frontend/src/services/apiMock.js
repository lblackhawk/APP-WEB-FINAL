import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_ORDERS } from "../mocks/mockData";

// Simula una espera de red de 500 milisegundos
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchInitialStoreData = async (simulateError = false) => {
  await delay(600);

  if (simulateError) {
    throw new Error("No se pudo conectar con el servidor de la tienda. Intenta nuevamente.");
  }

  return {
    categories: [...MOCK_CATEGORIES],
    products: [...MOCK_PRODUCTS],
    orders: [...MOCK_ORDERS],
  };
};