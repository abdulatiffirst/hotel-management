import React, { useState, useEffect } from "react";
import { Container, Create, Table } from "../multi control/styled";
import { set, ref, onValue, remove, update } from "firebase/database";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { Button, Modal, message, Popconfirm } from "antd";

function GetInformation() {
  // State for leave hotel functionality
  const [leaveHotelRows, setLeaveHotelRows] = useState({});
  const [informations, setInformations] = useState([]);
  //Function to get information from firebase
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        const sortedData = Object.values(data).sort((a, b) => {
          if (a.leaveHotel && !b.leaveHotel) return 1;
          if (!a.leaveHotel && b.leaveHotel) return -1;
          return new Date(b.registrationTime) - new Date(a.registrationTime);
        });
        setInformations(sortedData);
        const leaveHotelStatus = {};
        sortedData.forEach((info) => {
          leaveHotelStatus[info.uuid] = info.leaveHotel || false;
        });
        setLeaveHotelRows(leaveHotelStatus);
      }
    });
  }, []);
  // Function to handle deleting data
  const handleDelete = (inf) => {
    remove(ref(db, `/${inf.uuid}`));
  };

  //Function popconfirm
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  return (
    <Container>
      <div>
              <div className="buttonsContainer2">
                  <div>
                  <Link className="link2" to="/">
            Create
          </Link>
                  </div>
       
        </div>

        <Table>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Passport Series</th>
            <th>Date of Birth</th>
            <th>Room Namber</th>
            {/* <th>Phone Number</th> */}
            <th>Arrival Day</th>
            <th>Leaving Day</th>
            {/* <th>Guests Quintity</th> */}
            <th>Registsration time</th>
            <th>Leave Hotel Time</th>
            <th>Days</th>
            <th>Daily Price</th>
            <th>Whole Price</th>
            {/* <th>Delete</th> */}
          </tr>
          {informations.map((value, index) => (
            <tr key={value.uuid}>
              <td>{index + 1}</td>
              <td>{value.name}</td>
              <td>{value.passportSeries}</td>
              <td>{value.birthDate}</td>
              {/* <th>{value.phoneNumber}</th> */}
              <td>{value.roomNumber}</td>
              <td>{value.arrivalDay}</td>
              <td>{value.leavingDay}</td>
              <td>{value.registrationTime}</td>
              <td>{value.leaveHotelTime}</td>
              <td>{value.days}</td>
              <td>{value.dailyPrice}</td>
              <td>{value.days * value.dailyPrice}</td>
              {/* <td>
                <Popconfirm
                  title="Delete"
                  description="Are you sure to delete this guest?"
                  onConfirm={() => handleDelete(value)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                  className="deleteButton"
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </td> */}
            </tr>
          ))}
        </Table>
      </div>
    </Container>
  );
}

export default GetInformation;
