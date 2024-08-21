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
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* padding: 10px; */

  .name {
    text-transform: capitalize;
    background-color: #4caf50;
    padding: 3px;
    color: white;
    border-radius: 5px;
  }

  .room {
    overflow-y: scroll;
    background-color: #333333;
    border: 1px solid #3c3c3c;
    padding: 4px;
  }
  .roomCont {
    height: fit-content;
    display: flex;
    padding: 5px;
    width: 100%;
    overflow-y: auto;
    flex-direction: column;
  }
  h1 {
    margin: 20px 0 10px 10px;
    color: #ff5722;
    padding: 5px 0;
  }
  h4 {
    position: sticky;
    color: #ffffff;
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
    height: fit-content;
          padding: 2px;
          font-size: 12px;
          color: white;
  }
  .leaveHotelButton {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 3px 7px;
      height: 20px;
      border-radius: 4px;
      margin-left: 3px;
    }
  .Buttons {
    width: 100%;
    height: 50px;
    padding: 10px 20px;
    font-size: 20px;
    top: 0px;
    position: fixed;
    background-color: #1a1a1b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
    .exportToExcel {
      width: 100px;
      height: 30px;
      background-color: #4caf50;
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
    /* margin-top: 10px; */
    padding: 10px;

    h4 {
      border-bottom: 1px solid gray;
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
    width: 100vw;
    /* background-color: gree; */
    padding: 10px;
    /* border-top: 1px solid white; */

    .arrivalDay {
    }
    .dailyPrice {
    }
 
  }

  .secondFloorScheme {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: calc(100vh - 40px);

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

     
          }
        }
      }
      .center {
        display: flex;

        width: 60%;
        .room {
          height: 33%;
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

      .room {
        width: 20%;
        height: 100%;
  
      }
    }
    .r217-223 {
      width: 25%;
      height: 80%;
      .room {
        height: 20%;
     
      }
    }
  }
`;

/////////////////////////////////////////////////////////

export const ToggleButton = styled.button`
  margin: 60px 0 0 15px;
  padding: 5px;
  border: none;
  background-color: white;
  color: black;
  border-radius: 5px;
`;

export const Table = styled.table`
  /* background-color: yellow; */

  height: 90vh;
  border-radius: 5px;
  margin: 10px 0;
  overflow-y: scroll;
  text-transform: capitalize;

  tr:nth-child(even) {
    background-color: gray;
  }
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
        padding: 3px 7px;
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
    width: 200px;
    padding: 10px;
    background-color: #1677ff;
    color: black;
    border: none;
    border-radius: 10px;
    margin-top: 10px;
  }
  
`;
