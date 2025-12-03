# Wishlist Functionality

This document explains the wishlist functionality in the application, including the recent changes and how to use the components.

## Overview

The wishlist functionality allows users to:
- Add courses to their wishlist
- Remove courses from their wishlist
- Toggle courses in/out of their wishlist
- View their wishlist
- Clear their entire wishlist

## Components

### WishlistToggle

A reusable component that displays a heart icon that toggles a course in/out of the wishlist.

#### Usage

```jsx
import WishlistToggle from "@/components/wishList/wishlistToggle";

// Basic usage
<WishlistToggle courseId="123" />

// With custom size
<WishlistToggle courseId="123" size="lg" />

// Without tooltip
<WishlistToggle courseId="123" showTooltip={false} />

// With custom class
<WishlistToggle courseId="123" className="absolute top-2 right-2" />
```

#### Props

- `courseId` (string, required): The ID of the course to toggle in the wishlist
- `size` (string, optional): The size of the heart icon ("sm", "md", "lg"). Default: "md"
- `showTooltip` (boolean, optional): Whether to show a tooltip on hover. Default: true
- `className` (string, optional): Additional CSS classes to apply to the button

### Wishlist

A component that displays the user's wishlist, including all the courses they've added.

#### Usage

```jsx
import Wishlist from "@/components/wishList/wishList";

// Basic usage
<Wishlist />

// With dashboard wishlist data
<Wishlist dashboardWishlists={dashboardWishlists} />
```

#### Props

- `dashboardWishlists` (array, optional): Wishlist data from the dashboard API

## State Management

The wishlist state is managed using the `useWishlistStore` hook, which provides the following:

- `wishlistedCourses`: Array of course IDs in the wishlist
- `wishlistItems`: Array of complete Course objects in the wishlist
- `isLoading`: Boolean indicating if a wishlist operation is in progress
- `error`: Error message if a wishlist operation failed
- `fetchWishlistedCourses`: Function to fetch the user's wishlist
- `isWishlisted`: Function to check if a course is in the wishlist
- `toggleWishlist`: Function to toggle a course in/out of the wishlist
- `removeFromWishlist`: Function to remove a course from the wishlist
- `clearWishlist`: Function to clear the entire wishlist
- `toggleNotification`: Function to toggle notifications for a course in the wishlist

## API Endpoints

The following API endpoints are used for wishlist functionality:

- `GET /api/wishlist`: Get all wishlist items for the authenticated user
- `POST /api/wishlist`: Add a course to the wishlist
- `GET /api/wishlist/{id}`: Get a specific wishlist item
- `PATCH /api/wishlist/{id}`: Update a wishlist item
- `DELETE /api/wishlist/{id}`: Remove a specific wishlist item
- `POST /api/wishlist/toggle`: Toggle a course in the wishlist
- `PATCH /api/wishlist/{id}/notifications`: Toggle notifications for a wishlist item
- `DELETE /api/wishlist`: Clear all items from the wishlist
- `GET /api/wishlist/check/{courseId}`: Check if a course is in the wishlist

## Recent Changes

1. Updated the `removeFromWishlist` function in `useWishlistStore.ts` to use the DELETE endpoint instead of the toggle endpoint.
2. Created a new reusable `WishlistToggle` component that can be used throughout the application to toggle courses in/out of the wishlist.

These changes improve the code organization and make it easier to add wishlist functionality to new parts of the application.