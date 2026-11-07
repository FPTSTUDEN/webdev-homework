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
    return <p>Please log in to view your profile.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <section>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </section>
  );
};

export default Profile;
