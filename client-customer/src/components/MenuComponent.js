import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import '../styles/Menu.css'; 

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: ''
    };
  }

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <li key={item._id} className="nav-item">
          <Link to={'/product/category/' + item._id} className="nav-link">
            {item.name}
          </Link>
        </li>
      );
    });

    return (
      <div className="main-menu-container">
        <div className="menu-wrapper">
          {/* LOGO HOẶC HOME */}
          <div className="menu-logo">
            <Link to="/home" className="logo-text">Love<span>Choux</span></Link>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="menu-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/home" className="nav-link">Home</Link>
              </li>
              {cates}
            </ul>
          </nav>

          {/* SEARCH BOX */}
          <div className="menu-search">
            <form className="search-form" onSubmit={(e) => this.btnSearchClick(e)}>
              <input
                type="search"
                placeholder="Search pastries..."
                className="search-input"
                value={this.state.txtKeyword}
                onChange={(e) => {
                  this.setState({ txtKeyword: e.target.value });
                }}
              />
              <button type="submit" className="search-button">
                <i className="fa fa-search"></i> {/* Bạn có thể dùng icon hoặc chữ SEARCH */}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  apiGetCategories() {
    axios.get('/api/customer/categories').then((res) => {
      this.setState({ categories: res.data });
    });
  }

  btnSearchClick(e) {
    e.preventDefault();
    if (this.state.txtKeyword.trim()) {
      this.props.navigate('/product/search/' + this.state.txtKeyword);
    }
  }
}

export default withRouter(Menu);