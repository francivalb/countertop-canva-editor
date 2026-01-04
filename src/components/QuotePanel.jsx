import { useCallback } from 'react'
import './QuotePanel.css'

const PIXELS_PER_INCH = 10
const L_SHAPE_AREA_RATIO = 0.75 // L-shape is approximately 75% of full rectangle area

const QuotePanel = ({ shapes, pricePerSqFt, onPriceChange }) => {

  const calculateArea = (shape) => {
    if (shape.type === 'rectangle') {
      const widthInInches = shape.width / PIXELS_PER_INCH
      const heightInInches = shape.height / PIXELS_PER_INCH
      return (widthInInches * heightInInches) / 144 // Convert to square feet
    }
    
    if (shape.type === 'l-shape') {
      const widthInInches = shape.width / PIXELS_PER_INCH
      const heightInInches = shape.height / PIXELS_PER_INCH
      const totalArea = (widthInInches * heightInInches) / 144
      return totalArea * L_SHAPE_AREA_RATIO
    }
    
    return 0
  }

  const totalArea = shapes.reduce((sum, shape) => sum + calculateArea(shape), 0)
  const totalCost = totalArea * pricePerSqFt

  const exportQuote = useCallback(() => {
    const timestamp = Date.now()
    const quoteData = {
      date: new Date().toLocaleDateString(),
      shapes: shapes.map((shape, index) => ({
        number: index + 1,
        type: shape.type,
        dimensions: {
          width: (shape.width / PIXELS_PER_INCH).toFixed(1) + '"',
          height: (shape.height / PIXELS_PER_INCH).toFixed(1) + '"',
        },
        area: calculateArea(shape).toFixed(2) + ' sq ft',
      })),
      totalArea: totalArea.toFixed(2) + ' sq ft',
      pricePerSqFt: '$' + pricePerSqFt.toFixed(2),
      totalCost: '$' + totalCost.toFixed(2),
    }

    const blob = new Blob([JSON.stringify(quoteData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `countertop-quote-${timestamp}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [shapes, totalArea, pricePerSqFt, totalCost])

  return (
    <div className="quote-panel">
      <h3>Quote Summary</h3>

      <div className="quote-section">
        <h4>Pricing</h4>
        <div className="price-input">
          <label htmlFor="price">Price per sq ft:</label>
          <div className="input-group">
            <span>$</span>
            <input
              id="price"
              type="number"
              value={pricePerSqFt}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              min="0"
              step="5"
            />
          </div>
        </div>
      </div>

      <div className="quote-section">
        <h4>Shapes ({shapes.length})</h4>
        <div className="shapes-list">
          {shapes.length === 0 ? (
            <p className="empty-message">No shapes drawn yet</p>
          ) : (
            shapes.map((shape, index) => (
              <div key={shape.id} className="shape-item">
                <div className="shape-header">
                  <span className="shape-number">#{index + 1}</span>
                  <span className="shape-type">{shape.type}</span>
                </div>
                <div className="shape-details">
                  <div className="detail">
                    <span className="label">Width:</span>
                    <span className="value">
                      {(shape.width / PIXELS_PER_INCH).toFixed(1)}"
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">Height:</span>
                    <span className="value">
                      {(shape.height / PIXELS_PER_INCH).toFixed(1)}"
                    </span>
                  </div>
                  <div className="detail highlight">
                    <span className="label">Area:</span>
                    <span className="value">
                      {calculateArea(shape).toFixed(2)} sq ft
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="quote-section total-section">
        <div className="total-row">
          <span className="label">Total Area:</span>
          <span className="value">{totalArea.toFixed(2)} sq ft</span>
        </div>
        <div className="total-row main-total">
          <span className="label">Total Cost:</span>
          <span className="value">${totalCost.toFixed(2)}</span>
        </div>
      </div>

      <button 
        className="export-btn"
        onClick={exportQuote}
        disabled={shapes.length === 0}
      >
        📄 Export Quote
      </button>
    </div>
  )
}

export default QuotePanel
