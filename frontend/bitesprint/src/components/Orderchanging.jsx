import React, { useState, useEffect } from 'react';
import './Orderchanging.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orderchanging = () => {
  const navigate = useNavigate();
  const [order, setorder] = useState([]);

  const orderfetching = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auth/orderall`);
      const data = await response.json();
      setorder(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    }
  };

  // delete function
  const deleting = async (customerid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/auth/orderdel?customerid=${customerid}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        toast.success('Order record deleted successfully');
        setorder(order.filter((item) => item.customerid !== customerid));
      } else {
        toast.error('Error deleting order');
      }
    } catch (error) {
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
    }
  };

  // update status function
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/auth/statusupdate/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderstatus: newStatus }),
        }
      );

      if (response.ok) {
        toast.success('Order status updated successfully');
        setorder((prevOrders) =>
          prevOrders.map((item) =>
            item._id === id ? { ...item, orderstatus: newStatus } : item
          )
        );
      } else {
        toast.error('Error updating status');
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    const logged = localStorage.getItem('adminlog');
    if (!logged) {
      toast.info('Please login to access this page');
      navigate('/adminlog');
    } else {
      orderfetching();
    }
  }, []);

  return (
    <>
      <div className="changing-page">
        <center>
          <h2 className="order-head">Current Orders</h2>
        </center>
        <div className="cart-table">
          {order.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Bill</th>
                  <th>Order Status</th>
                  <th>Change Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => (
                  <tr key={item._id}>
                    <td>{item.customername}</td>
                    <td>₹{item.totalbill}</td>
                    <td className="order-style">{item.orderstatus}</td>
                    <td>
                      <select
                        value={item.orderstatus}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                      >
                        <option value="Order in process">Order in process</option>
                        <option value="Order on your way">Order on your way</option>
                        <option value="Order arrived at your door">Order arrived at your door</option>
                        <option value="Order completed">Order completed</option>
                      </select>
                    </td>
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
            <div>No order Placed</div>
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
  );
};

export default Orderchanging;