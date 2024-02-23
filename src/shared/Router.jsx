import DetailPage from 'pages/DetailPage';
import MainPage from 'pages/MainPage';
import MyPage from 'pages/MyPage';
import SignupPage from 'pages/SignupPage';
import Header from 'components/layout/Header';
import NotFound from 'pages/NotFound';

const { default: LoginPage } = require('pages/LoginPage');
const { BrowserRouter, Routes, Route } = require('react-router-dom');

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
