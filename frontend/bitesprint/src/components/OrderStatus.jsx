import React from 'react'
import './OrderStatus.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const OrderStatus = () => {
  const navigate = useNavigate();
  const [order, setorder] = useState([]);
  const logid = localStorage.getItem("logid");

  const orderfetching = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auth/order?customerid=${logid}`);
      const data = await response.json();
      setorder(data);
    } catch (error) {
      toast.error("Failed to fetch orders", { autoClose: 3000 });
      console.error("Error fetching orders:", error);
    }
  };

  // delete function
  const deleting = async (customerid) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/orderdel?customerid=${customerid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Order deleted successfully", { autoClose: 3000 });
        setorder(order.filter(item => item.customerid !== customerid));
      } else {
        toast.error("Error deleting order", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Failed to delete order", { autoClose: 3000 });
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    const logged = localStorage.getItem("logged");
    if (!logged) {
      toast.info("Please login to view your orders", { 
        autoClose: 3000,
        onClose: () => navigate("/")
      });
    } else {
      orderfetching();
    }
  }, [navigate]);

  return (
    <>
      <div className='orderstatus-page'>
        <center>
          <h2 className='order-head'>Your Order Status</h2>
        </center>
        <div className="cart-table">
          {order.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Bill</th>
                  <th>Order Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => (
                  <tr key={item._id}>
                    <td>{item.customername}</td>
                    <td>₹{item.totalbill}</td>
                    <td className='order-style'>{item.orderstatus}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => deleting(item.customerid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No orders placed</div>
          )}
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default OrderStatus