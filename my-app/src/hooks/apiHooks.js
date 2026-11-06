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

const useAuthentication = () => {
  const postLogin = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    const loginResult = await fetchData(
      `${import.meta.env.VITE_AUTH_API}/auth/login`,
      fetchOptions,
    );
    return loginResult;
  };

  return { postLogin };
};

export { useAuthentication, useMedia };
