import { Link } from 'react-router';
import { useUserContext } from '../hooks/contextHooks';

const MediaRow = ({ item }) => {
  const { user } = useUserContext();
  const currentUserId = user?.user_id ?? user?.id;
  const mediaOwnerId = item.user_id ?? item.owner_id ?? item.userId;
  const isAdmin =
    user?.is_admin === true ||
    user?.role?.toLowerCase() === 'admin' ||
    user?.user_type?.toLowerCase() === 'admin';
  const canManageMedia =
    Boolean(user) &&
    (isAdmin ||
      (currentUserId != null &&
        mediaOwnerId != null &&
        String(currentUserId) === String(mediaOwnerId)));

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
      <td className="px-4 py-3">
        {canManageMedia && (
          <div className="flex gap-3">
            <button
              className="font-medium text-accent underline-offset-4 hover:underline"
              type="button"
              onClick={() => console.log('modify', item)}
            >
              Modify
            </button>
            <button
              className="font-medium text-accent underline-offset-4 hover:underline"
              type="button"
              onClick={() => console.log('delete', item)}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default MediaRow;
