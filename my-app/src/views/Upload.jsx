import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useForm from '../hooks/formHooks';
import { useFile, useMedia } from '../hooks/apiHooks';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const { postFile } = useFile();
  const { postMedia } = useMedia();
  const navigate = useNavigate();

  const doUpload = async (inputs) => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to upload a file');
      }

      const fileData = await postFile(file, token);
      await postMedia(fileData, inputs, token);
      navigate('/');
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(doUpload, {
    title: '',
    description: '',
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : '');
  };

  return (
    <>
      <h1>Upload</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            type="text"
            id="title"
            value={inputs.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            rows={5}
            id="description"
            value={inputs.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="file">File</label>
          <input
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </div>
        <img
          src={previewUrl || 'https://placehold.co/200?text=Choose+image'}
          alt="preview"
          width="200"
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={!file || inputs.title.length <= 3}>
          Upload
        </button>
      </form>
    </>
  );
};

export default Upload;
