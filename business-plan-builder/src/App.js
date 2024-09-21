import React, { useState } from 'react';
import axios from "axios";
// import fs from 'fs'; // Importing the fs module

// const GoogleGenerativeAI = require('path-to-google-generative-ai'); // Importing GoogleGenerativeAI

const BusinessPlanBuilder = () => {
  const [step, setStep] = useState(0);
  const [businessPlan, setBusinessPlan] = useState({
    productService: '',
    description: '',
    price: '',
    features: '',
    threats: '',
    distributions: '',
    targetAudience: ''
  });
  const [currentInput, setCurrentInput] = useState('');
  const [appendedText, setAppendedText] = useState('');
  const [planText, setPlanText] = useState('');

  const steps = [
    { key: 'productService', label: 'Product Name' },
    { key: 'description', label: 'Product Description' }
  ];

  const handleInputChange = (e) => {
    setCurrentInput(e.target.value);
  };

  const handleNextStep = () => {
    if (step === 0 && currentInput.trim()) {
      setTimeout(() => {
        setBusinessPlan({ ...businessPlan, [steps[step].key]: currentInput });
        setCurrentInput('');
        setStep(step + 1);
      }, 300);
    } else if (step > 0 && currentInput.trim() !== '') {
      setTimeout(() => {
        setBusinessPlan({ ...businessPlan, [steps[step].key]: currentInput });
        setCurrentInput('');
        setStep(step + 1);
      }, 300);
    }
  };

  /*
  const genResponse = async (query) => {
    const genAI = new GoogleGenerativeAI("AIzaSyAFM4xf_--ZoURni6Avj2qyag_2jqhRf5Q");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    function fileToGenerativePart(path, mimeType) {
      return {
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType,
        },
      };
    }

    const prompt = query;
    const mediaPath = 'path-to-media'; // Define mediaPath
    const imagePart = fileToGenerativePart(
      `${mediaPath}/jetpack.jpg`,
      "image/jpeg",
    );

    const result = await model.generateContent([prompt, imagePart]);
    return (result.response.text());
  }
*/


  const getResp = (query) => {

    //const q = "What is Tanaike? Return answer within 50 words.";
    const apiKey = "AIzaSyAFM4xf_--ZoURni6Avj2qyag_2jqhRf5Q" // Please set your API key.

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: query }] }] };
    const res = axios.fetch(url, {
      payload: JSON.stringify(payload),
      contentType: "application/json",
    });
    const obj = JSON.parse(res.getContentText());
    if (
      obj.candidates &&
      obj.candidates.length > 0 &&
      obj.candidates[0].content.parts.length > 0
    ) {
      setPlanText(obj.candidates[0].content.parts[0].text);
    } else {
      setPlanText("No response.");
    }
  }

  const handleButtonClick = (type) => {
    let str = ''
    switch (type) {
      case 'price':
        str = 'What are three consumer price ranges I should use for a ' + businessPlan.productService + ' product? '
          + ' What income should a user have to afford a $price ' + businessPlan.productService + ' product?'
          + ' What are the most popular occupations that support an income for this product?'
          + ' What education level is required for this kind of income generating occupation?';

        break
      case 'market':
        str = ' What is the market size of the ' + businessPlan.productService + ' industry? '
          + '	Is the ' + businessPlan.productService + ' industry growing or shrinking?';
        break
      case 'audience':
        str = 'What are ideal age breakdowns for a consumer of ' + businessPlan.productService + ' '
          + ' What is the ideal country for a consumer of $product? Can you also compare urban vs rural for ' + businessPlan.productService + ' '
        break
      case 'distributions':
        str = 'distributions'
        break
      case 'targetAudience':
        str = 'targetAudience'
        break
      case 'genPlan':
        getResp(appendedText);
    }
    setAppendedText((prevText) => prevText + str + '  ');
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
          <button onClick={handleNextStep} style={{ padding: '5px 10px' }}>Next</button>
        </div>
      ) : (
        <div>
          <h2>Your Business Plan</h2>
          {steps.map((s) => (
            <p key={s.key}>
              <strong>{s.label}:</strong> {businessPlan[s.key]}
            </p>
          ))}
          <div>
            <button onClick={() => handleButtonClick('market')}>Market</button>
            <button onClick={() => handleButtonClick('audience')}>Audience</button>
            <button onClick={() => handleButtonClick('price')}>Price</button>
            {/* <button onClick={() => handleButtonClick('distributions')}>Distributions</button>
            <button onClick={() => handleButtonClick('targetAudience')}>Target Audience</button> */}
          </div>
          <div id="prompt-params">
            <textarea
              value={appendedText}
              style={{ width: '100%', height: '100px', marginTop: '10px' }}
            />
             <button onClick={() => handleButtonClick('genPlan')}>Generate Plan</button>
             <textarea
              value={planText}
              style={{ width: '100%', height: '100px', marginTop: '10px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanBuilder;
