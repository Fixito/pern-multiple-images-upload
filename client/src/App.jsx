import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [images, setImages] = useState([]);

  const handleImageChange = async (e) => {
    e.preventDefault();

    try {
      setImages(e.target.files);

      const formData = new FormData();

      Array.from(images).forEach((image) => {
        formData.append('image', image);
      });

      const data = await axios.post(
        'http://localhost:5000/api/v1/products/uploads',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    } catch (error) {
      console.error(error.response.data.msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');
  };

  return (
    <main>
      <h1>Uploader plusieurs images</h1>
      <form>
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={handleImageChange}
        />
        <button type='submit'>Soumettre</button>
      </form>
    </main>
  );
};

export default App;
