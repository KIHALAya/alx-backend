import express from 'express';
import { promisify } from 'util';
import redis from 'redis';

// Data
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

// Redis Client
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Express Server
const app = express();
const PORT = 1245;

// Function to get item by ID
const getItemById = (id) => {
  return listProducts.find((item) => item.id === id);
};

// Route to list all products
app.get('/list_products', (req, res) => {
  const products = listProducts.map(({ id, name, price, stock }) => ({
    itemId: id,
    itemName: name,
    price,
    initialAvailableQuantity: stock,
  }));
  res.json(products);
});

// Function to reserve stock by ID
const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

// Function to get current reserved stock by ID
const getCurrentReservedStockById = async (itemId) => {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : 0;
};

// Route to get product details
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const item = getItemById(itemId);

  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentQuantity = await getCurrentReservedStockById(itemId);
  res.json({
    itemId: item.id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock,
    currentQuantity: item.stock - currentQuantity,
  });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const item = getItemById(itemId);

  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentReservedStock = await getCurrentReservedStockById(itemId);
  if (currentReservedStock >= item.stock) {
    return res.status(400).json({
      status: 'Not enough stock available',
      itemId: item.id,
    });
  }

  await reserveStockById(itemId, currentReservedStock + 1);
  res.json({
    status: 'Reservation confirmed',
    itemId: item.id,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

