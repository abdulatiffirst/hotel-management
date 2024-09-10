import React from "react";
import { Container } from "./styled";
import { Link } from "react-router-dom";
// import { handleExportToExcel } from "../multicontrol/app";

function HomePage() {

    // const a = handleExportToExcel
 
    
    return (
        <Container>
         
            <div className="navbar"><h1>Welcome to Mohir Hostel!</h1> <div className="links"><Link to="/multiControll">Dashboard</Link><Link to="/getInformation">History</Link></div></div>
            <div className="imageBox"></div>
        </Container>

    )
  
  
}

export default HomePage;
