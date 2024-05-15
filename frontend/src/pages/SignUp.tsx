import { MainHeader } from '../components/MainHeader';
import { Footer } from '../components/Footer';
import React from 'react';
import styled from 'styled-components';
import { SignupInputForm } from '../components/SignUp/InputForm';

const MainWrapper = styled.div`
  width: 100%;
  min-width: 80rem;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eef9f1;
`;

const HeaderWrapper = styled.div`
  min-width: 80rem;
  width: 80rem;
  min-height: 8rem;
  height: 8rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  min-width: 80rem;
  width: 80rem;
  flex-grow: 1;
  justify-content: space-around;
`;

const FooterWrapper = styled.div`
  min-width: 80rem;
  width: 80rem;
  min-height: 16rem;
  height: 16rem;
`;

export const SignUp = () => {
  return (
    <MainWrapper>
      <HeaderWrapper>
        <MainHeader></MainHeader>
      </HeaderWrapper>
      <ContentWrapper>
        <SignupInputForm />
      </ContentWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </MainWrapper>
  );
};
