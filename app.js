// Importing essential modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listing.js");
const Sale = require("./model/sale.js");
const New_A = require("./model/na.js");
const Men = require("./model/men.js");
const Women = require("./model/women.js");
const Collections = require("./model/collections.js");
const Kids = require("./model/kids.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const Wishlist = require("./model/wishlist.js");
const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./model/user.js");
const { saveRedirectUrl } = require("./middleware.js");
const flash = require("express-flash");
const multer = require("multer");
const fs = require("fs");
const methodOverride = require("method-override");




// Setting up EJS as the view engine and configuring view file paths
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

// Parsing incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(methodOverride("_method"));

// Session management setup to handle user sessions, cookies, etc.
app.use(session({
  secret: "your_secret_key",  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  
}));


app.use(passport.initialize());
app.use(passport.session());

// Global Variables Middleware
app.use((req, res, next) => {
  console.log("Current User:", req.user);  
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user || null;
  res.locals.Admin = "admin@123" || null;
  next();
});



passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  user.findById(id, (err, user) => {
    if (err) return done(err);
    console.log("Deserialized User:", user);  
    done(null, user);
  });
});



// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


// Connect to MongoDB database
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/shoes_palace");
    // await mongoose.connect("mongodb+srv://omkale0107:KpQXxecPPRt7WAin@cluster0.9e6ps.mongodb.net/shoes_palace?retryWrites=true&w=majority")
    console.log("Connected To Database...");
  } catch (err) {
    console.log("Connection error", err);
  }
}
main();

// Routes to render different product listings and detail pages




// Signup Route
app.get("/signup", async (req, res) => {
  res.render("User/signup_form.ejs", {
  });
});




// User Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user object
    const newUser = new user({ email, username });

    // Register the new user with a password
    const registeredUser = await user.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Signup successful! Welcome to our website.");
      res.redirect("/");
    });
  } catch (e) {
    // Handle specific errors, such as user already existing
    if (e.name === "UserExistsError") {
      req.flash(
        "error",
        "User already exists. Please try a different username."
      );
      console.log("Error IS occured")
    } else {
      req.flash("error", "Something went wrong. Please try again.");
      console.log("Error Found")
    }

    res.redirect("/signup");
  }
});

// Login Routes
app.get("/login", async (req, res) => {
  res.render("User/login_form.ejs", {
    
  });
});

app.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password.",
  }),
  async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/";
    delete res.locals.redirectUrl;

    req.flash("success", "Login successful! Welcome back.");
    res.redirect(redirectUrl);
  }
);

// Logout Route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    req.session.destroy(() => res.redirect("/"));
  });
});








// Show all listings
app.get("/", async (req, res) => {
  console.log( req.curruser)
  const allListing = await Listing.find({});
  res.render("./listings/showall.ejs", { allListing });
});

// Show details for individual listing
app.get("/showdetail/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/showdetail.ejs", { listing });
});

// Show all sale items
app.get("/salepage", async (req, res) => {
  const allListing = await Sale.find({});
  res.render("./listings/sale_showall.ejs", { allListing });
});

// Show details for individual sale item
app.get("/sale_showdetail/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Sale.findById(id);
  res.render("./listings/sale_showdetail.ejs", { listing });
});

// Routes for other product categories (arrival, men, women, kids, collections)
app.get("/arivalpage", async (req, res) => {
  const allListing = await New_A.find({});
  res.render("./listings/new_A_showall.ejs", { allListing });
});
app.get("/new_A_showdetail/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await New_A.findById(id);
  res.render("./listings/new_A_showdetail.ejs", { listing });
});
app.get("/men", async (req, res) => {
  const allListing = await Men.find({});
  res.render("./listings/men.ejs", { allListing });
});
app.get("/men_d/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Men.findById(id);
  res.render("./listings/men_d.ejs", { listing });
});
app.get("/women", async (req, res) => {
  const allListing = await Women.find({});
  res.render("./listings/women.ejs", { allListing });
});
app.get("/women_d/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Women.findById(id);
  res.render("./listings/women_d.ejs", { listing });
});
app.get("/kids", async (req, res) => {
  const allListing = await Kids.find({});
  res.render("./listings/kids.ejs", { allListing });
});
app.get("/kids_d/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Kids.findById(id);
  res.render("./listings/kids_d.ejs", { listing });
});
app.get("/collections", async (req, res) => {
  const allListing = await Collections.find({});
  res.render("./listings/collections.ejs", { allListing });
});
app.get("/collections_d/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Collections.findById(id);
  res.render("./listings/collections_d.ejs", { listing });
});

// Mapping of models for easier retrieval by category
const models = { Sale, Listing, New_A, Men, Women, Kids, Collections };

// Helper function to fetch product by model name and ID
async function getProductById(productModel, productId) {
  try {
    const model = models[productModel];
    if (!model) return null;
    return await model.findById(productId);
  } catch (error) {
    console.error(`Error fetching product by ID: ${error.message}`);
    return null;
  }
}

// Cart management routes

// Add product to cart
app.post("/add-to-cart", async (req, res) => {
  const { productId, quantity, model, img, size } = req.body;
  
  try {
    // console.log("image: ",img,"size:",size);
    const product = await getProductById(model, productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      img: img,
      quantity: quantity,
    });
    req.session.cartCount=req.session.cart.length;
    console.log("cart count ", req.session.cartCount);
    console.log("Cart:", req.session.cart);
    return res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.json({ success: false, message: "Error adding to cart" });
  }
});



app.post("/delete-from-cart", (req, res) => {
  const { productId } = req.body;

  if (!req.session.cart) {
    return res.json({ success: false, message: "Cart is empty" });
  }

  // Filter out the item to be deleted
  req.session.cart = req.session.cart.filter(item => item.productId != productId);

  // Update cart count
  req.session.cartCount = req.session.cart.length;

  
    res.redirect("/cart");
    req.flash("success", "Item Was Deleted!");
});


app.get("/checkoutAll", (req, res) => {
  const cart = req.session.cart || []; // assuming cart is in session
  res.render('checkout-all', { cart });
});
app.get("/confirm-order", (req, res) => {
  const cart = req.session.cart || []; // assuming cart is in session
  res.render("buy_now.ejs");
});

// Render the cart page
app.get("/cart", (req, res) => {
  res.render("cart", { cart: req.session.cart || [] });
});

// Purchase management routes

// Buy Now functionality (single product purchase)
app.post("/buy-now", async (req, res) => {
  const { productId, quantity, model } = req.body;
  try {
    const product = await getProductById(model, productId);
    if (!product) {
      return res.render("order_sucess.ejs", { message: "Product not found" });
    }
    req.session.order = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: quantity,
    };
    res.json({ success: true });
  } catch (error) {
    console.error("Error processing buy now:", error);
    res.json({ success: false, message: "Error processing order" });
  }
});

// Render the buy now page
app.get("/buy_now1", (req, res) => {
  const buy = req.session.order || [];
  res.render("buy_now.ejs", { buy });
});

// Wishlist management routes

// Add product to wishlist
app.post("/add-to-wishlist", async (req, res) => {
  const { productId, model } = req.body;
  if (!productId || !model) {
    return res.status(400).json({ error: "Product ID or model not provided" });
  }
  try {
    const product = await getProductById(model, productId);
    if (!product) {
      return res.status(500).json({ error: "Product not found" });
    }
    if (!req.session.wishlist) {
      req.session.wishlist = [];
    }
    req.session.wishlist.push(product._id);
    req.session.wishlistCount=req.session.wishlist.length ;
    // console.log("wishlist count",req.session.wishlistCount);
    res.redirect(req.get("referer"));
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ error: "Error adding to wishlist" });
  }
});

// Render the wishlist page
app.get("/wishlist", async (req, res) => {
  if (!req.session.wishlist || req.session.wishlist.length === 0) {
    return res.redirect("/Empty_wishlis");
  }
  try {
    const wishlistProducts = [];
    for (let productId of req.session.wishlist) {
      const product =
        (await Listing.findById(productId)) ||
        (await Sale.findById(productId)) ||
        (await New_A.findById(productId)) ||
        (await Men.findById(productId)) ||
        (await Women.findById(productId)) ||
        (await Collections.findById(productId)) ||
        (await Kids.findById(productId));
      if (product) {
        wishlistProducts.push(product);
      }
    }
    res.render("wishlist.ejs", { wishlist: wishlistProducts });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

// Render empty wishlist page
app.get("/Empty_wishlis", (req, res) => {
  res.render("Empty_wishlist.ejs");
});












// Remove a product from wishlist
app.post("/remove-from-wishlist", async (req, res) => {
  const { productId } = req.body;
  try {
    if (!req.session.wishlist) {
      return res.redirect("/wishlist");
    }
    req.session.wishlist = req.session.wishlist.filter((id) => id !== productId);
    req.session.wishlistCount=req.session.wishlist.length ;
    // console.log("Remove wishlist count",req.session.wishlistCount);
    res.redirect("/wishlist");
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.redirect("/wishlist");
  }
});

// Footer links pages (Privacy, Terms, etc.)
app.get("/privacy", (req, res) => {
  res.render("./footer_links/privacy.ejs");
});
app.get("/terms", (req, res) => {
  res.render("./footer_links/term.ejs");
});
app.get("/track_orders", (req, res) => {
  res.render("track_order.ejs");
});
app.get("/Contact_Us", (req, res) => {
  res.render("./footer_links/contact.ejs");
});


app.get("/added_in_wishlist",(req,res)=>{
  const wishlistCount=req.session.wishlistCount || 0;
 res.json({wishlistCount});
})

app.get("/added_to_cart",(req,res)=>{
  const cartCount=req.session.cartCount || 0;
  res.json({cartCount});
})





// Admin Panel Routes

// Route to render the form for adding a new listing
app.get("/listings/new", (req, res) => {
  res.render("Admin/new_listing.ejs", {
   
  });
});

// Route to handle new listing creation with file upload
const upload = multer({ storage });
app.post("/listings/new", upload.single("listing[image]"), async (req, res) => {
  console.log(req.body.listing);
  const { title, description, price, Rprice, category } = req.body.listing;
  const Model = models[category];

  if (!Model) {
    return res.status(400).send("Invalid category");
  }

  try {
    const newListing = new Model({
      title,
      description,
      price,
      Rprice,
      image: req.file ? "/uploads/" + req.file.filename : null, // Save the uploaded image path
    });
    console.log(req.file);

    await newListing.save();
    req.flash("success", "New Listing Is Creted!");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to create listing: " + error.message);
  }
});

// Route to render the form for editing a listing
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;


  try {
    const listing = await Men.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    res.render("Admin/edit_listing.ejs", {
      listing,
    });
  } catch (error) {
    res.status(500).send("Failed to load edit form: " + error.message);
  }
});

app.post(
  "/listings/:id/",
  upload.single("listing[image]"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, price,Rprice } = req.body.listing;
   

    try {
      const updatedData = {
        title,
        description,
        price,
        Rprice
      };

      // Add new image if uploaded
      if (req.file) {
        updatedData.image = "/uploads/" + req.file.filename;
      }

      // Update the database
      const updatedListing = await Men.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      req.flash("success", "Successfully Reacord Updated!");
      res.redirect(`/`);
    } catch (error) {
      res.status(500).send("Failed to update listing: " + error.message);
    }
  }
);

// Route to handle deleting a listing
app.delete("/listings/:id/del", async (req, res) => {
  const { id } = req.params;
 console.log(id)

  try {
    const deletedListing = await Men.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }

    // const imagePath = path.join(__dirname, deletedListing.image);
    // if (fs.existsSync(imagePath)) {
    //   fs.unlinkSync(imagePath);
    // }
    req.flash("success", "Reacord is deleted!");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to delete listing: " + error.message);
  }
});






//admin pannel for sale

// Route to render the form for editing a listing
app.get("/listings/:id/edit2", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Sale.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("Admin/edit2.ejs", {
      listing,
    });
  } catch (error) {
    res.status(500).send("Failed to load edit form: " + error.message);
  }
});

app.post(
  "/listings/:id/2",
  upload.single("listing[image]"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, price,Rprice } = req.body.listing;
    try {
      const updatedData = {
        title,
        description,
        price,
        Rprice
      };

      // Add new image if uploaded
      if (req.file) {
        updatedData.image = "/uploads/" + req.file.filename;
      }
      // Update the database
      const updatedListing = await Sale.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      req.flash("success", "Successfully Reacord Updated!");
      res.redirect(`/`);
    } catch (error) {
      res.status(500).send("Failed to update listing: " + error.message);
    }
  }
);

// Route to handle deleting a listing
app.delete("/listings/:id/del2", async (req, res) => {
  const { id } = req.params;
 console.log(id)
  try {
    const deletedListing = await Sale.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("success", "Reacord is deleted!");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to delete listing: " + error.message);
  }
});



//admin pannel for kids

// Route to render the form for editing a listing
app.get("/listings/:id/edit3", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Kids.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("Admin/edit3.ejs", {
      listing,
    });
  } catch (error) {
    res.status(500).send("Failed to load edit form: " + error.message);
  }
});

app.post(
  "/listings/:id/3",
  upload.single("listing[image]"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, price,Rprice } = req.body.listing;
    try {
      const updatedData = {
        title,
        description,
        price,
        Rprice
      };

      // Add new image if uploaded
      if (req.file) {
        updatedData.image = "/uploads/" + req.file.filename;
      }
      // Update the database
      const updatedListing = await Kids.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      req.flash("success", "Successfully Reacord Updated!");
      res.redirect(`/`);
    } catch (error) {
      res.status(500).send("Failed to update listing: " + error.message);
    }
  }
);

// Route to handle deleting a listing
app.delete("/listings/:id/del3", async (req, res) => {
  const { id } = req.params;
 console.log(id)
  try {
    const deletedListing = await Kids.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("success", "Reacord is deleted!");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to delete listing: " + error.message);
  }
});





//admin pannel for Women

// Route to render the form for editing a listing
app.get("/listings/:id/edit4", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Women.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("Admin/edit4.ejs", {
      listing,
    });
  } catch (error) {
    res.status(500).send("Failed to load edit form: " + error.message);
  }
});

app.post(
  "/listings/:id/4",
  upload.single("listing[image]"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, price,Rprice } = req.body.listing;
    try {
      const updatedData = {
        title,
        description,
        price,
        Rprice
      };

      // Add new image if uploaded
      if (req.file) {
        updatedData.image = "/uploads/" + req.file.filename;
      }
      // Update the database
      const updatedListing = await Women.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      req.flash("success", "Successfully Reacord Updated!");
      res.redirect(`/`);
    } catch (error) {
      res.status(500).send("Failed to update listing: " + error.message);
    }
  }
);

// Route to handle deleting a listing
app.delete("/listings/:id/del4", async (req, res) => {
  const { id } = req.params;
 console.log(id)
  try {
    const deletedListing = await Women.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("success", "Reacord is deleted!");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to delete listing: " + error.message);
  }
});





//admin pannel for New_A

// Route to render the form for editing a listing
app.get("/listings/:id/edit5", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await New_A.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("Admin/edit5.ejs", {
      listing,
    });
  } catch (error) {
    res.status(500).send("Failed to load edit form: " + error.message);
  }
});

app.post(
  "/listings/:id/5",
  upload.single("listing[image]"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, price,Rprice } = req.body.listing;
    try {
      const updatedData = {
        title,
        description,
        price,
        Rprice
      };

      // Add new image if uploaded
      if (req.file) {
        updatedData.image = "/uploads/" + req.file.filename;
      }
      // Update the database
      const updatedListing = await New_A.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      req.flash("success", "Successfully Reacord Updated!");
      res.redirect(`/`);
    } catch (error) {
      res.status(500).send("Failed to update listing: " + error.message);
    }
  }
);

// Route to handle deleting a listing
app.delete("/listings/:id/del5", async (req, res) => {
  const { id } = req.params;
 console.log(id)
  try {
    const deletedListing = await New_A.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("success", "Reacord is deleted!");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to delete listing: " + error.message);
  }
});





//admin pannel for Listing

// Route to render the form for editing a listing
app.get("/listings/:id/edit6", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("Admin/edit6.ejs", {
      listing,
    });
  } catch (error) {
    res.status(500).send("Failed to load edit form: " + error.message);
  }
});

app.post(
  "/listings/:id/6",
  upload.single("listing[image]"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, price,Rprice } = req.body.listing;
    try {
      const updatedData = {
        title,
        description,
        price,
        Rprice
      };

      // Add new image if uploaded
      if (req.file) {
        updatedData.image = "/uploads/" + req.file.filename;
      }
      // Update the database
      const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      req.flash("success", "Successfully Reacord Updated!");
      res.redirect(`/`);
    } catch (error) {
      res.status(500).send("Failed to update listing: " + error.message);
    }
  }
);

// Route to handle deleting a listing
app.delete("/listings/:id/del6", async (req, res) => {
  const { id } = req.params;
 console.log(id)
  try {
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("success", "Reacord is deleted!");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to delete listing: " + error.message);
  }
});





//admin pannel for Collection

// Route to render the form for editing a listing
app.get("/listings/:id/edit7", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Collections.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("Admin/edit7.ejs", {
      listing,
    });
  } catch (error) {
    res.status(500).send("Failed to load edit form: " + error.message);
  }
});

app.post(
  "/listings/:id/7",
  upload.single("listing[image]"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, price,Rprice } = req.body.listing;
    try {
      const updatedData = {
        title,
        description,
        price,
        Rprice
      };

      // Add new image if uploaded
      if (req.file) {
        updatedData.image = "/uploads/" + req.file.filename;
      }
      // Update the database
      const updatedListing = await Collections.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedListing) {
        return res.status(404).send("Listing not found");
      }
      req.flash("success", "Successfully Reacord Updated!");
      res.redirect(`/`);
    } catch (error) {
      res.status(500).send("Failed to update listing: " + error.message);
    }
  }
);

// Route to handle deleting a listing
app.delete("/listings/:id/del7", async (req, res) => {
  const { id } = req.params;
 console.log(id)
  try {
    const deletedListing = await Collections.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("success", "Reacord is deleted!");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to delete listing: " + error.message);
  }
});





// Start server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
