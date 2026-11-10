import { createContext, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthentication, useUser } from '../hooks/apiHooks';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { postLogin } = useAuthentication();
  const { getUserByToken } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const loginResult = await postLogin(credentials);
      if (!loginResult.token) {
        throw new Error('Login response did not include a token');
      }

      localStorage.setItem('token', loginResult.token);
      const userResult = await getUserByToken(loginResult.token);
      setUser(userResult.user ?? userResult);
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  }, [navigate]);

  const handleAutoLogin = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const userResult = await getUserByToken(token);
      setUser(userResult.user ?? userResult);
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  }, [getUserByToken, navigate]);

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout, handleAutoLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
