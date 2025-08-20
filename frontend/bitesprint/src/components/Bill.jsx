import React from 'react'
import './Bill.css'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bill = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logged = localStorage.getItem("logged");
        if (!logged) {
            toast.error("Please login to access this page", {
                autoClose: 3000,
                onClose: () => navigate("/")
            });
        }
    }, [navigate]);

    const saving = async () => {
        const first = document.getElementById("first").value;
        const last = document.getElementById("last").value;
        
        if (!first || !last) {
            toast.error("Please enter both first and last name", { autoClose: 3000 });
            return;
        }

        const customername = first + " " + last;
        const totalbillstr = localStorage.getItem("total");
        const totalbill = Number(totalbillstr);
        const orderstatus = "Order in process";
        const customerid = localStorage.getItem("logid");
        
        if (!totalbill || isNaN(totalbill)) {
            toast.error("Invalid total amount", { autoClose: 3000 });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/auth/ordersaving", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customername, customerid, totalbill, orderstatus }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("total");
                localStorage.removeItem("allFoodItems");
                localStorage.removeItem("cartCounts");
                
                toast.success("Order placed successfully!", {
                    autoClose: 3000,
                    onClose: () => navigate("/orderstatus")
                });
            } else {
                toast.error(data.error || "Failed to place order", { autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Something went wrong. Please try again", { autoClose: 3000 });
        }
    };

    return (
        <>
            <div className="bill-page">
                <center>
                    <h2 className="bill-head">Bill Payment</h2>
                </center>
                <div className="payment">
                    <div className="form-group1">
                        <input type="text" id="first" placeholder='Enter First Name' required />
                        <input type="text" id="last" placeholder='Enter Last Name' required />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder='Enter the address' required />
                    </div>
                    <div className="form-group">
                        <input type="number" placeholder='Enter card number' required />
                    </div>
                    <div className="button">
                        <center>
                            <button className='order-button' onClick={saving}>Pay Bill</button>
                        </center>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-center"
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

export default Bill;