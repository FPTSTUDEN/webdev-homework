import { Link, useLocation } from 'react-router';
import Likes from '../components/Likes';

const Single = () => {
  const { state } = useLocation();
  const item = state?.item;

  if (!item) {
    return (
      <>
        <p className="mb-3">No media item was selected.</p>
        <Link className="text-accent underline-offset-4 hover:underline" to="/">Back to Home</Link>
      </>
    );
  }

  return (
    <article>
      <h2 className="mb-2 text-2xl leading-[1.18] font-medium tracking-[-0.24px] text-heading max-[1024px]:text-xl">{item.title}</h2>
      <p className="mb-4">{item.description}</p>
      <Likes mediaId={item.media_id} />
      {item.media_type.startsWith('image/') ? (
        <img className="mx-auto max-h-[70vh] max-w-full rounded-lg object-contain" src={item.filename} alt={item.title} />
      ) : (
        <video className="mx-auto max-h-[70vh] max-w-full rounded-lg" controls src={item.filename} aria-label={item.title} />
      )}
      <p>
        <Link className="text-accent underline-offset-4 hover:underline" to="/">Back to Home</Link>
      </p>
    </article>
  );
};

export default Single;
