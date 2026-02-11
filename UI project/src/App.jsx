import { useState } from 'react'
import excelData from './data.json'
import { Search, Download, Settings, Upload, BarChart3, FileText, ExternalLink, Copy, Check } from 'lucide-react'

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true)
  const [activeTable, setActiveTable] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Azure')
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Use Excel data from Azure BI Playbook.xlsx
  const tableData = excelData
  const availableTables = Object.keys(tableData).length

  const handleTableSelect = (tableNum) => {
    setActiveTable(tableNum)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowLandingPage(false)
    }, 500)
  }

  const copyToClipboard = () => {
    const promptText = "Create a comprehensive data dictionary for the following tables: [Table Names]. Include column names, data types, descriptions, primary keys, foreign keys, and any constraints. Also generate a visual data lineage diagram showing the flow of data from source to destination."
    navigator.clipboard.writeText(promptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const categories = [
    { name: 'Azure', label: 'Azure BI' },
    { name: 'AIML', label: 'AI & ML' },
    { name: 'Frontend', label: 'Front-End' }
  ]

  const sections = [
    { id: 1, Icon: Search, description: 'Create inventory list, document ownership, and identify data sources for comprehensive analysis.', category: 'Azure' },
    { id: 2, Icon: Download, description: 'Extract and load data from various sources into data platform efficiently.', category: 'Azure' },
    { id: 3, Icon: Settings, description: 'Transform and process raw data into structured, analytics-ready formats.', category: 'Azure' },
    { id: 4, Icon: Upload, description: 'Publish processed data to consumption layers for business intelligence use.', category: 'Azure' },
    { id: 5, Icon: BarChart3, description: 'Build semantic models and curated datasets for advanced analytics and insights.', category: 'Azure' },
    { id: 6, Icon: FileText, description: 'Create reports and dashboards to visualize data and drive business decisions.', category: 'Azure' }
  ]

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="wavy-loader">
          <span style={{ '--i': 1 }}>.</span>
          <span style={{ '--i': 2 }}>.</span>
          <span style={{ '--i': 3 }}>.</span>
          <span style={{ '--i': 4 }}>.</span>
          <span style={{ '--i': 5 }}>.</span>
          <span style={{ '--i': 6 }}>.</span>
          <span style={{ '--i': 7 }}>.</span>
        </div>
        <p className="loading-text">Loading table...</p>
      </div>
    )
  }

  if (showLandingPage) {
    return (
      <div className="landing-container">
        <div className="landing-header">
          <img 
            src="https://maqsoftware.com/images/logos/MAQ-Software-Logo.svg" 
            alt="MAQ Software" 
            className="landing-logo" 
            onClick={() => setShowLandingPage(true)}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="landing-content">
          <h1 className="landing-title">AI Software Development Life Cycle Playbook</h1>
          <p className="landing-description">A Master Framework for Building Scalable, Governed, and Intelligent Analytics Platforms.</p>
          
          {/* <h3 className="section-heading">Explore Our Framework</h3> */}
          
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.name}
                className={selectedCategory === category.name ? 'category-btn active' : 'category-btn'}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="landing-cards">
              {sections.filter(section => section.category === selectedCategory).map(section => {
                const IconComponent = section.Icon;
                return tableData[section.id] && (
                  <div key={section.id} className="landing-card" onClick={() => handleTableSelect(section.id)}>
                    <div className="card-icon"><IconComponent size={40} strokeWidth={1.5} /></div>
                    <h4 className="card-title">{tableData[section.id].title}</h4>
                    <p className="card-description">{section.description}</p>
                    <span className="card-link">Show Details &gt;</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="header">
        <img 
          src="https://maqsoftware.com/images/logos/MAQ-Software-Logo.svg" 
          alt="MAQ Software" 
          className="logo" 
          onClick={() => setShowLandingPage(true)}
          style={{ cursor: 'pointer' }}
        />
        <h1 className="app-heading" onClick={() => setShowLandingPage(true)} style={{ cursor: 'pointer' }}>AI SDLC Playbook</h1>
      </div>
      
      <div className="button-container">
        <button 
          className="btn"
          onClick={() => setShowLandingPage(true)}
        >
          ← Back to Home
        </button>
        {[1, 2, 3, 4, 5, 6].map(num => (
          tableData[num] && (
            <button 
              key={num}
              className={activeTable === num ? 'btn active' : 'btn'}
              onClick={() => setActiveTable(num)}
            >
              {tableData[num].title}
            </button>
          )
        ))}
      </div>

      {tableData[activeTable] && (
        <div className="table-container">
          <h2 className="table-title">{tableData[activeTable].title}</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {tableData[activeTable].columns.map((column, index) => (
                    <th key={index}>{column || `Column ${index + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData[activeTable].rows.map((row, rowIndex) => {
                  const copilotColumnIndex = tableData[activeTable].columns.indexOf('Can it be done using Automation/Copilot?')
                  const howToColumnIndex = tableData[activeTable].columns.indexOf('How to Do?')
                  const isCopilotYes = row[copilotColumnIndex] === 'Yes'
                  
                  return (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => {
                        // If this is the "How to Do?" column and Copilot is "Yes", show a link
                        if (cellIndex === howToColumnIndex && isCopilotYes) {
                          return (
                            <td key={cellIndex}>
                              <span 
                                className="copilot-link" 
                                title="Click here"
                                onClick={() => setShowModal(true)}
                              >
                                <ExternalLink size={18} />
                              </span>
                            </td>
                          )
                        }
                        return <td key={cellIndex}>{cell !== null && cell !== undefined ? cell : ''}</td>
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <h2>How to Do</h2>
            
            <div className="modal-scroll-content">
              <div className="modal-section">
                <h3>Area</h3>
                <p>Data Analysis and Discovery</p>
              </div>

              <div className="modal-section">
                <h3>Task</h3>
                <p>Generate schema documentation and data lineage diagrams</p>
              </div>

              <div className="modal-section">
                <h3>Prompt</h3>
                <div className="prompt-box">
                  <button className="copy-button" onClick={copyToClipboard}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <p>Create a comprehensive data dictionary for the following tables: [Table Names]. Include column names, data types, descriptions, primary keys, foreign keys, and any constraints. Also generate a visual data lineage diagram showing the flow of data from source to destination.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
