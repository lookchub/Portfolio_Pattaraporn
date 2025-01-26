/*
- Testing Select all product
Method : GET
URL: http://localhost:3000/products

- Testing Select product by name and category
Method : POST
URL: http://localhost:3000/search
Body: raw JSON
{
    "PDName": "Hai",
    "Tag": "Pre-Order",
    "MinPrice": null,
    "MaxPrice": 3000,
    "category": "Goods",
    "sort": "ASC"
}

- Testing register insert new admin with Picture
Method : POST
URL: http://localhost:3000/register-submit
Body: form-data
KEY   VALUES
AMFName  JJ type:text
AMLName  JJ type:text
AMEmail   JJ@gmail.com type:text
AMTelephone 083-000-0000  type:text
AMUsername  JJ type:text
AMPassword  JJ type:text
AMFPic  (use your local picture (.png only)) type:file

- Login with valid Username and Password
Method : POST
URL: http://localhost:3000/login
Body: raw JSON
{
    "username": "6687019",
    "password": "000000000"
}
- Login with invalid Username and Password
Method : POST
URL: http://localhost:3000/login
Body: raw JSON
{
    "username": "6687019",
    "password": "11"

- Testing Add product
Method: PUT
URL: http://localhost:3000/add-product
Body: form data
Key Value Type
Editer 6687015 Text
PDSKU 0000000 Text
PDName Mochi Text
PDCategory Gooods Text
PDTag Haikyu!! Text
PDPrice 2500.00 Text
status active Text
picture Haikuy-mochi.jpg File

- Testing Edit product
Method: PUT
URL: http://localhost:3000/update_product/4544815079777 
Body: form-data
Key Value Type
Editer 6687015 Text
PDSKU 4544815079777 Text
PDName Hikyu Mochi Text
PDCategory Popular Items Text
PDTag Hikyuu!! Text
PDPrice 2500.00 Text
status active Text

- Testing Edit admin
Method: PUT
URL: http://localhost:3000/update_admin/1 
Body: form-data
Key Value Type
first_name Sutarnthip Text
last_name Luangthip Text
email sutarnthip.lua@student.mahidol.edu Text
tel 9876543210 Text
username 6687057 Text
password 123456 Text

- Testing Delete admin
Method: DELETE
URL: http://localhost:3000/delete-admin/1
- Testing Delete product
Method: DELETE
URL: http://localhost:3000/delete-product/4544815079777
*/


const fs = require("fs");
const express = require("express");
const path = require('path');
const port = 3030;

// สร้างแอป Express  
const multer = require("multer");
const mysql = require('mysql2');
const cors = require("cors");

const app = express();
const dotenv = require("dotenv");
dotenv.config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

// const htmlFolderPath = path.join(__dirname, "../../sec2_gr6_fe_src/html");
// const staticFolderPath = path.join(__dirname, "../../sec2_gr6_fe_src/static");
// app.use(express.static(staticFolderPath));


const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.DB_user,
    password: process.env.DB_pass,
    database: process.env.DB_name,
});

// จจ 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Upload directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });


connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1); // หยุดโปรแกรมถ้าฐานข้อมูลเชื่อมต่อไม่ได้
    }
    console.log(`Connected to DB: ${process.env.DB_name}`);
});

// API routes
app.get("/products", (req, res) => {
    const query = `
        SELECT 
            SKU, 
            Name, 
            Price, 
            Tag, 
            Category, 
            image, 
            status
        FROM products;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            res.status(500).send("Error fetching products");
        } else {
            res.json(results);
        }
    });
});


app.get("/learnmore/:SKU", (req, res) => {
    const { SKU } = req.params;

    const query = `
        SELECT 
            SKU, 
            Name, 
            Price, 
            Tag, 
            Category, 
            image, 
            status
        FROM products
        WHERE SKU = ?;
    `;

    connection.query(query, [SKU], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            res.status(500).send("Error fetching product");
        } else if (results.length === 0) {
            res.status(404).send("Product not found");
        } else {
            res.json(results[0]); // ส่งเฉพาะสินค้าเดียว
        }
    });
});


app.post('/login', (req, res) => {
    console.log("test login");
    const { username, password } = req.body;

    // ตรวจสอบข้อมูลในตาราง Admin
    const query = 'SELECT * FROM administrator WHERE username = ? AND password = ?';
    connection.execute(query, [username, password], (err, result) => {
        if (err) {
            console.log("database error");
            return res.status(500).send('Database error');
        }

        if (result.length > 0) {
            // ถ้าพบข้อมูลใน Admin
            const insertQuery = 'INSERT INTO login_logs (Username, password) VALUES (?, ?)';
            connection.execute(insertQuery, [username, password], (err, insertResult) => {
                if (err) {
                    console.log("insert login log");
                    return res.status(500).send('Error logging login attempt');
                }
                res.send('Login successful!');
            });
        } else {
            // ถ้าไม่พบข้อมูล
            console.log("invalid");
            res.send('Invalid username or password!');
        }
    });
});

app.get("/login", (req, res) => {
    console.log("req select all")
    let sql = `select * from administrator ;`
    connection.query(sql, function (err, result) {
        if (err) {
            throw error;
        }
        res.json(result)
    });
});

app.post("/search", (req, res) => {
    const { PDName, tags, minPrice, maxPrice, category, sort } = req.body;
    let query = `
        SELECT SKU, Name, Price, Tag, Category, image, status
        FROM products
        WHERE 1 = 1
    `;
    let queryParams = [];

    // ค้นหาชื่อสินค้าด้วย LIKE
    if (PDName) {
        query += ' AND Name LIKE ?';
        queryParams.push(`%${PDName}%`);
    }

    // ค้นหาตามแท็ก (ใช้ LIKE เพื่อให้ยืดหยุ่น)
    if (tags) {
        query += ' AND Tag LIKE ?';
        queryParams.push(`%${tags}%`);
    }

    // ค้นหาตามหมวดหมู่
    if (category) {
        query += ' AND Category = ?';
        queryParams.push(category);
    }

    // ค้นหาตามช่วงราคาที่กำหนด
    if (minPrice) {
        query += ' AND Price >= ?';
        queryParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
        query += ' AND Price <= ?';
        queryParams.push(parseFloat(maxPrice));
    }

    // การจัดเรียง
    if (sort) {
        query += ` ORDER BY Price ${sort}`;
    }

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error searching products:", err);
            res.status(500).send("Error searching products");
        } else {
            res.json(results);
        }
    });
});




// ALREADY
app.get("/category/:Category", (req, res) => {
    console.log("test category")
    const Category = decodeURIComponent(req.params.Category);

    const query = `
        SELECT 
            SKU, Name, Price, Tag, Category, image, status
        FROM products
        WHERE Category = ? AND status = 'active';
    `;

    connection.query(query, [Category], (err, results) => {
        if (err) {
            console.error("Error fetching products by category:", err);
            return res.status(500).send("Error fetching products by category");
        }
        if (results.length === 0) {
            return res.status(404).send("No products found in this category");
        }
        res.json(results);
    });
});




app.post('/register-submit', upload.single('AMFPic'), (req, res) => {
    const { AMFName, AMLName, AMEmail, AMTelephone, AMUsername, AMPassword } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send('File upload is required.');
    }

    // Insert administrator details into the administrators table
    const adminSql = `INSERT INTO administrator (first_name, last_name, email, telephone, username, password, profile_image)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const adminValues = [
        AMFName,
        AMLName,
        AMEmail,
        AMTelephone,
        AMUsername,
        AMPassword, // You may want to hash the password for security
        file.filename // Save the uploaded file's unique name
    ];

    connection.query(adminSql, adminValues, (adminErr, adminResult) => {
        if (adminErr) {
            console.error('Error inserting administrator:', adminErr);
            return res.status(500).send('Error saving administrator.');
        }

        const adminId = adminResult.insertId; // Get the inserted administrator's ID

        // Insert file details into the uploads table
        const uploadSql = `INSERT INTO uploads (original_name, saved_name, path, mimetype, size, admin_id)
                           VALUES (?, ?, ?, ?, ?, ?)`;

        const uploadValues = [
            file.originalname,          // Original file name
            file.filename,              // Unique saved name
            `uploads/${file.filename}`, // File path
            file.mimetype,              // File MIME type
            file.size,                  // File size
            adminId                     // Link to the administrator
        ];

        connection.query(uploadSql, uploadValues, (uploadErr, uploadResult) => {
            if (uploadErr) {
                console.error('Error inserting upload:', uploadErr);
                return res.status(500).send('Error saving file upload.');
            }

            // Once everything is done, send a success message
            res.status(200).send('Registration successful');
        });
    });
});


/*ดึงข้อมูลจากproductsมาแสดงในหน้าproduct management*/
app.get('/product-management', (req, res) => {
    const query = 'SELECT * FROM products';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

/*ดึงข้อมูลจากadministratorมาแสดงในหน้าadmin management*/
app.get('/admin-management', (req, res) => {
    const query = 'SELECT id, first_name, last_name, email, telephone, username, profile_image FROM administrator';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send(err);
            return;
        }

        console.log('Fetched results:', results);  // เช็คผลลัพธ์ที่ได้
        res.json(results);
    });
});


/*Add product*/
app.post('/add-product', upload.single('picture'), (req, res) => {
    console.log("add product")
    const { Editer, PDSKU, PDName, PDCategory, PDTag, PDPrice, status } = req.body;
    const file = req.file;


    if (!file) {
        return res.status(400).send('File upload is required.');
    }
        const productQuery = `
        INSERT INTO products (image, sku, name, category, tag, price, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const productValues = [
        `${file.filename}`, // Save relative file path
        PDSKU,
        PDName,
        PDCategory,
        PDTag,
        PDPrice,
        status
    ];

    connection.query(productQuery, productValues, (productErr, productResult) => {
        if (productErr) {
            console.error('Error inserting product:', productErr);
            return res.status(500).json({ error: 'Error saving product.' });
        }

        // Insert log into action_logs table
        const actionQuery = `
            INSERT INTO action_logs (admin_id, sku, action) 
            VALUES (?, ?, 'Add product');
        `;
        const actionValues = [Editer, PDSKU];

        connection.query(actionQuery, actionValues, (actionErr) => {
            if (actionErr) {
                console.error('Error inserting action log:', actionErr);
                return res.status(500).json({ error: 'Error saving action log.' });
            }

            // Insert file details into uploads table
            const uploadSql = `
                INSERT INTO uploadsPD (original_name, saved_name, path, mimetype, size, sku)
                VALUES (?, ?, ?, ?, ?, ?);
            `;
            const uploadValues = [
                file.originalname,          // Original file name
                file.filename,              // Unique saved name
                `${file.filename}`, // File path
                file.mimetype,              // File MIME type
                file.size,                  // File size
                PDSKU                       // Link to the product
            ];

            connection.query(uploadSql, uploadValues, (uploadErr,uploadResult) => {
                if (uploadErr) {
                    console.error('Error inserting upload:', uploadErr);
                    return res.status(500).json({ error: 'Error saving file upload.' });
                }

                res.redirect('/product-management'); // Redirect after successful addition
            });
        });
    });
});

/*Add admin*/
app.post('/add-admin', upload.single('picture'), (req, res) => {
    const { id, first_name, last_name, email, tel, username, password, editer } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send('File upload is required.');
    }

    // Insert administrator details into the administrators table
    const adminQuery = `
        INSERT INTO administrator (id,first_name ,last_name , email, telephone, username, password , profile_image) 
        VALUES (?, ?, ?, ?, ?, ?, ?,?);
    `;

    const adminValues = [
        id,
        first_name,
        last_name,
        email,
        tel,
        username,
        password,
        `${file.filename}`
    ];

    connection.query(adminQuery, adminValues, (productErr, productResult) => {
        if (productErr) {
            console.error('Error Adding admin:', productErr);
            return res.status(500).json({ error: 'Error.' });
        }

        // Insert log into action_logs table
        const actionQuery = `
        INSERT INTO action_admin (EditBy, admin_id, action) 
        VALUES (?, ?, 'Add Admin');
        `;
        const actionValues = [editer, id];

        connection.query(actionQuery, actionValues, (actionErr) => {
            if (actionErr) {
                console.error('Error inserting action log:', actionErr);
                return res.status(500).json({ error: 'Error saving action log.' });
            }

            // Insert file details into uploads table
            const uploadSql = `
                INSERT INTO uploads (original_name, saved_name, path, mimetype, size, admin_id)
                VALUES (?, ?, ?, ?, ?, ?);
            `;
            const uploadValues = [
                file.originalname,          // Original file name
                file.filename,              // Unique saved name
                `${file.filename}`, // File path
                file.mimetype,              // File MIME type
                file.size,                  // File size
                id                       // Link to the product
            ];

            connection.query(uploadSql, uploadValues, (uploadErr, uploadResult) => {
                if (uploadErr) {
                    console.error('Error inserting upload:', uploadErr);
                    return res.status(500).json({ error: 'Error saving file upload.' });
                }

                res.redirect('/admin-management'); // Redirect after successful addition
            });
        });
    });
});

/*Fetching admin data*/
app.get('/admin/:id', (req, res) => {
    // if (!req.session.user) {
    //     return res.status(401).send('Not logged in');
    // }

    const adminId = req.params.id; // Assume user session contains admin's ID
    const query = 'SELECT * FROM administrator WHERE id = ?';

    connection.query(query, [adminId], (err, results) => {
        if (err) {
            console.error('Error fetching admin data:', err);
            return res.status(500).send('Error fetching admin data');
        }

        if (results.length > 0) {
            res.json(results[0]); // Send back the first admin result
        } else {
            res.status(404).send('Admin not found');
        }
    });
});
/*Update admin */
const upload2 = multer();
app.put('/update_admin/:id', upload2.none(), (req, res) => {
    // if (!req.session.user) {
    //     return res.status(401).send('Not logged in');
    // }   //เช็คว่าuserนี้ได้ล็อคอินมั้ย

    const adminId = req.params.id
    const { first_name, last_name, tel, email, username, password } = req.body;
    console.log('Parsed Body:', req.body);

    const query = `UPDATE administrator SET 
        first_name = ?, 
        last_name = ?, 
        telephone = ?, 
        email = ?, 
        username = ?, 
        password = ? 
    WHERE id = ?`;

    connection.query(query, [first_name, last_name, tel, email, username, password, adminId], (err, results) => {
        if (err) {
            console.error('Error updating admin data:', err);
            return res.status(500).send('Error updating admin data');
        }

        res.send('Admin data updated successfully');
    });
});

/*Fetching Product data*/
app.get('/product/:sku', (req, res) => {
    const PDSKU = req.params.sku; 
    const query = 'SELECT * FROM products WHERE sku = ?';

    connection.query(query, [PDSKU], (err, results) => {
        if (err) {
            console.error('Error fetching product data:', err);
            return res.status(500).send('Error fetching product data');
        }

        if (results.length > 0) {
            res.json(results[0]); 
        } else {
            res.status(404).send('Product not found');
        }
    });
});
/*edit product */
app.put('/update_product/:sku', upload2.none(), (req, res) => {
    const PDSKU = req.params.sku
    console.log(PDSKU)
    const { PDName, PDCategory, PDTag, PDPrice, status } = req.body;
    console.log('Parsed Body:', req.body);

    const query = `UPDATE products SET 
        name = ?, 
        category = ?, 
        tag = ?, 
        price = ?, 
        status = ? 
    WHERE sku = ?`;

    connection.query(query, [PDName, PDCategory, PDTag, PDPrice, status, PDSKU], (err, results) => {
        if (err) {
            console.error('Error updating product data:', err);
            return res.status(500).send('Error updating product data');
        }

        res.send('Product data updated successfully');
    });
});

/*Delete product*/
app.delete('/delete-product/:sku', (req, res) => {
    const sku = req.params.sku;
    const query = "DELETE FROM products WHERE sku = ?"
    connection.query(query, [sku], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json({ msg: "Deleted" });
    })
}
)
/*Delete Admin*/
app.delete('/delete-admin/:id', (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM administrator WHERE id = ?"
    connection.query(query, [id], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json({ msg: "Deleted" });
    })
}
)

/*Search admin by id*/
app.get('/admin-management/:id', (req, res) => {
    const id = req.params.id;

    const query = 'SELECT id, first_name, last_name, email, telephone, profile_image FROM administrator WHERE id = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching admin:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json(results[0]);
    });
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
