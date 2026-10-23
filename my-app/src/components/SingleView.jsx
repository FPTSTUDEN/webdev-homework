const SingleView = ({ item, setSelectedItem }) => {
  return (
    <dialog open={Boolean(item)}>
      {item && (
        <article>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          {item.media_type.startsWith('image/') ? (
            <img src={item.filename} alt={item.title} />
          ) : (
            <video controls src={item.filename} aria-label={item.title} />
          )}
          <button type="button" onClick={() => setSelectedItem(null)}>
            Close
          </button>
        </article>
      )}
    </dialog>
  );
};

export default SingleView;
