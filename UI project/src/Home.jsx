import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import excelData from './data.json'
import copilotPrompts from './copilotPrompts.json'
import { Search, Download, Settings, Upload, BarChart3, FileText, ExternalLink, Copy, Check } from 'lucide-react'

function Home() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('Azure')
  const [copied, setCopied] = useState(false)

  // Use Excel data from Azure BI Playbook.xlsx
  const tableData = excelData
  const availableTables = Object.keys(tableData).length

  // Helper function to convert table title to URL slug
  const titleToSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  // Helper function to get table ID from slug
  const getTableIdFromSlug = (slug) => {
    for (let id in tableData) {
      if (titleToSlug(tableData[id].title) === slug) {
        return parseInt(id)
      }
    }
    return null
  }

  // Check URL params to determine which view to show
  const tableParam = searchParams.get('table')
  const showModal = searchParams.get('prompt') === 'true'
  const selectedTaskId = searchParams.get('taskId')
  const activeTable = tableParam ? (getTableIdFromSlug(tableParam) || 1) : 1
  const showLandingPage = !tableParam

  const formatArea = (area = '') => area.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
  const normalizeText = (value = '') => (
    value
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )

  const getPromptForTask = (areaTitle = '', taskName = '') => {
    const areaEntry = Object.entries(copilotPrompts).find(([areaKey]) => (
      normalizeText(formatArea(areaKey)) === normalizeText(areaTitle)
    ))

    if (!areaEntry || !taskName) {
      return null
    }

    const [, tasks] = areaEntry
    const normalizedTask = normalizeText(taskName)

    let match = tasks.find((item) => normalizeText(item.task) === normalizedTask)
    if (!match) {
      match = tasks.find((item) => (
        normalizeText(item.task).includes(normalizedTask) ||
        normalizedTask.includes(normalizeText(item.task))
      ))
    }

    return match || null
  }

  const activeTableData = tableData[activeTable]
  const taskIdColumnIndex = activeTableData?.columns.indexOf('Task Id') ?? -1
  const taskColumnIndex = activeTableData?.columns.indexOf('Task') ?? -1
  const selectedRow = showModal && activeTableData && taskIdColumnIndex >= 0
    ? activeTableData.rows.find((row) => String(row[taskIdColumnIndex]) === String(selectedTaskId))
    : null
  const selectedTask = selectedRow && taskColumnIndex >= 0 ? selectedRow[taskColumnIndex] : ''
  const selectedPrompt = getPromptForTask(activeTableData?.title || '', selectedTask)
  const modalPromptDetails = showModal ? {
    area: activeTableData?.title || '-',
    task: selectedPrompt?.task || selectedTask || '-',
    prompt: selectedPrompt?.copilotPrompt || 'Prompt not available for this task.'
  } : null

  const closePromptModal = () => {
    setCopied(false)
    setSearchParams({ table: titleToSlug(tableData[activeTable].title) })
  }

  const openPromptModal = (taskId) => {
    setCopied(false)
    setSearchParams({
      table: titleToSlug(tableData[activeTable].title),
      prompt: 'true',
      taskId: String(taskId)
    })
  }

  const handleTableSelect = (tableNum) => {
    const slug = titleToSlug(tableData[tableNum].title)
    setSearchParams({ table: slug })
  }

  const copyToClipboard = async () => {
    if (!modalPromptDetails?.prompt) return
    try {
      await navigator.clipboard.writeText(modalPromptDetails.prompt)
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = modalPromptDetails.prompt
      fallback.setAttribute('readonly', '')
      fallback.style.position = 'absolute'
      fallback.style.left = '-9999px'
      document.body.appendChild(fallback)
      fallback.select()
      document.execCommand('copy')
      document.body.removeChild(fallback)
    }
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

  if (showLandingPage) {
    return (
      <div className="landing-container">
        <div className="landing-header">
          <img 
            src="https://maqsoftware.com/images/logos/MAQ-Software-Logo.svg" 
            alt="MAQ Software" 
            className="landing-logo" 
            onClick={() => navigate('/')}
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
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <h1 className="app-heading" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>AI SDLC Playbook</h1>
      </div>
      
      <div className="button-container">
        <button 
          className="btn btn-back"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
        {[1, 2, 3, 4, 5, 6].map(num => (
          tableData[num] && (
            <button 
              key={num}
              className={activeTable === num ? 'btn active' : 'btn'}
              onClick={() => setSearchParams({ table: titleToSlug(tableData[num].title) })}
            >
              {tableData[num].title}
            </button>
          )
        ))}
        <button 
          className="btn active btn-view-details"
          onClick={() => navigate('/prompt-library')}
        >
          Prompt Library →
        </button>
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
                                title="View Prompt"
                                onClick={() => openPromptModal(taskIdColumnIndex >= 0 ? row[taskIdColumnIndex] : rowIndex + 1)}
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
        <div className="modal-overlay" onClick={closePromptModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closePromptModal}>&times;</button>
            <h2>How to Do</h2>
            
            <div className="modal-scroll-content">
              <div className="modal-section">
                <h3>Area</h3>
                <p>{modalPromptDetails?.area || '-'}</p>
              </div>

              <div className="modal-section">
                <h3>Task</h3>
                <p>{modalPromptDetails?.task || '-'}</p>
              </div>

              <div className="modal-section">
                <h3>Prompt</h3>
                <div className="prompt-box">
                  <button className="copy-button" onClick={copyToClipboard}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <p>{modalPromptDetails?.prompt || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
