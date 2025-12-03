# Stripe Integration Documentation

## Overview
This document provides information about the Stripe integration files that have been added to the project. These files implement the frontend functionality for purchasing courses using Stripe Checkout.

## File Locations

### Main Service File
- `resources\js\stripeService.ts` - Contains all the Stripe-related API functions

### Components
- `resources\js\components\course\CourseExplore.tsx` - Course details page with "Buy Course" button

### Pages
- `resources\js\pages\PaymentSuccess.tsx` - Success page after Stripe payment

### Router
- `resources\js\router\index.tsx` - Router configuration including payment success route

### State Management
- `resources\js\stores\authStore.ts` - Authentication store for user state

## Usage
To use the Stripe integration:

1. Import the necessary functions from `stripeService.ts`:
   ```typescript
   import { redirectToCheckout, verifyPayment } from '../stripeService';
   ```

2. Use the `redirectToCheckout` function when a user clicks the "Buy Course" button:
   ```typescript
   const handlePurchase = async () => {
     await redirectToCheckout(courseId);
   };
   ```

3. The payment success page will automatically verify the payment using the `verifyPayment` function.

## Note for Editors
If these files are not visible in your editor, try the following:
- Refresh your file explorer or project view
- Ensure you're looking at the correct project directory
- Check if your editor has any file filters that might be hiding TypeScript files
- If using version control, make sure you've pulled the latest changes
