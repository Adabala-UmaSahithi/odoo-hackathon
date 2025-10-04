import React, { useState } from 'react';
import Papa from 'papaparse';

function Upload({ addTransactions, categories }) {
  const [file, setFile] = useState(null);
  const [mappings, setMappings] = useState({
    date: '',
    description: '',
    amount: '',
  });
  const [headers, setHeaders] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          setHeaders(results.meta.fields || []);
          setPreview(results.data || []);
        }
      });
    }
  };

  const handleMappingChange = (field, value) => {
    setMappings({
      ...mappings,
      [field]: value
    });
  };

  const processFile = () => {
    if (!file || !mappings.date || !mappings.description || !mappings.amount) {
      alert('Please select a file and map all required fields');
      return;
    }

    setLoading(true);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedTransactions = results.data
          .filter(row => row[mappings.date] && row[mappings.amount])
          .map((row, index) => {
            // Convert amount to a number and handle different formats
            let amount = row[mappings.amount];
            
            // Remove currency symbols and commas
            amount = amount.replace(/[$,]/g, '');
            
            // Convert to float
            amount = parseFloat(amount);
            
            return {
              id: Date.now() + index,
              date: new Date(row[mappings.date]).toISOString().split('T')[0],
              description: row[mappings.description],
              amount: amount,
              categoryId: null, // Initially uncategorized
            };
          });

        addTransactions(parsedTransactions);
        setLoading(false);
        alert(`Successfully imported ${parsedTransactions.length} transactions`);
      },
      error: (error) => {
        setLoading(false);
        alert(`Error parsing file: ${error}`);
      }
    });
  };

  return (
    <div className="upload-container">
      <h2>Upload Bank Statement</h2>
      
      <div className="upload-form">
        <div className="form-group">
          <label>Select CSV File:</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
          />
        </div>
        
        {headers.length > 0 && (
          <>
            <h3>Map Fields</h3>
            <div className="mapping-fields">
              <div className="form-group">
                <label>Date Column:</label>
                <select 
                  value={mappings.date} 
                  onChange={(e) => handleMappingChange('date', e.target.value)}
                >
                  <option value="">Select Column</option>
                  {headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description Column:</label>
                <select 
                  value={mappings.description} 
                  onChange={(e) => handleMappingChange('description', e.target.value)}
                >
                  <option value="">Select Column</option>
                  {headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Amount Column:</label>
                <select 
                  value={mappings.amount} 
                  onChange={(e) => handleMappingChange('amount', e.target.value)}
                >
                  <option value="">Select Column</option>
                  {headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              className="process-button"
              onClick={processFile}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Process Statement'}
            </button>
            
            {preview.length > 0 && (
              <div className="preview-section">
                <h3>File Preview</h3>
                <table className="preview-table">
                  <thead>
                    <tr>
                      {headers.map(header => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index}>
                        {headers.map(header => (
                          <td key={header}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Upload;
