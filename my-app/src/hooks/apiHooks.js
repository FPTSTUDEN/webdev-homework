import { useEffect, useState } from 'react';
import { fetchData } from '../utils/fetchData';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const json = await fetchData('test.json');
        setMediaArray(json);
        console.log(json);
      } catch (error) {
        console.error(error);
      }
    };

    getMedia();
  }, []);

  return { mediaArray };
};

export { useMedia };
