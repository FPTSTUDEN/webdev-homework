const MediaRow = ({ item, setSelectedItem }) => {
  return (
    <tr>
      <td>
        <button type="button" onClick={() => setSelectedItem(item)}>
          <img src={item.filename} alt={item.title} />
        </button>
      </td>
      <td>
        <button type="button" onClick={() => setSelectedItem(item)}>
          {item.title}
        </button>
      </td>
      <td>{item.description}</td>
      <td>{new Date(item.created_at).toLocaleDateString()}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
    </tr>
  );
};

export default MediaRow;
