// Replace the existing Button with WishlistToggle in courseExplore.tsx

// First, update the imports at the top:
import WishlistToggle from "@/components/wishList/wishlistToggle";

// Then replace the existing heart button (in the course card) with this:
<WishlistToggle courseId={course.id} size="sm" showTooltip={false} />