import express from 'express';
import db from '../database/database.js';

const router = express.Router();

// Obtener todas las tareas
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Crear una nueva tarea
router.post('/', (req, res) => {
  const { title, description } = req.body;
  db.run(
    'INSERT INTO tasks (title) VALUES (?)',
    [title, description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, title });
    }
  );
});

// Actualizar una tarea
router.put('/:id', (req, res) => {
  const { completed } = req.body; // Asegúrate de que completed es un boolean
  const id = req.params.id;

  console.log(`Actualizar tarea ID: ${id}, Estado completado: ${completed}`);

  if (typeof completed !== 'boolean') {
    res.status(400).json({ error: 'El campo completed debe ser booleano' });
    return;
  }

  db.run(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id], // Convertimos booleano a entero para SQLite
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      res.json({ id, completed });
    }
  );
});

// Eliminar una tarea
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    res.status(204).send();
  });
});

export default router;