# Desk Booking System Guide

## Overview

This is a comprehensive desk booking system inspired by Condeco/Eptura Engage, featuring an interactive floor plan where users can view and book available desks.

## Features

### User Features
- **Interactive Floor Plan**: View the office layout with an overlay of available desks
- **Real-time Availability**: See desk status at a glance with color-coded markers
- **Popup Information**: Hover over any desk to see details (name, floor, status, amenities)
- **Easy Booking**: Click on any available desk to book it
- **Date Selection**: Choose your booking date
- **Zoom & Pan**: Navigate the floor plan with zoom controls and drag to pan
- **Filters**: Filter desks by amenities (Monitor, Standing Desk, etc.)

### Admin Features
- **Admin Mode**: Toggle admin mode to manage desk layouts
- **Place Desks**: Click on the map to place new desk markers
- **Drag & Reposition**: Drag existing desks to adjust their positions
- **Edit Desk Details**: Configure desk name, floor, status, and attributes
- **Delete Desks**: Remove desks from the layout
- **Export/Import**: Save and restore desk layouts as JSON files

## Getting Started

### Running the Application

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - Homepage: http://localhost:3000
   - Booking page: http://localhost:3000/booking

## Using the Booking Page

### For Regular Users

1. **Select a Date**: Choose your desired booking date from the date picker in the left sidebar

2. **Browse Available Desks**: 
   - Green markers = Available desks
   - Blue markers = Your bookings
   - Gray markers = Colleague bookings
   - Orange markers = Team member bookings

3. **View Desk Details**: Hover over any desk marker to see a popup with:
   - Desk name
   - Floor number
   - Current status
   - Available amenities

4. **Book a Desk**:
   - Click on any green (available) desk marker
   - A booking modal will appear
   - Enter your name
   - Confirm the date
   - Click "Book Desk"

5. **Navigate the Floor Plan**:
   - Use the + and − buttons to zoom in/out
   - Drag the floor plan to pan around
   - Use the ↺ button to reset the view
   - Scroll with mouse wheel to zoom

### For Administrators

1. **Enter Admin Mode**: Click the "🔓 Enter Admin Mode" button in the right sidebar

2. **Add New Desks**:
   - Fill in the desk details in the form:
     - Desk Name (e.g., "04.069")
     - Floor number
     - Status (available, booked, closed, etc.)
     - Attributes (comma-separated, e.g., "Monitor, Standing Desk")
   - Click "Add Desk"
   - Click anywhere on the floor plan to place the new desk

3. **Reposition Desks**:
   - In admin mode, click and drag any desk marker to move it
   - Release to place it in the new position

4. **Delete Desks**:
   - Click on a desk to select it
   - The desk details will appear in the right sidebar
   - Click "Delete Desk" to remove it

5. **Export Desk Layout**:
   - Click "📥 Export Desks (JSON)"
   - A JSON file will be downloaded with all desk configurations
   - Save this file as a backup or to share with others

6. **Import Desk Layout**:
   - Click "📤 Import Desks (JSON)"
   - Paste the JSON data into the text area
   - Click "Import" to load the layout

7. **Exit Admin Mode**: Click the "🔒 Exit Admin Mode" button when done

## Desk Status Types

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| Available | Green | ● | Desk is free to book |
| Booked | Blue | ● | You have booked this desk |
| Colleague | Gray | 😊 | Booked by a colleague |
| Team Member | Orange | 👥 | Booked by a team member |
| Closed | Dark Gray | ⊘ | Desk is not available |
| Awaiting Cleaning | Purple | 🧹 | Desk needs cleaning |
| Hidden | Light Gray | ● | Desk is hidden from view |
| Fixed Space | Red | 📌 | Permanently assigned desk |

## Data Persistence

- Desk layouts are automatically saved to browser localStorage
- Bookings persist across page refreshes
- Export your layout to JSON for backup or sharing

## Customization

### Adding Custom Amenities

Edit the filters section in `/frontend/src/app/booking/page.tsx`:

```typescript
<label className="flex items-center">
  <input type="checkbox" className="mr-2" />
  <span className="text-sm">Your Custom Amenity</span>
</label>
```

### Changing the Floor Plan Image

Replace the image at `/frontend/public/MC_Etaj 4_Plan Compartimentare_11.09.2025-1.png` with your own floor plan, or update the image path in the booking page:

```typescript
floorPlanImage="/your-floor-plan.png"
```

### Modifying Initial Desk Data

Edit the `INITIAL_DESKS` array in `/frontend/src/app/booking/page.tsx` to set up your default desk layout.

## Technical Details

### File Structure

```
frontend/src/
├── app/
│   ├── booking/
│   │   └── page.tsx          # Main booking page
│   ├── layout.tsx
│   └── page.tsx               # Homepage
├── components/
│   ├── AdminPanel.tsx         # Admin controls
│   ├── BookingModal.tsx       # Booking popup
│   ├── DeskMarker.tsx         # Individual desk marker
│   └── FloorPlanMap.tsx       # Interactive map component
└── types/
    └── desk.ts                # TypeScript interfaces
```

### Key Components

- **FloorPlanMap**: Main interactive map with zoom, pan, and drag functionality
- **DeskMarker**: Individual desk visualization with hover popups
- **BookingModal**: Booking confirmation dialog
- **AdminPanel**: Administrative controls for managing desks

## Troubleshooting

### Floor plan not showing
- Check that the image file exists at `/frontend/public/MC_Etaj 4_Plan Compartimentare_11.09.2025-1.png`
- Verify the image path in the booking page is correct

### Desks not saving
- Check browser console for localStorage errors
- Try exporting desks and re-importing if data is corrupted

### Admin mode not working
- Ensure you've clicked the "Enter Admin Mode" button
- Check that you're clicking directly on the map (not on other UI elements)

## Future Enhancements

Potential features to add:
- Backend integration for persistent storage
- User authentication and authorization
- Real-time booking updates
- Email notifications
- Booking history and analytics
- Multi-floor support with floor selector
- Mobile-responsive design
- Accessibility improvements

## Support

For issues or questions, please refer to the project documentation or contact your system administrator.

