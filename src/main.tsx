import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./App";
// import AmazonLoginBridge from "./AmazonLoginBridge";

// function Router() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/amazon-login-bridge" element={<AmazonLoginBridge />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default Router;
