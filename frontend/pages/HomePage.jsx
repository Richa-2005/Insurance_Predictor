import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import '../styling/HomePage.css'; 

export default function HomePage (){

  const StepIcon1 = () => <svg xmlns="http://www.w3.org/2000/svg" className="step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
  const StepIcon2 = () => <svg xmlns="http://www.w3.org/2000/svg" className="step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M12 17h.01M12 7a2 2 0 100-4 2 2 0 000 4zm0 10a2 2 0 100-4 2 2 0 000 4z" /></svg>;
  const StepIcon3 = () => <svg xmlns="http://www.w3.org/2000/svg" className="step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

  return (
    <div className="homepage-container">
      
      <section className="hero-section">
        <h1 className="main-app-title">InsuranSure</h1>
        <h1 className="hero-title">Clarity in Costs, Confidence in Coverage.</h1>
        <p className="hero-subtitle">
          InsuranSure uses data to provide instant, transparent estimates for your insurance needs. No more guesswork.
        </p>
        <div className="india-badge">
          <span>Tailored for the Indian Market 🇮🇳</span>
        </div>
        <div className="hero-actions">
            <Link to="/medical">
            <button
              className="directingToPage directingToPage-abled"
            >
              Estimate Medical Costs
            </button>
            </Link >
            <Link to="/car">
            <button className="directingToPage directingToPage-dis">
              Estimate Car Premiums
            </button>
            </Link>
            <Link to="/life">
            <button className="directingToPage directingToPage-dis">
              Estimate Life Premiums
            </button>
            </Link>
        </div>
      </section>

   
      <section className="how-it-works-section">
        <h2 className="section-title">Get Your Estimate in 3 Simple Steps</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon-wrapper"><StepIcon1 /></div>
            <h3 className="step-title">1. Enter Your Details</h3>
            <p className="step-description">Provide a few key anonymous details like your age and health metrics.</p>
          </div>
          <div className="step-card">
            <div className="step-icon-wrapper"><StepIcon2 /></div>
            <h3 className="step-title">2. We Analyze the Data</h3>
            <p className="step-description">Our model compares your information against thousands of data points.</p>
          </div>
          <div className="step-card">
            <div className="step-icon-wrapper"><StepIcon3 /></div>
            <h3 className="step-title">3. Receive Your Estimate</h3>
            <p className="step-description">Get a clear, data-backed estimate of your potential premium instantly.</p>
          </div>
        </div>
      </section>


       <section className="factors-section">
        <h2 className="section-title">What Influences Your Insurance Cost?</h2>
        <div className="section-subtitle-wrapper">
            <h3 className="section-subtitle">For Medical Insurance</h3>
        </div>
        <div className="factors-grid">
            <div className="factor-card">
                <h3 className="factor-title">Age</h3>
                <p className="factor-description">Age is one of the most significant factors. Our data shows a strong correlation between age and premium cost, as healthcare needs tend to increase over time.</p>
            </div>
            <div className="factor-card">
                <h3 className="factor-title">Body Mass Index (BMI)</h3>
                <p className="factor-description">While not as direct as age, a higher BMI can be associated with higher-risk health conditions, which may influence the final premium.</p>
            </div>
            <div className="factor-card">
                <h3 className="factor-title">Major Health Events</h3>
                <p className="factor-description">A history of major surgeries or transplants can play a role in premium calculation, reflecting a more complex health profile.</p>
            </div>
        </div>
      </section>

    </div>
  );
};
