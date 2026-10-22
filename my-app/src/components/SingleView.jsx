const SingleView = ({ item }) => {
  if (!item) {
    return null;
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
    </article>
  );
};

export default SingleView;
