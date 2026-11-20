import { useEffect } from 'react';
import { useUserContext } from '../hooks/contextHooks';

const Logout = () => {
  const { handleLogout } = useUserContext();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <h2 className="mb-2 text-2xl leading-[1.18] font-medium tracking-[-0.24px] text-heading max-[1024px]:text-xl">Logout</h2>;
};

export default Logout;
