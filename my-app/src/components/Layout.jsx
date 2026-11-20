import { useEffect } from 'react';
import { Link, Outlet } from 'react-router';
import { useUserContext } from '../hooks/contextHooks';

const Layout = () => {
  const { user, handleAutoLogin } = useUserContext();

  useEffect(() => {
    handleAutoLogin();
  }, [handleAutoLogin]);

  return (
    <div className="flex min-h-svh flex-col">
      <h1 className="my-8 text-[56px] leading-tight font-medium tracking-[-1.68px] text-heading max-[1024px]:my-5 max-[1024px]:text-4xl">
        My App
      </h1>
      <nav className="border-y border-outline bg-panel/60 px-4 py-3">
        <ul className="mx-auto flex w-fit flex-wrap justify-center gap-3 p-0 *:list-none *:rounded-lg *:border *:border-outline *:bg-canvas *:px-4 *:py-2 *:transition-colors">
          <li className="hover:border-accent/50">
            <Link className="font-medium text-accent no-underline" to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li className="hover:border-accent/50">
                <Link className="font-medium text-accent no-underline" to="/logout">Logout</Link>
              </li>
              <li className="hover:border-accent/50">
                <Link className="font-medium text-accent no-underline" to="/profile">Profile</Link>
              </li>
              <li className="hover:border-accent/50">
                <Link className="font-medium text-accent no-underline" to="/upload">Upload</Link>
              </li>
            </>
          ) : (
            <li className="hover:border-accent/50">
              <Link className="font-medium text-accent no-underline" to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <main className="flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
