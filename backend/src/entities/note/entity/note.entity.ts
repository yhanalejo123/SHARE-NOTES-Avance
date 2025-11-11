import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn 
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Category } from '../../category/entity/category.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { Favorite } from '../../favorite/entity/favorite.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  preview: string;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  downloads: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Foreign Keys
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  // Relaciones
  @ManyToOne(() => User, (user) => user.notes, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.notes, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.note)
  comments: Comment[];

  @OneToMany(() => Favorite, (favorite) => favorite.note)
  favorites: Favorite[];
}
