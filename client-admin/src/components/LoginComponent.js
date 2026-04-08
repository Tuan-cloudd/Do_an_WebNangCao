import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    if (this.context.token === '') {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h2 style={styles.title}>ADMIN LOGIN</h2>

            <form onSubmit={(e) => this.btnLoginClick(e)}>
              <div style={styles.formGroup}>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={this.state.txtUsername}
                  onChange={(e) =>
                    this.setState({ txtUsername: e.target.value })
                  }
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={this.state.txtPassword}
                  onChange={(e) =>
                    this.setState({ txtPassword: e.target.value })
                  }
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.button}>
                LOGIN
              </button>
            </form>
          </div>
        </div>
      );
    }

    return <div />;
  }

  btnLoginClick(e) {
    e.preventDefault();

    const { txtUsername, txtPassword } = this.state;

    if (txtUsername && txtPassword) {
      const account = {
        username: txtUsername,
        password: txtPassword
      };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }

  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;

      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    });
  }
}

// 🎨 STYLE OBJECT
const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '320px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginTop: '5px',
    outline: 'none',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    background: '#667eea',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: '0.3s'
  }
};

export default Login;