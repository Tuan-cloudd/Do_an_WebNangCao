import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

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
        <div className="align-center">
          <h2 className="text-center">PRODUCT DETAILS</h2>

          <figure className="caption-right">
            <img
              src={"data:image/jpg;base64," + product.image}
              width="400px"
              height="400px"
              alt=""
            />

            <figcaption>
              <form>
                <table>
                  <tbody>

                    {/* PRODUCT INFO */}
                    <tr>
                      <td align="right">ID:</td>
                      <td>{product._id}</td>
                    </tr>

                    <tr>
                      <td align="right">Name:</td>
                      <td>{product.name}</td>
                    </tr>

                    <tr>
                      <td align="right">Price:</td>
                      <td>{product.price}</td>
                    </tr>

                    <tr>
                      <td align="right">Category:</td>
                      <td>{product.category.name}</td>
                    </tr>

                    {/* QUANTITY */}
                    <tr>
                      <td align="right">Quantity:</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={txtQuantity}
                          onChange={(e) =>
                            this.setState({
                              txtQuantity: parseInt(e.target.value) || 1
                            })
                          }
                        />
                      </td>
                    </tr>

                    {/* BUTTON */}
                    <tr>
                      <td></td>
                      <td>
                        <button onClick={(e) => this.btnAdd2CartClick(e)}>
                          ADD TO CART
                        </button>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </form>
            </figcaption>
          </figure>
        </div>
      );
    }

    return <div />;
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  // API
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      this.setState({ product: res.data });
    });
  }

  // EVENT HANDLER
  btnAdd2CartClick(e) {
    e.preventDefault();

    const { product, txtQuantity } = this.state;
    const quantity = parseInt(txtQuantity);

    // validate
    if (!quantity || quantity < 1) {
      alert('Please input quantity');
      return;
    }

    // clone cart (tránh mutate trực tiếp)
    const mycart = [...this.context.mycart];

    const index = mycart.findIndex(
      item => item.product._id === product._id
    );

    if (index === -1) {
      const newItem = {
        product: product,
        quantity: quantity
      };
      mycart.push(newItem);
    } else {
      mycart[index].quantity += quantity;
    }

    this.context.setMycart(mycart);

    alert('OK BABY!');
  }
}

export default withRouter(ProductDetail);