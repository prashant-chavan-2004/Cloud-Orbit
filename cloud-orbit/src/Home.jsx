import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


function Home(){
    const navigate = useNavigate();

    return (
        <div className="home">
            <h1>Welcome to Cloud Orbit</h1>
            <p>Your gateway to the cloud. Explore our services and solutions to elevate your business to new heights.</p>
            <button onClick={()=>navigate("/chart")}>Click me see chart</button>
        </div>
    );
}

export default Home;