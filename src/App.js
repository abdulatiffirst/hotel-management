// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Write from "./components/write";
// import Read from "./components/read";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Box } from "./styledApp";
const MultiControll = lazy(() => import('./multi control/app'));
const GetInformation = lazy(() => import('./read informations/readInformation'));
const HomePage = lazy(() => import('./Home Page/home'));
const ReportsPage = lazy(() => import('./Reports/reports'));
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 24, marginBottom: 20, color: '#1B4235' }}>Loading Hotel Management System...</div>
          <div style={{ 
            width: 60, 
            height: 60, 
            border: '6px solid #f3f3f3', 
            borderTop: '6px solid #1B4235', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </Box>
    );
  }

  return (
    <Box>
      <Router>
        <Suspense fallback={
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 20, marginBottom: 16, color: '#1B4235' }}>Loading page...</div>
            <div style={{ 
              width: 40, 
              height: 40, 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #1B4235', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        }>
          <Routes>
            <Route path="/" index element={<HomePage/>} />
            <Route path="/multiControll" index element={<MultiControll/>} />
            <Route path="/getInformation"  element={<GetInformation/>} />
            <Route path="/reports"  element={<ReportsPage/>} />
          </Routes>
        </Suspense>
      </Router>
    </Box>
  );
}

export default App;
