
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NotePage from './Components/NotePage/NotePage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotePage/>} />
      </Routes>
    </BrowserRouter>
  );

}
export default App
