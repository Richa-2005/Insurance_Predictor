import React, { useState } from 'react';
import '../styling/MedicalPage.css'; 


export default function MedicalPage() {
  return (
    <div className="medical-page-container">
      <h1 className="main-page-title">Medical Insurance Predictor</h1>
      <p className="page-subtitle">
          --- A quick guide to your potential health insurance costs in India ---
        </p>
      <PredictorSection />
      <NextStepsSection />
      <ExplorePlansSection />
      <DidYouKnowSection />
      <JargonBusterSection />
    </div>
  );
}


// --- 1. Predictor Section Component (UPDATED) ---
const PredictorSection = () => {
  // State for form inputs
  const [age, setAge] = useState('');
  const [height, setHeight] = useState(''); // in cm
  const [weight, setWeight] = useState(''); // in kg
  const [anyTransplants, setAnyTransplants] = useState(0); // 0 for No, 1 for Yes
  const [numberOfMajorSurgeries, setNumberOfMajorSurgeries] = useState('');

  // State for API interaction
  const [prediction, setPrediction] = useState(null); // Will store the predicted_premium
  const [analysis, setAnalysis] = useState(null); // Will store the age_group_analysis object
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    setAnalysis(null);
    setLoading(true);

    try {
      if (!age || !height || !weight || numberOfMajorSurgeries === '') {
        throw new Error("Please fill in all fields.");
      }

      const heightInMeters = Number(height) / 100;
      const bmi = Number(weight) / (heightInMeters * heightInMeters);

      const requestData = {
        age: Number(age),
        bmi: parseFloat(bmi.toFixed(2)),
        anyTransplants: Number(anyTransplants),
        numberOfMajorSurgeries: Number(numberOfMajorSurgeries),
      };

      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('Server responded with an error.');
      const result = await response.json();
      
      setPrediction(result.predicted_premium);
      setAnalysis(result.age_group_analysis);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const scrollToPlans = () => {
    document.getElementById('explore-plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="predictor-section">
      <div className="predictor-form-container">
        <h2 className="predictor-title">Get Your Instant Estimate</h2>
        <p className="predictor-subtitle">Enter your details to get a data-driven premium estimate.</p>
        <form onSubmit={handleSubmit} className="predictor-form">
          {/* ... (Form fields remain unchanged) ... */}
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g., 45" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g., 175" />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g., 70" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="surgeries">Number of Major Surgeries</label>
            <input id="surgeries" type="number" value={numberOfMajorSurgeries} onChange={e => setNumberOfMajorSurgeries(e.target.value)} placeholder="e.g., 0" />
          </div>
          <div className="form-group">
            <label htmlFor="transplants">Any Past Transplants?</label>
            <select id="transplants" value={anyTransplants} onChange={e => setAnyTransplants(e.target.value)}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Calculating...' : 'Estimate Premium'}
          </button>
        </form>
      </div>
      <div className="result-display-container">
        {error && <div className="error-message">{error}</div>}
        
        {/* --- Display logic for placeholder vs. result --- */}
        {!prediction && !analysis && !error && (
            <div className="result-placeholder">
                <p>Your personalized estimate will appear here.</p>
            </div>
        )}

        {prediction !== null && analysis !== null && (
          <div className="result-card">
            <p className="result-label">Estimated Annual Premium</p>
            <p className="result-value">₹{prediction.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            
            {/* --- NEW DYNAMIC RANGE GRAPH --- */}
            <RangeComparisonGraph 
              userPrice={prediction} 
              analysis={analysis} 
            />

            <div className="monthly-breakdown">
                <p>≈ ₹{(prediction / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })} per month</p>
            </div>

            <button className="cta-button" onClick={scrollToPlans}>
              Explore Plans
            </button>
          </div>
        )}
        <p className="disclaimer">This is a data-driven estimate, not an official quote. Prices may vary based on provider and plan details.</p>
      </div>
    </section>
  );
};

// --- New Sub-Component for the DYNAMIC RANGE Graph ---
const RangeComparisonGraph = ({ userPrice, analysis }) => {
  const { min_premium, avg_premium, max_premium, age_range } = analysis;

  if (min_premium === null || (max_premium - min_premium === 0)) {
    return <p className="graph-summary">Not enough data for your age group to build a comparison.</p>;
  }

  const range = max_premium - min_premium;
  let userPercent = ((userPrice - min_premium) / range) * 100;
  let avgPercent = ((avg_premium - min_premium) / range) * 100;

  // Cap percentages
  userPercent = Math.max(0, Math.min(100, userPercent));
  avgPercent = Math.max(0, Math.min(100, avgPercent));

  return (
  <>
    <div className='labels'>
      <div className='graph-label user-label'>
        Your Estimate: ₹{userPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})} 
      </div>
      <div className='graph-label avg-label'>
        Average: ₹{avg_premium.toLocaleString('en-IN', {maximumFractionDigits: 0})}
      </div>
      </div>
    <div className="comparison-graph">
      
      <div className="graph-label-container">
        <div style={{ left: `${userPercent}%` }}> </div>
        <div style={{ left: `${avgPercent}%` }}> </div>
      </div>

      {/* --- Graph Track & Markers --- */}
      <div className="graph-track">
        <div 
          className="user-marker" 
          style={{ left: `${userPercent}%` }}
        ></div>
        <div 
          className="average-marker"
          style={{ left: `${avgPercent}%` }}
        ></div>
      </div>

      {/* --- Min/Max Labels --- */}
      <div className="graph-min-max-labels">
        <span>Min: ₹{min_premium.toLocaleString('en-IN')}</span>
        <span>Max: ₹{max_premium.toLocaleString('en-IN')}</span>
      </div>

      <p className="graph-summary">
        This shows where your estimate falls within the actual premium range for ages {age_range}.
      </p>
    </div>
    </>
  );
};
// --- 2. "What's Next?" Guide Component (Unchanged) ---
const NextStepsSection = () => (
  <section className="next-steps-section">
    <h2 className="section-title">Your Journey to Coverage</h2>
    <div className="steps-timeline">
      <div className="step">
        <div className="step-number">1</div>
        <div className="step-content">
          <h3>Explore Policies</h3>
          <p>Use your estimate as a baseline to explore different health insurance plans.</p>
        </div>
      </div>
      <div className="step">
        <div className="step-number">2</div>
        <div className="step-content">
          <h3>Prepare Documents</h3>
          <p>Typically, you'll need ID (Aadhaar, PAN) and proof of age. Having these ready speeds up the process.</p>
        </div>
      </div>
      <div className="step">
        <div className="step-number">3</div>
        <div className="step-content">
          <h3>Contact Insurers</h3>
          <p id="explore-plans">Reach out to official providers or advisors to get a formal quote and finalize your policy.</p>
        </div>
      </div>
    </div>
  </section>
);


// --- 3. Explore Plans Component (UPDATED) ---
const ExplorePlansSection = () => {
    const plans = [
        { name: 'Star Health', logo: 'https://placehold.co/120x40/E2E8F0/475569?text=Star+Health', link: 'https://www.starhealth.in/', type: 'Family & Individual Plans', description: 'A leading standalone health insurer, popular for a wide range of specialized health plans.' },
        { name: 'HDFC Ergo', logo: 'https://placehold.co/120x40/E2E8F0/475569?text=HDFC+Ergo', link: 'https://www.hdfcergo.com/', type: 'Comprehensive Coverage', description: 'Offers a variety of trusted plans with a focus on comprehensive coverage and digital services.' },
        { name: 'ICICI Lombard', logo: 'https://placehold.co/120x40/E2E8F0/475569?text=ICICI+Lombard', link: 'https://www.icicilombard.com/', type: 'Critical Illness Cover', description: 'A well-known general insurer providing diverse health policies, including critical illness cover.' },
        { name: 'Niva Bupa', logo: 'https://placehold.co/120x40/E2E8F0/475569?text=Niva+Bupa', link: 'https://www.nivabupa.com/', type: 'Senior Citizen Plans', description: 'Known for customer-centric plans, especially for senior citizens and family-first coverage.' },
        { name: 'Care Health', logo: 'https://placehold.co/120x40/E2E8F0/475569?text=Care+Health', link: 'https://www.careinsurance.com/', type: 'Top-up & Super Top-up', description: 'Specializes in health insurance, offering flexible plans including popular top-up options.' },
        { name: 'Aditya Birla', logo: 'https://placehold.co/120x40/E2E8F0/475569?text=Aditya+Birla', link: 'https://www.adityabirlacapital.com/healthinsurance', type: 'Wellness Focused', description: 'Focuses on wellness and preventive care, often rewarding customers for healthy habits.' },
    ];
    return (
        <section className="explore-plans-section" >
            <h2 className="section-title" >Explore Popular Health Insurance Providers</h2>
            <div className="plans-grid">
                {plans.map(plan => (
                    <a key={plan.name} href={plan.link} target="_blank" rel="noopener noreferrer" className="plan-card">
                        <img src={plan.logo} alt={`${plan.name} logo`} className="plan-logo" />
                        <h3 className="plan-type">{plan.type}</h3>
                        <p className="plan-description">{plan.description}</p>
                        <span className="plan-link">Visit Website &rarr;</span>
                    </a>
                ))}
            </div>
        </section>
    );
};

// --- 4. "Did You Know?" Component (UPDATED) ---
const DidYouKnowSection = () => {
    const facts = [
        "In India, health insurance plans offer tax benefits under Section 80D of the Income Tax Act.",
        "The 'Free Look Period' is a 15-day window after receiving policy documents during which you can cancel the policy if you disagree with the terms.",
        "A 'No-Claim Bonus' can increase your coverage amount each year you don't make a claim, at no extra cost.",
        "Portability allows you to switch your health insurance provider without losing benefits like the waiting period credit you've accumulated.",
        "Many policies now offer coverage for AYUSH treatments (Ayurveda, Yoga, Unani, Siddha, and Homeopathy).",
    ];
    const [factIndex, setFactIndex] = useState(0);

    const showNextFact = () => {
        setFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
    };

   

    return (
        <section className="did-you-know-section">
            <div className="did-you-know-card">
                <div className="did-you-know-header">
                  <h3>Did You Know?</h3>
                </div>
                <p>"{facts[factIndex]}"</p>
                <button onClick={showNextFact}>Show me another fact</button>
            </div>
        </section>
    );
};


// --- 5. Jargon Buster Component (FIXED) ---
const JargonBusterSection = () => {
    // Fixed typos from previous version
    const terms = [
        { term: 'Deductible', def: 'A fixed amount you pay for your medical expenses before your insurance provider starts paying. A higher deductible usually means a lower premium.' },
        { term: 'No-Claim Bonus (NCB)', def: 'A reward given by the insurer for not making any claims in a policy year. It usually results in a discount on the next premium or an increased sum insured.' },
        { term: 'Co-payment', def: 'A clause where you agree to pay a portion of the claim amount from your pocket. The insurer pays the remaining amount. This helps in reducing the premium.' },
        { term: 'Sum Insured', def: 'The maximum amount the insurance company will pay for your claims during the policy period. This is the total value of your health cover.' },
        { term: 'Waiting Period', def: 'The specific time you must wait after buying a policy before you can claim some or all of its benefits, especially for pre-existing diseases.'},
        { term: 'Cashless Hospitalization', def: 'A facility where the insured person can get treatment at a network hospital without paying cash; the insurer settles the bill directly with the hospital.'}
    ];
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="jargon-buster-section">
            <h2 className="section-title">Insurance Jargon Buster</h2>
            <div className="accordion">
                {terms.map((item, index) => (
                    <div key={item.term} className="accordion-item">
                        <button onClick={() => toggleAccordion(index)} className={`accordion-header ${openIndex === index ? 'open' : ''}`}>
                            <span>{item.term}</span>
                            <span className="accordion-icon">{openIndex === index ? '−' : '+'}</span>
                        </button>
                        <div className={`accordion-content ${openIndex === index ? 'open' : ''}`}>
                            <p>{item.def}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

