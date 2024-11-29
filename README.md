# DWWM-ECF1-Julien
 
# Le Port de La Teste en Musique

An interactive, responsive, and feature-rich website designed for **Le Port de La Teste en Musique**, a vibrant electronic music festival. This project leverages modern web development practices to deliver an engaging user experience.

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [File Structure](#file-structure)  
4. [Technologies Used](#technologies-used)  
5. [Installation](#installation)  
6. [Usage](#usage)  
7. [Deployment](#deployment)  

---

### Overview

This website was developed to promote and support the **Le Port de La Teste en Musique** festival. It includes key functionalities:
- A dynamic and informative homepage.
- Interactive program and ticketing pages, updated in real time.
- A clean, modern design with responsive layouts for seamless navigation on all devices.

The goal is to provide users with an engaging platform to discover festival highlights, explore the program, and reserve tickets with ease.

---

### Features

1. **Dynamic Content Loading**:
   - Artist details and event schedules are dynamically fetched from a `festival.json` file.
   - Interactive filters on the ticketing page allow users to sort by date, price, or availability.

2. **Audio Player**:
   - A built-in music player with equalizer animations enhances the website’s ambiance.
   - Audio playback state and progress are saved using `localStorage`.

3. **Responsive Design**:
   - A mobile-first approach ensures compatibility across all devices.
   - Features adaptive navigation menus (burger menu for mobile).

4. **Expandable Sections**:
   - Toggle functionality for practical information (e.g., directions, food options) on the **Info Page**.

5. **Interactive Program Display**:
   - Automatically organizes and sorts artists by performance date and time.

6. **Real-Time Ticketing**:
   - Updates ticket availability dynamically.
   - Displays alerts for events that are sold out or have limited availability.

---

### File Structure

The project follows a modular structure for clarity and maintainability:

project-root/
│
├── index.html        # Homepage
├── program.html      # Program page
├── tickets.html      # Ticket booking page
├── info.html         # Info and access page
│
├── css/
│   └── stylesheet.min.css   # Minified CSS compiled from SASS
│
├── js/
│   └── main.js        # JavaScript for dynamic and interactive features
│
├── data/
│   └── festival.json  # Data file containing program and ticket information
│
├── img/              # Images for the website (banners, artist photos, etc.)
└── mp3/              # Audio files for the background player



---

### Technologies Used

- **HTML5**: Provides a semantic and structured layout.
- **CSS3 & SASS**: Enables scalable, reusable, and maintainable styles.
- **JavaScript (ES6)**: Implements dynamic behaviors and interactivity.
- **JSON**: Stores and retrieves data for the program and ticketing features.
- **LocalStorage**: Saves user preferences and playback progress across sessions.
- **Responsive Design**: Built with mobile-first principles.

---

### Installation

To run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-project.git
   cd your-project


2. If you’re using SASS or build tools, install the necessary dependencies:

       npm install

3. Compile the SASS files into CSS:

       npm run sass
   
4. Launch the project:
    - Open the `index.html` file in your browser
    - Or, if you have a local server (e.g., Live Server in VS Code), serve the project root.

---


### Usage:

 - Homepage:
   - View festival highlights and explore the call-to-action buttons for tickets or program details.
  
- Program Page:
   - Displays artists sorted by performance date.
   - Automatically fetches and displays content from festival.json.

- Ticketing Page:
   - Filter tickets by date, price, or availability.
   - Displays real-time availability, including "Sold Out" status.

- Info Page:
   - Explore practical details such as transportation, food, and access maps.
   - Use the toggle buttons to expand or collapse sections.

---

### Deployment:

To deploy the website on a hosting service:
 1. Build the project for production: If you’re using build tools, ensure the project is optimized:

        npm run build
2. Upload the files:
  - Deploy the contents of the project folder to your hosting provider.
  - Services like GitHub Pages are recommended.

3. Access your website: After deployment, visit the live URL provided by your hosting service.

---

Contributing:

1. Contributions are welcome. Fork the repository and submit a pull request.
2. Ensure that changes are tested before committing.
3. Write clear descriptions for all new features or fixes.

---

Additional Notes:

- Ensure The `festival.json` file is properly formatted and placed in the `data/` folder.
- Use modern browsers for optimal performance, as some features may not work in older browsers.
