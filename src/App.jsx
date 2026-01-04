import { useState } from 'react'
import './App.css'
import CountertopEditor from './components/CountertopEditor'
import Toolbar from './components/Toolbar'
import QuotePanel from './components/QuotePanel'

function App() {
  const [shapes, setShapes] = useState([])
  const [selectedTool, setSelectedTool] = useState('select')
  const [pricePerSqFt, setPricePerSqFt] = useState(50)

  const addShape = (shape) => {
    setShapes([...shapes, { ...shape, id: Date.now() }])
  }

  const updateShape = (id, updates) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    ))
  }

  const deleteShape = (id) => {
    setShapes(shapes.filter(shape => shape.id !== id))
  }

  const clearAll = () => {
    setShapes([])
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Countertop Designer</h1>
        <p>Draw, measure & quote countertops</p>
      </header>
      
      <div className="app-content">
        <Toolbar 
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          onClear={clearAll}
        />
        
        <CountertopEditor 
          shapes={shapes}
          onAddShape={addShape}
          onUpdateShape={updateShape}
          onDeleteShape={deleteShape}
          selectedTool={selectedTool}
        />
        
        <QuotePanel 
          shapes={shapes}
          pricePerSqFt={pricePerSqFt}
          onPriceChange={setPricePerSqFt}
        />
      </div>
    </div>
  )
}

export default App
