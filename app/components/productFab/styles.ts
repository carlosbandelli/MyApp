import styled from 'styled-components/native';

interface FormContainerProps {
  fabPosition: number;
}

export const Container = styled.View`
  flex: 1;
  background-color: '#7048D1';
`;

export const FormContainer = styled.View<FormContainerProps>`
  position: absolute;
  bottom: ${({ fabPosition }) => fabPosition + 100}px;
  left: 20px;
  right: 50px;
  z-index: 90;
  width: 90%;
  background-color: '#7048D1';
`;

export const FabContainer = styled.View`
  position: absolute;
  bottom: 75px;
  left: 300px;

  z-index: 100;
`;

export const InputContainer = styled.View`
  padding: 16px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;
