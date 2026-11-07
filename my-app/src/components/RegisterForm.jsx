import useForm from '../hooks/formHooks';
import { useUser } from '../hooks/apiHooks';

const RegisterForm = () => {
  const { postUser } = useUser();
  const initValues = {
    username: '',
    password: '',
    email: '',
  };

  const doRegister = async (formInputs) => {
    try {
      const registerResult = await postUser(formInputs);
      console.log(registerResult);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(doRegister, initValues);

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="registeruser">Username</label>
          <input
            name="username"
            type="text"
            id="registeruser"
            onChange={handleInputChange}
            autoComplete="username"
            value={inputs.username}
          />
        </div>
        <div>
          <label htmlFor="registeremail">Email</label>
          <input
            name="email"
            type="email"
            id="registeremail"
            onChange={handleInputChange}
            autoComplete="email"
            value={inputs.email}
          />
        </div>
        <div>
          <label htmlFor="registerpassword">Password</label>
          <input
            name="password"
            type="password"
            id="registerpassword"
            onChange={handleInputChange}
            autoComplete="new-password"
            value={inputs.password}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default RegisterForm;
