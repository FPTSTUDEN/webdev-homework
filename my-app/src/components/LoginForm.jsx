import useForm from '../hooks/formHooks';
import { useAuthentication } from '../hooks/apiHooks';

const LoginForm = () => {
  const { postLogin } = useAuthentication();

  const initValues = {
    username: '',
    password: '',
  };

  const doLogin = async (formInputs) => {
    try {
      const loginResult = await postLogin(formInputs);
      console.log(loginResult);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(doLogin, initValues);

  console.log(inputs);

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginuser">Username</label>
          <input
            name="username"
            type="text"
            id="loginuser"
            onChange={handleInputChange}
            autoComplete="username"
            value={inputs.username}
          />
        </div>
        <div>
          <label htmlFor="loginpassword">Password</label>
          <input
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
            value={inputs.password}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
