import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? <RegisterForm /> : <LoginForm />}
      <button type="button" onClick={() => setShowRegister((show) => !show)}>
        {showRegister ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </>
  );
};

export default Login;
