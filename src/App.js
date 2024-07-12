// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Write from "./components/write";
// import Read from "./components/read";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MultiControll from "./multi control/app";
import { Box } from "./styledApp";
import MainPage from "./main page/main";
import GetInformation from "./read informations/readInformation";
function App() {
  return (
   
      <Box>
        <Router>
          <Routes>
            <Route path="/" index element={<MultiControll/>} />
            <Route path="/getInformation"  element={<GetInformation/>} />
          </Routes>
        </Router>
        {/* <Write/> */}
        {/* <MultiControll /> */}
        {/* <MainPage/> */}
      </Box>
 
  );
}

export default App;
