import Logout from 'components/Logout';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom/dist';
import styled from 'styled-components';

const Navbar = () => {
  const currentUser = auth.currentUser;

  return (
    <>
      <StNavContainer>
        <StLogo>
          <Link to="/main">한사랑 산악회</Link>
        </StLogo>
        <StRightNav>
          {currentUser ? (
            <>
              <Logout />
              <Link to="/mypage">마이페이지</Link>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </StRightNav>
      </StNavContainer>
    </>
  );
};

export default Navbar;

const StNavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20 px 25px;
`;

const StLogo = styled.span`
  font-family: 'Dokdo', cursive;
  font-size: 36px;
`;

const StRightNav = styled.div`
  display: flex;
  gap: 15px;
`;
