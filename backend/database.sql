-- =====================================================
-- Script de Base de Datos - Sistema de Notas Académicas
-- =====================================================
-- TypeORM creará automáticamente estas tablas
-- Este script es solo para referencia de la estructura
-- =====================================================

CREATE DATABASE IF NOT EXISTS notes_db;
USE notes_db;

-- =====================================================
-- Tabla: users
-- Descripción: Almacena los usuarios del sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: categories
-- Descripción: Categorías de las notas académicas
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: notes
-- Descripción: Notas/materiales académicos
-- =====================================================
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    preview TEXT NOT NULL,
    rating INT DEFAULT 0,
    downloads INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: comments
-- Descripción: Comentarios en las notas
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    note_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_note_id (note_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: favorites
-- Descripción: Relación entre usuarios y notas favoritas
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    note_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_note (user_id, note_id),
    INDEX idx_user_id (user_id),
    INDEX idx_note_id (note_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Datos de Prueba (Opcional)
-- =====================================================

-- Insertar categorías iniciales
INSERT INTO categories (name) VALUES 
('Algoritmos'),
('Bases de datos'),
('Redes'),
('Programación'),
('Matemáticas'),
('Física'),
('Ingeniería de Software')
ON DUPLICATE KEY UPDATE name = name;

-- =====================================================
-- Consultas Útiles
-- =====================================================

-- Ver todas las tablas
-- SHOW TABLES;

-- Ver estructura de cada tabla
-- DESCRIBE users;
-- DESCRIBE categories;
-- DESCRIBE notes;
-- DESCRIBE comments;
-- DESCRIBE favorites;

-- Ver todas las notas con su autor y categoría
-- SELECT n.id, n.title, u.name AS author, c.name AS category, n.rating, n.downloads
-- FROM notes n
-- INNER JOIN users u ON n.user_id = u.id
-- INNER JOIN categories c ON n.category_id = c.id
-- ORDER BY n.created_at DESC;

-- Ver comentarios de una nota específica
-- SELECT c.id, c.text, u.name AS author, c.created_at
-- FROM comments c
-- INNER JOIN users u ON c.user_id = u.id
-- WHERE c.note_id = 1
-- ORDER BY c.created_at DESC;

-- Ver favoritos de un usuario
-- SELECT n.id, n.title, c.name AS category
-- FROM favorites f
-- INNER JOIN notes n ON f.note_id = n.id
-- INNER JOIN categories c ON n.category_id = c.id
-- WHERE f.user_id = 1;

-- Limpiar todas las tablas (¡CUIDADO! Esto borra todos los datos)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE favorites;
-- TRUNCATE TABLE comments;
-- TRUNCATE TABLE notes;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;
