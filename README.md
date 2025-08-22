# City Pulse - Civic Reporting Platform

A modern, real-time civic reporting platform that connects citizens and city officials to resolve urban issues faster. Built with Next.js, React, and a beautiful, responsive UI.

## 🌟 Features

### For Citizens
- **Easy Issue Reporting**: Report problems with detailed descriptions and GPS coordinates
- **Google Maps Integration**: Interactive map for precise location selection with automatic geolocation
- **Real-time Tracking**: Monitor the status of your submitted reports with countdown timers
- **User-friendly Interface**: Modern, intuitive design with smooth animations
- **Multiple Issue Types**: Support for various urban problems (potholes, streetlights, garbage, etc.)
- **Location Permission**: Automatic location detection with manual override options

### For Officers
- **Kanban Dashboard**: Visual board to manage reports with drag-and-drop functionality
- **Priority Management**: Automatic overdue alerts for reports older than 48 hours
- **Warning System**: Automatic warnings issued for reports not resolved within 48 hours
- **Real-time Updates**: Live refresh of report statuses and new submissions
- **Status Management**: Easy status updates (Not Done → In Progress → Finished)
- **Timer Tracking**: Visual countdown timers and progress bars for each report

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Beautiful gradient backgrounds, animations, and glass morphism effects
- **Real-time Updates**: Auto-refreshing dashboards for officers
- **Secure Authentication**: JWT-based authentication system
- **Role-based Access**: Separate interfaces for citizens and officers
- **Google Maps API**: Interactive location selection with geolocation support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend setup)
- Google Maps API key (see setup instructions below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd city_pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Google Maps API key:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Google Maps API Setup

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Maps JavaScript API**
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

4. **Secure Your API Key**
   - Click on the created API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:3000/*` for development)
   - Under "API restrictions", select "Restrict key"
   - Choose "Maps JavaScript API"

5. **Add to Environment**
   - Add the API key to your `.env.local` file:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

## 📱 Usage

### For Citizens
1. **Sign Up**: Create a new account with the "Citizen" role
2. **Sign In**: Access your personal dashboard
3. **Report Issues**: Use the "Create New Report" form to submit problems
   - Select issue type from dropdown
   - Add detailed description
   - Use the interactive map to select location or enable location permissions
   - Coordinates are automatically filled when using map or location
4. **Track Progress**: Monitor your reports with countdown timers and status updates

### For Officers
1. **Sign Up**: Create a new account with the "Officer" role
2. **Sign In**: Access the officer dashboard
3. **Manage Reports**: View all reports organized by status with timer information
4. **Handle Warnings**: Focus on reports with warnings (48+ hours old)
5. **Update Status**: Move reports between columns as work progresses
6. **Monitor Timers**: Track time remaining before reports become overdue

## 🎨 Design System

The application uses a modern design system with:

- **Color Palette**: Blue and purple gradients with dark theme
- **Typography**: Inter font family for clean readability
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and hover effects
- **Icons**: Heroicons for consistent iconography
- **Maps**: Interactive Google Maps integration

### Key Design Features
- **Glass Morphism**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Dynamic, animated background elements
- **Status Badges**: Color-coded status indicators
- **Loading States**: Elegant loading spinners and skeleton screens
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Timer Visualizations**: Progress bars and countdown displays

## 🏗️ Architecture

### Frontend Structure
```
app/
├── authPages/
│   ├── dashboard/     # Main dashboard for both roles
│   ├── landingPage/   # Marketing landing page
│   ├── signin/        # Authentication page
│   └── signup/        # Registration page
├── components/
│   ├── CreateReport.jsx    # Report creation form with map
│   ├── GoogleMap.jsx       # Interactive map component
│   ├── ReportsList.jsx     # Reports display with timers
│   ├── SignInForm.jsx      # Login form
│   └── SignUpForm.jsx      # Registration form
├── config/
│   └── maps.js             # Google Maps configuration
├── api/
│   └── page.jsx            # API integration functions
└── globals.css             # Global styles and design system
```

### Key Components
- **Dashboard**: Role-based interface with welcome section and main content
- **CreateReport**: Form for citizens to submit new issues with map integration
- **GoogleMap**: Interactive map component with location selection
- **ReportsList**: Displays reports with timer information for citizens vs officers
- **SignInForm/SignUpForm**: Authentication forms with validation

### Backend Features
- **Timer System**: Automatic 48-hour countdown for reports
- **Warning System**: Automatic warnings for overdue reports
- **Real-time Updates**: Live status tracking and notifications
- **Location Support**: GPS coordinate storage and validation

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Google Maps API Key (Required)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend Integration
The frontend connects to a backend API that handles:
- User authentication and authorization
- Report creation and management
- Real-time updates and notifications
- Timer tracking and warning system
- Location data storage and retrieval

## ⏰ Timer System

### How It Works
- **48-Hour Deadline**: All reports have a 48-hour resolution deadline
- **Automatic Warnings**: Reports not resolved within 48 hours trigger warnings
- **Visual Indicators**: Color-coded timers and progress bars
- **Real-time Updates**: Countdown timers update automatically

### Timer States
- **🟢 Normal**: More than 12 hours remaining
- **🟡 Warning**: 12 hours or less remaining
- **🔴 Overdue**: Past 48-hour deadline
- **✅ Completed**: Report marked as finished

## 🎯 Roadmap

### Planned Features
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Photo Uploads**: Allow citizens to attach images to reports
- [ ] **Push Notifications**: Real-time alerts for status changes
- [ ] **Analytics Dashboard**: Insights and reporting for city officials
- [ ] **Multi-language Support**: Internationalization for diverse communities
- [ ] **Advanced Filtering**: Search and filter reports by various criteria
- [ ] **Offline Support**: Work offline with sync when connected

### Technical Improvements
- [ ] **Performance Optimization**: Code splitting and lazy loading
- [ ] **PWA Support**: Progressive Web App capabilities
- [ ] **Enhanced Security**: Two-factor authentication and advanced security measures
- [ ] **Advanced Maps**: Heat maps and clustering for multiple reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Heroicons** for the beautiful icon set
- **Inter Font** for the clean typography
- **Google Maps API** for location services

---

**City Pulse** - Empowering communities through technology. 🏙️✨
