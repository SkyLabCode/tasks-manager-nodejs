import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import tasksRouter from './routes/tasks.js';

const app = express();
const port = 3000;

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (index.html y otros desde la carpeta "public")
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/tasks', tasksRouter);

// Ruta principal para servir la vista
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
