import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import '../styles/ProductDetail.css'; // Import file CSS mới

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1
    };
  }

  render() {
    const { product, txtQuantity } = this.state;

    if (product != null) {
      return (
        <div className="product-detail-container">
          <div className="product-detail-card">
            {/* LEFT: IMAGE */}
            <div className="product-image-section">
              <img
                src={"data:image/jpg;base64," + product.image}
                alt={product.name}
                className="main-product-img"
              />
            </div>

            {/* RIGHT: INFO */}
            <div className="product-info-section">
              <span className="product-category-tag">{product.category.name}</span>
              <h2 className="product-name-display">{product.name}</h2>
              <p className="product-id-text">ID: {product._id}</p>
              
              <div className="product-price-display">
                {product.price.toLocaleString()} <span className="currency">đ</span>
              </div>

              <hr className="divider" />

              <div className="purchase-controls">
                <div className="quantity-wrapper">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    className="quantity-input"
                    value={txtQuantity}
                    onChange={(e) =>
                      this.setState({
                        txtQuantity: parseInt(e.target.value) || 1
                      })
                    }
                  />
                </div>

                <button className="btn-add-to-cart" onClick={(e) => this.btnAdd2CartClick(e)}>
                  <i className="fa fa-shopping-basket"></i> ADD TO BASKET
                </button>
              </div>
              
              <p className="product-note">✨ Freshly baked daily with love and premium ingredients.</p>
            </div>
          </div>
        </div>
      );
    }

    return <div className="loading-spinner">Loading deliciousness...</div>;
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      this.setState({ product: res.data });
    });
  }

  btnAdd2CartClick(e) {
    e.preventDefault();
    const { product, txtQuantity } = this.state;
    const quantity = parseInt(txtQuantity);

    if (!quantity || quantity < 1) {
      alert('Please input quantity');
      return;
    }

    const mycart = [...this.context.mycart];
    const index = mycart.findIndex(item => item.product._id === product._id);

    if (index === -1) {
      mycart.push({ product: product, quantity: quantity });
    } else {
      mycart[index].quantity += quantity;
    }

    this.context.setMycart(mycart);
    alert('Added to your basket! 🥐');
  }
}

export default withRouter(ProductDetail);