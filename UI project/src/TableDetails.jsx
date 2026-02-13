import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, X } from 'lucide-react'
import copilotPrompts from './copilotPrompts.json'

function TableDetails() {
  const navigate = useNavigate()
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterArea, setFilterArea] = useState('All')

  const handleViewPrompt = (prompt) => {
    setSelectedPrompt(prompt)
  }

  const handleCloseModal = () => {
    setSelectedPrompt(null)
  }

  // Flatten the new structure into a single array with taskId
  const allPrompts = Object.entries(copilotPrompts).flatMap(([area, tasks]) => 
    tasks.map((task, index) => ({
      area: task.area,
      taskId: index + 1,
      task: task.task,
      prompt: task.copilotPrompt
    }))
  )

  // Get unique areas for filter
  const areas = ['All', ...new Set(allPrompts.map(p => p.area))]

  // Filter prompts based on search and area filter
  const filteredPrompts = allPrompts.filter(p => {
    const matchesSearch = p.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.taskId.toString().includes(searchTerm)
    const matchesArea = filterArea === 'All' || p.area === filterArea
    return matchesSearch && matchesArea
  })

  // Helper function to get prompt summary/context
  const getPromptContext = (prompt) => {
    // Display the prompt as-is, CSS will handle truncation
    return prompt
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
          className="btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="table-title" style={{ margin: 0 }}>Prompt Library</h2>

          {/* Search and Filter */}
          <div className="search-filter-container" style={{ margin: 0, flex: '0 0 auto', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search prompts by area, task, or keywords..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '350px' }}
            />
            <select
              className="filter-select"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
            >
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '6%', padding: '16px 24px' }}>Task ID</th>
                <th style={{ width: '32%', padding: '16px 24px' }}>Task</th>
                <th style={{ width: '15%', padding: '16px 24px' }}>Area</th>
                <th style={{ width: '47%', padding: '16px 24px' }}>Prompt</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrompts.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600', padding: '16px 24px' }}>{item.taskId}</td>
                  <td style={{ padding: '16px 24px' }}>{item.task}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="area-badge">
                      {item.area}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="prompt-cell-content">
                      <p className="prompt-text">
                        {getPromptContext(item.prompt)}
                      </p>
                      <div className="prompt-actions">
                        <button
                          onClick={() => handleViewPrompt(item)}
                          className="action-btn"
                          title="View full prompt"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPrompts.length === 0 && (
            <div className="empty-state">
              <p>No prompts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing full prompt */}
      {selectedPrompt && (
        <div className="modal-backdrop">
          <div className="details-modal">
            <div className="modal-header">
              <div className="modal-header-content">
                <h2>{selectedPrompt.area}</h2>
                <p>{selectedPrompt.task}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>{selectedPrompt.prompt}</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCloseModal}
                className="modal-btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableDetails
