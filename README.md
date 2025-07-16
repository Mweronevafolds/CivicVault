# CivicVault

CivicVault is a secure and simple solution for birth and ID registration, allowing you to manage your important civic documents safely and access them anytime, anywhere. This project is built with Expo and React Native, using file-based routing with Expo Router.

## Project Overview

- The app uses Expo Router for navigation.
- On first launch, users are shown an onboarding flow to introduce the app features.
- After onboarding, users are directed to the authentication flow.
- The onboarding flow consists of a 3-page swiper with images and descriptions.
- The app stores a flag in AsyncStorage (`alreadyLaunched`) to track if onboarding has been completed.
- The obsolete `src/navigation/AppNavigator.js` file should be removed to avoid confusion.

## Getting Started

### Prerequisites

- Node.js and npm installed
- Expo CLI installed globally (`npm install -g expo-cli`)
- A Supabase account and project (see Supabase Setup below)

### Installation

1. Clone the repository and navigate to the project directory.

2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npx expo start
```

You can open the app in:

- Development build
- Android emulator
- iOS simulator
- Expo Go app

### Resetting the Project

To reset the project to a fresh state, run:

```bash
npm run reset-project
```

This moves the starter code to the `app-example` directory and creates a blank `app` directory for development.

## Supabase Setup

This project uses Supabase as the backend for authentication, storage, and database.

### Prerequisites

- A Supabase account: https://supabase.com/
- A Supabase project

### Database Setup

1. Go to your Supabase project dashboard.
2. Navigate to the SQL Editor.
3. Run the SQL migration script located at `supabase/migrations/20230713150000_create_tables.sql`.

### Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Storage Configuration

1. In the Supabase dashboard, go to the Storage section.
2. Verify that a `registrations` bucket exists (created by the migration).
3. Ensure the bucket has the following CORS configuration:
   - Allowed origins: `*` (or your app's domain in production)
   - Allowed methods: GET, POST, PUT, DELETE
   - Allowed headers: *
   - Max age: 3600

### Authentication Providers

1. In Supabase dashboard, go to Authentication > Providers.
2. Enable the "Email" provider.
3. Configure your site URL and redirect URLs in Authentication > URL Configuration:
   - Site URL: Your app's URL (e.g., `http://localhost:19006`)
   - Redirect URLs: Add your app's redirect URLs (e.g., `http://localhost:19006/auth/callback`)

### Email Templates (Optional)

Customize email templates in Authentication > Templates if needed.

### Testing

1. Sign up a new user.
2. Verify receipt of confirmation email.
3. Log in with the new user.
4. Test document submission and file uploads.

## Usage Guide

### Onboarding Flow

- On first launch, the app shows a 3-page onboarding swiper introducing CivicVault features.
- The onboarding screens include welcome messages, security features, and getting started instructions.
- After completing or skipping onboarding, the app sets `alreadyLaunched` in AsyncStorage to prevent showing onboarding again.
- Users are then redirected to the authentication flow.

### Resetting Onboarding for Testing

To test the onboarding screen again, you can clear the flag by running this in your app's console or code:

```js
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.removeItem('alreadyLaunched');
```

### Navigation

- The initial route logic is in `src/app/index.tsx`.
- The onboarding route is in `src/app/onboarding.tsx`.
- The onboarding UI is implemented in `src/screens/OnboardingScreen.js`.

## Important Note

The file `src/navigation/AppNavigator.js` is obsolete with the adoption of Expo Router and should be removed to avoid confusion.

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Supabase documentation](https://supabase.com/docs)

## Join the Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
