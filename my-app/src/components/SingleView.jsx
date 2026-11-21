import Likes from './Likes';

const SingleView = ({ item, setSelectedItem }) => {
  return (
    <dialog className="fixed inset-0 m-auto max-h-[90vh] max-w-[90vw] rounded-xl border border-outline bg-canvas p-6 text-copy shadow-2xl backdrop:bg-black/50" open={Boolean(item)}>
      {item && (
        <article>
          <h2 className="mb-2 text-2xl leading-[1.18] font-medium tracking-[-0.24px] text-heading max-[1024px]:text-xl">{item.title}</h2>
          <p className="mb-4">{item.description}</p>
          <Likes mediaId={item.media_id} />
          {item.media_type.startsWith('image/') ? (
            <img className="max-h-[65vh] max-w-full object-contain" src={item.filename} alt={item.title} />
          ) : (
            <video className="max-h-[65vh] max-w-full" controls src={item.filename} aria-label={item.title} />
          )}
          <button className="mt-4 rounded-md bg-accent px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90" type="button" onClick={() => setSelectedItem(null)}>
            Close
          </button>
        </article>
      )}
    </dialog>
  );
};

export default SingleView;
