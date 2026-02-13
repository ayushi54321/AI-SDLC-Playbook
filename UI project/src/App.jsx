import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import TableDetails from './TableDetails'
import CopilotPrompts from './CopilotPrompts'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table-details" element={<TableDetails />} />
        <Route path="/prompt-library" element={<CopilotPrompts />} />
      </Routes>
    </Router>
  )
}

export default App
