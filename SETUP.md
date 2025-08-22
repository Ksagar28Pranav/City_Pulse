# City Pulse Setup Guide

## Quick Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory with the following content:

```env
# Google Maps API Key (Required for map functionality)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Google Maps API Setup

#### Step 1: Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**
4. Go to "Credentials" and create an API key
5. Copy the API key

#### Step 2: Secure Your API Key
1. Click on the created API key
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domain (e.g., `localhost:3000/*` for development)
4. Under "API restrictions", select "Restrict key"
5. Choose "Maps JavaScript API"

#### Step 3: Add to Environment
Add the API key to your `.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Backend Setup

Make sure your backend server is running on port 5000:

```bash
cd backend
npm install
npm start
```

### 4. Frontend Setup

```bash
npm install
npm run dev
```

## Troubleshooting

### Google Maps Errors

**Error: "You have included the Google Maps JavaScript API multiple times"**
- This is fixed in the updated code
- The component now prevents multiple script loading

**Error: "InvalidKeyMapError"**
- Check that your API key is correct
- Ensure the Maps JavaScript API is enabled
- Verify API key restrictions allow your domain

**Error: "Google Maps API Key Required"**
- Add your API key to `.env.local`
- Restart the development server after adding the key

### Report Submission Issues

**Reports not showing on officer dashboard:**
- Check that the backend server is running
- Verify the API endpoints are working
- Check browser console for errors
- Ensure proper authentication tokens

### Common Issues

1. **Maps not loading**: Check API key configuration
2. **Reports not updating**: Refresh the page or check network connectivity
3. **Authentication errors**: Clear browser storage and re-login
4. **Backend connection issues**: Verify server is running on port 5000

## Development Notes

- The application works without Google Maps API key, but map functionality will be disabled
- Reports can still be created with manual coordinate entry
- All other features work independently of the maps integration

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure both frontend and backend are running
4. Check the README.md for detailed documentation
