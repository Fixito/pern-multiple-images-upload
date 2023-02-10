import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const fetchProducts = async () => {
    try {
      const {
        data: { products }
      } = await axios('http://localhost:5000/api/v1/products');
      setProducts(products);
      console.log(products);
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    // Limiter à 5 images
    if (e.target.files.length <= 5) {
      setImages([...images, ...e.target.files]);

      // Prévisualiser les images
      const newPreviewImages = [];

      for (const file of e.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          newPreviewImages.push(reader.result);
          setPreviewImages(newPreviewImages);
        };
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Envoyer les informations du produit au backend
    const formData = new FormData();
    formData.append('productName', productName);

    images.forEach((image, index) => {
      formData.append(`image-${index}`, image);
    });

    try {
      // Envoyer les données du formulaire à l'API
      const { data: product } = await axios.post(
        'http://localhost:5000/api/v1/products',
        formData
      );
      setProducts([...products, product]);
    } catch (error) {
      console.log(error);
    }

    setProductName('');
    setPreviewImages([]);
    e.target.reset();
  };

  return (
    <main>
      <form className='form' onSubmit={handleSubmit}>
        <h4>Ajouter un produit</h4>
        <div className='form-row'>
          <label htmlFor='productName' className='form-label'>
            Nom du produit :
          </label>
          <input
            type='text'
            className='form-input'
            id='productName'
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
          />
        </div>

        <div className='form-row'>
          <label htmlFor='images' className='form-label'>
            Images :
          </label>
          <input
            type='file'
            className='form-input'
            multiple
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>

        <div className='image-previewer'>
          {previewImages.map((previewImage, index) => (
            <img className='img' key={index} src={previewImage} alt='Preview' />
          ))}
        </div>

        <button type='submit' className='btn btn-block'>
          Soumettre
        </button>
      </form>
    </main>
  );
};

export default App;
