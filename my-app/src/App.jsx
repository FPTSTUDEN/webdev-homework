import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import Home from './views/Home';
import Profile from './views/Profile';
import Single from './views/Single';
import Upload from './views/Upload';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="upload" element={<Upload />} />
        <Route path="single" element={<Single />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;