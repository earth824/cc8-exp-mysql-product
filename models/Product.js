const db = require('../utils/db');

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  static findAll() {
    return db.execute('SELECT * FROM products').then(res => res[0]);
  }

  static findById(id) {
    return (
      db
        .execute('SELECT * FROM products WHERE id = ?', [id])
        // .then(res => (res[0].length ? res[0][0] : null));
        .then(([res]) => (res.length ? res[0] : null))
    );
  }

  static create(product) {
    return db
      .execute('INSERT INTO products (name, price) VALUES (?, ?)', [
        product.name,
        product.price
      ])
      .then(([res]) => {
        if (res.affectedRows)
          return { id: res.insertId, name: product.name, price: product.price };
        throw new Error('cannot create product: 0 affected rows');
      });
  }

  static deleteById(id) {
    return db
      .execute('DELETE FROM products WHERE id = ?', [id])
      .then(([result]) => {
        if (result.affectedRows) return result.affectedRows;
        throw new Error('product id is not found');
      });
  }

  save() {
    return db
      .execute('INSERT INTO products (name, price) VALUES (?, ?)', [
        this.name,
        this.price
      ])
      .then(([res]) => {
        console.log(res);
        if (res.affectedRows) {
          this.id = res.insertId;
          return this;
        }
        throw new Error('cannot create product: 0 affected rows');
      });
  }
}

module.exports = Product;
