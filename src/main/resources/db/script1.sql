ALTER TABLE tables
DROP COLUMN table_number;

select * from tables;

ALTER TABLE tables
ADD COLUMN table_number INT NOT NULL;

ALTER TABLE guests MODIFY guest_id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE reservations MODIFY guest_id BIGINT;

SELECT  COLUMN_NAME,        -- Ім'я стовпця
    DATA_TYPE,          -- Тип даних
    CHARACTER_MAXIMUM_LENGTH, -- Максимальна довжина (для строкових типів)
    IS_NULLABLE,        -- Чи може стовпець містити NULL
    COLUMN_DEFAULT,     -- Значення за замовчуванням
    NUMERIC_PRECISION,  -- Точність для числових типів
    NUMERIC_SCALE,      -- Масштаб для числових типів
    DATETIME_PRECISION, -- Точність для типів datetime
    COLUMN_KEY,         -- Індекс (наприклад, PRI для первинного ключа)
    EXTRA,              -- Додаткові властивості (наприклад, auto_increment)
    PRIVILEGES          -- Привілеї
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'restaurant_booking' AND TABLE_NAME = 'guests';

SELECT  COLUMN_NAME,        -- Ім'я стовпця
    DATA_TYPE,          -- Тип даних
    CHARACTER_MAXIMUM_LENGTH, -- Максимальна довжина (для строкових типів)
    IS_NULLABLE,        -- Чи може стовпець містити NULL
    COLUMN_DEFAULT,     -- Значення за замовчуванням
    NUMERIC_PRECISION,  -- Точність для числових типів
    NUMERIC_SCALE,      -- Масштаб для числових типів
    DATETIME_PRECISION, -- Точність для типів datetime
    COLUMN_KEY,         -- Індекс (наприклад, PRI для первинного ключа)
    EXTRA,              -- Додаткові властивості (наприклад, auto_increment)
    PRIVILEGES          -- Привілеї
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'restaurant_booking' AND TABLE_NAME = 'reservations';

ALTER TABLE reservations DROP FOREIGN KEY reservations_ibfk_2;
ALTER TABLE reservations ADD CONSTRAINT reservations_ibfk_2 FOREIGN KEY (guest_id) REFERENCES guests (guest_id);

SHOW CREATE TABLE reservations;
ALTER TABLE reservations DROP FOREIGN KEY reservations_ibfk_2;



-- 1. Видалення поточного зовнішнього ключа
ALTER TABLE reservations DROP FOREIGN KEY reservations_ibfk_2;

-- 2. Зміна поля `guest_id` на унікальне, щоб забезпечити зв'язок "один до одного"
ALTER TABLE reservations ADD CONSTRAINT UNIQUE (guest_id);

-- 3. Додавання зовнішнього ключа з обмеженням "один до одного"
ALTER TABLE reservations
ADD CONSTRAINT FOREIGN KEY (guest_id) REFERENCES guests(guest_id)
ON DELETE CASCADE ON UPDATE CASCADE;


SELECT 
    r.reservation_id,
    g.full_name AS guest_name,
    g.phone_number,
    g.email,
    g.telegram_id,
    t.table_number,
    t.location,
    r.guest_count,
    r.reservation_date,
    r.reservation_time
FROM reservations r
JOIN guests g ON r.guest_id = g.guest_id
JOIN tables t ON r.table_id = t.table_id
ORDER BY r.reservation_date, r.reservation_time;

