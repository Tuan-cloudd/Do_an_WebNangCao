import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import './Product.css'; // Import file CSS mới

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  render() {
    const prods = this.state.products.map((item) => {
      return (
        <div key={item._id} className="product-card">
          <Link to={`/product/${item._id}`} className="product-link">
            <div className="product-image-wrapper">
              <img
                src={"data:image/jpg;base64," + item.image}
                alt={item.name}
                className="product-img"
              />
              <div className="view-detail-overlay">View Detail</div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-price">
                {item.price.toLocaleString()} <span className="currency">đ</span>
              </p>
            </div>
          </Link>
        </div>
      );
    });

    return (
      <div className="product-list-container">
        <h2 className="category-title">
          {this.props.params.keyword ? `Results for: "${this.props.params.keyword}"` : "Our Delicacies"}
        </h2>
        <div className="product-grid">
          {prods.length > 0 ? prods : <p className="no-product">No sweet treats found...</p>}
        </div>
      </div>
    );
  }

  // --- Logic API giữ nguyên ---
  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      this.setState({ products: res.data });
    });
  }

  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      this.setState({ products: res.data });
    });
  }
}

export default withRouter(Product);