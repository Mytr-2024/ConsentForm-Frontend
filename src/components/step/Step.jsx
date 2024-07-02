// src/components/Step.js
import React from 'react';
import './Step.css';

const Step = ({ key,icon, label, isActive }) => {
    return (
        <div  className={`step  d-flex justify-content-center ${isActive ? 'active' : ''}`}>
            <div className="step-content d-flex flex-column justify-content-center align-items-center">
                <img className='size'  src={icon} alt={`${label} icon`} />
                <span className='px-2' >{label}</span>
            </div>
        </div>
    );
};

export default Step;
