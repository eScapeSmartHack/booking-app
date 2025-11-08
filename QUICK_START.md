# Quick Start Guide - Desk Booking System

## 🚀 Get Started in 3 Steps

### 1. Start the Development Server

```bash
cd frontend
npm run dev
```

### 2. Open the Booking Page

Navigate to: **http://localhost:3000/booking**

### 3. Start Booking!

- **View desks**: Hover over any marker to see details
- **Book a desk**: Click on a green (available) desk marker
- **Navigate**: Use zoom buttons or drag to explore the floor plan

## 🎯 Quick Tips

### For Regular Users
- **Green dots** = Available desks (click to book)
- **Blue dots** = Your bookings
- Hover over any desk to see details in a popup
- Use the date picker to select your booking date

### For Administrators
1. Click **"🔓 Enter Admin Mode"** in the right sidebar
2. Fill in desk details and click **"Add Desk"**
3. Click anywhere on the map to place the new desk
4. Drag existing desks to reposition them
5. Click **"📥 Export Desks"** to save your layout

## 📋 What's Included

✅ Interactive floor plan with zoom & pan  
✅ Hover popups showing desk details  
✅ Booking modal for desk reservations  
✅ Admin panel for placing and managing desk points  
✅ Drag-and-drop desk repositioning  
✅ Export/Import desk layouts (JSON)  
✅ Color-coded desk status indicators  
✅ Local storage persistence  
✅ Responsive design with **Material UI**  
✅ Accessible components with ARIA support  

## 🎨 Key Features

### User Mode
- Browse available desks on the floor plan
- View desk details on hover (name, floor, status, amenities)
- Book desks with a simple click
- Filter by amenities
- Track your bookings

### Admin Mode
- Place new desk markers by clicking on the map
- Drag existing desks to reposition them
- Edit desk properties (name, status, attributes)
- Delete desks
- Export layouts to JSON files
- Import layouts from JSON files

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── booking/
│   │   │   └── page.tsx       ← Main booking page
│   │   ├── layout.tsx
│   │   └── page.tsx           ← Homepage with link to booking
│   ├── components/
│   │   ├── AdminPanel.tsx     ← Admin controls
│   │   ├── BookingModal.tsx   ← Booking dialog
│   │   ├── DeskMarker.tsx     ← Individual desk marker
│   │   └── FloorPlanMap.tsx   ← Interactive map
│   └── types/
│       └── desk.ts            ← TypeScript types
└── public/
    └── MC_Etaj 4_Plan Compartimentare_11.09.2025-1.png  ← Floor plan image
```

## 🔧 Customization

### Change Floor Plan Image
Replace the image in `/frontend/public/` or update the path in `booking/page.tsx`:
```typescript
floorPlanImage="/your-floor-plan.png"
```

### Modify Initial Desks
Edit the `INITIAL_DESKS` array in `booking/page.tsx` to set your default layout.

### Add Custom Filters
Add new amenity filters in the left sidebar section of `booking/page.tsx`.

## 🎨 Desk Status Colors

| Color | Status | Description |
|-------|--------|-------------|
| 🟢 Green | Available | Ready to book |
| 🔵 Blue | Booked | Your booking |
| ⚫ Gray | Colleague | Booked by colleague |
| 🟠 Orange | Team Member | Team member booking |
| ⚫ Dark Gray | Closed | Not available |
| 🟣 Purple | Cleaning | Awaiting cleaning |
| 🔴 Red | Fixed | Permanently assigned |

## 📚 Full Documentation

For detailed information, see [DESK_BOOKING_GUIDE.md](DESK_BOOKING_GUIDE.md)

## 🎨 UI Library

This application uses **Material UI (MUI)** - a comprehensive React component library with:
- Beautiful, modern design
- Full TypeScript support
- Accessibility built-in
- Customizable theming
- Responsive components

See `MATERIAL_UI_MIGRATION.md` for details on the Material UI implementation.

## 🐛 Troubleshooting

**Floor plan not showing?**
- Check that the image file exists in `/frontend/public/`
- Verify the image path is correct

**Desks not appearing?**
- Open browser console to check for errors
- Try clearing localStorage and refreshing

**Admin mode not working?**
- Make sure you clicked "Enter Admin Mode"
- Ensure you're clicking on the map, not other elements

## 🎉 You're All Set!

Your desk booking system is ready to use. Visit **http://localhost:3000/booking** to get started!

