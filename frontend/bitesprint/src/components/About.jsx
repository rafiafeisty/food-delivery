import React from 'react'
import './About.css'

const About = () => {
    return (
        <>
            <div className="about-page">
                <h2 className='about-head'>About Us</h2>
                <div className="about-content">
                    <h2>Features</h2>
                    <p>You can order food of your choice, and we will deliver it to your doorstep. Just search your favorite food, and place your order. We will take care of the rest.</p>
                </div>
                <div className="bullets">
                    <ul>
                        <li>Search the food</li>
                        <li>Go to the cart to view your Bill.</li>
                        <li>Do the payment process.</li>
                        <li>The order will be placed at yoour door step soon.</li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default About
