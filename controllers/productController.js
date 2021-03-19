const db = require('../utils/db');
const Product = require('../models/Product');

exports.getAllProducts = async (req, res, next) => {
  // pool.execute('SELECT * FROM products', (err, result, fields) => {
  //   res.status(200).json({ products: result });
  // });
  // try {
  //   const result = await db.execute('SELECT * FROM products');
  //   res.status(200).json({ products: result[0] });
  // } catch (err) {
  //   next(err);
  // }
  try {
    const products = await Product.findAll();
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const result = await db.execute('SELECT * FROM products WHERE id = ?', [
    //   id
    // ]);

    // res.status(200).json({ product: result[0].length ? result[0][0] : null });
    const product = await Product.findById(id);
    res.status(200).json({ product });
  } catch (err) {
    res.status(200).json({ message: 'Get Product' });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ message: 'name is required' });
    if (price === undefined)
      return res.status(400).json({ message: 'price is required' });
    if (!(+price > 0))
      return res
        .status(400)
        .json({ message: 'price must be numeric and greater than zero' });

    // const result = await db.execute(
    //   'INSERT INTO products (name, price) VALUES (?, ?)',
    //   [name, price]
    // );

    const product = await Product.create({ name, price });

    // const product = new Product(name, price); // {name: , price: }
    // await product.save();

    res.status(200).json({ product: product });
  } catch (err) {
    next(err);
  }

  // pool.execute(
  //   `INSERT INTO products (name, price) VALUES (?, ?)`,
  //   [name, price],
  //   (err, result) => {
  //     if (err) return res.status(500).json({ message: err.message });
  //     console.log(result.insertId);
  //     res.status(200).json({ message: 'Create Product' });
  //   }
  // );
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const { id } = req.params;

    if (!name || !name.trim())
      return res.status(400).json({ message: 'name is required' });
    if (price === undefined)
      return res.status(400).json({ message: 'price is required' });
    if (!(+price > 0))
      return res
        .status(400)
        .json({ message: 'price must be numeric and greater than zero' });

    const resultProduct = await db.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!resultProduct[0].length)
      return res
        .status(400)
        .json({ message: 'product with this id is not found' });

    await db.execute('UPDATE products SET name = ?, price = ? WHERE id = ?', [
      name,
      price,
      id
    ]);
    res.status(200).json({ message: 'Update product success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const resultProduct = await db.execute(
    //   'SELECT * FROM products WHERE id = ?',
    //   [id]
    // );

    // if (!resultProduct[0].length)
    //   return res
    //     .status(400)
    //     .json({ message: 'product with this id is not found' });

    // await db.execute('DELETE FROM products WHERE id = ?', [id]);

    const affectRow = await Product.deleteById(id);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
