The application was developed for a company that provides online language lessons. It consists of a database, an HTTP server with various features, and a front-end part for an easy user interface. FireBase is Used as backend.

Front end:

The interface is implemented using React with Redux Toolkit for state management and react-router-dom for routing. The interface adapts to screens from 320 to 1440 pixels using a design-based responsive layout.

Main pages:

Home Page: Highlights the company's benefits and includes a "Getting Started" link that leads to the Teachers page.
Teachers Page: Displays a list of teachers filtered by languages, levels, and price per hour.
Favorites Page: A private user's page for added teachers to Favorites.

Authorization forms are implemented using react-hook-form and yes. The function of booking a trial lesson is included.

Authorization:

Users can register, log in (including through Google accounts), retrieve user data, and log out. Some features are restricted for unauthorized users.

1. Firebase integration for authentication:

Registration: User registration using Firebase authentication has been implemented. User information is stored in Firebase Firestore.
Login: Enabled user login via Firebase authentication, including Google account integration.
Retrieving current user data: functionality has been implemented to obtain and display current user data.
Logout: Added user logout feature.

Deployment:

Page: https://teachers-v1.vercel.app on Vercel.

This app allows users to easily find and interact with online language teachers.

