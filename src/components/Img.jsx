import axios from 'axios';
import React, { useEffect, useState } from 'react';
import mountain from '../assets/mountain.png';

function Img({ data }) {
  const [images, setImages] = useState([]);

  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const query = encodeURIComponent(data.명산_이름);
        const img = await axios.get(`https://dapi.kakao.com/v2/search/image?query=${query}`, {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`
          }
        });
        // console.log('뭐가뜰까:', img);
        setImages(img.data.documents[0]);
      } catch (error) {
        console.error('불러오기 실패:', error);
      }
    };
    fetchImages();
  }, [REST_API_KEY]);

  return <div>{images.length === 0 ? <img src={mountain} /> : <img src={images.image_url} />}</div>;
}

export default Img;
