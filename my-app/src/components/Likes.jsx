import { useCallback, useEffect, useState } from 'react';
import { useLike } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/contextHooks';

const Likes = ({ mediaId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [userLike, setUserLike] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserContext();
  const { postLike, deleteLike, getLikeCountByMediaId, getLikeByUser } = useLike();
  const isLoggedIn = Boolean(user);
  const hasLiked = isLoggedIn && Boolean(userLike);

  const loadLikes = useCallback(async () => {
    const token = isLoggedIn ? localStorage.getItem('token') : null;
    const [countResult, userLikeResult] = await Promise.allSettled([
      // promise.allSettled is used here to ensure that both promises are executed in parallel 
      // and we can handle their results independently, even if one of them fails. 
      // This way, we can still get the like count even if the user like check fails (e.g., if the user is not logged in).
      getLikeCountByMediaId(mediaId),
      isLoggedIn && token
        ? getLikeByUser(mediaId, token)
        : Promise.resolve(null),
    ]);

    if (countResult.status === 'fulfilled') {
      const countResponse = countResult.value;
      if (typeof countResponse.count !== 'number') {
        console.error('Media API response did not include the like count');
      } else {
        setLikeCount(countResponse.count);
      }
    } else {
      console.error('Could not load media like count:', countResult.reason);
    }

    if (userLikeResult.status === 'fulfilled') {
      setUserLike(userLikeResult.value);
    } else {
      console.error('Could not load user like:', userLikeResult.reason);
    }
  }, [getLikeByUser, getLikeCountByMediaId, isLoggedIn, mediaId]);

  useEffect(() => {
    loadLikes();
  }, [loadLikes]);

  const handleLike = async () => {
    if (!isLoggedIn || isSubmitting) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (hasLiked) {
        await deleteLike(userLike.like_id, token);
        setUserLike(null);
        setLikeCount((count) => Math.max(0, count - 1));
      } else {
        await postLike(mediaId, token);
        setLikeCount((count) => count + 1);
        setUserLike(await getLikeByUser(mediaId, token));
      }
    } catch (error) {
      console.error('Could not update media like:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <span aria-live="polite">
        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
      </span>
      <button
        className="rounded-md border border-accent px-3 py-1 font-medium text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={handleLike}
        disabled={!isLoggedIn || isSubmitting} // disable the button if the user is not logged in or if a like/unlike action is in progress
        aria-pressed={hasLiked}
      >
        {hasLiked ? '♥ Liked' : '♡ Like'}
      </button>
    </div>
  );
};

export default Likes;
