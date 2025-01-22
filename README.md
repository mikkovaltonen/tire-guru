# Rengas Guru

A modern tire comparison service that helps users save €50-200 per tire set. Built with React and Firebase.

## Save Money on Tires

![Rengas Guru UI](docs/images/rengas-guru-ui.png)

With Rengas Guru, you can:
- **Save up to €200 per tire set** by comparing prices across all major tire retailers
- **Find the best value** by balancing price with quality metrics (wet grip, noise, fuel efficiency)
- **Make informed decisions** using our smart scoring system that considers your preferences
- **Compare prices instantly** across multiple vendors
- **See all important metrics** in one view (price, ratings, EU labels, noise levels)

Example savings from the screenshot:
- Top rated tire (139 points): €133.72
- Similar tire with lower score: €97.49
- **Potential savings: €36.23 per tire (€145 per set)**

## Features

- Clean, modern landing page design
- Real-time tire product listings from Firebase
- Responsive layout for all devices
- Finnish language interface
- Material-UI components
- Smart scoring system (0-100 points)
- Customizable preferences for:
  - Price importance
  - Wet grip performance
  - Fuel economy
  - Noise levels
  - User satisfaction

## Data Structure

### Tire Products Collection (`tire_products`)

Each document in the collection should have these fields that connect to filters:

```javascript
{
  "width": "205",      // Tire width (e.g., "205", "225")
  "profile": "55",     // Tire profile/height (e.g., "55", "45")
  "diameter": "16",    // Rim diameter (e.g., "16", "17")
  "season": "Summer",  // Season type ("Summer" or "Winter")
  
  // Other product fields
  "brand": "string",   // Tire brand name
  "model": "string",   // Tire model name
  "price": number,     // Price in EUR
  "vendor": "string",  // Vendor name
  "url": "string",     // Product URL
  "fuel_efficiency": "string",  // Fuel efficiency rating
  "noise_level": "string"      // Noise level in dB
}
```

### Filter to Field Mapping

| Filter Name | Firestore Field | Example Values |
|------------|----------------|----------------|
| width      | width          | "205", "225"   |
| profile    | profile        | "55", "45"     |
| diameter   | diameter       | "16", "17"     |
| season     | season         | "Summer", "Winter" |

**Note:** All dimension values (width, profile, diameter) are stored as strings in Firestore to match exactly with the filter values.

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd rengas-guru
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and add your Firebase configuration:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server:
```bash
npm start
```

## Project Structure

- `/src`
  - `/components` - Reusable UI components
    - `RengasGuruLogo.js` - Logo component
    - `TireProductsList.js` - Tire products display component
  - `/config` - Configuration files including Firebase setup
  - `/pages` - Main application pages
    - `Login.js` - Landing page
- `firestore.rules` - Firestore security rules

## Technologies Used

- React
- Material-UI
- Firebase (Firestore)
- CSS-in-JS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment Checklist

1. Ensure all environment variables are set in Vercel:
   - REACT_APP_FIREBASE_API_KEY
   - REACT_APP_FIREBASE_AUTH_DOMAIN
   - REACT_APP_FIREBASE_PROJECT_ID
   - REACT_APP_FIREBASE_STORAGE_BUCKET
   - REACT_APP_FIREBASE_MESSAGING_SENDER_ID
   - REACT_APP_FIREBASE_APP_ID

2. Build command should be:
   ```bash
   npm run build
   ```

3. Output directory should be:
   ```
   build
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

## Troubleshooting Deployment

If changes are not visible:
1. Clear Vercel cache and redeploy
2. Check build logs for errors
3. Verify environment variables
4. Test locally with `npm start`
