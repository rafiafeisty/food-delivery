import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import './Adminlogin.css'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Adminlogin = () => {
  useEffect(() => {
    localStorage.clear()
    toast.info("Welcome to Admin Panel")
  }, []) // Added empty dependency array to run only once

  const navigate = useNavigate()
  
  const checking = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      toast.error("Please enter all required details");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/admincheck", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!", {
          onClose: () => {
            localStorage.setItem("adminlog", true)
            navigate('/orderchange')
          }
        });
      } else {
        toast.error(data.error || "Login failed. Please check your credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again");
    }
  }

  return (
    <>
      <div className="admin-page">
        <center>
          <h2 className='admin-head'>Admin Panel</h2>
        </center>
        <center>
          <div className="admin-card">
            <Card className='admin-card-body'>
              <Card.Body>
                <Card.Title>Admin Login</Card.Title>
                <Form onSubmit={checking}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" id="username" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" id="password" />
                  </Form.Group>
                  <Button variant="success" type="submit">
                    Login
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </center>
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

export default Adminlogin