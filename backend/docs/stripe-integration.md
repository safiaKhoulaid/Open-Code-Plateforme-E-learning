# Stripe Integration for Course Purchases

This document provides instructions on how to integrate Stripe payments for course purchases in the e-learning platform.

## Backend Setup

The backend is already set up with the necessary controllers and routes for Stripe integration. Here's what's been implemented:

1. **Stripe Controller**: `app\Http\Controllers\StripeController.php` handles all Stripe-related functionality, including:
   - Creating checkout sessions
   - Processing successful payments
   - Handling cancelled payments
   - Processing Stripe webhooks

2. **API Routes**: The following routes have been added to `routes\api.php`:
   - `POST /api/courses/{course}/checkout`: Creates a Stripe checkout session for a course purchase
   - `GET /api/stripe/success`: Handles successful payments
   - `GET /api/stripe/cancel`: Handles cancelled payments
   - `POST /api/stripe/webhook`: Processes Stripe webhooks

3. **Configuration**: Stripe API keys are configured in the `.env` file and loaded through `config\stripe.php`.

## Frontend Integration

To integrate Stripe payments in the frontend, follow these steps:

### 1. Import the Stripe Utilities

The `resources\js\stripe.js` file provides utility functions for interacting with the Stripe API. Import these functions in your component:

```javascript
import { redirectToCheckout, isEnrolledInCourse } from '../stripe';
```

### 2. Add a "Buy Course" Button

In your courseExplore component, add a button that will redirect the user to the Stripe checkout page:

```jsx
// Example for a React component
import React, { useState, useEffect } from 'react';
import { redirectToCheckout, isEnrolledInCourse } from '../stripe';

const CourseExplore = ({ courseId }) => {
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already enrolled in the course
    const checkEnrollment = async () => {
      try {
        const isEnrolled = await isEnrolledInCourse(courseId);
        setEnrolled(isEnrolled);
      } catch (error) {
        console.error('Error checking enrollment:', error);
      } finally {
        setLoading(false);
      }
    };

    checkEnrollment();
  }, [courseId]);

  const handlePurchase = async () => {
    try {
      await redirectToCheckout(courseId);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Course details */}
      <div className="course-actions">
        {enrolled ? (
          <button className="btn btn-primary">Suivre le cours</button>
        ) : (
          <button className="btn btn-success" onClick={handlePurchase}>
            Acheter le cours
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseExplore;
```

### 3. Update UI After Successful Payment

After a successful payment, the user will be redirected to the course page with a success message. The backend will automatically enroll the user in the course.

To ensure the UI reflects this change, you can either:

1. Reload the page after redirection
2. Use a state management solution to update the UI based on the enrollment status

## Testing

To test the Stripe integration:

1. Use Stripe test API keys in your `.env` file
2. Use Stripe test cards for payments (e.g., `4242 4242 4242 4242` for successful payments)
3. Check the Stripe dashboard for payment events
4. Verify that users are enrolled in courses after successful payments

## Webhook Setup

For production, you'll need to set up a Stripe webhook to handle asynchronous payment events:

1. Go to the Stripe Dashboard > Developers > Webhooks
2. Add an endpoint with the URL: `https://your-domain.com/api/stripe/webhook`
3. Select the events to listen for (at minimum: `checkout.session.completed` and `charge.refunded`)
4. Get the webhook signing secret and add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

If you encounter issues with the Stripe integration:

1. Check the Laravel logs for error messages
2. Verify that the Stripe API keys are correctly set in the `.env` file
3. Ensure that the user is authenticated before attempting to purchase a course
4. Check the browser console for JavaScript errors
