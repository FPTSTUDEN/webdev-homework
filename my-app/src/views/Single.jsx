import { Link, useLocation } from 'react-router';

const Single = () => {
  const { state } = useLocation();
  const item = state?.item;

  if (!item) {
    return (
      <>
        <p>No media item was selected.</p>
        <Link to="/">Back to Home</Link>
      </>
    );
  }

  return (
    <article>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      {item.media_type.startsWith('image/') ? (
        <img src={item.filename} alt={item.title} />
      ) : (
        <video controls src={item.filename} aria-label={item.title} />
      )}
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </article>
  );
};

export default Single;
