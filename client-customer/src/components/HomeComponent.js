import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
    };
  }

  render() {
    // 1. Map sản phẩm Hot
    const hotprodsJSX = this.state.hotprods.map((item) => (
      <div key={item._id} className="product-card">
        <Link to={`/product/${item._id}`} className="product-link">
          <div className="product-image-wrapper">
            <img 
              src={item.image ? "data:image/jpg;base64," + item.image : "https://via.placeholder.com/300"} 
              alt={item.name} 
              className="product-img"
            />
          </div>
          <div className="product-info">
            <h3 className="product-name">{item.name}</h3>
            <p className="product-description">Best seller of the week.</p>
            <span className="product-price">{item.price.toLocaleString()} đ</span>
          </div>
        </Link>
      </div>
    ));

    // 2. Map sản phẩm Mới
    const newprodsJSX = this.state.newprods.map((item) => (
      <div key={item._id} className="product-card">
        <Link to={`/product/${item._id}`} className="product-link">
          <div className="product-image-wrapper">
            <img 
              src={item.image ? "data:image/jpg;base64," + item.image : "https://via.placeholder.com/300"} 
              alt={item.name} 
              className="product-img"
            />
          </div>
          <div className="product-info">
            <h3 className="product-name">{item.name}</h3>
            <span className="product-price">{item.price.toLocaleString()} đ</span>
          </div>
        </Link>
      </div>
    ));

    return (
      <div className="home-container">
       
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Love<br/><span>Choux</span></h1>
            <p className="hero-text">
              Thưởng thức hương vị bánh Pháp tinh tế, giòn tan bên ngoài và mềm mịn bên trong. 
            </p>
            <Link to="/home">
                <button className="btn-checkout">Shop Now</button>
            </Link>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000" 
              alt="Beautiful Pastry" 
            />
          </div>
        </section>

         {/* PHẦN GIỚI THIỆU THÊM MỚI */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-text">
              <h2 className="section-title">Câu Chuyện Của Love Choux</h2>
              <p>
                Khởi nguồn từ niềm đam mê với nghệ thuật làm bánh Pháp, <strong>Love Choux</strong> không chỉ bán bánh, 
                chúng tôi trao gửi những niềm vui ngọt ngào. Mỗi chiếc bánh đều được làm thủ công trong ngày 
                với nguyên liệu nhập khẩu cao cấp.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <span className="feature-icon">🌿</span>
                  <h4>Nguyên liệu sạch</h4>
                  <p>100% tự nhiên, không chất bảo quản.</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👨‍🍳</span>
                  <h4>Làm mới mỗi ngày</h4>
                  <p>Bánh luôn ra lò tươi mới mỗi sáng.</p>
                </div>
              </div>
            </div>
            <div className="about-img-grid">
               <img src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=500" alt="Baking process" />
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="signatures-section">
          <h2 className="section-title">New Arrivals</h2>
          <div className="product-grid">
            {newprodsJSX}
          </div>
        </section>

        {/* BEST SELLERS (Hot) */}
        <section className="signatures-section">
          <h2 className="section-title">Signature Treats</h2>
          <div className="product-grid">
            {hotprodsJSX}
          </div>
        </section>
      </div> 
      /* Đã chuyển thẻ đóng xuống cuối cùng để bao bọc tất cả section */
    );

    //  footer 
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