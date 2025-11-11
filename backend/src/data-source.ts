import { DataSource } from 'typeorm';
import { User } from './entities/user/entity/user.entity';
import { Category } from './entities/category/entity/category.entity';
import { Note } from './entities/note/entity/note.entity';
import { Comment } from './entities/comment/entity/comment.entity';
import { Favorite } from './entities/favorite/entity/favorite.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'notes_db',
  synchronize: true, // En producción usar migrations
  logging: false,
  entities: [User, Category, Note, Comment, Favorite],
  migrations: [],
  subscribers: [],
});
