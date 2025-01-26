SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+07:00";


create database sec2_gr6_database;
use sec2_gr6_database;

-- CREATE TABLE product (
--     SKU VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL PRIMARY KEY,
--     Name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
--     Price INT,
--     Tag VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
--     Category VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
	image VARCHAR(255),
    SKU VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL PRIMARY KEY,
    Name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    Price DECIMAL(10, 2),
    Tag VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    Category VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    status ENUM('active', 'inactive')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


select * from products;
select * from action_logs;
DELETE FROM products WHERE SKU = null;
select * from administrator;
-- DELETE FROM products;

SELECT * FROM administrator WHERE username = "6687019" AND password = "000000000";
select * from login_logs;
-- Main products
INSERT INTO products (image,SKU, Name, Price, Tag, Category,status)
VALUES 
('4535123842283-3.jpg','4535123842283', 'Haikyu Look Up Bokuto Kotaro Uniform Ver.', 1520, 'Pre-Order', 'Goods','active'),
('4544815079777-768x576.jpg','4544815079777', 'Haikyu Mochi Mochi Mascot Vol.5 (Re-Sale)', 2700, 'Pre-Order', 'Goods','active'),
('4550621139529.jpg','4550621139529', 'Haikyu – Chara Badge Collection', 162, 'New', 'Goods','active');

INSERT INTO products (image,SKU, Name, Price, Tag, Category,status)
VALUES 
('4571542977878.jpg','4571542977878', 'Haikyu – NEW Acrylic Stand Festival Miya Osamu', 556, 'New', 'Popular Items','active'),
('91eGNKIi9lL._AC_UF10001000_QL80_.jpg','9784087925869', 'Haikyu!! Complete Illustration book Owari to Hajimari', 1647, 'Pre-Order', 'Book/Comic','active'),
('4580590202368-1-768x497.webp','4580590202368', 'Haikyu!! – Nendoroid Surprise Haikyu!! Nationals Arc', 1647, 'New', 'Popular Items','active'),
('4580590200418.webp','4580590200418', 'Haikyu!! – Qset+ Tetsuro Kuroo & Kenma Kozume', 1986, 'sale', 'Figure','active');

-- DELETE FROM products WHERE SKU = 4544815079779;




CREATE TABLE uploadsPD (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,  -- The original name of the file
    saved_name VARCHAR(255) NOT NULL,     -- The unique name of the file saved on the server
    path VARCHAR(255) NOT NULL,           -- File path relative to the server root
    mimetype VARCHAR(50),                 -- The file type (e.g., image/jpeg)
    size INT,                             -- The file size in bytes
    upload_date DATETIME DEFAULT NOW(),   -- Timestamp of when the file was uploaded

    -- Foreign key to link to the administrators table
    sku varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    FOREIGN KEY (sku)  REFERENCES products(sku) ON DELETE CASCADE
);

-- CREATE TABLE product_images (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     SKU VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
--     image_path VARCHAR(255) NOT NULL,
--     image_order INT DEFAULT 1,
--     FOREIGN KEY (SKU) REFERENCES product(SKU) ON DELETE CASCADE,
--     INDEX idx_sku (SKU)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- select * from product ;
-- select * from product p left JOIN product_images pi ON p.SKU = pi.SKU; 

-- INSERT INTO product (SKU, Name, Price, Tag, Category)
-- VALUES 
-- ('4535123842283', 'Haikyu Look Up Bokuto Kotaro Uniform Ver.', 1520, 'Pre-Order', 'Popular Items'),
-- ('4544815079777', 'Haikyu Mochi Mochi Mascot Vol.5 (Re-Sale)', 2700, 'Sale', 'Goods'),
-- ('4550621139529', 'Haikyu – Chara Badge Collection', 162, 'New', 'Figure');

-- INSERT INTO product_images (SKU, image_path, image_order)
-- VALUES 
-- ('4535123842283', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4535123842283-3.jpg', 1),
-- ('4535123842283', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4535123842283-4.jpg', 2),
-- ('4544815079777', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4544815079777-768x576.jpg', 1),
-- ('4544815079777', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4544815079777-1.jpg', 2),
-- ('4544815079777', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4544815079777-2-768x576.jpg', 3),
-- ('4550621139529', 'https://animatebkk-online.com/wp-content/uploads/2024/10/4550621139529.jpg', 1);

-- SHOW GRANTS FOR 'testproject'@'localhost';

-- INSERT INTO product (SKU, Name, Price, Tag, Category)
-- VALUES ('4580590200500', 'Haikyu!! – Qset+ Shoyo Hinata & Tobio Kageyama', 1986, 'Pre-Order', 'Figure');

-- INSERT INTO product_images (SKU, image_path, image_order)
-- VALUES 
-- ('4580590200500', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4580590200500.webp', 1);

-- INSERT INTO product (SKU, Name, Price, Tag, Category)
-- VALUES ('9784087925869', 'Haikyu!! Complete Illustration book Owari to Hajimari', 1647, 'Shueisha', 'Book/Comic'),
-- ('4580683621816', 'Haikyu Tenorinzu Collection 2', 314, 'New', 'Goods');

-- INSERT INTO product_images (SKU, image_path, image_order)
-- VALUES
-- ('9784087925869', 'https://animatebkk-online.com/wp-content/uploads/2021/05/91eGNKIi9lL._AC_UF10001000_QL80_.jpg', 1),
-- ('9784087925869', 'https://animatebkk-online.com/wp-content/uploads/2020/10/22041580805184_453-768x567.jpg', 2),
-- ('9784087925869', 'https://animatebkk-online.com/wp-content/uploads/2020/11/hkowari-1-768x541.jpg', 3),
-- ('4580683621816', 'https://animatebkk-online.com/wp-content/uploads/2024/05/4580683621816-768x768.jpg', 1),
-- ('4580683621816', 'https://animatebkk-online.com/wp-content/uploads/2024/05/4580683621816-1-768x768.jpg', 2),
-- ('4580683621816', 'https://animatebkk-online.com/wp-content/uploads/2024/05/4580683621816-2.jpg', 3);

-- INSERT INTO product (SKU, Name, Price, Tag, Category)
-- VALUES ('4580590203099', 'Haikyu!! Complete Illustration book Owari to Hajimari', 1691, 'Pre-Order', 'Figure'),
-- ('4580590200418', 'Haikyu!! – Qset+ Tetsuro Kuroo & Kenma Kozume', 1986, 'Pre-Order', 'Figure');

-- INSERT INTO product (SKU, Name, Price, Tag, Category)
-- VALUES ('4580590202368', 'Haikyu!! – Nendoroid Surprise Haikyu!! Nationals Arc', 3639, 'Pre-Order', 'Figure');

-- INSERT INTO product (SKU, Name, Price, Tag, Category)
-- VALUES ('4580590200715', 'Haikyu!! – Nendoroid Osamu Miya: School Uniform Ver.', 1691, 'Pre-Order', 'Figure');

-- INSERT INTO product (SKU, Name, Price, Tag, Category)
-- VALUES ('4580590200708', 'Haikyu!! – Nendoroid Atsumu Miya: School Uniform Ver.', 1691, 'Pre-Order', 'Figure');

-- INSERT INTO product_images (SKU, image_path, image_order)
-- VALUES
-- ('4580590203099', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4580590203099.webp', 1),
-- ('4580590203099', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4580590203099-5.webp', 2),
-- ('4580590202368', 'https://animatebkk-online.com/wp-content/uploads/2024/11/4580590202368-1-768x497.webp', 1),
-- ('4580590200715', 'https://animatebkk-online.com/wp-content/uploads/2024/10/4580590200715.jpg', 1),
-- ('4580590200715', 'https://animatebkk-online.com/wp-content/uploads/2024/10/4580590200715-4.jpg', 2),
-- ('4580590200715', 'https://animatebkk-online.com/wp-content/uploads/2024/10/4580590200715-2.jpg', 3),
-- ('4580590200708', 'https://animatebkk-online.com/wp-content/uploads/2024/10/4580590200708.jpg', 1),
-- ('4580590200708', 'https://animatebkk-online.com/wp-content/uploads/2024/10/4580590200708-2.jpg', 2),
-- ('4580590200708', 'https://animatebkk-online.com/wp-content/uploads/2024/10/4580590200708-4.jpg', 3),
-- ('4580590200708', 'https://animatebkk-online.com/wp-content/uploads/2024/10/4580590200708-5.jpg', 4);

-- DELETE FROM product_images WHERE SKU = 4580590200715;

-- SET SQL_SAFE_UPDATES = 0;
-- SET SQL_SAFE_UPDATES = 1;

-- CREATE TABLE Admin (
--   AdminID varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL PRIMARY KEY,
--   FName varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
--   LName varchar(100) NOT NULL,
--   Tel varchar(100) NOT NULL,
--   Email VARCHAR(255) NOT NULL UNIQUE,
--   username varchar(255) NOT NULL unique,
--   password VARCHAR(255) NOT NULL
--  
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- select * from admin;


CREATE TABLE administrator (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    telephone VARCHAR(15),
    username VARCHAR(50),
    password VARCHAR(255),
    profile_image VARCHAR(255) -- You can use this for a direct link to a profile image in the uploads table if necessary
);
select * from administrator;
INSERT INTO administrator (`first_name`, `last_name`,`email`, `telephone`, `username`, `password`,`profile_image`) VALUES
('Daraporn', 'Seapoo', 'daraporn.sap@student.mahidol.edu','0934399215','6687019','000000000','Image\Daraporn.png'); 

CREATE TABLE uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,  -- The original name of the file
    saved_name VARCHAR(255) NOT NULL,     -- The unique name of the file saved on the server
    path VARCHAR(255) NOT NULL,           -- File path relative to the server root
    mimetype VARCHAR(50),                 -- The file type (e.g., image/jpeg)
    size INT,                             -- The file size in bytes
    upload_date DATETIME DEFAULT NOW(),   -- Timestamp of when the file was uploaded

    -- Foreign key to link to the administrators table
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES administrator(id) ON DELETE CASCADE
);
select * from uploads;


CREATE TABLE login_logs (
    Username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    Login_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from login_logs;

-- Drop table login_logs;
-- commit ;

CREATE TABLE action_logs (
    admin_id INT,
    sku varchar(255),
    action varchar(255) NOT NULL, -- กิจกรรมที่ทำ เช่น เพิ่มสินค้า หรือ แก้ไขสินค้า
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- เวลาที่ดำเนินการ

);
CREATE TABLE action_admin (
    EditBy INT ,
    admin_id varchar(255),
    action varchar(255) NOT NULL, -- กิจกรรมที่ทำ เช่น เพิ่มสินค้า หรือ แก้ไขสินค้า
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- เวลาที่ดำเนินการ
);

select * from action_logs;
select * from action_admin;