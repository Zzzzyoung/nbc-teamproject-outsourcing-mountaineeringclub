import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const MyPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [nickName, setNickname] = useState("");
  const [newNickName, setNewNickname] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("user.uid: ", user.uid);
        const userDoc = doc(db, 'users', user.uid);
        console.log('Before getDoc');
        const userDocData = await getDoc(userDoc);
        console.log('After getDoc');
        if (userDocData.exists()) {
          console.log(userDocData.data());
          const userData = userDocData.data();
          // profileImage가 없거나 빈 문자열인 경우 기본 이미지 URL을 설정
          setImageUrl(userData.profileImage || "https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMyAg/MDAxNjA0MjI5NDA4NDMy.5zGHwAo_UtaQFX8Hd7zrDi1WiV5KrDsPHcRzu3e6b8Eg.IlkR3QN__c3o7Qe9z5_xYyCyr2vcx7L_W1arNFgwAJwg.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%8C%8C%EC%8A%A4%ED%85%94.jpg?type=w800");
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
  
    uploadTask.then(snapshot => {
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
    }).catch(error => {
      console.error('Upload failed:', error);
    });
  };
  
  // 닉네임 업데이트 하는 함수
  const handleNicknameChange = async () => {
    const user = auth.currentUser;
    const userDoc = doc(db, 'users', user.uid);
    try {
      // 닉네임 업데이트
      await updateDoc(userDoc, { nickName: newNickName });
      setNickname(newNickName);
      setNewNickname("");
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
      <StContainer>
        <StMenu>
          <div>
          <StProfile src={imageUrl} alt="프로필 사진" />
          </div>
          <p>{nickName}</p>
          <StButtons>
            <StBtn active={activeButton === '내정보 수정'} onClick={() => setActiveButton('내정보 수정')}>내정보 수정</StBtn>
            <StBtn active={activeButton === '스크랩'} onClick={() => setActiveButton('스크랩')}>스크랩</StBtn>
            <StBtn active={activeButton === '완주한 등산코스'} onClick={() => setActiveButton('완주한 등산코스')}>완주한 등산코스</StBtn>
            <StBtn active={activeButton === '작성한 댓글'} onClick={() => setActiveButton('작성한 댓글')}>작성한 댓글</StBtn>
            <StBtn onClick={handleLogout}>로그아웃</StBtn> {/* 로그아웃 버튼을 추가합니다. */}
          </StButtons>
        </StMenu>
        <StContent>
          {activeButton === '내정보 수정' ? (
            <div>
              <StImage src={imageUrl} alt="프로필 사진" />
              <div>
                <StFileInput type="file" id="file" onChange={handleProfileImageUpload} style={{display: 'none'}} />
                <label htmlFor="file">파일 선택</label>
              </div>
              <p>닉네임</p>
              <p>{nickName}</p>
              <input type="text" value={newNickName} onChange={(e) => setNewNickname(e.target.value)} />
              <button onClick={handleNicknameChange}>닉네임 변경</button>
            </div>
          ) : activeButton === '스크랩' ? (
            <div>
              {/* 스크랩 목록 */}
            </div>
          ) : activeButton === '완주한 등산코스' ? (
            <div>
              {/* 완주한 등산코스 */}
            </div>
          ) : activeButton === '작성한 댓글' ? (
            <div>
              {/* 작성한 댓글 */}
            </div>
          ) : (
            <div>
              <StImage src={imageUrl} alt="프로필 사진" />
              <StNickName>{nickName}</StNickName>
            </div>
          )}
        </StContent>
      </StContainer>
  )
}

const StContainer = styled.div`
  display: flex;
`;

const StMenu = styled.div`
  width: 20%;
  height: 500px;
  margin-left: 50px;
  text-align: center;
  
  /*중앙정렬*/
  justify-content: center;
  border-radius: 10px;
  border: solid 2px;
  border-color:var(--sub-color2);
`;

const StNickName = styled.p`
  font-size: 25px;
`;

const StProfile = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 30px;
`;

const StButtons = styled.div`
  display: flex ;
 /*위에서 아래로 수직 배치*/
  flex-direction: column;
  /*중앙정렬*/
  justify-content: center;
  height: 200px;
`;

const StBtn = styled.button`
  background-color: transparent;
  border-color: transparent;
`;

const StContent = styled.div`
  width: 70%;
  // background-color: var(--sub-color3);
  text-align: center;
  margin: 0px 50px 0px 50px;
  
  border-radius: 10px;
  border: solid 2px;
  border-color: var(--sub-color2);
`;

const StImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-top: 50px;
`;

const StFileInput = styled.input`
  ::file-selector-button {
    display: none;
  }
`;

export default MyPage