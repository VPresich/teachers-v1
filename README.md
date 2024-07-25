The application was developed for a company that provides online language lessons. It consists of a database, an HTTP server with various functions, and a front-end part for a convenient user interface.

Frontend:

The frontend is implemented using React with Redux Toolkit for state management and react-router-dom for routing. The interface adapts to screens from 320px to 1440px using a responsive layout based on the design.

Main Pages:

Home: Highlights company benefits and includes a "Getting Started" link leading to the "Teachers" page.
Teachers: Displays a list of teachers with filters for language, student level, and price.
Favorites: A private page for teachers added to "favorites."
Authorization forms are implemented using react-hook-form and yup. A feature for booking a trial lesson is included.

Authorization:

Users can register, log in (including via Google accounts), retrieve user data, and log out. Certain features are restricted for unauthorized users.

1. Firebase Integration for Authentication:

Registration: Implemented user registration using Firebase Authentication. User information is stored in Firebase Firestore.
Login: Enabled user login via Firebase Authentication, including Google account integration.
Fetching Current User Data: Implemented functionality to retrieve and display current user data.
Logout: Added functionality for user logout.
Deployment:

Frontend: https://teachers-puce.vercel.app/ on Vercel
This application allows users to easily find and interact with online language teachers.

