import { Link } from 'react-router';

const MediaRow = ({ item }) => {
  return (
    <tr className="border-t border-outline align-middle transition-colors hover:bg-panel/60">
      <td className="px-4 py-3">
        <Link to="/single" state={{ item }}>
          <img className="h-16 w-24 rounded object-cover" src={item.filename} alt={item.title} />
        </Link>
      </td>
      <td className="px-4 py-3">
        <Link className="font-medium text-accent underline-offset-4 hover:underline" to="/single" state={{ item }}>
          {item.title}
        </Link>
      </td>
      <td className="px-4 py-3">{item.description}</td>
      <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString()}</td>
      <td className="px-4 py-3">{item.filesize}</td>
      <td className="px-4 py-3">{item.media_type}</td>
    </tr>
  );
};

export default MediaRow;
