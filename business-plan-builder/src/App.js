import React, { useState } from 'react';

const BusinessPlanBuilder = () => {
  const [step, setStep] = useState(0);
  const [businessPlan, setBusinessPlan] = useState({
    companyName: '',
    mission: '',
    productService: '',
    targetMarket: '',
    strategy: ''
  });
  const [currentInput, setCurrentInput] = useState('');


  // Each description
  const steps = [
    { key: 'companyName', label: 'Company Name' },
    { key: 'mission', label: 'Mission Statement' },
    { key: 'productService', label: 'Product/Service Description' },
    { key: 'targetMarket', label: 'Target Market' },
    { key: 'strategy', label: 'Business Strategy' }
  ];

  const handleInputChange = (e) => {
    setCurrentInput(e.target.value);
  };

  const handleSubmit = () => {
    if (step < steps.length) {
      setBusinessPlan({ ...businessPlan, [steps[step].key]: currentInput });
      setCurrentInput('');
      setStep(step + 1);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h1 style={{ textAlign: 'center' }}>Business Plan Builder</h1>
      {step < steps.length ? (
        <div>
          <h2>{steps[step].label}</h2>
          <input
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            placeholder={`Enter ${steps[step].label}`}
            style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
          />
          <button onClick={handleSubmit} style={{ padding: '5px 10px' }}>Next</button>
        </div>
      ) : (
        <div>
          <h2>Your Business Plan</h2>
          {steps.map((s) => (
            <p key={s.key}>
              <strong>{s.label}:</strong> {businessPlan[s.key]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessPlanBuilder;