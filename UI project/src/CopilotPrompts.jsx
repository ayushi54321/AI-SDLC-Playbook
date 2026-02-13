import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, X, Copy, Check, ArrowLeft } from 'lucide-react'
import copilotPrompts from './copilotPrompts.json'

function CopilotPrompts() {
  const navigate = useNavigate()
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterArea, setFilterArea] = useState('All')

  const handleViewPrompt = (prompt) => {
    setSelectedPrompt(prompt)
  }

  const handleCloseModal = () => {
    setSelectedPrompt(null)
  }

  const handleCopyPrompt = (prompt, index) => {
    navigator.clipboard.writeText(prompt.copilotPrompt)
    setCopiedId(index)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Helper function to truncate prompt to first 5 words
  const truncatePrompt = (prompt) => {
    // Return full prompt, CSS will handle truncation uniformly
    return prompt
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prompt Library</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredPrompts.length} prompts available
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search prompts by area, task, or keywords..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ width: '350px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
              >
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="text-left text-sm font-semibold" style={{ padding: '20px 28px', width: '6%' }}>Task ID</th>
                  <th className="text-left text-sm font-semibold" style={{ padding: '20px 28px', width: '32%' }}>Task</th>
                  <th className="text-left text-sm font-semibold" style={{ padding: '20px 28px', width: '15%' }}>Area</th>
                  <th className="text-left text-sm font-semibold" style={{ padding: '20px 28px', width: '47%' }}>Prompt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrompts.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="text-gray-900 font-semibold" style={{ padding: '18px 28px' }}>
                      {item.taskId}
                    </td>
                    <td className="text-gray-700" style={{ padding: '18px 28px' }}>
                      {item.task}
                    </td>
                    <td style={{ padding: '18px 28px' }}>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {item.area}
                      </span>
                    </td>
                    <td style={{ padding: '18px 28px' }}>
                      <div className="flex items-center gap-3">
                        <p className="text-gray-700 flex-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '300px' }}>
                          {truncatePrompt(item.prompt)}
                        </p>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleViewPrompt(item)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="View full prompt"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCopyPrompt(item, index)}
                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                            title="Copy prompt"
                          >
                            {copiedId === index ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No prompts found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for viewing full prompt */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedPrompt.area}</h2>
                <p className="text-blue-100 text-sm mt-1">{selectedPrompt.task}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {selectedPrompt.prompt}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedPrompt.prompt)
                  handleCloseModal()
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Prompt
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
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
