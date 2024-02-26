import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc, getDocs, collection, where } from 'firebase/firestore';
import CommentItem from 'components/detail/CommentItem';

const MyPage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [nickName, setNickname] = useState('');
  const [newNickName, setNewNickname] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState();

  // 작성한 댓글 코드 추가
  const currentUser = auth.currentUser;
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    const loadUserComments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'comments'), where('userId', '==', auth.currentUser.uid));
        const userCommentsList = await querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

        setUserComments(userCommentsList);
      } catch (error) {
        console.error('Error fetching user comments: ', error);
      }
    };

    loadUserComments();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('user.uid: ', user.uid);
        const userDoc = doc(db, 'users', user.uid);
        console.log('Before getDoc');
        const userDocData = await getDoc(userDoc);
        console.log('After getDoc');
        if (userDocData.exists()) {
          console.log(userDocData.data());
          const userData = userDocData.data();
          // profileImage가 없거나 빈 문자열인 경우 기본 이미지 URL을 설정합니다.
          setImageUrl(
            userData.profileImage ||
              'https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMyAg/MDAxNjA0MjI5NDA4NDMy.5zGHwAo_UtaQFX8Hd7zrDi1WiV5KrDsPHcRzu3e6b8Eg.IlkR3QN__c3o7Qe9z5_xYyCyr2vcx7L_W1arNFgwAJwg.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%8C%8C%EC%8A%A4%ED%85%94.jpg?type=w800'
          );
          setNickname(userData.nickName);
          setIsLoading(false);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user is signed in');
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleProfileImageUpload = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const storageRef = ref(storage, `profileImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask
      .then((snapshot) => {
        console.log('Upload completed');
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          setImageUrl(downloadURL);
          console.log(imageUrl);

          const user = auth.currentUser;
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);

          if (!docSnap.exists()) {
            await setDoc(userDoc, { profileImage: downloadURL });
          } else {
            await updateDoc(userDoc, { profileImage: downloadURL });
          }
          setIsLoading(false);
          alert('이미지가 변경되었습니다.');
          event.target.value = null;
        });
      })
      .catch((error) => {
        console.error('Upload failed:', error);
      });
  };

  // 닉네임 업데이트 하는 함수
  const handleNicknameChange = async () => {
    const user = auth.currentUser;
    const userDoc = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDoc, { nickName: newNickName }); // 닉네임 업데이트
      setNickname(newNickName);
      setNewNickname('');
      alert('닉네임이 변경되었습니다.');
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('로그아웃 되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <StyledContainer>
      <StyledMenu>
        <div>
          <StyledProfile src={imageUrl} alt="프로필 사진" />
        </div>
        <p>{nickName}</p>
        <StyledButtons>
          <StyledBtn active={activeButton === '내 정보 수정'} onClick={() => setActiveButton('내 정보 수정')}>
            내 정보 수정
          </StyledBtn>
          <StyledBtn
            active={activeButton === '북마크한 등산 코스'}
            onClick={() => setActiveButton('북마크한 등산 코스')}
          >
            북마크한 등산 코스
          </StyledBtn>
          <StyledBtn active={activeButton === '완주한 등산 코스'} onClick={() => setActiveButton('완주한 등산 코스')}>
            완주한 등산 코스
          </StyledBtn>
          <StyledBtn active={activeButton === '작성한 댓글'} onClick={() => setActiveButton('작성한 댓글')}>
            작성한 댓글
          </StyledBtn>
          <StyledBtn onClick={handleLogout}>로그아웃</StyledBtn> {/* 로그아웃 버튼을 추가합니다. */}
        </StyledButtons>
      </StyledMenu>
      <StyledContent>
        {activeButton === '내 정보 수정' ? (
          <div>
            <StyledImage src={imageUrl} alt="프로필 사진" />
            <div>
              <StyledFileInput type="file" id="file" onChange={handleProfileImageUpload} style={{ display: 'none' }} />
              <label htmlFor="file">파일 선택</label>
            </div>
            <p>닉네임</p>
            <p>{nickName}</p>
            <input type="text" value={newNickName} onChange={(e) => setNewNickname(e.target.value)} />
            <button onClick={handleNicknameChange}>닉네임 변경</button>
          </div>
        ) : activeButton === '북마크한 등산 코스' ? (
          <div>{/* 북마크한 등산 코스 목록 */}</div>
        ) : activeButton === '완주한 등산 코스' ? (
          <div>{/* 완주한 등산 코스 */}</div>
        ) : activeButton === '작성한 댓글' ? (
          <StCommentContainer>
            <StCommentList>
              {userComments.map((userComment, index) => (
                <Link to={`/detail/${userComment.postId}`}>
                  <CommentItem
                    currentUser={currentUser}
                    comments={userComments}
                    setComments={setUserComments}
                    comment={userComment}
                    index={index}
                  />
                </Link>
              ))}
            </StCommentList>
          </StCommentContainer>
        ) : (
          <div>
            <StyledImage src={imageUrl} alt="프로필 사진" />
            <StyledNickName>{nickName}</StyledNickName>
          </div>
        )}
      </StyledContent>
    </StyledContainer>
  );
};

export default MyPage;

const StyledContainer = styled.div`
  display: flex;
`;

const StyledMenu = styled.div`
  width: 20%;
  height: 500px;
  margin-left: 50px;
  text-align: center;

  /*중앙정렬*/
  justify-content: center;
  border-radius: 10px;
  border: solid 2px;
  border-color: var(--sub-color2);
`;

const StyledNickName = styled.p`
  font-size: 25px;
`;

const StyledProfile = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 30px;
`;

const StyledButtons = styled.div`
  display: flex;
  /*위에서 아래로 수직 배치*/
  flex-direction: column;
  /*중앙정렬*/
  justify-content: center;
  height: 200px;
`;

const StyledBtn = styled.button`
  background-color: transparent;
  border-color: transparent;
`;

const StyledContent = styled.div`
  width: 70%;
  // background-color: var(--sub-color3);
  text-align: center;
  margin: 0px 50px 0px 50px;

  border-radius: 10px;
  border: solid 2px;
  border-color: var(--sub-color2);
`;

const StyledImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-top: 50px;
`;

const StyledFileInput = styled.input`
  ::file-selector-button {
    display: none;
  }
`;

// 작성한 댓글 스타일 컴포넌트
const StCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 100px;
`;

const StCommentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
  width: 100%;
`;
