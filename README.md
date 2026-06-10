# BeautyBag

BeautyBag is a modern e-commerce storefront for beauty and hair-care products, built with React, TypeScript and Vite.

## Features

- **Product catalog** with category pages, search, sorting and filtering (price range, rating)
- **Cart & Wishlist** with persistent state via Redux Toolkit
- **Authentication** (sign up, log in, logout) powered by Firebase Auth, with protected routes (account, cart, checkout)
- **Checkout flow** with order summary and order success page
- **Light / dark theme** toggle with system preference detection and persistence
- **Internationalization** — English and Ukrainian, switchable at runtime (react-i18next)
- **Responsive UI** — dedicated mobile navigation menu
- **Animations** powered by Framer Motion
- **Promotions & Delivery info** pages

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for development and bundling
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [React Router](https://reactrouter.com/) for routing
- [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- [react-i18next](https://react.i18next.com/) for localization
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for form validation
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Swiper](https://swiperjs.com/) for carousels

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project (for authentication and data storage)

### Installation

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Available Scripts

```bash
npm run dev       # start the development server
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Project Structure

```
src/
├── assets/        # icons and static images
├── components/    # reusable UI components (Header, Footer, Form, Banner, Products, ...)
├── context/       # React contexts (Auth, Theme)
├── hooks/         # shared custom hooks
├── locales/       # i18n translation files (en, uk)
├── pages/         # route-level pages (Home, Cart, Checkout, Account, ...)
├── routes/        # error/route handling
├── store/         # Redux store and feature slices
└── HOC/           # higher-order components (e.g. AuthGuard)
```

## License

This project is for educational/portfolio purposes.
