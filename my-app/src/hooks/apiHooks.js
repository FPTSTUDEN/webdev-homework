import { useCallback, useEffect, useState } from 'react';
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

const useUser = () => {
  const postUser = useCallback(async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return fetchData(`${import.meta.env.VITE_AUTH_API}/users`, fetchOptions);
  }, []);

  const getUserByToken = useCallback(async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return fetchData(`${import.meta.env.VITE_AUTH_API}/users/token`, fetchOptions);
  }, []);

  return { getUserByToken, postUser };
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

export { useAuthentication, useMedia, useUser };
