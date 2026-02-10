# Azure BI & Data Engineering Playbook

A React application displaying data from the Azure BI Playbook Excel file. The application features 6 different worksheets from the playbook, each accessible through interactive buttons with scrollable tables.

## Data Source

This application displays data from: **Azure BI Playbook.xlsx**

The Excel file contains 6 sheets:
1. **Data Analysis and Discovery** - Tasks related to data analysis and discovery phase
2. **Data Ingestion** - Data ingestion tasks and processes
3. **Data Processing** - Data processing and transformation tasks
4. **Data Publishing** - Data publishing and distribution tasks
5. **Analytics Layer** - Analytics layer implementation tasks
6. **Reporting** - Reporting and visualization tasks

## Features

- 🎯 6 switchable data tables (one per Excel sheet)
- 📊 Dynamic columns based on Excel data
- 🎨 Modern, professional MAQ Software branding
- ⚡ Fast switching between tables
- 📱 Mobile-friendly responsive design
- 📜 Scrollable tables with fixed headers
- ⬅️➡️ Horizontal and vertical scrolling support

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Project Structure

- `src/App.jsx` - Main application component with table switching logic
- `src/App.css` - Professional MAQ Software styling
- `src/main.jsx` - Application entry point
- `src/data.json` - Converted data from Azure BI Playbook.xlsx
- `src/assets/` - Logo and static assets

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Custom styling with MAQ Software branding
