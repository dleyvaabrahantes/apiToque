const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

let cachedData = null;

app.get('/data', async (req, res) => {
  if (cachedData) {
    // Si ya tenemos los datos en caché, los enviamos
    res.json(cachedData);
  } else {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      // Configurar la solicitud a la API original con el encabezado de autorización

      const apiUrl = `https://tasas.eltoque.com/v1/trmi?date_from=${currentDate}%2000%3A00%3A01&date_to=${currentDate}%2023%3A59%3A01`;

      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3MDA0OTc0OSwianRpIjoiZGI3MGVkMTgtZTBlZi00NDAyLWIyNWQtZDI0ZmY1MzJjM2FiIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYzOGFlZmQ1ZTNhYzlkNWM2NDc4NDA0YyIsIm5iZiI6MTY3MDA0OTc0OSwiZXhwIjoxNzAxNTg1NzQ5fQ.bXSFseCVzVOW1RSIPxs4ZdqAZR3ZI4gPkY09_5rXzNM',
          'accept': '*/*'
        }
      });

      const data = response.data;

      // Almacenar los datos en caché y enviar la respuesta
      cachedData = data;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'No se pudo obtener la información' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
