-- Створення бази даних
CREATE DATABASE restaurant_booking;
USE restaurant_booking;

-- Створення таблиці столиків
CREATE TABLE tables (
    table_id INT AUTO_INCREMENT PRIMARY KEY,
    capacity INT NOT NULL,
    location VARCHAR(255)
);

-- Створення таблиці гостей
CREATE TABLE guests (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(13) NOT NULL,
    email VARCHAR(100),
    telegram_id VARCHAR(50),
    allergens TEXT
);

-- Створення таблиці бронювань
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guest_count INT NOT NULL,
    guest_id INT NOT NULL,
    
    -- Зв'язок із таблицею tables
    FOREIGN KEY (table_id) REFERENCES tables(table_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Зв'язок із таблицею guests
    FOREIGN KEY (guest_id) REFERENCES guests(guest_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Перевірка створених таблиць
SHOW TABLES;

select * from tables;
select * from guests;
select * from reservations;
select * from reservation;

DROP TABLE reservation;

truncate reservations;
truncate reservation;
truncate guests;

delete from reservations;
delete from reservation;
delete from guests;

SET FOREIGN_KEY_CHECKS = 0;

-- Видалення всіх даних
TRUNCATE TABLE reservations;
TRUNCATE TABLE guests;
TRUNCATE TABLE reservation;

SET FOREIGN_KEY_CHECKS = 1;




-- Заповнення таблиці tables даними про столики з номерами столиків
INSERT INTO tables (table_number, capacity, location) VALUES 
    (1, 2, 'біля вікна'),
    (2, 4, 'центр зали'),
    (3, 4, 'біля бару'),
    (4, 6, 'куточок'),
    (5, 2, 'тераса'),
    (6, 8, 'велика зала'),
    (7, 2, 'біля каміна'),
    (8, 4, 'на балконі');

-- Заповнення таблиці guests даними про гостей
INSERT INTO guests (full_name, phone_number, email, telegram_id, allergens) VALUES
    ('Іван Іваненко', '+380501234567', 'ivan.ivanenko@example.com', NULL, 'горіхи'),
    ('Марія Петренко', '+380671234567', NULL, '@mariapetrenko', 'морепродукти'),
    ('Олексій Коваленко', '+380931234567', 'oleksiy.kovalenko@example.com', '@kovalex', NULL),
    ('Ольга Сидоренко', '+380991234567', 'olha.sydorenko@example.com', NULL, 'глютен'),
    ('Андрій Шевченко', '+380631234567', NULL, '@andriisheva', 'мед'),
    ('Катерина Левченко', '+380661234567', 'kateryna.levchenko@example.com', NULL, NULL);

-- Заповнення таблиці reservations даними про бронювання
INSERT INTO reservations (table_id, reservation_date, reservation_time, guest_count, guest_id) VALUES
    (1, '2024-11-05', '18:00:00', 2, 1),
    (2, '2024-11-05', '19:30:00', 4, 2),
    (3, '2024-11-06', '17:00:00', 3, 3),
    (4, '2024-11-06', '20:00:00', 5, 4),
    (5, '2024-11-07', '18:30:00', 2, 5),
    (6, '2024-11-07', '19:00:00', 6, 6),
    (7, '2024-11-08', '20:30:00', 2, 1),
    (8, '2024-11-08', '21:00:00', 4, 3);



