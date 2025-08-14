import React, { useState, useEffect, useMemo, useCallback } from "react";
import { db } from "../firebaseConfig";
import { uid } from "uid";
import {
  set,
  ref,
  onValue,
  // remove,
  update,
} from "firebase/database";
import {
  Create,
  Table,
  ContainerScheme,
  UpdateButton,
  ToggleButton,
  ElevatorButton,
  ContainerTable,
  ContainerModal,
} from "./styled";
import { Button, Modal, message, Popconfirm } from "antd";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import BedroomChildIcon from "@mui/icons-material/BedroomChild";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// import { formLabelClasses } from "@mui/material";
import Switch from "@mui/material/Switch";
import BookIcon from "@mui/icons-material/Book";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
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
  const [loading, setLoading] = useState(true);

  // State for editing data
  const [editInformations, setEditInformations] = useState(false);
  const [tempUuid, setTempUuid] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");

	// Leave modal state
	const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
	const [leaveModalGuest, setLeaveModalGuest] = useState(null);
	const [leaveDays, setLeaveDays] = useState("");

	  const formatDateTimeDMY = useCallback((value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  }, []);

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

  // Function to read data from Firebase
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        const dataArray = Object.values(data);
        const sortedData = dataArray.sort((a, b) => {
          if (a.leaveHotel && !b.leaveHotel) return 1;
          if (!a.leaveHotel && b.leaveHotel) return -1;
          return new Date(b.registrationTime) - new Date(a.registrationTime);
        });
        setInformations(sortedData);
        
        // Optimize leaveHotelRows creation
        const leaveHotelStatus = {};
        for (let i = 0; i < dataArray.length; i++) {
          const info = dataArray[i];
          leaveHotelStatus[info.uuid] = info.leaveHotel || false;
        }
        setLeaveHotelRows(leaveHotelStatus);
      }
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Group guests by room number (excluding those who already left)
  const roomMap = useMemo(() => {
    const map = {};
    const activeGuests = informations.filter(guest => !leaveHotelRows[guest.uuid]);
    activeGuests.forEach((guest) => {
      const rn = String(guest.roomNumber);
      if (!map[rn]) map[rn] = [];
      map[rn].push(guest);
    });
    return map;
  }, [informations, leaveHotelRows]);

  // Function to handle leaving hotel
  const handleLeaveHotel = useCallback((guest) => {
    setLeaveModalGuest(guest);
    setLeaveDays(guest.days || "");
    setIsLeaveModalOpen(true);
  }, []);

  // Reusable renderer for room guests to remove duplication without UI changes
  const renderRoomGuests = useCallback((roomNumber, { showArrival = true, showLeave = true } = {}) => {
    const guests = roomMap[String(roomNumber)] || [];
    return guests.map((value, index) => (
      <div key={value.uuid || index} className="roomCont">
        <p className="name">
          {index + 1}) {value.name}
        </p>
        {showArrival ? (
          <p className="arrivalDay">
            {value.registrationTime}/{value.leaveHotel}
          </p>
        ) : null}
        {showLeave ? (
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
        ) : null}
      </div>
    ));
  }, [roomMap, handleLeaveHotel]);

  // Function to write data to Firebase
  const writeToDatabase = () => {
    const uuid = uid();
    set(ref(db, `/${uuid}`), {
      name,
      phoneNumber,
      roomNumber,
      dailyPrice,
      birthDate,
      passportSeries,
      registrationTime: new Date().toISOString(),
      uuid,
      leaveHotel: false, // Add default leaveHotel status
      leaveHotelTime: null,
      paymentMethod,
    });
    setName("");
    setPhoneNumber("");
    setRoomNumber("");
    setDailyPrice("");
    setBirthDate("");
    setPassportSeries("");
    setPaymentMethod("");
    setIsModalOpen(false);
  };

  // Function to handle editing data
  const handleEdit = useCallback((value) => {
    setEditInformations(true);
    setName(value.name);
    setTempUuid(value.uuid);
    // setPhoneNumber(value.phoneNumber);
    setRoomNumber(value.roomNumber);
    setDailyPrice(value.dailyPrice);
    setBirthDate(value.birthDate);
    setPassportSeries(value.passportSeries);
    setPaymentMethod(value.paymentMethod);
    showModal();
    setOpenRoom(false);
  }, []);

  // Function to submit edited data
  const handleSubmitChange = () => {
    update(ref(db, `/${tempUuid}`), {
      name,
      phoneNumber,
      roomNumber,
      dailyPrice,
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
    setRoomNumber("");
    setDailyPrice("");
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
  const handleExportToExcel = useCallback(() => {
    const tableData = informations.map((value, index) => ({
      No: index + 1,
      Name: value.name,
      RoomNumber: value.roomNumber,
      ArrivalDay: value.arrivalDay,
      LeavingDay: value.leavingDay,
      RegistrationTime: value.registrationTime,
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
    
    // Clean up URL object to prevent memory leaks
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }, [informations]);

  //Function popconfirm
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const handleOk = () => {
    if (editInformations) return;
    if (
      (roomNumber >= 101 && roomNumber <= 113) ||
      (roomNumber >= 201 && roomNumber <= 224)
    ) {
      if (
        name &&
        roomNumber &&
        dailyPrice &&
        birthDate &&
        paymentMethod
      ) {
        writeToDatabase();
        setIsModalOpen(false);
      } else {
        message.error("Please fill in all fields");
      }
    } else {
      message.error(
        "Invalid room number. Please enter a room number between 101-113 or 201-224."
      );
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

  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // Debounce suggestions to reduce filtering work while typing
  useEffect(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      const q = trimmed.toLowerCase();
      const filtered = informations.filter((info) =>
        (info.name || "").toLowerCase().includes(q)
      );
      setSuggestions(filtered);
    }, 300); // Increased debounce time for better performance
    return () => clearTimeout(timeoutId);
  }, [name, informations]);

  const handleSelectSuggestion = useCallback((suggestion) => {
    setSelectedSuggestion(suggestion);
    setName(suggestion.name);
    setBirthDate(suggestion.birthDate);
    setPassportSeries(suggestion.passportSeries);
  }, []);
  return (
    <ContainerScheme>
      {loading ? (
        <div style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 18, marginBottom: 16 }}>Loading dashboard...</div>
          <div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <>
          <div className="Buttons">
            <div className="miniContainer">
              <Button
                style={{
                  backgroundColor: "#1B4235",
                  color: "white",
                  fontSize: "100px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "100%",
                }}
                className="showModal"
                onClick={showModal}
              >
                <ControlPointRoundedIcon />
              </Button>

              <ElevatorButton onClick={FirstFloor}>1</ElevatorButton>

              <ElevatorButton onClick={SecondFloor}>2</ElevatorButton>
              <ToggleButton style={{ backgroundColor: "#D1D8D6" }}>
                <Switch
                  checked={checked}
                  onChange={handleSwitch}
                  inputProps={{ "aria-label": "controlled" }}
                  ToggleButton
                  style={{ color: "#1B4235" }}
                />
              </ToggleButton>
            </div>
            <div className="miniContainer">
              <Link className="link" to="/">
                Home
              </Link>
              <Link className="link" to="/getInformation">
                History
              </Link>

              <button className="exportToExcel" onClick={handleExportToExcel}>
                <BookIcon />
              </button>

              <Modal
                title="Add Guest"
                open={isModalOpen}
                onOk={editInformations ? null : handleOk}
                onCancel={handleCancel}
              >
                
                  <Create>
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    
                  {name !== "" && suggestions.length > 0 && (
                    <ul className="suggestions">
                      {suggestions.map((suggestion) => (
                        <li
                          className="suggestion"
                          key={suggestion.uuid}
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <p>{suggestion.name} </p>
                         <p> {suggestion.passportSeries}</p>
                        </li>
                      ))}
                    </ul>
                  )}

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
                      onChange={(e) =>
                        setPassportSeries(e.target.value.toUpperCase())
                      }
                    />
                    <input
                      type="number"
                      placeholder="Room Number"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                    />
                    
                    <input
                      type="number"
                      placeholder="Daily Price"
                      value={dailyPrice}
                      onChange={(e) => setDailyPrice(e.target.value)}
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
                        <button style={{width:"200px", color:"white"}} onClick={handleSubmitChange}>Submit Change</button>{" "}
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
                        style={{width:"200px", color:"white"}}
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

                    {renderRoomGuests("101", { showArrival: true, showLeave: true })}
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

                    {renderRoomGuests("102", { showArrival: true, showLeave: true })}
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

                    {renderRoomGuests("103", { showArrival: true, showLeave: true })}
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

                    {renderRoomGuests("104", { showArrival: true, showLeave: true })}
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

                      {renderRoomGuests("107", { showArrival: true, showLeave: true })}
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

                      {renderRoomGuests("105", { showArrival: true, showLeave: true })}
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

                      {renderRoomGuests("106", { showArrival: true, showLeave: true })}
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

                      {renderRoomGuests("108", { showArrival: true, showLeave: true })}
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

                    {renderRoomGuests("109", { showArrival: true, showLeave: true })}
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

                    {renderRoomGuests("110", { showArrival: true, showLeave: true })}
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

                    {renderRoomGuests("111", { showArrival: true, showLeave: true })}
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

                    {renderRoomGuests("112", { showArrival: true, showLeave: true })}
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

                    {renderRoomGuests("113", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("212", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("213", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("214", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("215", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("216", { showArrival: true, showLeave: true })}
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
                        {renderRoomGuests("210", { showArrival: false, showLeave: false })}
                      </div>
                      <div className="r209 room">
                        <h4
                          onClick={() => {
                            setCurrentRoom("209");
                            handleOpenModal();
                          }}
                        >
                          <b>209</b>|<BedroomParentIcon className="i" />
                        </h4>
                        {renderRoomGuests("209", { showArrival: false, showLeave: false })}
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
                        {renderRoomGuests("207", { showArrival: false, showLeave: false })}
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
                          {renderRoomGuests("211", { showArrival: false, showLeave: false })}
                        </div>
                        <div className="r208 room">
                          <h4
                            onClick={() => {
                              setCurrentRoom("208");
                              handleOpenModal();
                            }}
                          >
                            <b>208</b>|
                            <div>
                              <BedroomChildIcon className="i" />
                              <BedroomChildIcon className="i" />
                              <BedroomChildIcon className="i" />
                            </div>
                          </h4>
                          {renderRoomGuests("208", { showArrival: false, showLeave: false })}
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
                          {renderRoomGuests("206", { showArrival: false, showLeave: false })}
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
                            <b>219</b>|<BedroomChildIcon className="i" /><BedroomChildIcon className="i" />
                          </h4>
                          {renderRoomGuests("219", { showArrival: false, showLeave: false })}
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
                          {renderRoomGuests("221", { showArrival: false, showLeave: false })}
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
                          {renderRoomGuests("224", { showArrival: false, showLeave: false })}
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
                      {renderRoomGuests("205", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("204", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("203", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("202", { showArrival: true, showLeave: true })}
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
                      {renderRoomGuests("201", { showArrival: true, showLeave: true })}
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
                    {renderRoomGuests("217", { showArrival: false, showLeave: false })}
                  </div>
                  <div className="r218 room">
                    <h4
                      onClick={() => {
                        setCurrentRoom("218");
                        handleOpenModal();
                      }}
                    >
                      <b>218</b>|<BedroomParentIcon className="i" />L
                    </h4>
                    {renderRoomGuests("218", { showArrival: false, showLeave: false })}
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
                    {renderRoomGuests("220", { showArrival: false, showLeave: false })}
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
                    {renderRoomGuests("222", { showArrival: false, showLeave: false })}
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
                    {renderRoomGuests("223", { showArrival: false, showLeave: false })}
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
                  <p>Registration Time: {formatDateTimeDMY(value.registrationTime)}</p>
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

          <Modal
            title="Leave Hotel"
            open={isLeaveModalOpen}
            onOk={() => {
              if (!leaveModalGuest) return;
              const parsedDays = Number(leaveDays);
              if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
                message.error("Please enter valid days stayed");
                return;
              }
              const total = parsedDays * (Number(leaveModalGuest.dailyPrice) || 0);
              const updatedLeaveHotelStatus = true;
              setLeaveHotelRows((prev) => ({ ...prev, [leaveModalGuest.uuid]: updatedLeaveHotelStatus }));
              const leaveHotelTime = new Date().toLocaleString();
              update(ref(db, `/${leaveModalGuest.uuid}`), {
                ...leaveModalGuest,
                leaveHotel: updatedLeaveHotelStatus,
                leaveHotelTime,
                days: parsedDays,
              });
              setIsLeaveModalOpen(false);
              setLeaveModalGuest(null);
              setLeaveDays("");
              message.success(`Total: ${total}`);
            }}
            onCancel={() => {
              setIsLeaveModalOpen(false);
              setLeaveModalGuest(null);
              setLeaveDays("");
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Registration Time:</span>
                <b>{formatDateTimeDMY(leaveModalGuest?.registrationTime)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Daily Price:</span>
                <b>{Number(leaveModalGuest?.dailyPrice) || 0}</b>
              </div>
              <div>
                <label>Days Stayed</label>
                <input
                  type="number"
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total</span>
                <b>{(Number(leaveDays) || 0) * (Number(leaveModalGuest?.dailyPrice) || 0)}</b>
              </div>
            </div>
          </Modal>
          <ContainerTable
            style={switch1 ? { display: "none" } : { display: "flex" }}
          >
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
        </>
      )}
    </ContainerScheme>
  );
}

export default MultiControll;