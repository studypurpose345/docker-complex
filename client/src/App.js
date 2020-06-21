import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import OtherPage from './OtherPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <h1>Fib Calculator</h1>
          <Link to='/'>Home</Link>
          <Link to='/otherpage'>Other Page</Link>
        </header>
        <Route exact path='/' component={Fib} />
        <Route exact path='/otherpage' component={OtherPage} />
      </div>
    </Router>
  );
}

export default App;
