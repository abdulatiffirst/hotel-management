import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Create, Table } from "./styled";
import { ref, onValue, set, serverTimestamp } from "firebase/database";
import { db } from "../firebaseConfig";

function HomePage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [passportSeries, setPassportSeries] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [informations, setInformations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setInformations(Object.values(data));
      }
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const writeToDatabase = () => {
    if (!name || !roomNumber || !dailyPrice || !birthDate || !passportSeries || !paymentMethod) {
      alert("Please fill in all fields");
      return;
    }

    const newGuest = {
      name: name.toUpperCase(),
      phoneNumber,
      roomNumber,
      dailyPrice,
      birthDate,
      passportSeries: passportSeries.toUpperCase(),
      paymentMethod,
      registrationTime: serverTimestamp(),
      uuid: Date.now().toString(),
    };

    set(ref(db, `/${newGuest.uuid}`), newGuest);

    // Reset form
    setName("");
    setPhoneNumber("");
    setRoomNumber("");
    setDailyPrice("");
    setBirthDate("");
    setPassportSeries("");
    setPaymentMethod("");
  };

  if (loading) {
    return (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 18, marginBottom: 16 }}>Loading home page...</div>
        <div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Container>
      <div className="navbar">
        <h1>Welcome to Mohir Hostel!</h1>{" "}
        <div className="links">
          <Link to="/multiControll">Dashboard</Link>
          <Link to="/getInformation">History</Link>
          <Link to="/reports">Reports</Link>
        </div>
      </div>
      <div className="imageBox"></div>
      
      <div className="formSection">
        <h2>Add New Guest</h2>
        <Create>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
          <button onClick={writeToDatabase}>Add Guest</button>
        </Create>
      </div>

      <div className="tableSection">
        <h2>Current Guests</h2>
        <Table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Room Number</th>
              
              <th>Daily Price</th>
              <th>Whole Price</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {informations
              .filter(info => !info.leaveHotel)
              .map((value, index) => (
                <tr key={value.uuid}>
                  <td>{index + 1}</td>
                  <td>{value.name}</td>
                  <td>{value.roomNumber}</td>
                  
                  <td>{value.dailyPrice}</td>
                  <td>{(Number(value.days) || 0) * (Number(value.dailyPrice) || 0)}</td>
                  <td>{value.paymentMethod}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default HomePage;
