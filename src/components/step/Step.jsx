// src/components/Step.js
import React from 'react';
import './Step.css';

const Step = ({ icon, label, isActive }) => {
    return (
        <div className={`step d-flex ${isActive ? 'active' : ''}`}>
            <div className="step-content">
                <img style={{height:"100px", width:"100px"}} src={icon} alt={`${label} icon`} />
                <span className='px-2' >{label}</span>
            </div>
        </div>
    );
};

export default Step;
