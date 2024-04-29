import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Metrics from './pages/Metrics'
import Logs from './pages/Logs'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Navigate to='/metrics' />} />
        <Route path='/metrics' element={<Metrics />} />
        <Route path='/logs' element={<Logs />} />
      </Routes>
    </Router>
  )
}

export default App