const express = require('express');
const axios = require('axios');


const getLocalizedTime = (region) => {
  const now = new Date();
  
  const utcOffset = getUtcOffset(region);
  const localTime = new Date(now.getTime() + utcOffset);
  
  return localTime;
};

const getUtcOffset = (region) => {
  // Map of region to UTC offsets in minutes
  const utcOffsets = {
    'America/New_York': -4 * 60, // Eastern Daylight Time (EDT) UTC-4
    // Add more regions and their offsets as needed
  };
  
  return utcOffsets[region] || 0; // Default to UTC if region is not found
};

const region = 'America/New_York';
const currentTimeActual = getLocalizedTime(region);

const app = express();
const PORT = process.env.PORT || 3000;

let cachedData = null;
let cacheTimestamp = null;

app.get('/data', async (req, res) => {
  const currentTime = Date.now();

  // Si los datos están en caché y han pasado más de 1 hora, actualiza la caché
  if (!cachedData || (currentTime - cacheTimestamp) >= 3600000) { // 3600000 milisegundos = 1 hora
    try {
      
      

      const currentDate = currentTimeActual.toISOString().split('T')[0];
      const apiUrl = `https://tasas.eltoque.com/v1/trmi?date_from=${currentDate}%2000%3A00%3A01&date_to=${currentDate}%2023%3A59%3A01`;

      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3MDA0OTc0OSwianRpIjoiZGI3MGVkMTgtZTBlZi00NDAyLWIyNWQtZDI0ZmY1MzJjM2FiIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYzOGFlZmQ1ZTNhYzlkNWM2NDc4NDA0YyIsIm5iZiI6MTY3MDA0OTc0OSwiZXhwIjoxNzAxNTg1NzQ5fQ.bXSFseCVzVOW1RSIPxs4ZdqAZR3ZI4gPkY09_5rXzNM',
          'accept': '*/*'
        }
      });

      const data = response.data;

      // Actualizar la caché y la marca de tiempo
      cachedData = data;
      cacheTimestamp = currentTime;
    } catch (error) {
      res.status(500).json({ error: 'No se pudo obtener la información' });
      return;
    }
  }

  // Enviar los datos desde la caché
  res.json(cachedData);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
