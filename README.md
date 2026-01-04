# 🪨 Countertop Design Studio

A professional web-based Canva-style editor tailored for countertop businesses of all sizes. Design, visualize, and export custom countertop layouts with an intuitive drag-and-drop interface.

## ✨ Features

### 🎨 Design Tools
- **Visual Canvas Editor** - Intuitive interface built with HTML5 Canvas API
- **Multiple Tools** - Select, text, shapes, measurements, and notes
- **Element Management** - Track and manage design elements with a visual element panel
- **Interactive Canvas** - Drag and drop elements, with grid overlay for precision

### 📐 Countertop-Specific Features
- **Pre-made Templates** - Quick start with common sizes:
  - Kitchen Countertop (25" × 96")
  - Bathroom Vanity (22" × 60")
  - Island Top (36" × 72")
  - Custom Dimensions
- **Material Library** - Professional countertop materials:
  - Black Granite
  - White Granite
  - Carrara Marble
  - Calacatta Quartz
  - Brown Granite
  - Gray Quartz
- **Precise Measurements** - Dimension tools with inch-based measurements
- **Thickness Options** - Standard thickness selections (3/4", 1 1/4", 2", 3")

### 💼 Business-Ready Features
- **Export Options** - Save designs as PNG images or JSON files
- **Professional Output** - High-quality canvas exports with detailed specifications
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **No Installation Required** - Runs entirely in the browser with no dependencies

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in a modern web browser
2. Select a template or create custom dimensions
3. Choose materials and start designing
4. Add text, shapes, measurements, and images
5. Export your design as PNG or PDF

### Usage Guide

#### Creating a New Design
1. Click on a template button (Kitchen, Bathroom, Island, or Custom)
2. For custom sizes, enter your dimensions in inches
3. Click "Apply Dimensions" to create your canvas

#### Selecting Materials
1. Click on any material in the Materials section
2. The material will be applied to the countertop base
3. Mix and match materials for your design

#### Adding Elements
- **Text**: Click the Text tool, then click anywhere on the canvas
- **Shapes**: Click the Shape tool to add rectangles for cutouts or features
- **Measurements**: Add dimension lines to annotate your design
- **Notes**: Add sticky notes for comments or specifications

#### Working with Objects
- **Select**: Click an object to select it (selection shown with dashed border)
- **Move**: Drag selected objects to reposition
- **Properties**: Adjust position, size, and content in the Properties panel
- **Elements**: View and manage all objects in the Elements panel
- **Delete**: Select an object and click "Delete Object" in the Properties panel

#### Exporting Your Design
- **PNG**: High-resolution image file for presentations and web use
- **Save Design**: Export as JSON file to save and reload your design later

## 💻 Technical Details

### Technologies Used
- **HTML5** - Semantic markup and Canvas API for rendering
- **CSS3** - Modern responsive styling with flexbox and grid
- **JavaScript (ES6+)** - Object-oriented application architecture with vanilla JS
- **No External Dependencies** - Pure browser-based implementation

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with HTML5 Canvas support

### File Structure
```
countertop-canva-editor/
├── index.html      # Main application HTML
├── styles.css      # Application styling
├── app.js          # Editor functionality and logic
├── README.md       # Documentation
└── LICENSE         # MIT License
```

## 🎯 Use Cases

### For Small Businesses
- Quick design mockups for customer consultations
- Professional presentations without expensive software
- Easy material visualization and selection

### For Medium Businesses
- Standard workflow for design teams
- Client collaboration and approval process
- Consistent branded output

### For Large Enterprises
- Scalable solution for multiple locations
- Integration-ready design tool
- Professional documentation and exports

## 🔧 Customization

The editor is highly customizable. You can:

1. **Add Materials**: Edit the `materials` object in `app.js` to add new material types
2. **Modify Templates**: Update the `templates` object to change standard sizes
3. **Customize Styling**: Edit `styles.css` to match your brand colors
4. **Add Features**: Extend the `CountertopEditor` class with additional functionality

## 📱 Responsive Design

The editor adapts to different screen sizes:
- **Desktop** (1200px+): Full three-panel layout
- **Tablet** (768px-1200px): Two-panel layout
- **Mobile** (<768px): Single-panel layout with collapsible sidebar

## 🤝 Contributing

Contributions are welcome! This project is designed to grow with the needs of countertop businesses.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.

---

**Built for countertop professionals** | **No installation required** | **Works in any modern browser**
