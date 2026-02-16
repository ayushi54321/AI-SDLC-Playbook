import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, X, Copy, Check } from 'lucide-react'
import copilotPrompts from './copilotPrompts.json'

function CopilotPrompts() {
  const navigate = useNavigate()
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [promptCopied, setPromptCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterArea, setFilterArea] = useState('All')

  const handleViewPrompt = (prompt) => {
    setSelectedPrompt(prompt)
  }

  const handleCloseModal = () => {
    setSelectedPrompt(null)
    setPromptCopied(false)
  }

  const handleCopyPrompt = async () => {
    if (!selectedPrompt?.prompt) return
    try {
      await navigator.clipboard.writeText(selectedPrompt.prompt)
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = selectedPrompt.prompt
      fallback.setAttribute('readonly', '')
      fallback.style.position = 'absolute'
      fallback.style.left = '-9999px'
      document.body.appendChild(fallback)
      fallback.select()
      document.execCommand('copy')
      document.body.removeChild(fallback)
    }
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  const formatArea = (area = '') => area.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
  const normalizeText = (value = '') => value.toLowerCase().replace(/\s+/g, ' ').trim()

  const allPrompts = Object.entries(copilotPrompts)
    .flatMap(([areaKey, tasks]) =>
      tasks.map((task) => ({
        areaLabel: formatArea(areaKey),
        task: task.task,
        prompt: task.copilotPrompt
      }))
    )
    .map((item, index) => ({
      ...item,
      id: index + 1
    }))

  const areas = ['All', ...new Set(allPrompts.map((p) => p.areaLabel))]

  const filteredPrompts = allPrompts.filter((p) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch = p.prompt.toLowerCase().includes(search) ||
      p.areaLabel.toLowerCase().includes(search) ||
      p.task.toLowerCase().includes(search) ||
      p.id.toString().includes(search)

    const matchesArea = filterArea === 'All' || normalizeText(p.areaLabel) === normalizeText(filterArea)
    return matchesSearch && matchesArea
  })

  const promptSections = selectedPrompt ? [
    { key: 'area', label: 'Area', value: selectedPrompt.areaLabel },
    { key: 'task', label: 'Task', value: selectedPrompt.task },
    { key: 'prompt', label: 'Prompt', value: selectedPrompt.prompt, isPrompt: true }
  ] : []

  return (
    <div className="copilot-library-page">
      <div className="header">
        <img
          src="https://maqsoftware.com/images/logos/MAQ-Software-Logo.svg"
          alt="MAQ Software"
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <h1 className="app-heading" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          AI SDLC Playbook
        </h1>
      </div>

      <div className="copilot-library-topbar">
        <button className="btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="copilot-library-content">
        <div className="copilot-library-header">
          <h1 className="copilot-library-title">Prompts Library</h1>

          <div className="copilot-library-controls">
            <input
              type="text"
              placeholder="Search prompts by area, task, or keywords..."
              className="copilot-library-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="copilot-library-filter"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
            >
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="copilot-table-wrapper">
          <table className="copilot-library-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Area</th>
                <th>Prompt</th>
                <th aria-label="Action"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPrompts.map((item) => (
                <tr key={item.id}>
                  <td className="copilot-id-cell">{item.id}</td>
                  <td>{item.task}</td>
                  <td className="copilot-area-cell">{item.areaLabel}</td>
                  <td>
                    <p className="copilot-prompt-text">{item.prompt}</p>
                  </td>
                  <td className="copilot-action-cell">
                    <button
                      onClick={() => handleViewPrompt(item)}
                      className="copilot-eye-btn"
                      title="View full prompt"
                      aria-label={`View prompt ${item.id}`}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPrompts.length === 0 && (
            <div className="copilot-empty-state">
              <p>No prompts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {selectedPrompt && (
        <div className="modal-backdrop">
          <div className="details-modal">
            <div className="modal-header">
              <div className="modal-header-content">
                <h2>Prompt Details</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {promptSections.map((section) => (
                <div
                  className={`prompt-details-section${section.isPrompt ? ' prompt-section-locked' : ''}`}
                  key={section.key}
                >
                  <h3>{section.label}</h3>
                  {section.isPrompt ? (
                    <div className="prompt-text-box prompt-text-box-locked">
                      <button
                        className="prompt-copy-btn"
                        onClick={handleCopyPrompt}
                        title="Copy full prompt"
                        aria-label="Copy full prompt"
                      >
                        {promptCopied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{promptCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <div className="prompt-details-text">{section.value || '-'}</div>
                    </div>
                  ) : (
                    <p>{section.value || '-'}</p>
                  )}
                </div>
              ))}
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

export default CopilotPrompts
