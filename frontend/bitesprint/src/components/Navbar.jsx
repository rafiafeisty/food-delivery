import React from 'react'
import './Navbar.css'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = ({ setlogged }) => {
    const [showlogin, setShowlogin] = useState(false);
    const [showsignup, setShowsignup] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false); // New state for checkbox
    const navigate = useNavigate()

    const handleCloselogin = () => setShowlogin(false);
    const handleShowlogin = () => setShowlogin(true);
    const handleClosesignup = () => {
        setShowsignup(false);
        setAgreeTerms(false); // Reset checkbox when modal closes
    };
    const handleShowsignup = () => setShowsignup(true);

    const cart = () => {
        navigate('/cart')
    }

    const registering = async () => {
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value

        if (!username || !password) {
            toast.error("Please fill in all fields", { autoClose: 3000 });
            return;
        }

        if (!agreeTerms) {
            toast.error("Please agree to the terms and conditions", { autoClose: 3000 });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json()
            if (response.ok) {
                toast.success("Registration successful!", { autoClose: 3000 });
                handleClosesignup();
            } else {
                toast.error(data.message || "Registration failed", { autoClose: 3000 });
            }
        } catch (error) {
            toast.error("An error occurred during registration", { autoClose: 3000 });
            console.error("Registration error:", error);
        }
    }

    const logging = async () => {
        const username = document.getElementById("usernamelog").value
        const password = document.getElementById("passwordlog").value

        if (!username || !password) {
            toast.error("Please fill in all fields", { autoClose: 3000 });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json()
            if (response.ok) {
                toast.success("Logged in successfully!", {
                    autoClose: 2000,
                    onClose: () => {
                        setlogged(true)
                        localStorage.setItem("logid", data.userid)
                        localStorage.setItem("logged", true)
                        handleCloselogin();
                    }
                });
            } else {
                toast.error(data.message || "Failed to login", { autoClose: 3000 });
            }
        } catch (error) {
            toast.error("An error occurred during login", { autoClose: 3000 });
            console.error("Login error:", error);
        }
    }

    return (
        <>
            <div className="navbar">
                <div className="logo"><h2>Bitesprint</h2></div>
                <div className="links">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <button onClick={handleShowlogin} className='login'>Login</button>
                    <button onClick={handleShowsignup} className='login'>Signup</button>
                </div>
                <a href=""><lord-icon
                    src="https://cdn.lordicon.com/uisoczqi.json"
                    trigger="hover"
                    className="lordicon"
                    onClick={cart}>
                </lord-icon></a>
            </div>

            {/* Modals */}
            <div>
                <Modal show={showsignup} onHide={handleClosesignup}>
                    <Modal.Header closeButton>
                        <Modal.Title>Signup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" id="username" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" id="password" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check 
                                    type="checkbox" 
                                    label="I agree with the terms and conditions" 
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosesignup}>
                            Close
                        </Button>
                        <Button 
                            className='modal-button' 
                            onClick={registering}
                            disabled={!agreeTerms} // Disable button when not checked
                        >
                            Signup
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showlogin} onHide={handleCloselogin}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" id="usernamelog" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" id="passwordlog" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloselogin}>
                            Close
                        </Button>
                        <Button className='modal-button' onClick={logging}>
                            Login
                        </Button>
                    </Modal.Footer>
                </Modal>
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

export default Navbar