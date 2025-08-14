import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  /* background-color: red; */
  .navbar {
    width: 100%;
    height: 10%;
    background-color: #d4dbd9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 40px;
    h1 {
        color: #1b4235;
        font-family: cursive;
    }
    .links {
      display: flex;
      gap: 40px;
      a {
        color: white;
        text-decoration: none;
        background-color: #1b4235;
        padding: 10px;
        border-radius: 15px;
      }
    }
  }
  .imageBox {
    width: 100%;
    height: 90%;
    background-image: url(${require("../assets/Firstfloor.png")});
    /* background-size: cover; */
    background-position: center;
    background-size: 89%;
    background-repeat: no-repeat;
    background-color: #d4dbd9;
  }
`;

export const Create = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 24px;

  input, select {
    width: 100%;
    height: 36px;
    padding: 6px 10px;
    border: 1px solid #3c3c3c;
    border-radius: 8px;
    background: #ffffff;
  }

  button {
    width: 200px;
    padding: 10px;
    background-color: #1677ff;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th, td {
    border-bottom: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    background: #fff;
  }

  thead th {
    background: #f2f2f2;
  }
`;