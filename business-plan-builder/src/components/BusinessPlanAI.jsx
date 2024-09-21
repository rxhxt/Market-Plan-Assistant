import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './BusinessPlanAI.css';

const API_KEY = 'AIzaSyAFM4xf_--ZoURni6Avj2qyag_2jqhRf5Q';

const BusinessPlanAI = ({ businessPlan }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateBusinessPlan = async () => {
      try {
        setLoading(true);
        setError(null);

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Generate a detailed business plan based on the following information:

          Business Idea: ${businessPlan.idea}
          Description: ${businessPlan.description}
          Target Audience: ${businessPlan.targetAudience}
          Preferred Pricing: ${businessPlan.price}
          Features/Benefits: ${businessPlan.features}
          Niche Qualities: ${businessPlan.niche}
          Distribution Channel: ${businessPlan.distChannel}

          Please provide a comprehensive business plan that includes the following sections:

          1. Executive Summary
          2. Company Description
          3. Market Analysis
          4. Products/Services
          5. Marketing and Sales Plan
          6. Operations Plan
          7. Financial Projections
          8. Management Team
          9. Appendix

          For each section, use the provided information to create specific, tailored content. If any information is missing or unclear, make reasonable assumptions based on the given details.
        `;

        const result = await model.generateContent(prompt);
        setAiResponse(result.response.text());
      } catch (err) {
        console.error('Error generating business plan:', err);
        setError(`Failed to generate the business plan: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    generateBusinessPlan();
  }, [businessPlan]);

  const formatText = (text) => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
      // Remove all asterisks from the beginning and end of the line
      line = line.replace(/^\*+|\*+$/g, '');

      // Check if the line starts with ##
      if (line.startsWith('##')) {
        // Remove ## and treat as main header
        return <h1 key={index} className="business-plan-main-header">{line.replace(/^##\s*/, '')}</h1>;
      }

      // Check if the line includes both number and asterisks
      if (/^\d+.*\*.*\*/.test(line)) {
        // Remove asterisks and treat as extra large header
        return <h1 key={index} className="business-plan-extra-large-header">{line.replace(/\*/g, '')}</h1>;
      }

      // Check if the line is a numbered main section (e.g., "1. Executive Summary")
      if (/^\d+\.\s+[A-Z]/.test(line)) {
        return <h2 key={index} className="business-plan-section-header">{line}</h2>;
      }

      // Check if the line is a subsection header (e.g., "Target Market:")
      if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*:$/.test(line)) {
        return <h3 key={index} className="business-plan-subsection-header">{line}</h3>;
      }

      // For other lines
      if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="business-plan-paragraph">{line}</p>;
      }
    });
  };

  return (
    <div className="business-plan-ai-container">
      {loading ? (
        <p>Generating your business plan, please wait...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <p>There was an error generating the business plan. Please try again later or contact support if the problem persists.</p>
        </div>
      ) : (
        <div className="business-plan">
          <h1 className="business-plan-title">Your Generated Business Plan</h1>
          <div className="business-plan-content">
            {formatText(aiResponse)}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanAI;