import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext; // dùng this.context để lấy global state

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <tr
        key={item._id}
        className="datatable"
        onClick={() => this.trItemClick(item)}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
      </tr>
    ));

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">CATEGORY LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>

        <div className="inline" />
        <CategoryDetail
          item={this.state.itemSelected}
          updateCategories={this.updateCategories}
          token={this.context.token}
        />
        <div className="float-clear" />
      </div>
    );
  }

  // ================= EVENT =================
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  // ================= API =================
  apiGetCategories() {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((error) => {
        console.error('Error loading categories:', error);
      });
  }
   //  Hàm cho component con gọi ngược lên
  updateCategories = (categories) => {
    this.setState({ categories: categories });
  };

}


export default Category;
