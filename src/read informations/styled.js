import styled from "styled-components";

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
    color: black;
  }

  
  .buttonsContainer2 {
    width: 95vw;
    padding: 15px 0 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .link2 {
      color: white;
    }
    input {
      width: 400px;
      height: 30px;
      margin-left: 40px;
      padding: 3px;
      border-radius: 5px;
    }
  }
  .exportToExcel {
    width: 100px;
    height: 30px;
    background-color: #4caf50;
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
    border: 1px solid #3c3c3c;
    border-radius: 10px;
  }

  select {
    width: 90%;
    height: 40px;
    margin: 3px 0;
    padding: 5px;
    background-color: black;
    color: #b0b0b0;
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




export const Table = styled.table`
  /* background-color: yellow; */
width: 96vw;
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

  .passportSeries{
    text-transform: uppercase;
  }
  `