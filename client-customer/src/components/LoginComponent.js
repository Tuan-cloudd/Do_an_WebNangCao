import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Login extends Component {
  static contextType = MyContext; // access global state

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: 'sonkk',
      txtPassword: '123'
    };
  }

  render() {
    const { txtUsername, txtPassword } = this.state;

    return (
      <div className="align-center">
        <h2 className="text-center">CUSTOMER LOGIN</h2>

        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Username</td>
                <td>
                  <input
                    type="text"
                    value={txtUsername}
                    onChange={(e) =>
                      this.setState({ txtUsername: e.target.value })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td>Password</td>
                <td>
                  <input
                    type="password"
                    value={txtPassword}
                    onChange={(e) =>
                      this.setState({ txtPassword: e.target.value })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="LOGIN"
                    onClick={(e) => this.btnLoginClick(e)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  // ================= EVENT HANDLERS =================

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

  // ================= API =================

  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;

      if (result.success === true) {
        // save to global state
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);

        // navigate to home
        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }
}

export default withRouter(Login);