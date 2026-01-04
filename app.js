// Countertop Design Studio - Main Application

class CountertopEditor {
    constructor() {
        this.canvas = null;
        this.currentTool = 'select';
        this.currentMaterial = null;
        this.zoomLevel = 1;
        this.layers = [];
        this.selectedObject = null;
        
        // Material definitions with textures
        this.materials = {
            'granite-black': {
                name: 'Black Granite',
                fill: '#2c2c2c',
                pattern: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)'
            },
            'granite-white': {
                name: 'White Granite',
                fill: '#f5f5f5',
                pattern: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
            },
            'marble-carrara': {
                name: 'Carrara Marble',
                fill: '#ffffff',
                pattern: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)'
            },
            'quartz-calacatta': {
                name: 'Calacatta Quartz',
                fill: '#fafafa',
                pattern: 'linear-gradient(135deg, #fafafa 0%, #ececec 100%)'
            },
            'granite-brown': {
                name: 'Brown Granite',
                fill: '#8b6f47',
                pattern: 'linear-gradient(135deg, #8b6f47 0%, #654321 100%)'
            },
            'quartz-gray': {
                name: 'Gray Quartz',
                fill: '#9e9e9e',
                pattern: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)'
            }
        };
        
        // Template sizes (width x depth in inches)
        this.templates = {
            'kitchen': { width: 96, depth: 25, name: 'Kitchen' },
            'bathroom': { width: 60, depth: 22, name: 'Bathroom' },
            'island': { width: 72, depth: 36, name: 'Island' },
            'custom': { width: 96, depth: 25, name: 'Custom' }
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.loadTemplate('kitchen');
        this.updateCanvasInfo();
    }
    
    setupCanvas() {
        const canvasElement = document.getElementById('mainCanvas');
        this.canvas = new fabric.Canvas('mainCanvas', {
            backgroundColor: '#ffffff',
            selection: true,
            preserveObjectStacking: true
        });
        
        // Set initial canvas size
        this.canvas.setWidth(800);
        this.canvas.setHeight(400);
        
        // Canvas event listeners
        this.canvas.on('selection:created', (e) => this.onObjectSelected(e));
        this.canvas.on('selection:updated', (e) => this.onObjectSelected(e));
        this.canvas.on('selection:cleared', () => this.onSelectionCleared());
        this.canvas.on('object:modified', () => this.updateLayers());
        this.canvas.on('object:added', () => this.updateLayers());
        this.canvas.on('object:removed', () => this.updateLayers());
    }
    
    setupEventListeners() {
        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                if (size === 'custom') {
                    this.showCustomSizeModal();
                } else {
                    this.loadTemplate(size);
                }
            });
        });
        
        // Material selection
        document.querySelectorAll('.material-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const material = e.currentTarget.dataset.material;
                this.selectMaterial(material);
            });
        });
        
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.selectTool(tool);
            });
        });
        
        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.8));
        document.getElementById('zoomFit').addEventListener('click', () => this.zoomToFit());
        
        // Export buttons
        document.getElementById('exportPNG').addEventListener('click', () => this.exportPNG());
        document.getElementById('exportPDF').addEventListener('click', () => this.exportPDF());
        document.getElementById('newProject').addEventListener('click', () => this.newProject());
        
        // Dimensions
        document.getElementById('applyDimensions').addEventListener('click', () => this.applyDimensions());
        
        // Custom size modal
        document.getElementById('cancelCustomSize').addEventListener('click', () => this.hideCustomSizeModal());
        document.getElementById('applyCustomSize').addEventListener('click', () => this.applyCustomSize());
        
        // Image upload
        document.getElementById('imageUpload').addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Canvas click for tools
        this.canvas.on('mouse:down', (e) => this.handleCanvasClick(e));
    }
    
    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;
        
        // Update canvas dimensions based on template
        const scale = 8; // 8 pixels per inch
        const width = template.width * scale;
        const height = template.depth * scale;
        
        this.canvas.setWidth(Math.min(width, 1200));
        this.canvas.setHeight(Math.min(height, 600));
        
        // Update input fields
        document.getElementById('canvasWidth').value = template.width;
        document.getElementById('canvasDepth').value = template.depth;
        
        // Clear canvas
        this.canvas.clear();
        this.canvas.backgroundColor = '#ffffff';
        
        // Add countertop base
        const countertop = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.canvas.width,
            height: this.canvas.height,
            fill: '#f5f5f5',
            stroke: '#dee2e6',
            strokeWidth: 2,
            selectable: false,
            name: 'countertop-base'
        });
        
        this.canvas.add(countertop);
        this.canvas.sendToBack(countertop);
        
        // Add dimension labels
        this.addDimensionLabels(template.width, template.depth);
        
        this.updateCanvasInfo();
        this.updateLayers();
        this.canvas.renderAll();
    }
    
    addDimensionLabels(width, depth) {
        // Width label
        const widthLabel = new fabric.Text(`${width}"`, {
            left: this.canvas.width / 2,
            top: this.canvas.height + 10,
            fontSize: 14,
            fill: '#495057',
            fontFamily: 'Arial',
            originX: 'center',
            selectable: false,
            name: 'dimension-label'
        });
        
        // Depth label
        const depthLabel = new fabric.Text(`${depth}"`, {
            left: -20,
            top: this.canvas.height / 2,
            fontSize: 14,
            fill: '#495057',
            fontFamily: 'Arial',
            angle: -90,
            originX: 'center',
            originY: 'center',
            selectable: false,
            name: 'dimension-label'
        });
        
        this.canvas.add(widthLabel, depthLabel);
    }
    
    selectMaterial(materialId) {
        // Update UI
        document.querySelectorAll('.material-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        this.currentMaterial = materialId;
        
        // Apply to selected object if any
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.name === 'countertop-base') {
            const material = this.materials[materialId];
            activeObject.set('fill', material.fill);
            this.canvas.renderAll();
        }
    }
    
    selectTool(tool) {
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        this.currentTool = tool;
        
        // Handle specific tool actions
        if (tool === 'image') {
            document.getElementById('imageUpload').click();
        }
    }
    
    handleCanvasClick(e) {
        if (!e.target) {
            switch(this.currentTool) {
                case 'text':
                    this.addText(e.pointer.x, e.pointer.y);
                    break;
                case 'shape':
                    this.addShape(e.pointer.x, e.pointer.y);
                    break;
                case 'measure':
                    this.addMeasurement(e.pointer.x, e.pointer.y);
                    break;
            }
        }
    }
    
    addText(x, y) {
        const text = new fabric.IText('Click to edit', {
            left: x,
            top: y,
            fontSize: 20,
            fill: '#2c3e50',
            fontFamily: 'Arial',
            name: 'text-element'
        });
        
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        this.canvas.renderAll();
    }
    
    addShape(x, y) {
        const rect = new fabric.Rect({
            left: x,
            top: y,
            width: 100,
            height: 100,
            fill: '#6366f1',
            stroke: '#4f46e5',
            strokeWidth: 2,
            opacity: 0.7,
            name: 'shape-element'
        });
        
        this.canvas.add(rect);
        this.canvas.setActiveObject(rect);
        this.canvas.renderAll();
    }
    
    addMeasurement(x, y) {
        const line = new fabric.Line([x, y, x + 100, y], {
            stroke: '#dc3545',
            strokeWidth: 2,
            name: 'measurement-line'
        });
        
        const text = new fabric.Text('100"', {
            left: x + 50,
            top: y - 20,
            fontSize: 14,
            fill: '#dc3545',
            fontFamily: 'Arial',
            originX: 'center',
            name: 'measurement-text'
        });
        
        const group = new fabric.Group([line, text], {
            name: 'measurement'
        });
        
        this.canvas.add(group);
        this.canvas.setActiveObject(group);
        this.canvas.renderAll();
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            fabric.Image.fromURL(event.target.result, (img) => {
                img.scale(0.5);
                img.set({
                    left: 100,
                    top: 100,
                    name: 'image-element'
                });
                this.canvas.add(img);
                this.canvas.setActiveObject(img);
                this.canvas.renderAll();
            });
        };
        reader.readAsDataURL(file);
        
        // Reset file input
        e.target.value = '';
    }
    
    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel));
        
        this.canvas.setZoom(this.zoomLevel);
        this.updateZoomDisplay();
        this.canvas.renderAll();
    }
    
    zoomToFit() {
        this.zoomLevel = 1;
        this.canvas.setZoom(1);
        this.updateZoomDisplay();
        this.canvas.renderAll();
    }
    
    updateZoomDisplay() {
        document.getElementById('zoomLevel').textContent = Math.round(this.zoomLevel * 100) + '%';
    }
    
    applyDimensions() {
        const width = parseInt(document.getElementById('canvasWidth').value);
        const depth = parseInt(document.getElementById('canvasDepth').value);
        
        if (width > 0 && depth > 0) {
            this.templates.custom = { width, depth, name: 'Custom' };
            this.loadTemplate('custom');
        }
    }
    
    showCustomSizeModal() {
        document.getElementById('customSizeModal').classList.add('active');
    }
    
    hideCustomSizeModal() {
        document.getElementById('customSizeModal').classList.remove('active');
    }
    
    applyCustomSize() {
        const width = parseInt(document.getElementById('customWidth').value);
        const depth = parseInt(document.getElementById('customDepth').value);
        
        if (width > 0 && depth > 0) {
            document.getElementById('canvasWidth').value = width;
            document.getElementById('canvasDepth').value = depth;
            this.applyDimensions();
            this.hideCustomSizeModal();
        }
    }
    
    updateCanvasInfo() {
        const width = document.getElementById('canvasWidth').value;
        const depth = document.getElementById('canvasDepth').value;
        const thickness = document.getElementById('thickness').value;
        
        document.getElementById('canvasInfo').textContent = 
            `${width}" × ${depth}" × ${thickness}" Countertop`;
    }
    
    onObjectSelected(e) {
        this.selectedObject = e.selected[0];
        this.updateObjectProperties();
    }
    
    onSelectionCleared() {
        this.selectedObject = null;
        this.updateObjectProperties();
    }
    
    updateObjectProperties() {
        const panel = document.getElementById('objectProperties');
        
        if (!this.selectedObject) {
            panel.innerHTML = '<p class="no-selection">Select an object to edit properties</p>';
            return;
        }
        
        const obj = this.selectedObject;
        let html = '<div class="property-group">';
        
        // Position
        html += `
            <label>Position X</label>
            <input type="number" value="${Math.round(obj.left)}" 
                   onchange="editor.updateObjectProperty('left', this.value)">
        </div>
        <div class="property-group">
            <label>Position Y</label>
            <input type="number" value="${Math.round(obj.top)}" 
                   onchange="editor.updateObjectProperty('top', this.value)">
        `;
        
        // Size (if applicable)
        if (obj.width) {
            html += `
                </div>
                <div class="property-group">
                    <label>Width</label>
                    <input type="number" value="${Math.round(obj.width * obj.scaleX)}" 
                           onchange="editor.updateObjectProperty('width', this.value)">
            `;
        }
        
        if (obj.height) {
            html += `
                </div>
                <div class="property-group">
                    <label>Height</label>
                    <input type="number" value="${Math.round(obj.height * obj.scaleY)}" 
                           onchange="editor.updateObjectProperty('height', this.value)">
            `;
        }
        
        // Rotation
        html += `
            </div>
            <div class="property-group">
                <label>Rotation (degrees)</label>
                <input type="number" value="${Math.round(obj.angle)}" 
                       onchange="editor.updateObjectProperty('angle', this.value)">
        `;
        
        // Opacity
        html += `
            </div>
            <div class="property-group">
                <label>Opacity</label>
                <input type="range" min="0" max="1" step="0.1" value="${obj.opacity || 1}" 
                       onchange="editor.updateObjectProperty('opacity', this.value)">
        `;
        
        // Delete button
        html += `
            </div>
            <button onclick="editor.deleteSelectedObject()" 
                    class="btn btn-secondary btn-block" 
                    style="background: #dc3545; color: white; margin-top: 12px;">
                Delete Object
            </button>
        `;
        
        panel.innerHTML = html;
    }
    
    updateObjectProperty(property, value) {
        if (!this.selectedObject) return;
        
        const numValue = parseFloat(value);
        
        if (property === 'width') {
            this.selectedObject.scaleX = numValue / this.selectedObject.width;
        } else if (property === 'height') {
            this.selectedObject.scaleY = numValue / this.selectedObject.height;
        } else {
            this.selectedObject.set(property, numValue);
        }
        
        this.canvas.renderAll();
    }
    
    deleteSelectedObject() {
        if (!this.selectedObject) return;
        
        this.canvas.remove(this.selectedObject);
        this.selectedObject = null;
        this.canvas.renderAll();
    }
    
    updateLayers() {
        const layersList = document.getElementById('layersList');
        const objects = this.canvas.getObjects().filter(obj => obj.name !== 'dimension-label');
        
        if (objects.length === 0) {
            layersList.innerHTML = '<p class="no-selection">No layers</p>';
            return;
        }
        
        let html = '';
        objects.reverse().forEach((obj, index) => {
            const name = obj.name || 'Layer ' + (objects.length - index);
            const isActive = this.selectedObject === obj ? 'active' : '';
            
            html += `
                <div class="layer-item ${isActive}" onclick="editor.selectLayer(${objects.length - index - 1})">
                    <span>${name}</span>
                    <span class="delete-layer" onclick="event.stopPropagation(); editor.deleteLayer(${objects.length - index - 1})">✕</span>
                </div>
            `;
        });
        
        layersList.innerHTML = html;
    }
    
    selectLayer(index) {
        const objects = this.canvas.getObjects().filter(obj => obj.name !== 'dimension-label');
        const obj = objects.reverse()[index];
        
        if (obj) {
            this.canvas.setActiveObject(obj);
            this.canvas.renderAll();
        }
    }
    
    deleteLayer(index) {
        const objects = this.canvas.getObjects().filter(obj => obj.name !== 'dimension-label');
        const obj = objects.reverse()[index];
        
        if (obj) {
            this.canvas.remove(obj);
            this.canvas.renderAll();
        }
    }
    
    exportPNG() {
        // Hide dimension labels temporarily
        const labels = this.canvas.getObjects().filter(obj => obj.name === 'dimension-label');
        labels.forEach(label => label.set('opacity', 0));
        this.canvas.renderAll();
        
        // Export
        const dataURL = this.canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        // Restore labels
        labels.forEach(label => label.set('opacity', 1));
        this.canvas.renderAll();
        
        // Download
        const link = document.createElement('a');
        link.download = 'countertop-design.png';
        link.href = dataURL;
        link.click();
    }
    
    exportPDF() {
        // Hide dimension labels temporarily
        const labels = this.canvas.getObjects().filter(obj => obj.name === 'dimension-label');
        labels.forEach(label => label.set('opacity', 0));
        this.canvas.renderAll();
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: this.canvas.width > this.canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [this.canvas.width, this.canvas.height]
        });
        
        const imgData = this.canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, this.canvas.width, this.canvas.height);
        
        // Add specifications
        const width = document.getElementById('canvasWidth').value;
        const depth = document.getElementById('canvasDepth').value;
        const thickness = document.getElementById('thickness').value;
        
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Countertop Specifications', 20, 30);
        pdf.setFontSize(12);
        pdf.text(`Width: ${width} inches`, 20, 50);
        pdf.text(`Depth: ${depth} inches`, 20, 65);
        pdf.text(`Thickness: ${thickness} inches`, 20, 80);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 95);
        
        // Restore labels
        labels.forEach(label => label.set('opacity', 1));
        this.canvas.renderAll();
        
        pdf.save('countertop-design.pdf');
    }
    
    newProject() {
        if (confirm('Are you sure you want to start a new project? All unsaved changes will be lost.')) {
            this.loadTemplate('kitchen');
            this.currentMaterial = null;
            document.querySelectorAll('.material-item').forEach(item => {
                item.classList.remove('active');
            });
        }
    }
}

// Initialize the editor when the page loads
let editor;
window.addEventListener('DOMContentLoaded', () => {
    editor = new CountertopEditor();
});
