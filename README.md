# Rengas Guru Landing Page

A modern landing page for Rengas Guru tire comparison service, built with React and Material-UI.

![Rengas Guru Landing Page](./image.png)

## Features

- Clean, modern landing page design
- Real-time tire product listings from Firebase
- Responsive layout for all devices
- Finnish language interface
- Material-UI components

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd rengas-guru-landing
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
- `.env` - Environment variables

## Technologies Used

- React
- Material-UI
- Firebase (Firestore)
- CSS-in-JS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
