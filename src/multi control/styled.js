import styled from "styled-components";

export const UpdateButton = styled.button`
  background-color: #139724;
  color: white;
  border: none;
  height: 20px;
  border-radius: 4px;
  padding: 3px 7px;
`;

export const ContainerScheme = styled.div`
  width: 100%;

  background-color: black;
  color: white;
  /* padding: 10px; */
  .room {
      overflow-y: scroll;
    }
  .roomCont{
    height: fit-content;
    display: flex;
    }
  h1 {
    margin: 20px 0 10px 10px;
  
    padding: 5px 0;
  }
  h4{
    position: sticky;
  }
  p{
    font-size: 12px;
    margin: 2px 0;
  }
  .Buttons {
    width: 100%;
    height: 50px;
    padding: 10px 20px;
    font-size: 20px;
    top: 0px;
    position: fixed;
    background-color: black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
    .exportToExcel {
      width: 100px;
      height: 30px;
      background-color: green;
      color: white;
      border-radius: 4px;
      border: none;
    }
  }
  .link {
    color: white;
  }
  .firstFloor {
    width: 100vw;
    height: 100vh;
    /* background-color: red; */
    margin-top: 50px;
    padding: 10px;
    .room {
      padding: 3px;

      .roomCont {
        padding: 5px;
        width: 100%;
       
        overflow-y: auto;
      }
      h4 {
        border-bottom: 1px solid gray;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        padding: 3px;
        .i {
          font-size: 20px;
        }
      }
      p {
        margin: 3px;
        font-size: 12px;
      }
      .name {
        background-color: white;
        padding: 3px;
        color: black;
        border-radius: 5px;
      }
      .arrisvalDay {
      }
      .dailyPrice {
      }
      .leaveHotelButton {
        background-color: red;
        color: white;
        border: none;
        padding: 3px 7px;
        height: 20px;
        border-radius: 4px;
        margin-left: 3px;
      }
    }
    .firstFloorScheme {
      height: calc(100% - 40px);
      width: 100%;
      display: flex;
      justify-content: space-between;

      .r101-104 {
        width: 20%;
        height: 100%;
        display: flex;
        flex-direction: column-reverse;
        /* border: 1px solid white; */

        .room {
          width: 100%;
          height: 25%;
          border: 1px solid white;
        }
      }
      .middle {
        width: 40%;
        /* border: 1px solid white; */
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        flex-direction: column;
        .pantry-107 {
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 35%;
          /* border: 1px solid white; */
          .room {
            border: 1px solid white;
          }
          .pantry {
            width: 30%;
          }
          .r107 {
            width: 70%;
          }
        }
        .r105-108 {
          display: flex;
          width: 100%;
          height: 40%;
          .room {
            border: 1px solid white;
          }
          .roomCont{
            flex-direction: column;
          }
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
        width: 30%;
        /* border: 1px solid white; */
        .room {
          width: 100%;
          height: 20%;
          border: 1px solid white;

        
          p {
            font-size: 12px;
            margin: 3px ;
          }
          .leaveHotelButton {
            background-color: red;
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
    width: 100vw;
    /* background-color: gree; */
    padding: 10px;
    /* border-top: 1px solid white; */


    h4 {
      border-bottom: 1px solid gray;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      padding: 3px;
      .i {
        font-size: 20px;
      }
    }
    .room {
      padding: 3px;

 
    }

    .name {
      background-color: white;
      padding: 3px;
      color: black;
      border-radius: 5px;
    }
    .arrivalDay {
    }
    .dailyPrice {
    }
    .leaveHotelButton {
      background-color: red;
      color: white;
      border: none;
      padding: 3px 7px;
      height: 20px;
      border-radius: 4px;
      margin-left: 3px;
    }
  }

  .secondFloorScheme {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: calc(100vh - 40px);

    .room {
      border: 1px solid white;
    }
    .column-1 {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      width: 70%;
      .r212-216 {
        display: flex;
        width: 100%;
        height: 30%;
        .room {
          width: 20%;
        }
        .roomCont{
          flex-direction: column;
        }
      }
      .row {
        display: flex;

        justify-content: space-between;
        height: 30%;
        .r207-210 {
          height: 100%;
          width: 30%;

          .room {
            height: 33%;

            p {
              height: fit-content;
              padding: 3px;
              font-size: 12px;
            }
          }
        }
      }
      .center {
        display: flex;

        width: 60%;
        .room {
          height: 33%;
       overflow-y: scroll;
        }
        .centerColumn-1 {
          width: 50%;
          height: 100%;
        }
        .centerColumn-2 {
          width: 50%;
          height: 100%;
        }
      }
    }
    .r201-205 {
      display: flex;
      width: 100%;
      height: 30%;
      .roomCont{
          flex-direction: column;
        }
      .room {
        width: 20%;
        height: 100%;
        p{
          margin: 5px;
          font-size: 12px;
        }
      }
    }
    .r217-223 {
      width: 25%;
      height: 80%;
      .room {
        height: 20%;
        p {
              height: fit-content;
              padding: 3px;
              font-size: 12px;
            }
      }
    }
  }
`;

/////////////////////////////////////////////////////////

export const Container = styled.div`
  background-color: black;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  text-align: center;

  .link {
    color: white;
  }

  .buttonsContainer {
    width: 95vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }
  .buttonsContainer2 {
    width: 95vw;
    padding: 15px 0 20px 0;

    .link2 {
      color: white;
    }
  }
  .exportToExcel {
    width: 100px;
    height: 30px;
    background-color: green;
    color: white;
    border-radius: 4px;
    border: none;
  }
  .showModal {
    margin: 10px 0;
  }
`;
export const Create = styled.div`
  text-align: center;

  input {
    width: 90%;
    height: 31px;
    margin: 3px 0;
    padding: 10px;
    border: 1px solid black;
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
    width: 200px;
    padding: 10px;
    background-color: #1677ff;
    color: white;
    border: none;
    border-radius: 10px;
    margin-top: 10px;
  }
`;

export const Table = styled.table`
  /* background-color: yellow; */
  width: 95vw;
  border-radius: 5px;

  tr {
    th {
      background-color: gray;
      color: white;
      padding: 5px;
    }

    td {
      background-color: rgba(22, 22, 23, 0.8);
      color: white;
      padding: 5px;

      .deleteButton {
        background-color: #c70039;
        color: white;
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
        background-color: red;
        color: white;
        border: none;
        padding: 3px 7px;
        height: 20px;
        border-radius: 4px;
      }
    }
  }
`;
