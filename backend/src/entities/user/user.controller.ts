import { Request, Response } from 'express';
import { UserService } from './user.service';
import jwt from 'jsonwebtoken';

export class UserController {
  me = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: 'No autorizado' });
      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token faltante' });
      let payload: any;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
      } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }
      const user = await this.userService.findById(payload.userId);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  private userService = new UserService();

  getAll = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.findAll();
      const usersWithoutPassword = users.map(({ password, ...user }) => user);
      return res.json(usersWithoutPassword);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(parseInt(id));
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userService.update(parseInt(id), req.body);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await this.userService.delete(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
      }

      // Verificar si el usuario ya existe
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'El usuario ya existe' });
      }

      const user = await this.userService.create({ name, email, password });
      
      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
        token,
      });
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
      }

      const user = await this.userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      const isValidPassword = await this.userService.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
        token,
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  };
}
