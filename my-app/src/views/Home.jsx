import MediaRow from '../components/MediaRow';
import { useMedia } from '../hooks/apiHooks';

const Home = () => {
  const { mediaArray } = useMedia();

  return (
    <>
      <h2 className="mb-4 text-2xl leading-[1.18] font-medium tracking-[-0.24px] text-heading max-[1024px]:text-xl">My Media</h2>
      <div className="overflow-x-auto rounded-lg border border-outline">
      <table className="w-full min-w-[650px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-panel text-heading">
            <th className="px-4 py-3 font-semibold">Thumbnail</th>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Description</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3 font-semibold">Size</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} />
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};
export default Home;