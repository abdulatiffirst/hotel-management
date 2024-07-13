import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import { Container, Create, Table } from "./styled";
import { Button, Modal, message, Popconfirm } from "antd";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
// import { formLabelClasses } from "@mui/material";

function MultiControll() {
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
  //Payment method
  const [paymentMethod, setPaymentMethod] = useState("");
  // State for leave hotel functionality
  const [leaveHotelRows, setLeaveHotelRows] = useState({});

  // State for reading data
  const [informations, setInformations] = useState([]);

  // State for editing data
  const [editInformations, setEditInformations] = useState(false);
  const [tempUuid, setTempUuid] = useState("");

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

  // Function to handle leaving hotel
  const handleLeaveHotel = (value) => {
    const updatedLeaveHotelStatus = !leaveHotelRows[value.uuid];
    setLeaveHotelRows((prevLeaveHotelRows) => ({
      ...prevLeaveHotelRows,
      [value.uuid]: updatedLeaveHotelStatus,
    }));
    const leaveHotelTime = updatedLeaveHotelStatus
      ? new Date().toLocaleString()
      : null;
    update(ref(db, `/${value.uuid}`), {
      ...value,
      leaveHotel: updatedLeaveHotelStatus,
      leaveHotelTime,
    });
  };

  // Function to read data from Firebase
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

  // Function to write data to Firebase
  const writeToDatabase = () => {
    const uuid = uid();
    set(ref(db, `/${uuid}`), {
      name,
      phoneNumber,
      roomNumber,
      arrivalDay,
      leavingDay,
      dailyPrice,
      days,
      birthDate,
      passportSeries,
      registrationTime: new Date().toLocaleString(),
      uuid,
      leaveHotel: false, // Add default leaveHotel status
      leaveHotelTime: null,
      paymentMethod,
    });
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
  };

  // Function to handle deleting data
  // const handleDelete = (inf) => {
  //   remove(ref(db, `/${inf.uuid}`));
  // };

  // Function to handle exporting data to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(informations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "informations.xlsx";
    a.click();
  };

  //Function popconfirm
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <Container>
      <div>
        <div className="buttonsContainer">
          <Button type="primary" className="showModal" onClick={showModal}>
            Open Modal
          </Button>
          <Link className="link" to="/getInformation">
            Data
          </Link>
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

              {editInformations ? (
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
                      setPaymentMethod("")
                    }}
                  >
                    X
                  </button>
                </div>
              ) : (
                <button onClick={writeToDatabase}>Submit</button>
              )}
            </Create>
          </Modal>
          <button className="exportToExcel" onClick={handleExportToExcel}>
            Export to Excel
          </button>
        </div>
        <Table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Room Number</th>
              <th>Arrival Day</th>
              <th>Leaving Day</th>
              <th>Daily Price</th>
              <th>Whole Price</th>
              <th>Payment Method</th>
              {/* <th>Delete</th> */}
              <th>Update</th>
              <th>Leave Hotel</th>
            </tr>
          </thead>
          <tbody>
            {informations.map((value, index) => (
              <tr
                style={{
                  display: leaveHotelRows[value.uuid] ? "none" : "",
                }}
                key={value.uuid}
              >
                <td>{index + 1}</td>
                <td>{value.name}</td>
                <td>{value.roomNumber}</td>
                <td>{value.arrivalDay}</td>
                <td>{value.leavingDay}</td>
                <td>{value.dailyPrice}</td>
                <td>{value.days * value.dailyPrice}</td>
                <td>{value.paymentMethod}</td>
                <td>
                  <button
                    className="updateButton"
                    onClick={() => handleEdit(value)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <Popconfirm
                    title=""
                    description="Leave?"
                    onConfirm={() => handleLeaveHotel(value)}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                    className="leaveHotelButton"
                  >
                    <Button danger>Leave Hotel</Button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default MultiControll;
