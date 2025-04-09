// async function updateWishlistCount() {
//     try {
//         const response = await fetch('/wishlist-count');
//         const data = await response.json();
//         const count = data.count;
//         console.log(count);

//         const wishlistCountElement = document.getElementById('wishlist-count');
//         wishlistCountElement.textContent = count > 0 ? count : ''; // Show count if greater than 0
      
//         wishlistCountElement.style.display = count > 0 ? 'inline-block' : 'none';
       
//   // Use style instead of class toggle
//         console.log(count);
//     } catch (error) {
//         console.error('Error fetching wishlist count:', error);
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     updateWishlistCount(); // Initial count fetch on page load

//     const wishlistForms = document.querySelectorAll('.add-to-wishlist-form'); // Ensure the form has this class

//     wishlistForms.forEach(form => {
//         form.addEventListener('submit', async (event) => {
//             event.preventDefault(); // Prevent default form submission

//             const formData = new FormData(form);

//             try {
//                 const response = await fetch(form.action, {
//                     method: 'POST',
//                     body: formData,
//                 });

//                 if (response.ok) {
//                     updateWishlistCount(); // Update count after successful addition
//                 } else {
//                     const errorData = await response.json();
//                     console.error('Error adding to wishlist:', errorData);
//                     alert('Failed to add to wishlist. Please try again.');
//                 }
//             } catch (error) {
//                 console.error('Error adding to wishlist:', error);
//                 alert('An error occurred. Please try again.');
//             }
//         });
//     });
// });
