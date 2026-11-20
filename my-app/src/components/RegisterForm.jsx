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
      <h1 className="my-8 text-[56px] leading-tight font-medium tracking-[-1.68px] text-heading max-[1024px]:my-5 max-[1024px]:text-4xl">Register</h1>
      <form className="mx-auto max-w-md space-y-5 text-left" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block font-medium text-heading" htmlFor="registeruser">Username</label>
          <input
            className="w-full rounded-md border border-outline bg-canvas px-3 py-2 text-copy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="username"
            type="text"
            id="registeruser"
            onChange={handleInputChange}
            autoComplete="username"
            value={inputs.username}
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-heading" htmlFor="registeremail">Email</label>
          <input
            className="w-full rounded-md border border-outline bg-canvas px-3 py-2 text-copy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="email"
            type="email"
            id="registeremail"
            onChange={handleInputChange}
            autoComplete="email"
            value={inputs.email}
          />
        </div>
        <div className="space-y-1">
          <label className="block font-medium text-heading" htmlFor="registerpassword">Password</label>
          <input
            className="w-full rounded-md border border-outline bg-canvas px-3 py-2 text-copy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="password"
            type="password"
            id="registerpassword"
            onChange={handleInputChange}
            autoComplete="new-password"
            value={inputs.password}
          />
        </div>
        <button className="rounded-md bg-accent px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90" type="submit">Register</button>
      </form>
    </>
  );
};

export default RegisterForm;
