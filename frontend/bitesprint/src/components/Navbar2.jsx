import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css'; // Make sure to import your CSS file

const Navbar2 = ({ setlogged }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!setlogged) {
            toast.info("Please login to continue", { autoClose: 3000 });
            navigate("/");
        }
    }, [setlogged, navigate]);

    const cart = () => {
        navigate('/cart');
    }

    const logout = () => {
        localStorage.clear();
        toast.success("You have successfully logged out", {
            autoClose: 2000,
            onClose: () => {
                setlogged(false);
                navigate("/");
            }
        });
    }

    return (
        <>
            <div className="navbar">
                <div className="logo"><h2>Bitesprint</h2></div>
                <div className="links">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/orderstatus">Order Status</a>
                    <button className='login' onClick={logout}>Logout</button>
                </div>
                <a href=""><lord-icon
                    src="https://cdn.lordicon.com/uisoczqi.json"
                    trigger="hover"
                    className="lordicon"
                    onClick={cart}>
                </lord-icon></a>
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

export default Navbar2;