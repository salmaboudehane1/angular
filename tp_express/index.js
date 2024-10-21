const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// add a post endpoint to add items
let items = [];

app.post('/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json(newItem);
});

//Create a GET Endpoint to Retrieve All Items
app.get('/items', (req, res) => {
    res.json(items);
  });


//Create a GET Endpoint by ID to Get a Specific Item
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.find(i => i.id === itemId);
    if (item) {
      res.json(item);
    } else {
      res.status(404).send('Item not found');
    }
  });

  
//Create a PUT Endpoint to Update an Existing Item
app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === itemId);
    
    if (itemIndex !== -1) {
      items[itemIndex] = { ...items[itemIndex], ...req.body };
      res.json(items[itemIndex]);
    } else {
      res.status(404).send('Item not found');
    }
  });
  

//Create a DELETE Endpoint to Delete an Item
app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === itemId);
    
    if (itemIndex !== -1) {
      items.splice(itemIndex, 1);
      res.status(204).send(); // 204 No Content response
    } else {
      res.status(404).send('Item not found');
    }
  });
  