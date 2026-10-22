const MediaRow = ({ item }) => {
  return (
    <tr>
      <td>
        <img src={item.filename} alt={item.title} />
      </td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{new Date(item.created_at).toLocaleDateString()}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
    </tr>
  );
};

export default MediaRow;
