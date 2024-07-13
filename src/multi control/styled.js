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
  .link{
    color: white;
  }
  
  .buttonsContainer {
    width: 95vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    text-align:center;
  }
  .buttonsContainer2 {
 width: 95vw;
 padding:15px 0 20px 0;
 
    .link2{
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

  select{
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
      
      th{
        background-color: gray;
        color: white;
        padding: 5px;
      }

      td {
        background-color: rgba(22, 22, 23, .8);
        color: white;
        padding: 5px;
        

        .deleteButton {
          background-color:#C70039 ;
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
          background-color: #f56300 ;
          color: white;
          border: none;
          padding: 3px 7px;
          height: 20px;
          border-radius: 4px;
        }
      }
    
  }
`;
