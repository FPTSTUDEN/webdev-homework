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
      <h1 className="my-8 text-[56px] leading-tight font-medium tracking-[-1.68px] text-heading max-[1024px]:my-5 max-[1024px]:text-4xl">Upload</h1>
      <form className="mx-auto max-w-xl space-y-5 text-left" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block font-medium text-heading" htmlFor="title">Title</label>
          <input
            className="w-full rounded-md border border-outline bg-canvas px-3 py-2 text-copy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="title"
            type="text"
            id="title"
            value={inputs.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-heading" htmlFor="description">Description</label>
          <textarea
            className="w-full resize-y rounded-md border border-outline bg-canvas px-3 py-2 text-copy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="description"
            rows={5}
            id="description"
            value={inputs.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-heading" htmlFor="file">File</label>
          <input
            className="block w-full rounded-md border border-outline bg-canvas p-2 text-copy file:mr-3 file:rounded file:border-0 file:bg-panel file:px-3 file:py-1 file:text-copy"
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </div>
        <img
          className="mx-auto rounded-lg border border-outline object-cover"
          src={previewUrl || 'https://placehold.co/200?text=Choose+image'}
          alt="preview"
          width="200"
        />
        {error && <p className="rounded-md bg-red-100 p-3 text-red-800 dark:bg-red-950 dark:text-red-200" role="alert">{error}</p>}
        <button className="rounded-md bg-accent px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!file || inputs.title.length <= 3}>
          Upload
        </button>
      </form>
    </>
  );
};

export default Upload;
