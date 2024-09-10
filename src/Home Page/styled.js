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
