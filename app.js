// Countertop Design Studio - Main Application (Vanilla JS)

class CountertopEditor {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentTool = 'select';
        this.currentMaterial = null;
        this.elements = [];
        this.selectedElement = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.canvasWidth = 96;
        this.canvasDepth = 25;
        this.scale = 8; // pixels per inch
        
        // Material definitions
        this.materials = {
            'granite-black': { name: 'Black Granite', fill: '#2c2c2c' },
            'granite-white': { name: 'White Granite', fill: '#f5f5f5' },
            'marble-carrara': { name: 'Carrara Marble', fill: '#ffffff' },
            'quartz-calacatta': { name: 'Calacatta Quartz', fill: '#fafafa' },
            'granite-brown': { name: 'Brown Granite', fill: '#8b6f47' },
            'quartz-gray': { name: 'Gray Quartz', fill: '#9e9e9e' }
        };
        
        // Template sizes (width x depth in inches)
        this.templates = {
            'kitchen': { width: 96, depth: 25, name: 'Kitchen' },
            'bathroom': { width: 60, depth: 22, name: 'Bathroom' },
            'island': { width: 72, depth: 36, name: 'Island' },
            'custom': { width: 96, depth: 25, name: 'Custom' }
        };
        
        this.countertopMaterial = '#f5f5f5';
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.loadTemplate('kitchen');
        this.updateCanvasInfo();
        this.render();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set initial canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Canvas event listeners
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
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
                this.selectMaterial(material, e.currentTarget);
            });
        });
        
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.selectTool(tool, e.currentTarget);
            });
        });
        
        // Export buttons
        document.getElementById('exportPNG').addEventListener('click', () => this.exportPNG());
        document.getElementById('saveDesign').addEventListener('click', () => this.saveDesign());
        document.getElementById('newProject').addEventListener('click', () => this.newProject());
        
        // Dimensions
        document.getElementById('applyDimensions').addEventListener('click', () => this.applyDimensions());
        
        // Custom size modal
        document.getElementById('cancelCustomSize').addEventListener('click', () => this.hideCustomSizeModal());
        document.getElementById('applyCustomSize').addEventListener('click', () => this.applyCustomSize());
    }
    
    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;
        
        this.canvasWidth = template.width;
        this.canvasDepth = template.depth;
        
        // Update canvas dimensions
        const width = Math.min(template.width * this.scale, 1200);
        const height = Math.min(template.depth * this.scale, 600);
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Update input fields
        document.getElementById('canvasWidth').value = template.width;
        document.getElementById('canvasDepth').value = template.depth;
        
        // Clear elements
        this.elements = [];
        this.selectedElement = null;
        
        this.updateCanvasInfo();
        this.updateElementsList();
        this.render();
    }
    
    selectMaterial(materialId, element) {
        // Update UI
        document.querySelectorAll('.material-item').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
        
        this.currentMaterial = materialId;
        this.countertopMaterial = this.materials[materialId].fill;
        this.render();
    }
    
    selectTool(tool, element) {
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        element.classList.add('active');
        
        this.currentTool = tool;
        this.selectedElement = null;
        this.render();
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.currentTool === 'select') {
            // Check if clicking on an element
            this.selectedElement = null;
            for (let i = this.elements.length - 1; i >= 0; i--) {
                if (this.isPointInElement(x, y, this.elements[i])) {
                    this.selectedElement = this.elements[i];
                    this.isDragging = true;
                    this.dragOffset.x = x - this.elements[i].x;
                    this.dragOffset.y = y - this.elements[i].y;
                    break;
                }
            }
            this.updateObjectProperties();
            this.render();
        } else {
            // Add new element
            this.addElement(x, y);
        }
    }
    
    handleMouseMove(e) {
        if (this.isDragging && this.selectedElement) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.selectedElement.x = x - this.dragOffset.x;
            this.selectedElement.y = y - this.dragOffset.y;
            
            this.render();
        }
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
    }
    
    isPointInElement(px, py, element) {
        return px >= element.x && px <= element.x + element.width &&
               py >= element.y && py <= element.y + element.height;
    }
    
    addElement(x, y) {
        let element = null;
        
        switch (this.currentTool) {
            case 'text':
                element = {
                    type: 'text',
                    x: x,
                    y: y,
                    width: 150,
                    height: 30,
                    text: 'Click to edit',
                    fontSize: 16,
                    color: '#2c3e50'
                };
                break;
                
            case 'shape':
                element = {
                    type: 'shape',
                    x: x,
                    y: y,
                    width: 100,
                    height: 100,
                    color: '#6366f1'
                };
                break;
                
            case 'measure':
                element = {
                    type: 'measure',
                    x: x,
                    y: y,
                    width: 150,
                    height: 30,
                    length: '12"',
                    color: '#dc3545'
                };
                break;
                
            case 'note':
                element = {
                    type: 'note',
                    x: x,
                    y: y,
                    width: 120,
                    height: 80,
                    text: 'Note',
                    color: '#ffc107'
                };
                break;
        }
        
        if (element) {
            this.elements.push(element);
            this.selectedElement = element;
            this.updateElementsList();
            this.render();
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw countertop background
        this.ctx.fillStyle = this.countertopMaterial;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw border
        this.ctx.strokeStyle = '#dee2e6';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (optional)
        this.drawGrid();
        
        // Draw all elements
        this.elements.forEach(element => {
            this.drawElement(element);
        });
        
        // Draw selection highlight
        if (this.selectedElement) {
            this.drawSelectionBox(this.selectedElement);
        }
        
        // Draw dimension labels
        this.drawDimensions();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#e9ecef';
        this.ctx.lineWidth = 0.5;
        
        const gridSize = 50; // 50 pixels between lines
        
        for (let x = gridSize; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = gridSize; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawElement(element) {
        switch (element.type) {
            case 'text':
                this.ctx.fillStyle = element.color;
                this.ctx.font = `${element.fontSize}px Arial`;
                this.ctx.fillText(element.text, element.x, element.y + element.fontSize);
                break;
                
            case 'shape':
                this.ctx.fillStyle = element.color;
                this.ctx.globalAlpha = 0.7;
                this.ctx.fillRect(element.x, element.y, element.width, element.height);
                this.ctx.globalAlpha = 1.0;
                this.ctx.strokeStyle = '#4f46e5';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(element.x, element.y, element.width, element.height);
                break;
                
            case 'measure':
                this.ctx.strokeStyle = element.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(element.x, element.y);
                this.ctx.lineTo(element.x + element.width, element.y);
                this.ctx.stroke();
                
                // Draw arrows
                this.ctx.beginPath();
                this.ctx.moveTo(element.x, element.y - 5);
                this.ctx.lineTo(element.x, element.y + 5);
                this.ctx.moveTo(element.x + element.width, element.y - 5);
                this.ctx.lineTo(element.x + element.width, element.y + 5);
                this.ctx.stroke();
                
                // Draw text
                this.ctx.fillStyle = element.color;
                this.ctx.font = '14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(element.length, element.x + element.width / 2, element.y - 10);
                this.ctx.textAlign = 'left';
                break;
                
            case 'note':
                this.ctx.fillStyle = element.color;
                this.ctx.fillRect(element.x, element.y, element.width, element.height);
                this.ctx.strokeStyle = '#ff9800';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(element.x, element.y, element.width, element.height);
                
                this.ctx.fillStyle = '#333';
                this.ctx.font = '12px Arial';
                this.ctx.fillText(element.text, element.x + 5, element.y + 20);
                break;
        }
    }
    
    drawSelectionBox(element) {
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(element.x - 5, element.y - 5, element.width + 10, element.height + 10);
        this.ctx.setLineDash([]);
    }
    
    drawDimensions() {
        this.ctx.fillStyle = '#495057';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // Width label
        this.ctx.fillText(`${this.canvasWidth}"`, this.canvas.width / 2, this.canvas.height - 5);
        
        // Depth label
        this.ctx.save();
        this.ctx.translate(10, this.canvas.height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(`${this.canvasDepth}"`, 0, 0);
        this.ctx.restore();
        
        this.ctx.textAlign = 'left';
    }
    
    updateCanvasInfo() {
        const thickness = document.getElementById('thickness').value;
        document.getElementById('canvasInfo').textContent = 
            `${this.canvasWidth}" × ${this.canvasDepth}" × ${thickness}" Countertop`;
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
    
    updateObjectProperties() {
        const panel = document.getElementById('objectProperties');
        
        if (!this.selectedElement) {
            panel.innerHTML = '<p class="no-selection">Select an object to edit properties</p>';
            return;
        }
        
        const element = this.selectedElement;
        
        // Clear panel and build with DOM elements for better security
        panel.innerHTML = '';
        
        // Position X
        const posXGroup = this.createPropertyInput('Position X', 'number', Math.round(element.x), (value) => {
            this.updateElementProperty('x', value);
        });
        panel.appendChild(posXGroup);
        
        // Position Y
        const posYGroup = this.createPropertyInput('Position Y', 'number', Math.round(element.y), (value) => {
            this.updateElementProperty('y', value);
        });
        panel.appendChild(posYGroup);
        
        // Width
        const widthGroup = this.createPropertyInput('Width', 'number', Math.round(element.width), (value) => {
            this.updateElementProperty('width', value);
        });
        panel.appendChild(widthGroup);
        
        // Height
        const heightGroup = this.createPropertyInput('Height', 'number', Math.round(element.height), (value) => {
            this.updateElementProperty('height', value);
        });
        panel.appendChild(heightGroup);
        
        // Text input for text and note elements
        if (element.type === 'text' || element.type === 'note') {
            const textGroup = this.createPropertyInput('Text', 'text', element.text, (value) => {
                this.updateElementProperty('text', value);
            });
            panel.appendChild(textGroup);
        }
        
        // Measurement input for measure elements
        if (element.type === 'measure') {
            const measureGroup = this.createPropertyInput('Measurement', 'text', element.length, (value) => {
                this.updateElementProperty('length', value);
            });
            panel.appendChild(measureGroup);
        }
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-secondary btn-block';
        deleteBtn.style.background = '#dc3545';
        deleteBtn.style.color = 'white';
        deleteBtn.style.marginTop = '12px';
        deleteBtn.textContent = 'Delete Object';
        deleteBtn.addEventListener('click', () => this.deleteSelectedElement());
        panel.appendChild(deleteBtn);
    }
    
    createPropertyInput(label, type, value, onChange) {
        const group = document.createElement('div');
        group.className = 'property-group';
        
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        group.appendChild(labelEl);
        
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.addEventListener('change', (e) => onChange(e.target.value));
        group.appendChild(input);
        
        return group;
    }
    
    updateElementProperty(property, value) {
        if (!this.selectedElement) return;
        
        if (property === 'x' || property === 'y' || property === 'width' || property === 'height') {
            this.selectedElement[property] = parseFloat(value);
        } else {
            this.selectedElement[property] = value;
        }
        
        this.render();
    }
    
    deleteSelectedElement() {
        if (!this.selectedElement) return;
        
        const index = this.elements.indexOf(this.selectedElement);
        if (index > -1) {
            this.elements.splice(index, 1);
        }
        
        this.selectedElement = null;
        this.updateObjectProperties();
        this.updateElementsList();
        this.render();
    }
    
    updateElementsList() {
        const elementsList = document.getElementById('elementsList');
        
        if (this.elements.length === 0) {
            elementsList.innerHTML = '<p class="no-selection">No elements</p>';
            return;
        }
        
        // Clear the list
        elementsList.innerHTML = '';
        
        this.elements.forEach((element, index) => {
            const name = `${element.type} ${index + 1}`;
            const isActive = this.selectedElement === element;
            
            // Create layer item
            const layerItem = document.createElement('div');
            layerItem.className = 'layer-item' + (isActive ? ' active' : '');
            layerItem.addEventListener('click', () => this.selectElement(index));
            
            // Add element name
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            layerItem.appendChild(nameSpan);
            
            // Add delete button
            const deleteSpan = document.createElement('span');
            deleteSpan.className = 'delete-layer';
            deleteSpan.textContent = '✕';
            deleteSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteElement(index);
            });
            layerItem.appendChild(deleteSpan);
            
            elementsList.appendChild(layerItem);
        });
    }
    
    selectElement(index) {
        this.selectedElement = this.elements[index];
        this.updateObjectProperties();
        this.updateElementsList();
        this.render();
    }
    
    deleteElement(index) {
        this.elements.splice(index, 1);
        this.selectedElement = null;
        this.updateObjectProperties();
        this.updateElementsList();
        this.render();
    }
    
    exportPNG() {
        const link = document.createElement('a');
        link.download = 'countertop-design.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
    
    saveDesign() {
        const design = {
            width: this.canvasWidth,
            depth: this.canvasDepth,
            thickness: document.getElementById('thickness').value,
            material: this.currentMaterial,
            elements: this.elements
        };
        
        const json = JSON.stringify(design, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'countertop-design.json';
        link.href = url;
        link.click();
        
        // Clean up the blob URL to prevent memory leaks
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    
    newProject() {
        if (confirm('Are you sure you want to start a new project? All unsaved changes will be lost.')) {
            this.loadTemplate('kitchen');
            this.currentMaterial = null;
            this.countertopMaterial = '#f5f5f5';
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
