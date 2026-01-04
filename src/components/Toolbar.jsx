import './Toolbar.css'

const Toolbar = ({ selectedTool, onSelectTool, onClear }) => {
  const tools = [
    { id: 'select', label: '↖️ Select', icon: '🖱️' },
    { id: 'rectangle', label: '⬜ Rectangle', icon: '▭' },
    { id: 'l-shape', label: '🔄 L-Shape', icon: 'L' },
  ]

  return (
    <div className="toolbar">
      <h3>Tools</h3>
      
      <div className="tool-group">
        <h4>Draw</h4>
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
            onClick={() => onSelectTool(tool.id)}
            title={tool.label}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-label">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="tool-group">
        <h4>Actions</h4>
        <button 
          className="tool-btn danger"
          onClick={onClear}
          title="Clear all shapes"
        >
          <span className="tool-icon">🗑️</span>
          <span className="tool-label">Clear All</span>
        </button>
      </div>

      <div className="tool-info">
        <p><strong>How to use:</strong></p>
        <ul>
          <li>Select a tool above</li>
          <li>Click and drag on canvas</li>
          <li>Use Select to move/resize</li>
          <li>Delete key to remove</li>
        </ul>
      </div>
    </div>
  )
}

export default Toolbar
