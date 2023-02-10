CREATE DATABASE multiple_file_upload;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  url TEXT NOT NULL
);
