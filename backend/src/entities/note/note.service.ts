import { AppDataSource } from '../../data-source';
import { Note } from './entity/note.entity';
import { Category } from '../category/entity/category.entity';
import { Favorite } from '../favorite/entity/favorite.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Like } from 'typeorm';

export class NoteService {
  private noteRepository = AppDataSource.getRepository(Note);
  private categoryRepository = AppDataSource.getRepository(Category);
  private favoriteRepository = AppDataSource.getRepository(Favorite);

  async findAll(): Promise<Note[]> {
    return await this.noteRepository.find({
      relations: ['user', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Note | null> {
    return await this.noteRepository.findOne({
      where: { id },
      relations: ['user', 'category', 'comments'],
    });
  }

  async findByCategory(categoryName: string): Promise<Note[]> {
    const category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      return [];
    }

    return await this.noteRepository.find({
      where: { categoryId: category.id },
      relations: ['user', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Note[]> {
    return await this.noteRepository.find({
      where: { userId },
      relations: ['user', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string): Promise<Note[]> {
    return await this.noteRepository.find({
      where: { title: Like(`%${query}%`) },
      relations: ['user', 'category'],
    });
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create(createNoteDto);
    return await this.noteRepository.save(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    const note = await this.findById(id);
    if (!note) return null;

    Object.assign(note, updateNoteDto);
    return await this.noteRepository.save(note);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.noteRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async incrementDownloads(id: number): Promise<Note | null> {
    const note = await this.findById(id);
    if (!note) return null;

    note.downloads += 1;
    return await this.noteRepository.save(note);
  }

  async updateRating(id: number, rating: number): Promise<Note | null> {
    const note = await this.findById(id);
    if (!note) return null;

    note.rating = rating;
    return await this.noteRepository.save(note);
  }

  async findFavoritesByUser(userId: number): Promise<any[]> {
    return await this.favoriteRepository.find({
      where: { userId },
      relations: ['note', 'note.user', 'note.category'],
    });
  }

  async toggleFavorite(userId: number, noteId: number): Promise<{ message: string; isFavorite: boolean }> {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, noteId },
    });

    if (existingFavorite) {
      await this.favoriteRepository.remove(existingFavorite);
      return { message: 'Eliminado de favoritos', isFavorite: false };
    } else {
      const favorite = this.favoriteRepository.create({ userId, noteId });
      await this.favoriteRepository.save(favorite);
      return { message: 'Agregado a favoritos', isFavorite: true };
    }
  }
}
