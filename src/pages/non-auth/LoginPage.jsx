import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useSelector } from 'react-redux';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const isLogin = useSelector((state) => state.auth.isLogin);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인이 완료되었습니다. 홈페이지로 이동합니다.');
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleGoogleLogin = (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Google login success:', result);
        alert('구글 로그인이 완료되었습니다. 홈페이지로 이동합니다.');
        navigate('/');
      })
      .catch((error) => {
        console.error('Google login failed:', error);
        alert('구글 로그인이 실패하었습니다. 다시 시도해주세요.');
      });
  };

  const handleGoSignup = (event) => {
    event.preventDefault();
    navigate('/signup');
  };

  useEffect(() => {
    if (isLogin) {
      alert('이미 로그인되어 있습니다.');
      navigate('/');
    }
  }, [isLogin, navigate]);

  return (
    <StLoginContainer>
      <StP>로그인</StP>
      <StFormContainer>
        <StForm>
          <StInput type="text" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
          <StInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StLoginButton onClick={handleLogin}>로그인</StLoginButton>
          <StDivider />
          <StGoogle onClick={handleGoogleLogin}>구글 로그인</StGoogle>
          <StSignupButton onClick={handleGoSignup}>회원가입</StSignupButton>
        </StForm>
      </StFormContainer>
    </StLoginContainer>
  );
};

const StP = styled.p`
  font-family: 'Dokdo', cursive;
  font-size: 60px;
  margin: 15px;
  user-select: none;
`;
const StLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #eef0e5;
`;
const StForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 500px;
  padding: 20px;
  border-radius: 5px;
  gap: 1rem;
  background-color: #b6c4b6;
`;
const StInput = styled.input`
  width: 350px;
  border-radius: 3px;
  border: none;
  padding: 10px;
  font-size: 15px;
  user-select: none;
  cursor: pointer;
  margin: 10px;
  box-shadow: 0px 0px 5px #163020;
`;
const StLoginButton = styled.button`
  width: 100px;
  border-radius: 5px;
  border: none;
  font-size: 15px;
  padding: 10px;
  margin: 10px;
  margin-left: 263px;
  background-color: #304d30;
  color: white;
  cursor: pointer;
  transition: backgroud-color 2s;
  user-select: none;

  &:hover {
    background-color: #163020;
  }
`;
const StGoogle = styled.button`
  width: 350px;
  border-radius: 30px;
  border: none;
  padding: 10px;
  font-size: 15px;
  background-color: #304d30;
  color: white;
  cursor: pointer;
  transition: backgroud-color 2s;
  user-select: none;
  margin: 10px;

  &:hover {
    background-color: #163020;
  }
`;
const StSignupButton = styled.button`
  border: none;
  background-color: #b6c4b6;
  transition: backgroud-color 2s;
  font-size: 15px;
  user-select: none;
  margin-top: 40px;

  &:hover {
    color: #eef0e5;
  }
`;
const StDivider = styled.div`
  width: 350px;
  height: 0.2px;
  background-color: rgb(255, 255, 255, 0.6);
  margin: 10px;
`;
const StFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 520px;
  height: 520px;
  border: 2px solid rgba(48, 77, 48, 0.3); // 띄어진 선의 스타일을 설정합니다.
`;

export default LoginPage;
