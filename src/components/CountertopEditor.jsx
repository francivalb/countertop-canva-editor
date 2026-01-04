import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Rect, Transformer, Line, Text } from 'react-konva'
import './CountertopEditor.css'

const GRID_SIZE = 20

const CountertopShape = ({ shape, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef()
  const trRef = useRef()

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  const handleDragEnd = (e) => {
    onChange({
      ...shape,
      x: e.target.x(),
      y: e.target.y(),
    })
  }

  const handleTransformEnd = () => {
    const node = shapeRef.current
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    onChange({
      ...shape,
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    })
  }

  if (shape.type === 'rectangle') {
    return (
      <>
        <Rect
          ref={shapeRef}
          {...shape}
          draggable={isSelected}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          fill="#e0e7ff"
          stroke="#667eea"
          strokeWidth={2}
        />
        {isSelected && <Transformer ref={trRef} />}
      </>
    )
  }

  if (shape.type === 'l-shape') {
    const points = [
      0, 0,
      shape.width, 0,
      shape.width, shape.height / 2,
      shape.width / 2, shape.height / 2,
      shape.width / 2, shape.height,
      0, shape.height,
    ]

    return (
      <>
        <Line
          ref={shapeRef}
          x={shape.x}
          y={shape.y}
          points={points}
          closed={true}
          draggable={isSelected}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={handleDragEnd}
          fill="#e0e7ff"
          stroke="#667eea"
          strokeWidth={2}
        />
        {isSelected && <Transformer ref={trRef} />}
      </>
    )
  }

  return null
}

const CountertopEditor = ({ 
  shapes, 
  onAddShape, 
  onUpdateShape, 
  onDeleteShape,
  selectedTool 
}) => {
  const [selectedId, setSelectedId] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [newShape, setNewShape] = useState(null)
  const stageRef = useRef()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedId) {
        onDeleteShape(selectedId)
        setSelectedId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, onDeleteShape])

  const handleMouseDown = (e) => {
    if (selectedTool === 'select') return

    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()

    setIsDrawing(true)
    setNewShape({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      type: selectedTool,
    })
  }

  const handleMouseMove = (e) => {
    if (!isDrawing || !newShape) return

    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()

    setNewShape({
      ...newShape,
      width: pos.x - newShape.x,
      height: pos.y - newShape.y,
    })
  }

  const handleMouseUp = () => {
    if (!isDrawing || !newShape) return

    setIsDrawing(false)

    if (Math.abs(newShape.width) > 10 && Math.abs(newShape.height) > 10) {
      const normalizedShape = {
        ...newShape,
        x: newShape.width < 0 ? newShape.x + newShape.width : newShape.x,
        y: newShape.height < 0 ? newShape.y + newShape.height : newShape.y,
        width: Math.abs(newShape.width),
        height: Math.abs(newShape.height),
      }
      onAddShape(normalizedShape)
    }

    setNewShape(null)
  }

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedId(null)
    }
  }

  return (
    <div className="editor-container">
      <div className="canvas-wrapper">
        <Stage
          ref={stageRef}
          width={window.innerWidth - 550}
          height={window.innerHeight - 100}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onClick={checkDeselect}
        >
          <Layer>
            {/* Grid background */}
            {Array.from({ length: 50 }).map((_, i) => (
              <Line
                key={`v-${i}`}
                points={[i * GRID_SIZE, 0, i * GRID_SIZE, 2000]}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 50 }).map((_, i) => (
              <Line
                key={`h-${i}`}
                points={[0, i * GRID_SIZE, 2000, i * GRID_SIZE]}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            ))}

            {/* Existing shapes */}
            {shapes.map((shape) => (
              <CountertopShape
                key={shape.id}
                shape={shape}
                isSelected={shape.id === selectedId}
                onSelect={() => setSelectedId(shape.id)}
                onChange={(newAttrs) => onUpdateShape(shape.id, newAttrs)}
              />
            ))}

            {/* Shape being drawn */}
            {newShape && (
              <Rect
                {...newShape}
                fill="rgba(102, 126, 234, 0.3)"
                stroke="#667eea"
                strokeWidth={2}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default CountertopEditor
