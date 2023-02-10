const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { BadRequestError } = require('../errors/index.js');
const db = require('../db');

const createProduct = async (req, res) => {
  const { productName } = req.body;

  if (!req.files)
    throw new BadRequestError('Veuillez fournir au moins une image');

  const images = Object.values(req.files).map((image) => image.tempFilePath);
  // Uploader les images sur Cloudinary
  const uploadPromises = images.map((image) => {
    return cloudinary.uploader.upload(image, {
      use_filename: true,
      folder: 'file-upload'
    });
  });

  const uploadedImages = await Promise.all(uploadPromises);
  const imageUrls = uploadedImages.map(
    (uploadedImage) => uploadedImage.secure_url
  );

  // Supprimer les images temporaires
  images.forEach((image) => {
    fs.unlinkSync(image);
  });

  // Enregistrer les informations du produit
  const productResult = await db.query(
    'INSERT INTO products(name) VALUES($1) RETURNING id',
    [productName]
  );
  const productId = productResult.rows[0].id;

  // Enregistrer les URL des images associées à ce produit
  for (let i = 0; i < imageUrls.length; i++) {
    await db.query(
      'INSERT INTO product_images(product_id, url) VALUES($1, $2)',
      [productId, imageUrls[i]]
    );
  }

  res.json({ productName, imageUrls });
};

const getAllProducts = async (_req, res) => {
  // Obtenir la liste de tous les produits avec leurs images associées
  const { rows: products } = await db.query(
    'SELECT products.name, product_images.url FROM products JOIN product_images ON products.id = product_images.product_id'
  );

  res.json({ products });
};

module.exports = { createProduct, getAllProducts };
