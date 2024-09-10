import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import {
  Create,
  Table,
  ContainerScheme,
  UpdateButton,
  ToggleButton,
  ElevatorButton,
  ContainerTable
} from "./styled";
import { Button, Modal, message, Popconfirm } from "antd";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import BedroomChildIcon from "@mui/icons-material/BedroomChild";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// import { formLabelClasses } from "@mui/material";
import Switch from "@mui/material/Switch";
import BookIcon from '@mui/icons-material/Book';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
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
  const [paymentMethod, setPaymentMethod] = useState("");

  // State for leave hotel functionality
  const [leaveHotelRows, setLeaveHotelRows] = useState({});

  //FirstFloor & SecondFloor Switch
  const [firstFloorVisible, setFirstFloorVisible] = useState(true);
  const [secondFloorVisible, setSecondFloorVisible] = useState(false);

  //State for switch
  const [switch1, setSwitch1] = useState(true);

  // State for reading data
  const [informations, setInformations] = useState([]);

  // State for editing data
  const [editInformations, setEditInformations] = useState(false);
  const [tempUuid, setTempUuid] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");

  //Switch
  const [checked, setChecked] = React.useState(true);

  const handleSwitch = (event) => {
    setChecked(event.target.checked);
    setSwitch1(!switch1);
  };

  //Function to more information}

  const [openRoom, setOpenRoom] = useState(false);
  const handleOpenModal = () => {
    setOpenRoom(true);
  };

  const handleCloseModal = () => {
    setOpenRoom(false);
  };

  // Function to handle opening modal add Guest
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle modal cancel
  const handleCancel = () => {
    setIsModalOpen(false);
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
    // setPhoneNumber(value.phoneNumber);
    setArrivalDay(value.arrivalDay);
    setRoomNumber(value.roomNumber);
    setLeavingDay(value.leavingDay);
    setDailyPrice(value.dailyPrice);
    setDays(value.days);
    setBirthDate(value.birthDate);
    setPassportSeries(value.passportSeries);
    setPaymentMethod(value.paymentMethod);
    showModal();
    setOpenRoom(false);
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

  // Function to handle deleting data
  // const handleDelete = (inf) => {
  //   remove(ref(db, `/${inf.uuid}`));
  // };

  // Function to handle exporting data to Excel
 const handleExportToExcel = () => {
    const tableData = informations.map((value, index) => ({
      No: index + 1,
      Name: value.name,
      RoomNumber: value.roomNumber,
      ArrivalDay: value.arrivalDay,
      LeavingDay: value.leavingDay,
      RgistrationTime: value.registrationTime,
      LeavingTime: value.leaveHotelTime,
      Days: value.days,
      DailyPrice: value.dailyPrice,
      WholePrice: value.days * value.dailyPrice,
      PaymentMethod: value.paymentMethod,
    }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
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

  const handleOk = () => {
    if (
      name &&
      roomNumber &&
      arrivalDay &&
      dailyPrice &&
      birthDate &&
      paymentMethod &&
      days
    ) {
      writeToDatabase();
      setIsModalOpen(false);
    } else {
      message.error("Please fill in all fields");
    }
  };

  //Function to choose first floor and second floor

  const FirstFloor = () => {
    setFirstFloorVisible(true);
    setSecondFloorVisible(false);
  };
  const SecondFloor = () => {
    setFirstFloorVisible(false);
    setSecondFloorVisible(true);
  };

  return (
    <ContainerScheme>
      <div className="Buttons">
<div className="miniContainer">
        <Button style={{backgroundColor:"#1B4235", color:"white", fontSize:"100px", width:"50px", height:"50px",borderRadius:"100%"}}  className="showModal" onClick={showModal}>
         <ControlPointRoundedIcon/>
        </Button>
     
        <ElevatorButton onClick={FirstFloor}>1</ElevatorButton>
          
          <ElevatorButton onClick={SecondFloor}>2</ElevatorButton>
          <ToggleButton    style={{backgroundColor:"#D1D8D6"}}>
          <Switch
            checked={checked}
            onChange={handleSwitch}
              inputProps={{ "aria-label": "controlled" }}
              ToggleButton    style={{color:"#1B4235"}}
          />
          </ToggleButton>
          </div>
        <div className="miniContainer">
       

        <Link className="link" to="/getInformation">
          History
        </Link>
        <Link className="link" to="/">
          Home
          </Link>
          <button className="exportToExcel" onClick={handleExportToExcel}><BookIcon/></button>

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
              onChange={(e) => setPassportSeries(e.target.value.toUpperCase())}
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
              <option value="Contract">Contract</option>
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
                    setPaymentMethod("");
                    setIsModalOpen(false);
                  }}
                >
                  X
                </button>
              </div>
            ) : (
              <></>
            )}
          </Create>

        </Modal>

    

        {/* <button className="exportToExcel" onClick={handleExportToExcel}>
          Export To Excel
        </button> */}
        </div>
      </div>

      <>
        {/* <div>
        <div className="buttonsContainer">
          <Button type="primary" className="showModal" onClick={showModal}>
            Open Modal
          </Button>
         
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
                      setPaymentMethod("");
                      setIsModalOpen(false);
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
                       <Button danger><LogoutRoundedIcon/></Button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div> */}
      </>
      {firstFloorVisible && (
        <div
          className="firstFloor"
          style={switch1 ? { display: "flex" } : { display: "none" }}
        >
          <div className="floor-titel">
            <h1>1st FLOOR</h1>
          </div>
          <div className="firstFloorScheme">
            <div className="r101-104">
              <div className="r101 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("101");
                    handleOpenModal();
                  }}
                >
                  <b>101</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "101")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
              <div className="r102 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("102");
                    handleOpenModal();
                  }}
                >
                  <b>102</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "102")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
              <div className="r103 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("103");
                    handleOpenModal();
                  }}
                >
                  <b>103</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "103")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
              <div className="r104 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("104");
                    handleOpenModal();
                  }}
                >
                  <b>104</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "104")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
            </div>
            <div className="middle">
              <div className="pantry-107">
                <div className="pantry room">Pantry</div>
                <div className="r107 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("107");
                      handleOpenModal();
                    }}
                  >
                    <b>107</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>

                  {informations
                    .filter((value) => value.roomNumber === "107")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
              </div>
              <div className="r105-108">
                <div className="r105 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("105");
                      handleOpenModal();
                    }}
                  >
                    <b>105</b>|<BedroomParentIcon className="i" />
                  </h4>

                  {informations
                    .filter((value) => value.roomNumber === "105")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r106 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("106");
                      handleOpenModal();
                    }}
                  >
                    <b>106</b>|<BedroomParentIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>

                  {informations
                    .filter((value) => value.roomNumber === "106")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r108 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("108");
                      handleOpenModal();
                    }}
                  >
                    <b>108</b>|<BedroomParentIcon className="i" />
                  </h4>

                  {informations
                    .filter((value) => value.roomNumber === "108")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="r109-113">
              <div className="r109 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("109");
                    handleOpenModal();
                  }}
                >
                  <b>109</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "109")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
              <div className="r110 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("110");
                    handleOpenModal();
                  }}
                >
                  <b>110</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "110")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
              <div className="r111 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("111");
                    handleOpenModal();
                  }}
                >
                  <b>111</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "111")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
              <div className="r112 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("112");
                    handleOpenModal();
                  }}
                >
                  <b>112</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "112")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
              <div className="r113 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("113");
                    handleOpenModal();
                  }}
                >
                  <b>113</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>

                {informations
                  .filter((value) => value.roomNumber === "113")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>
                      <p className="arrivalDay">
                        {value.arrivalDay}/{value.leaveHotel}
                      </p>
                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                      <Popconfirm
                        title=""
                        description="Leave?"
                        onConfirm={() => handleLeaveHotel(value)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        className="leaveHotelButton"
                      >
                        <Button danger>
                          <LogoutRoundedIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {secondFloorVisible && (
        <div
          className="secondFloor"
          style={switch1 ? { display: "flex" } : { display: "none" }}
        >
          <div className="floor-titel">
            <h1>2nd FLOOR</h1>
          </div>
         
          <div className="secondFloorScheme">
            <div className="column-1">
              <div className="r212-216">
                <div className="r212 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("212");
                      handleOpenModal();
                    }}
                  >
                    <b>212</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "212")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r213 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("213");
                      handleOpenModal();
                    }}
                  >
                    <b>213</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "213")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r214 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("214");
                      handleOpenModal();
                    }}
                  >
                    <b>214</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "214")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r215 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("215");
                      handleOpenModal();
                    }}
                  >
                    <b>215</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "215")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r216 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("216");
                      handleOpenModal();
                    }}
                  >
                    <b>216</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "216")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
              </div>
              <div className="row">
                <div className="r207-210">
                  <div className="r210 room">
                    <h4
                      onClick={() => {
                        setCurrentRoom("210");
                        handleOpenModal();
                      }}
                    >
                      <b>210</b>|<BedroomParentIcon className="i" />
                    </h4>
                    {informations
                      .filter((value) => value.roomNumber === "210")
                      .map((value, index) => (
                        <div
                          key={index}
                          style={{
                            display: leaveHotelRows[value.uuid] ? "none" : "",
                          }}
                          className="roomCont"
                        >
                          <p className="name">
                            {index + 1}) {value.name}
                          </p>

                          {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                        </div>
                      ))}
                  </div>
                  <div className="r209 room">
                    <h4
                      onClick={() => {
                        setCurrentRoom("209");
                        handleOpenModal();
                      }}
                    >
                      <b>209</b>|<BedroomChildIcon className="i" />
                      <BedroomChildIcon className="i" />
                      <BedroomChildIcon className="i" />
                    </h4>
                    {informations
                      .filter((value) => value.roomNumber === "209")
                      .map((value, index) => (
                        <div
                          key={index}
                          style={{
                            display: leaveHotelRows[value.uuid] ? "none" : "",
                          }}
                          className="roomCont"
                        >
                          <p className="name">
                            {index + 1}) {value.name}
                          </p>

                          {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                        </div>
                      ))}
                  </div>
                  <div className="r207 room ">
                    {" "}
                    <h4
                      onClick={() => {
                        setCurrentRoom("207");
                        handleOpenModal();
                      }}
                    >
                      <b>207</b>|<BedroomParentIcon className="i" />
                    </h4>
                    {informations
                      .filter((value) => value.roomNumber === "207")
                      .map((value, index) => (
                        <div
                          key={index}
                          style={{
                            display: leaveHotelRows[value.uuid] ? "none" : "",
                          }}
                          className="roomCont"
                        >
                          <p className="name">
                            {index + 1}) {value.name}
                          </p>

                          {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="center">
                  <div className="centerColumn-1">
                    <div className="r211 room">
                      <h4
                        onClick={() => {
                          setCurrentRoom("211");
                          handleOpenModal();
                        }}
                      >
                        <b>211</b>|<BedroomParentIcon className="i" />
                      </h4>
                      {informations
                        .filter((value) => value.roomNumber === "211")
                        .map((value, index) => (
                          <div
                            key={index}
                            style={{
                              display: leaveHotelRows[value.uuid] ? "none" : "",
                            }}
                            className="roomCont"
                          >
                            <p className="name">
                              {index + 1}) {value.name}
                            </p>

                            {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                          </div>
                        ))}
                    </div>
                    <div className="r208 room">
                      <h4
                        onClick={() => {
                          setCurrentRoom("208");
                          handleOpenModal();
                        }}
                      >
                        <b>208</b>|<BedroomParentIcon className="i" />
                        <BedroomChildIcon className="i" />
                      </h4>
                      {informations
                        .filter((value) => value.roomNumber === "208")
                        .map((value, index) => (
                          <div
                            key={index}
                            style={{
                              display: leaveHotelRows[value.uuid] ? "none" : "",
                            }}
                            className="roomCont"
                          >
                            <p className="name">
                              {index + 1}) {value.name}
                            </p>

                            {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                          </div>
                        ))}
                    </div>
                    <div className="r206 room">
                      <h4
                        onClick={() => {
                          setCurrentRoom("206");
                          handleOpenModal();
                        }}
                      >
                        <b>206</b>|<BedroomParentIcon className="i" />
                      </h4>
                      {informations
                        .filter((value) => value.roomNumber === "206")
                        .map((value, index) => (
                          <div
                            key={index}
                            style={{
                              display: leaveHotelRows[value.uuid] ? "none" : "",
                            }}
                            className="roomCont"
                          >
                            <p className="name">
                              {index + 1}) {value.name}
                            </p>

                            {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="centerColumn-2">
                    <div className="r219 room">
                      <h4
                        onClick={() => {
                          setCurrentRoom("219");
                          handleOpenModal();
                        }}
                      >
                        <b>219</b>|<BedroomParentIcon className="i" />
                      </h4>
                      {informations
                        .filter((value) => value.roomNumber === "219")
                        .map((value, index) => (
                          <div
                            key={index}
                            style={{
                              display: leaveHotelRows[value.uuid] ? "none" : "",
                            }}
                            className="roomCont"
                          >
                            <p className="name">
                              {index + 1}) {value.name}
                            </p>

                            {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                          </div>
                        ))}
                    </div>
                    <div className="r221 room">
                      <h4
                        onClick={() => {
                          setCurrentRoom("221");
                          handleOpenModal();
                        }}
                      >
                        <b>221</b>|<BedroomChildIcon className="i" />
                        <BedroomChildIcon className="i" />
                        <BedroomChildIcon className="i" />
                      </h4>
                      {informations
                        .filter((value) => value.roomNumber === "221")
                        .map((value, index) => (
                          <div
                            key={index}
                            style={{
                              display: leaveHotelRows[value.uuid] ? "none" : "",
                            }}
                            className="roomCont"
                          >
                            <p className="name">
                              {index + 1}) {value.name}
                            </p>

                            {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                          </div>
                        ))}
                    </div>
                    <div className="r224 room">
                      <h4
                        onClick={() => {
                          setCurrentRoom("224");
                          handleOpenModal();
                        }}
                      >
                        <b>224</b>|<BedroomParentIcon className="i" />
                      </h4>
                      {informations
                        .filter((value) => value.roomNumber === "224")
                        .map((value, index) => (
                          <div
                            key={index}
                            style={{
                              display: leaveHotelRows[value.uuid] ? "none" : "",
                            }}
                            className="roomCont"
                          >
                            <p className="name">
                              {index + 1}) {value.name}
                            </p>

                            {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="r201-205">
                <div className="r205 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("205");
                      handleOpenModal();
                    }}
                  >
                    <b>205</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "205")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r204 room">
                  {" "}
                  <h4
                    onClick={() => {
                      setCurrentRoom("204");
                      handleOpenModal();
                    }}
                  >
                    <b>204</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "204")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r203 room">
                  {" "}
                  <h4
                    onClick={() => {
                      setCurrentRoom("203");
                      handleOpenModal();
                    }}
                  >
                    <b>203</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "203")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r202 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("202");
                      handleOpenModal();
                    }}
                  >
                    <b>202</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "202")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
                <div className="r201 room">
                  <h4
                    onClick={() => {
                      setCurrentRoom("201");
                      handleOpenModal();
                    }}
                  >
                    <b>201</b>|<BedroomChildIcon className="i" />
                    <BedroomChildIcon className="i" />
                  </h4>
                  {informations
                    .filter((value) => value.roomNumber === "201")
                    .map((value, index) => (
                      <div
                        key={index}
                        style={{
                          display: leaveHotelRows[value.uuid] ? "none" : "",
                        }}
                        className="roomCont"
                      >
                        <p className="name">
                          {index + 1}) {value.name}
                        </p>
                        <p className="arrivalDay">
                          {value.arrivalDay}/{value.leaveHotel}
                        </p>
                        {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}

                        <Popconfirm
                          title=""
                          description="Leave?"
                          onConfirm={() => handleLeaveHotel(value)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          className="leaveHotelButton"
                        >
                          <Button danger>
                            <LogoutRoundedIcon />
                          </Button>
                        </Popconfirm>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="r217-223">
              <div className="r217 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("217");
                    handleOpenModal();
                  }}
                >
                  <b>217</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>
                {informations
                  .filter((value) => value.roomNumber === "217")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>

                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                    </div>
                  ))}
              </div>
              <div className="r218 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("218");
                    handleOpenModal();
                  }}
                >
                  <b>218</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>
                {informations
                  .filter((value) => value.roomNumber === "218")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>

                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                    </div>
                  ))}
              </div>
              <div className="r220 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("220");
                    handleOpenModal();
                  }}
                >
                  <b>220</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>
                {informations
                  .filter((value) => value.roomNumber === "220")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>

                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                    </div>
                  ))}
              </div>
              <div className="r222 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("222");
                    handleOpenModal();
                  }}
                >
                  <b>222</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>
                {informations
                  .filter((value) => value.roomNumber === "222")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>

                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                    </div>
                  ))}
              </div>
              <div className="r223 room">
                <h4
                  onClick={() => {
                    setCurrentRoom("223");
                    handleOpenModal();
                  }}
                >
                  <b>223</b>|<BedroomChildIcon className="i" />
                  <BedroomChildIcon className="i" />
                </h4>
                {informations
                  .filter((value) => value.roomNumber === "223")
                  .map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: leaveHotelRows[value.uuid] ? "none" : "",
                      }}
                      className="roomCont"
                    >
                      <p className="name">
                        {index + 1}) {value.name}
                      </p>

                      {/* <p className="dailyPrice">{value.dailyPrice}/Day</p> */}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Guest Information"
        open={openRoom}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
      >
        {informations
          .filter((value) => value.roomNumber === currentRoom)
          .map((value, index) => (
            <div
              key={index}
              style={{
                display: leaveHotelRows[value.uuid] ? "none" : "",
                borderBottom: "1px solid gray",
                padding: "5px",
              }}
            >
              <p>Name: {value.name}</p>
              <p>Arrival Day: {value.arrivalDay}</p>
              <p>Leaving Day: {value.leavingDay}</p>
              <p>Daily Price: {value.dailyPrice}</p>
              <p>Days: {value.days}</p>
              <p>Payment Method: {value.paymentMethod}</p>
              <UpdateButton
                className="updateButton"
                onClick={() => handleEdit(value)}
              >
                Edit
              </UpdateButton>

              <p>
                <Popconfirm
                  title=""
                  description="Leave?"
                  onConfirm={() => handleLeaveHotel(value)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                  className="leaveHotelButton"
                >
                  <Button
                    style={{
                      fontSize: "12px",
                      width: "100px",
                      height: "24px",
                      color: "white",
                      backgroundColor: "red",
                    }}
                    danger
                  >
                    Leave
                  </Button>
                </Popconfirm>
              </p>
            </div>
          ))}
      </Modal>
      <ContainerTable style={switch1 ? { display: "none" } : { display: "flex" }}>
      <Table >
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
                  <Button danger>
                    <LogoutRoundedIcon />
                  </Button>
                </Popconfirm>
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
        </ContainerTable>
    </ContainerScheme>
  );
}

export default MultiControll;

