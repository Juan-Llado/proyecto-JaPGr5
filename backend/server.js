const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'MiPass123!', // PON AQUÍ TU PASSWORD DE MARIADB
    database: 'ecommerce'
};

const pool = mysql.createPool(dbConfig);

app.post('/cart', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { userId, items } = req.body;
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                error: 'Se requiere un array de items' 
            });
        }

        await connection.beginTransaction();

        let total = 0;
        for (const item of items) {
            total += item.price * item.quantity;
        }

        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
            [userId || null, total, 'pending']
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            const subtotal = item.price * item.quantity;
            
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.productId, item.quantity, item.price, subtotal]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Carrito guardado exitosamente',
            orderId: orderId,
            total: total
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error al guardar el carrito:', error);
        res.status(500).json({ 
            error: 'Error al procesar el carrito',
            details: error.message 
        });
    } finally {
        connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});