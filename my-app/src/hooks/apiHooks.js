import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { fetchData } from '../utils/fetchData';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMedia = async () => {
      try {
        const token = localStorage.getItem('token');
        const fetchOptions = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await fetchData(
          `${import.meta.env.VITE_MEDIA_API}/media`,
          fetchOptions,
        );
        const media = Array.isArray(response)
          ? response
          : response.data ?? response.media;
        if (!Array.isArray(media)) {
          throw new Error('Media API response did not contain a media list');
        }
        setMediaArray(media);
      } catch (error) {
        console.error(error);
      }
    };

    getMedia();
  }, []);

  const postMedia = useCallback(async (file, inputs, token) => {
    if (!file?.filename || file.filesize == null || !file.media_type) {
      throw new Error('File upload response did not include required file details');
    }

    const media = {
      filename: file.filename,
      filesize: file.filesize,
      media_type: file.media_type,
      title: inputs.title,
      description: inputs.description,
    };
    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(media),
    };
    const response = await fetchData(
      `${import.meta.env.VITE_MEDIA_API}/media`,
      fetchOptions,
    );
    return response.data ?? response;
  }, []);

  const deleteMedia = useCallback(async (mediaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to delete media');
    }

    const response = await fetchData(
      `${import.meta.env.VITE_MEDIA_API}/media/${mediaId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    navigate(0);
    return response.data ?? response;
  }, [navigate]);

  const modifyMedia = useCallback(async (mediaId, inputs) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to modify media');
    }

    const response = await fetchData(
      `${import.meta.env.VITE_MEDIA_API}/media/${mediaId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      },
    );
    navigate(0);
    return response.data ?? response;
  }, [navigate]);

  return { mediaArray, postMedia, deleteMedia, modifyMedia };
};

const useFile = () => {
  const postFile = useCallback(async (file, token) => {
    const uploadServer = import.meta.env.VITE_UPLOAD_SERVER;
    if (!uploadServer) {
      throw new Error('VITE_UPLOAD_SERVER is not configured');
    }

    const formData = new FormData();
    formData.append('file', file);

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    const response = await fetchData(`${uploadServer}/upload`, fetchOptions);
    return response.data ?? response;
  }, []);

  return { postFile };
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

export { useAuthentication, useFile, useMedia, useUser };
