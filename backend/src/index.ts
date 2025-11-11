import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { Category } from './entities/category/entity/category.entity';

// Rutas
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import noteRoutes from './routes/note.routes';
import commentRoutes from './routes/comment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/comments', commentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Notas Académicas - Backend funcionando correctamente' });
});

// Inicializar base de datos y servidor
AppDataSource.initialize()
  .then(async () => {
    console.log('Base de datos conectada correctamente');

    // Tarea: Insertar categorías de prueba si no existen
    const categoryRepo = AppDataSource.getRepository(Category);
    const defaultCategories = ['Matemáticas', 'Física', 'Química', 'Historia'];
    for (const name of defaultCategories) {
      const exists = await categoryRepo.findOne({ where: { name } });
      if (!exists) {
        const cat = categoryRepo.create({ name });
        await categoryRepo.save(cat);
      }
    }

    // Tarea: Insertar notas de ejemplo si no existen
    const noteRepo = AppDataSource.getRepository(require('./entities/note/entity/note.entity').Note);
    const notesEjemplo = [
      { title: 'Álgebra básica', preview: 'Conceptos fundamentales de álgebra', categoryName: 'Matemáticas' },
      { title: 'Leyes de Newton', preview: 'Resumen de las leyes del movimiento', categoryName: 'Física' },
      { title: 'Tabla periódica', preview: 'Elementos y grupos principales', categoryName: 'Química' },
      { title: 'Revolución Francesa', preview: 'Causas y consecuencias', categoryName: 'Historia' },
    ];
    for (const n of notesEjemplo) {
      const cat = await categoryRepo.findOne({ where: { name: n.categoryName } });
      if (!cat) continue;
      const exists = await noteRepo.findOne({ where: { title: n.title, category: cat } });
      if (!exists) {
        const note = noteRepo.create({
          title: n.title,
          preview: n.preview,
          category: cat,
          categoryId: cat.id,
          userId: 1,
        });
        await noteRepo.save(note);
      }
    }

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });
