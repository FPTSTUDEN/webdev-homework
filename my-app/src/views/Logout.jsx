import { useEffect } from 'react';
import { useUserContext } from '../hooks/contextHooks';

const Logout = () => {
  const { handleLogout } = useUserContext();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <h2>Logout</h2>;
};

export default Logout;
