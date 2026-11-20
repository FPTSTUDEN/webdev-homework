import { useEffect, useState } from 'react';
import { useUser } from '../hooks/apiHooks';

const Profile = () => {
  const { getUserByToken } = useUser();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadUser = async () => {
      try {
        const userData = await getUserByToken(token);
        setUser(userData.user ?? userData);
      } catch (err) {
        setError(err.message);
        console.error('Could not load profile:', err);
      }
    };

    loadUser();
  }, [getUserByToken, token]);

  if (!token) {
    return <p className="text-copy">Please log in to view your profile.</p>;
  }

  if (error) {
    return <p className="text-red-700 dark:text-red-300">{error}</p>;
  }

  if (!user) {
    return <p className="text-copy">Loading profile...</p>;
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl leading-[1.18] font-medium tracking-[-0.24px] text-heading max-[1024px]:text-xl">Profile</h2>
      <p className="mb-2">Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </section>
  );
};

export default Profile;
