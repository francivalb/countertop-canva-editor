# Countertop Designer - Canva-Style Editor

A fast and lightweight web-based countertop drawing & quote preparation tool built with React and Konva.js.

## 🚀 Features

- **Interactive Canvas**: Draw countertop shapes with click-and-drag functionality
- **Multiple Shape Types**: Support for rectangles and L-shaped countertops
- **Real-time Measurements**: Automatic dimension calculations in inches and square feet
- **Quote Generation**: Calculate costs based on customizable price per square foot
- **Transform Tools**: Move, resize, and delete shapes with intuitive controls
- **Export Quotes**: Download quote summaries as JSON files
- **Grid Layout**: Precise alignment with background grid

## 🛠️ Tech Stack

- **React 19** - Modern UI framework
- **Konva.js** - High-performance 2D canvas library
- **react-konva** - React bindings for Konva
- **Vite** - Fast build tool and dev server

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/francivalb/countertop-canva-editor.git

# Navigate to project directory
cd countertop-canva-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Usage

1. **Select a Tool**: Choose from Rectangle or L-Shape in the left toolbar
2. **Draw**: Click and drag on the canvas to create countertop shapes
3. **Edit**: Use the Select tool to move and resize shapes
4. **Delete**: Select a shape and press the Delete key
5. **Quote**: Adjust pricing and view real-time cost calculations in the right panel
6. **Export**: Download your quote as a JSON file for records

## 🏗️ Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 📝 Development

```bash
# Run development server
npm run dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 🎨 Project Structure

```
countertop-canva-editor/
├── src/
│   ├── components/
│   │   ├── CountertopEditor.jsx    # Main canvas component
│   │   ├── CountertopEditor.css
│   │   ├── Toolbar.jsx             # Tool selection panel
│   │   ├── Toolbar.css
│   │   ├── QuotePanel.jsx          # Quote calculation panel
│   │   └── QuotePanel.css
│   ├── App.jsx                     # Main application
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## 🌟 Key Features Explained

### Drawing Tools
- **Rectangle**: Perfect for standard countertop sections
- **L-Shape**: Ideal for corner countertops
- **Select**: Move and resize existing shapes

### Measurement System
- Dimensions displayed in inches
- Area calculated in square feet
- 10 pixels = 1 inch conversion ratio

### Quote Calculation
- Customizable price per square foot
- Real-time total cost updates
- Individual shape area breakdowns

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React and Konva.js
