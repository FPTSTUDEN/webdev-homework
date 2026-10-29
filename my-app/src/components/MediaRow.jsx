import { Link } from 'react-router';

const MediaRow = ({ item }) => {
  return (
    <tr>
      <td>
        <Link to="/single" state={{ item }}>
          <img src={item.filename} alt={item.title} />
        </Link>
      </td>
      <td>
        <Link to="/single" state={{ item }}>
          {item.title}
        </Link>
      </td>
      <td>{item.description}</td>
      <td>{new Date(item.created_at).toLocaleDateString()}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
    </tr>
  );
};

export default MediaRow;
