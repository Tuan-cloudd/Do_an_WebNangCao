import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Đảm bảo bạn tạo file CSS này

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
    };
  }

  render() {
    const hotprods = this.state.hotprods.map((item) => {
      return (
        <div key={item._id} className="product-card">
          <Link to={`/product/${item._id}`} className="product-link">
            <div className="product-image-wrapper">
              <img
                src={"data:image/jpg;base64," + item.image}
                alt={item.name}
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-description">Lorem ipsum dolor sit amet, consectetuer adipiscing.</p>
              {/* <span className="product-price">${item.price}</span> */}
            </div>
          </Link>
        </div>
      );
    });

    return (
      <div className="home-container">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Take a <br/><span>Croissant</span></h1>
            <p className="hero-text">
              Lorem ipsum Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam 
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam.
            </p>
            <button className="btn-checkout">Checkout Now</button>
          </div>
          <div className="hero-image">
            <img src="/path-to-your-croissant-hero-image.png" alt="Croissants" />
          </div>
        </section>

        {/* SIGNATURES SECTION */}
        <section className="signatures-section">
          <h2 className="section-title">Our Signatures</h2>
          <div className="product-grid">
            {hotprods}
          </div>
        </section>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
      this.setState({ newprods: res.data });
    });
  }

  apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
      this.setState({ hotprods: res.data });
    });
  }
}

export default Home;