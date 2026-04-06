// import axios from 'axios';
// import React, { Component } from 'react';
// // update
// import './App.css';
// import React, { Component } from 'react';
// import MyProvider from './contexts/MyProvider';
// import Login from './components/LoginComponent';
// import Main from './components/MainComponent';

// class App extends Component {
//   render() {
//     return (
//       <MyProvider>
//         <Login />
//         <Main />
//       </MyProvider>
//     );
//   }
// }
// // end update
// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       message: 'Loading...'
//     };
//   }

//   componentDidMount() {
//     axios.get('/hello').then((res) => {
//       const result = res.data;
//       this.setState({ message: result.message });
//     });
//   }

//   render() {
//     return (
//       <div>
//         <h2>Admin page</h2>
//         <p>{this.state.message}</p>
//       </div>
//     );
//   }
// }

// export default App;


import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MyProvider>
          <Login />
          <Main />
        </MyProvider>
      </BrowserRouter>
    );
  }
}

export default App;

