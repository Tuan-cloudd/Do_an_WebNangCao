const CartUtil = {
  getTotal(mycart) {
    if (!Array.isArray(mycart)) return 0;

    return mycart.reduce((total, item) => {
      const price = item?.product?.price || 0;
      const quantity = item?.quantity || 0;
      return total + price * quantity;
    }, 0);
  }
};

export default CartUtil;