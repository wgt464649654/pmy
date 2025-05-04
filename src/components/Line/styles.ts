import styled from "styled-components";

export const LineItem = styled.div`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
    color: var(--ant-blue);
    transform: scale(1.05);
  }
`

export const LightDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 55px;
  border: 0px solid blue;
`

export const AnImg = styled.img`
  cursor: pointer;
`