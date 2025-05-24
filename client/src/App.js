import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center">Student Marketplace</h1>
        <Routes>
          <Route path="/" element={<p>Welcome to the Marketplace!</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;