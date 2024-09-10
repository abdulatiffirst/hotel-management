import styled from "styled-components";

export const UpdateButton = styled.button`
  background-color: #139724;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 3px 12px;
  margin: 3px 0;
`;

export const ContainerScheme = styled.div`
  width: 100%;
  background: rgb(20, 42, 32);
  background: linear-gradient(
    90deg,
    rgba(20, 42, 32, 1) 38%,
    rgba(27, 66, 53, 1) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
  /* padding: 10px; */

  .floor-titel {
    width: 15%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: green; */
    h1 {
      color: white;
      rotate: -90deg;
      font-size: 90px;
      /* background-color: ; */
      white-space: nowrap;
    }
  }

  .name {
    text-transform: capitalize;
    background-color: white;
    padding: 3px;
    color: #1b4235;
    border-radius: 5px;
    font-size: 15px;
  }

  .room {
    overflow-y: scroll;
    background-color: #97a9a3;
    border: 1px solid #3c3c3c;
    padding: 4px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    /* margin: 10px; */
  }
  .roomCont {
    height: fit-content;
    /* display: flex; */
    padding: 5px;
    width: 90%;
    overflow-y: auto;
    /* flex-direction: column; */
  }

  h4 {
    height: 100%;
    width: 10%;
    color: white;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 3px;
    rotate: -90deg;
    transform-origin: left-top;
    /* overflow: hidden; */
    white-space: nowrap;
    /* background-color: red; */
    /* word-break: break-all; */
    .i {
      font-size: 20px;
      rotate: 90deg;
    }
  }
  p {
    height: fit-content;
    padding: 2px;
    font-size: 12px;
    color: white;
  }
  .leaveHotelButton {
    background-color: #ef8484;
    color: white;
    border: none;
    padding: 2px 3px;
    border-radius: 100%;
    margin-left: 3px;
    width: fit-content;
    font-size: 3px;
  }
  .Buttons {
    width: 100%;
    height: 70px;
    padding: 10px 20px;
    font-size: 20px;
    top: 0px;
    position: fixed;
    background-color: #d1d8d6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;

    .miniContainer {
      width: 18%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .exportToExcel {
      background-color: #113a32;
      color: white;
      border-radius: 10px;
      border: none;
      padding: 5px;
      font-size: 15px;
    }
  }
  .link {
    color: white;
    text-decoration: none;
    background-color: #1b4235;
    padding: 7px;
    border-radius: 15px;
    font-size: 18px;
  }
  .firstFloor {
    width: 100%;
    height: calc(100vh - 70px);
    margin-top: 70px;
    /* background-color: red; */
    /* margin-top: 10px; */
    padding: 10px;
    display: flex;
    /* background-color: white; */

    h4 {
      /* border-bottom: 1px solid gray; */
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      padding: 3px;
      .i {
        font-size: 20px;
      }

      .arrisvalDay {
      }
      .dailyPrice {
      }
    }
    .firstFloorScheme {
      height: 100%;
      width: 85%;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      .r101-104 {
        width: 25%;
        height: 100%;
        display: flex;
        flex-direction: column-reverse;
        /* border: 1px solid white; */
        /* background-color: pink; */
        gap: 10px;
        .room {
          width: 100%;
          height: 25%;
        }
      }
      .middle {
        width: 50%;
        /* border: 1px solid white; */
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        flex-direction: column;
        /* background-color: yellow; */

        .pantry-107 {
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 35%;
          /* border: 1px solid white; */
          gap: 10px;
          .pantry {
            width: 30%;
            color: white;
          }
          .r107 {
            width: 70%;
          }
        }
        .r105-108 {
          display: flex;
          width: 100%;
          height: 40%;
          /* background-color: blue; */
          gap: 10px;
          .r105 {
            width: 30%;
          }
          .r106 {
            width: 40%;
          }
          .r108 {
            width: 30%;
          }
        }
      }
      .r109-113 {
        width: 25%;
        /* border: 1px solid white; */
        display: flex;
        flex-direction: column;
        gap: 10px;
        /* background-color: orange; */
        .room {
          width: 100%;
          height: 20%;

          .leaveHotelButton {
            background-color: #f44336;

            color: white;
            border: none;
            padding: 6px 8px;
            height: 15px;
            border-radius: 4px;
            margin: 0 0 0 5px;
          }
        }
      }
    }
  }

  .secondFloor {
    width: 100%;
    height: calc(100vh - 70px);
    margin-top: 70px;
    /* background-color: gree; */
    padding: 10px;
    /* border-top: 1px solid white; */
    .room {
      padding: 3px;
    }
    h4 {
      /* border-bottom: 1px solid gray; */
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      padding: 3px;

      .i {
        font-size: 20px;
      }
    }
    .arrivalDay {
    }
    .dailyPrice {
    }
  }

  .secondFloorScheme {
    display: flex;
    justify-content: space-between;
    width: 90%;
    height: 100%;

    .column-1 {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      width: 70%;

      .r212-216 {
        display: flex;
        width: 100%;
        height: 30%;
        gap: 10px;
        .room {
          width: 20%;
          padding: 10px;
        }
      }
      .row {
        display: flex;

        justify-content: space-between;
        height: 30%;
        .r207-210 {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 30%;
          gap: 10px;
          .i {
            display: none;
          }
          .room {
            height: 33%;
          }
        }
      }
      .center {
        display: flex;
        .i {
          display: none;
        }
        width: 60%;
        .room {
          height: 33%;
        }
        .centerColumn-1 {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .centerColumn-2 {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      }
    }
    .r201-205 {
      display: flex;
      width: 100%;
      height: 30%;
      gap: 10px;

      .room {
        width: 20%;
        height: 100%;
      }
    }
    .r217-223 {
      display: flex;
      flex-direction: column;
      width: 25%;
      height: 90%;
      gap: 10px;

      .room {
        height: 20%;
      }
    }
  }
`;

/////////////////////////////////////////////////////////

export const ToggleButton = styled.div`
  /* margin: 60px 0 0 0; */
  padding: 5px;
  border: none;
  background-color: white;
  color: black;
  border-radius: 5px;
`;

export const Table = styled.table`
  /* background-color: yellow; */
 
 
 
  margin: 10px 0;
  overflow-y: scroll;
  text-transform: capitalize;

  tr:nth-child(even) {
    background-color: gray;
  }
  tr {
    width: 100%;
   
    th {
      background-color: gray;
      color: white;
      padding: 5px;
    }

    td {
      background-color: rgba(22, 22, 23, 0.8);
      color: white;
      padding: 5px;
      text-align: center;
      .deleteButton {
        background-color: #c70039;
        color: #b0b0b0;
        border: none;
        padding: 3px 7px;
        height: 20px;
        border-radius: 4px;
      }
      .updateButton {
        background-color: #139724;
        color: white;
        border: none;
        height: 20px;
        border-radius: 4px;
        padding: 3px 7px;
      }
      .leaveHotelButton {
        background-color: #f44336;
        color: white;
        border: none;
        padding: 4px;
        height: 20px;
        border-radius: 4px;
      }
    }
  }
`;

export const Create = styled.div`
  text-align: center;

  input {
    width: 90%;
    height: 31px;
    margin: 3px 0;
    padding: 10px;
    border: 1px solid #3c3c3c;
    border-radius: 10px;
  }

  select {
    width: 90%;
    height: 40px;
    margin: 3px 0;
    padding: 5px;
    background-color: black;
    color: white;
  }

  button {
    width: 20%;
    padding: 10px;
    background-color: #1677ff;
    color: black;
    border: none;
    border-radius: 10px;
    margin-top: 10px;
  }
`;

export const ElevatorButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #1b4235;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  border: none;
  &:hover {
    background-color: #999;
  }
`;
export const ContainerTable = styled.div`

width: 100%;
height: calc(100vh - 70px);
display: flex;
align-items: flex-start;
justify-content: center;
background-color: #1B4235;
margin-top: 70px;
`