import { Request, Response } from 'express';
import { NoteService } from './note.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class NoteController {
  private noteService = new NoteService();

  getAll = async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'No autenticado' });
      }
      const notes = await this.noteService.findByUser(userId);
      const formattedNotes = notes.map((note) => ({
        id: note.id,
        title: note.title,
        author: note.user.name,
        rating: note.rating,
        downloads: note.downloads,
        preview: note.preview,
        category: note.category.name,
      }));
      return res.json(formattedNotes);
    } catch (error) {
      console.error('Error al obtener notas:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const note = await this.noteService.findById(parseInt(id));

      if (!note) {
        return res.status(404).json({ message: 'Nota no encontrada' });
      }

      const formattedNote = {
        id: note.id,
        title: note.title,
        author: note.user.name,
        rating: note.rating,
        downloads: note.downloads,
        preview: note.preview,
        category: note.category.name,
      };

      return res.json(formattedNote);
    } catch (error) {
      console.error('Error al obtener nota:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.json([]);
      }

      const notes = await this.noteService.search(query as string);
      const formattedNotes = notes.map((note) => ({
        id: note.id,
        title: note.title,
        author: note.user.name,
        rating: note.rating,
        downloads: note.downloads,
        preview: note.preview,
        category: note.category.name,
      }));

      return res.json(formattedNotes);
    } catch (error) {
      console.error('Error al buscar notas:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  create = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id!;
      const createNoteDto = { ...req.body, userId };
      
      const note = await this.noteService.create(createNoteDto);
      return res.status(201).json(note);
    } catch (error) {
      console.error('Error al crear nota:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const note = await this.noteService.update(parseInt(id), req.body);

      if (!note) {
        return res.status(404).json({ message: 'Nota no encontrada' });
      }

      return res.json(note);
    } catch (error) {
      console.error('Error al actualizar nota:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await this.noteService.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({ message: 'Nota no encontrada' });
      }

      return res.json({ message: 'Nota eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar nota:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  getByCategory = async (req: Request, res: Response) => {
    try {
      const { categoryName } = req.params;
      const notes = await this.noteService.findByCategory(categoryName);

      const formattedNotes = notes.map((note) => ({
        id: note.id,
        title: note.title,
        author: note.user.name,
        rating: note.rating,
        downloads: note.downloads,
        preview: note.preview,
      }));

      return res.json(formattedNotes);
    } catch (error) {
      console.error('Error al obtener notas por categoría:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  getFavorites = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id!;
      const favorites = await this.noteService.findFavoritesByUser(userId);

      const formattedNotes = favorites.map((fav) => ({
        id: fav.note.id,
        title: fav.note.title,
        author: fav.note.user.name,
        rating: fav.note.rating,
        downloads: fav.note.downloads,
        preview: fav.note.preview,
        category: fav.note.category.name,
      }));

      return res.json(formattedNotes);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  toggleFavorite = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id!;

      const result = await this.noteService.toggleFavorite(userId, parseInt(id));

      return res.json(result);
    } catch (error) {
      console.error('Error al alternar favorito:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
}
