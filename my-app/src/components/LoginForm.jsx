import useForm from '../hooks/formHooks';
import { useUserContext } from '../hooks/contextHooks';

const LoginForm = () => {
  const { handleLogin } = useUserContext();

  const initValues = {
    username: '',
    password: '',
  };

  const doLogin = async (formInputs) => {
    try {
      await handleLogin(formInputs);
    } catch (error) {
      alert(error.message);
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(doLogin, initValues);

  console.log(inputs);

  return (
    <>
      <h1 className="my-8 text-[56px] leading-tight font-medium tracking-[-1.68px] text-heading max-[1024px]:my-5 max-[1024px]:text-4xl">Login</h1>
      <form className="mx-auto max-w-md space-y-5 text-left" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block font-medium text-heading" htmlFor="loginuser">Username</label>
          <input
            className="w-full rounded-md border border-outline bg-canvas px-3 py-2 text-copy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="username"
            type="text"
            id="loginuser"
            onChange={handleInputChange}
            autoComplete="username"
            value={inputs.username}
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-heading" htmlFor="loginpassword">Password</label>
          <input
            className="w-full rounded-md border border-outline bg-canvas px-3 py-2 text-copy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
            value={inputs.password}
          />
        </div>
        <button className="rounded-md bg-accent px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90" type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
