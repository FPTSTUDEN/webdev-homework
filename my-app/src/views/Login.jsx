import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? <RegisterForm /> : <LoginForm />}
      <button className="mt-6 rounded-md border border-accent px-4 py-2 font-medium text-accent transition-colors hover:bg-accent/10" type="button" onClick={() => setShowRegister((show) => !show)}>
        {showRegister ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </>
  );
};

export default Login;
