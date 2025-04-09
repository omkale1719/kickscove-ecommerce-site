// Quantity increment/decrement functions
function increaseValue() {
    let quantity = document.getElementById('quantity');
    let value = parseInt(quantity.value, 10);
    value = isNaN(value) ? 1 : value;
    value++;
    quantity.value = value;
}

function decreaseValue() {
    let quantity = document.getElementById('quantity');
    let value = parseInt(quantity.value, 10);
    value = isNaN(value) ? 1 : value;
    if (value > 1) {
        value--;
    }
    quantity.value = value;
}

// Snackbar display function
function showSnackbar(message, type = 'info') {
    var snackbar = document.getElementById('snackbar');
    snackbar.innerText = message; 
    snackbar.className = 'show ' + type; 

    // After 3 seconds, remove the "show" class from the snackbar
    setTimeout(function() {
        snackbar.className = snackbar.className.replace('show ' + type, '');
    }, 3000);
}

// Add to cart function
function addToCart() {
    const selectedSizeButton = document.querySelector('.btn-group .btn.active');
    const pincode = document.querySelector('input[name="pincode"]').value;

    // Check if size is selected
    if (!selectedSizeButton) {
        showSnackbar('Please select a size before adding to the cart.', 'warning');
        return;
    }

    // Check if pincode is entered
    if (!pincode) {
        showSnackbar('Please enter your pincode to check delivery.', 'warning');
        return;
    }

    const quantity = document.getElementById('quantity').value;
    const productId = document.getElementById('product-id').value;
    const model = document.getElementById('model').value;
    const selectedSize = selectedSizeButton.getAttribute('data-size');
    const img = document.querySelector('.col-md-6.img-det.text-center img').src;


    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            productId: productId, 
            quantity: quantity, 
            size: selectedSize,  
            pincode: pincode,  
            model: model,
            img :img
        })
    })
    .then(response => response.json())
    
    .then(data => {
        if (data.success) {
            showSnackbar('Added ' + quantity + ' item(s) to the cart', 'success');
        } else {
            showSnackbar('Error adding to cart: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showSnackbar('Something went wrong!', 'error');
    });
}

function buyNow() {
    let quantity = document.getElementById('quantity').value;
    let productId = document.getElementById('product-id').value;
    let model = document.getElementById('model').value;

    // Get selected size
    const selectedSizeButton = document.querySelector('.btn-group .btn.active');
    const selectedSize = selectedSizeButton ? selectedSizeButton.getAttribute('data-size') : null;

    // Get pincode value
    const pincode = document.querySelector('input[name="pincode"]').value;

    // Check if size is selected
    if (!selectedSize) {
        showSnackbar('Please select a size before proceeding.', 'error');
        return;
    }

    // Check if pincode is entered
    if (!pincode) {
        showSnackbar('Please enter your pincode to check delivery.', 'error');
        return;
    }

    fetch('/buy-now', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            productId: productId, 
            quantity: quantity, 
            model: model, 
            size: selectedSize,  // Include the selected size
            pincode: pincode     // Include the pincode
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'http://localhost:3000/buy_now1'; // Redirect to confirmation page
        } else {
            showSnackbar('Error processing order: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showSnackbar('Something went wrong!', 'error');
    });
}

// Check Delivery function
function checkDelivery() {
    let pincode = document.querySelector('input[name="pincode"]').value;
    if (pincode === "") {
        showSnackbar("Please enter a pincode.", 'warning');
        return;
    }

    // Mock check for pincode delivery
    if (pincode > "0") {
        showSnackbar("Delivery available.", 'success');
    } else {
        showSnackbar("Sorry, delivery is not available at this location.", 'error');
    }
}

// Attach click event listeners to size buttons once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-group .btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
            
            // Add 'active' class to the clicked button
            this.classList.add('active');
        });
    });
});



 // JavaScript function to toggle the menu on button click
 function toggleMenu() {
    const menu = document.getElementById('navbarMain');
    menu.classList.toggle('show'); 
  }

  // Prevent Bootstrap's default behavior of auto-expanding the navbar on resize
  window.addEventListener('resize', function () {
    const menu = document.getElementById('navbarMain');
    if (window.innerWidth > 991) {
      menu.classList.add('show'); 
    } else {
      menu.classList.remove('show'); 
    }
  });




// Select all heart buttons and icons
const heartButtons = document.querySelectorAll('.heartBtn');
        
heartButtons.forEach((heartBtn) => {
  heartBtn.addEventListener('click', function(event) {
  //  alert("product added in wishlist");
//   showSnackbar("ghdx jhexjkrxcnhcbx", 'success');

    const heartIcon = this.querySelector('.heartIcon'); // Get the icon inside the clicked button

    // Toggle between regular (outline) and solid heart
    if (heartIcon.classList.contains('fa-regular')) {
      heartIcon.classList.remove('fa-regular');
      heartIcon.classList.add('fa-solid');
    } else {
      heartIcon.classList.remove('fa-solid');
      heartIcon.classList.add('fa-regular');
    }
  });
});








 async  function updateWishlistCount(){
    try{
const response= await fetch("/added_in_wishlist");
   const data= await response.json();
   const wishlistCount=data.wishlistCount;

   const wishlistBadge=document.getElementById("wishlist-count");

   if(wishlistCount>0){
    wishlistBadge.textContent=wishlistCount;
    wishlistBadge.style.display="inline-block";
   }
   else{
    wishlistBadge.style.display="none";
   }
    }

    catch(error){
        console.error(error);

    }
   

  }

document.addEventListener("DOMContentLoaded",updateWishlistCount);


async function updateCartCount(){
    try{
    const response=await fetch("/added_to_cart");
    const data=await response.json();
    const cartCount=data.cartCount;

    const cartBadge=document.getElementById("cart-count");
    
if(cartCount>0){
    cartBadge.textContent=cartCount;
    cartBadge.style.display="inline-block";
}
else{
    cartBadge.style.display="none";
}
    }
    catch(error){
        console.error(error);
    }

}

document.addEventListener("DOMContentLoaded",updateCartCount);






