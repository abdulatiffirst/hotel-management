import React, { useState, useEffect } from "react";
import { Container, Create, Table } from "../multi control/styled";
import { set, ref, onValue, remove, update } from "firebase/database";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { Button, Modal, message, Popconfirm } from "antd";

function GetInformation() {
   // State for creating data
   const [name, setName] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
   const [roomNumber, setRoomNumber] = useState("");
   const [arrivalDay, setArrivalDay] = useState("");
   const [leavingDay, setLeavingDay] = useState("");
   const [dailyPrice, setDailyPrice] = useState("");
   const [days, setDays] = useState("");
   const [birthDate, setBirthDate] = useState("");
   const [passportSeries, setPassportSeries] = useState("");
   const [paymentMethod, setPaymentMethod] = useState("");
   // Modal state
   const [isModalOpen, setIsModalOpen] = useState(false);

   // Function to handle opening modal
   const showModal = () => {
     setIsModalOpen(true);
   };
 
   // Function to handle modal OK
   const handleOk = () => {
     setIsModalOpen(false);
   };
 
   // Function to handle modal cancel
   const handleCancel = () => {
     setIsModalOpen(false);
   };
  // State for leave hotel functionality
  const [leaveHotelRows, setLeaveHotelRows] = useState({});
  const [informations, setInformations] = useState([]);
  // State for editing data
  const [editInformations, setEditInformations] = useState(false);
  const [tempUuid, setTempUuid] = useState("");
    // Function to handle editing data
    const handleEdit = (value) => {
      setEditInformations(true);
      setName(value.name);
      setTempUuid(value.uuid);
      setPhoneNumber(value.phoneNumber);
      setArrivalDay(value.arrivalDay);
      setRoomNumber(value.roomNumber);
      setLeavingDay(value.leavingDay);
      setDailyPrice(value.dailyPrice);
      setDays(value.days);
      setBirthDate(value.birthDate);
      setPassportSeries(value.passportSeries);
      setPaymentMethod(value.paymentMethod)
      showModal();
    };
  
    // Function to submit edited data
    const handleSubmitChange = () => {
      update(ref(db, `/${tempUuid}`), {
        name,
        phoneNumber,
        roomNumber,
        arrivalDay,
        leavingDay,
        dailyPrice,
        days,
        birthDate,
        passportSeries,
        uuid: tempUuid,
        leaveHotel: leaveHotelRows[tempUuid],
        leaveHotelTime: leaveHotelRows[tempUuid]
          ? new Date().toLocaleString()
          : null,
        paymentMethod,
      });
      setEditInformations(false);
      setName("");
      setPhoneNumber("");
      setArrivalDay("");
      setRoomNumber("");
      setLeavingDay("");
      setDailyPrice("");
      setDays("");
      setBirthDate("");
      setPassportSeries("");
      setPaymentMethod("");
      setIsModalOpen(false);
    };
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
      <Modal
            title="Add Guest"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Create>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <input
                type="text"
                placeholder="Passport series"
                value={passportSeries}
                onChange={(e) => setPassportSeries(e.target.value)}
              />
              <input
                type="number"
                placeholder="Room Number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
              <input
                type="date"
                placeholder="Arrival day"
                value={arrivalDay}
                onChange={(e) => setArrivalDay(e.target.value)}
              />
              <input
                type="date"
                placeholder="Leaving day"
                value={leavingDay}
                onChange={(e) => setLeavingDay(e.target.value)}
              />
              <input
                type="number"
                placeholder="Daily Price"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select payment method</option>
                <option value="Cash">Cash</option>
                <option value="Debit Card">Debit Card</option>
              </select>

                <div>
                  <button onClick={handleSubmitChange}>Submit Change</button>{" "}
                  <button
                    onClick={() => {
                      setEditInformations(false);
                      setName("");
                      setPhoneNumber("");
                      setArrivalDay("");
                      setRoomNumber("");
                      setLeavingDay("");
                      setDailyPrice("");
                      setDays("");
                      setBirthDate("");
                      setPassportSeries("");
                      setPaymentMethod("");
                      setIsModalOpen(false);
                    }}
                  >
                    X
                  </button>
                </div>
             
            </Create>
          </Modal>
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
            <th>Payment Method</th>
            {/* <th>Edit</th> */}
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
              <td>{value.paymentMethod}</td>
              {/* <td> <button
                    className="updateButton"
                    onClick={() => handleEdit(value)}
                  >
                    Edit
                  </button></td> */}
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
