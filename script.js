const initialProducts = [
  {
    id: 1,
    brand: "baggy",
    name: "UC Men's Fleece Sweatpants",
    price: "15000",
    img: "images/pant2.webp",
  },
  {
    id: 2,
    brand: "baggy",
    name: "Anime Death Note shorts",
    price: "2240",
    img: "images/deathshort.png",
  },
  {
    id: 3,
    brand: "adidas",
    name: "Astronout t-Shirt",
    price: "2800",
    img: "images/p1.jpg",
  },
  {
    id: 4,
    brand: "adidas",
    name: "Summer Shorts",
    price: "1400",
    img: "images/p6.jpg",
  },
  {
    id: 5,
    brand: "polo",
    name: "Polo t-Shirt",
    price: "5040",
    img: "images/polo.png",
  },
  {
    id: 6,
    brand: "MeowMuse",
    name: "Whisker Charm Top",
    price: "2800",
    img: "images/p8.jpg",
  },
  {
    id: 7,
    brand: "Zeenat Wear",
    name: "Zehra Set",
    price: "5600",
    img: "images/zeenat.png",
  },
  {
    id: 8,
    brand: "Noore`",
    name: "Noore` Olive Grace",
    price: "5600",
    img: "images/noore.png",
  },
  {
    id: 9,
    brand: "baggy",
    name: "Men's Slim Fit Premium Chino Pants",
    price: "2240",
    img: "images/pant1.webp",
  },
  {
    id: 10,
    brand: "baggy",
    name: "baggy shirt with deathnote print",
    price: "2800",
    img: "images/deathshirt.png",
  },
  {
    id: 11,
    brand: "adidas",
    name: "Polo Republica Men's Essentials Knitted Casual Shirt",
    price: "4200",
    img: "images/shirt1.webp",
  },
  {
    id: 12,
    brand: "adidas",
    name: "ABS Men's Short Sleeves Polo Shirt",
    price: "1680",
    img: "images/shirt2.webp",
  },
  {
    id: 13,
    brand: "polo",
    name: "Eternity Men's Classic Fit Button Down Casual Shirt",
    price: "2800",
    img: "images/shirt4.webp",
  },
  {
    id: 14,
    brand: "MeowMuse",
    name: "East West Women's Dual Pocket Casual Shirt",
    price: "2800",
    img: "images/shirt5.webp",
  },
  {
    id: 15,
    brand: "Zeenat Wear",
    name: "Junior Republic Boy's Tom & Jerry Crew Neck Tee Shirt",
    price: "3360",
    img: "images/shirt6.webp",
  },
  {
    id: 16,
    brand: "Noore`",
    name: "Polo Republica Men's Essential Crew Neck Tee Shirt",
    price: "3360",
    img: "images/image3.webp",
  }, {
    id: 17,
    brand: "Noore`",
    name: "Men's Essential Crew Neck T-Shirt",
    price: "3360",
    img: "https://i.pinimg.com/564x/6a/7b/1e/6a7b1e3f4c9f2a1d8e7c9a4b5d6e7f8.jpg"
  },
  {
    id: 18,
    brand: "Noore`",
    name: "Men's Casual Summer Kurta",
    price: "4950",
    img: "https://i.pinimg.com/564x/9b/7c/1e/9b7c1e3a8d4f2c5a6b0.jpg"
  }
];

// Load from local storage or set initial
let products = JSON.parse(localStorage.getItem("hm_products_v2"));
if (!products || products.length === 0) {
  products = initialProducts;
  localStorage.setItem("hm_products_v2", JSON.stringify(products));
}

let cart = JSON.parse(localStorage.getItem("hm_cart")) || [];
let orders_list = JSON.parse(localStorage.getItem("hm_orders_list")) || [];
let sales = JSON.parse(localStorage.getItem("hm_sales_v2")) || 0;
let users = JSON.parse(localStorage.getItem("hm_users")) || [];
let currentUser = JSON.parse(localStorage.getItem("hm_current_user")) || null;
// Note: 'orders' var in previous code was just a count, we should use orders_list.length
// But to keep existing UI happy, we sync them.

let editingProductId = null;

function saveData() {
  localStorage.setItem("hm_products_v2", JSON.stringify(products));
  localStorage.setItem("hm_cart", JSON.stringify(cart));
  localStorage.setItem("hm_orders_list", JSON.stringify(orders_list));
  localStorage.setItem("hm_sales_v2", JSON.stringify(sales));
  localStorage.setItem("hm_users", JSON.stringify(users));
  localStorage.setItem("hm_current_user", JSON.stringify(currentUser));
  updateCartCount();
}
function updateCartCount() {
  const countElements = document.getElementsByClassName("cart-count");
  if (countElements.length > 0) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    for (let el of countElements) {
      el.innerText = totalItems;
    }
  }
}
updateCartCount();

// --- Page Routing Logic ---

if (window.location.href.includes("admin.html")) {
  document.getElementById("total_sales").innerText = "Rs." + sales;
  document.getElementById("total_products").innerText = products.length;
  // Use header orders count for total orders
  document.getElementById("total_orders").innerText = orders_list.length;

  const form = document.getElementById("upload_form");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("p_name").value;
    const brand = document.getElementById("p_brand").value;
    const price = document.getElementById("p_price").value;
    let img = document.getElementById("p_img").value;
    const imgFile = document.getElementById("p_img_file").files[0];

    const finishSubmit = (finalImg) => {
      if (editingProductId) {
        const index = products.findIndex((p) => p.id === editingProductId);
        if (index > -1) {
          products[index].name = name;
          products[index].brand = brand;
          products[index].price = price;
          products[index].img = finalImg;
          alert("Product Updated!");
        }
        editingProductId = null;
        submitBtn.innerText = "Add Product";
      } else {
        const product = {
          id: Date.now(),
          name: name,
          brand: brand,
          price: price,
          img: finalImg,
        };
        products.push(product);
        alert("Product Added!");
      }

      saveData();
      form.reset();
      renderAdminProducts();
    };

    if (imgFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        finishSubmit(event.target.result);
      };
      reader.readAsDataURL(imgFile);
    } else {
      finishSubmit(img); // Use the URL if no file
    }
  });

  renderAdminProducts();
  renderAdminOrders();
} else if (window.location.href.includes("sproducct.html")) {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  let currentProduct = null;

  if (productId) {
    currentProduct = products.find((p) => p.id == productId);
    if (currentProduct) {
      document.getElementById("MainImg").src = currentProduct.img;
      document.getElementById("p_brand").innerText =
        "Home / " + currentProduct.brand;
      document.getElementById("p_name").innerText = currentProduct.name;
      document.getElementById("p_price").innerText =
        "Rs." + currentProduct.price;

      const smallImgs = document.getElementsByClassName("small-img");
      for (let img of smallImgs) {
        img.src = currentProduct.img;
      }
    }
  }

  const MainImg = document.getElementById("MainImg");
  const smallimg = document.getElementsByClassName("small-img");

  if (MainImg && smallimg.length > 0) {
    for (let i = 0; i < smallimg.length; i++) {
      smallimg[i].onclick = function () {
        MainImg.src = smallimg[i].src;
      };
    }
  }

  // Add to cart functionality
  const addToCartBtn = document.getElementById("add_to_cart_btn");
  if (addToCartBtn && currentProduct) {
    addToCartBtn.onclick = function () {
      const quantity = document.getElementById("p_quantity").value;
      const size = document.getElementById("p_size").value;

      if (size === "Select size") {
        alert("Please select a size");
        return;
      }

      addToCart(currentProduct, parseInt(quantity), size);
    };
  }

  renderShopProducts();
} else if (window.location.href.includes("cart.html")) {
  renderCart();
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.onclick = checkout;
  }
} else if (window.location.href.includes("signin.html")) {
  checkSession();
} else {
  // Home or Shop page
  renderShopProducts();
}

// --- Functions ---

function addToCart(product, quantity, size) {
  const existingItem = cart.find(
    (item) => item.id === product.id && item.size === size
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity, size });
  }
  saveData();
  alert("Item added to cart!");
}

function renderCart() {
  const container = document.getElementById("cart-container");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td><a href="#" onclick="removeFromCart(${index})"><i class="fas fa-times-circle"></i></a></td>
            <td><img src="${item.img}" alt=""></td>
            <td>${item.name} <br> Size: ${item.size}</td>
            <td>Rs.${item.price}</td>
            <td><input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${index}, this.value)"></td>
            <td>Rs.${subtotal}</td>
        `;
    container.appendChild(tr);
  });

  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  if (subtotalEl) subtotalEl.innerText = "Rs." + total;
  if (totalEl) totalEl.innerText = "Rs." + total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveData();
  renderCart();
}

function updateCartQuantity(index, newQty) {
  if (newQty < 1) newQty = 1;
  cart[index].quantity = parseInt(newQty);
  saveData();
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("c_name").value;
  const email = document.getElementById("c_email").value;
  const address = document.getElementById("c_address").value;
  const phone = document.getElementById("c_phone").value;

  if (!name || !email || !address || !phone) {
    alert("Please fill in all checkout details!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = Math.floor(100000 + Math.random() * 900000); // 6 digit Order ID
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString(),
    items: [...cart],
    total: total,
    status: "Pending",
    customer: {
      name: name,
      email: email,
      address: address,
      phone: phone,
    },
  };

  orders_list.push(order);
  sales += total;
  cart = []; // Clear cart
  saveData();

  alert(`Order Placed Successfully! Your Order ID is ${orderId}`);
  renderCart(); // Will show empty cart
  window.location.href = "index.html";
}

function renderAdminProducts() {
  const container = document.getElementById("admin_pro_container");
  if (!container) return;
  container.innerHTML = "";

  const reversedProducts = [...products].reverse();

  for (let i = 0; i < reversedProducts.length; i++) {
    const p = reversedProducts[i];
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td><img src="${p.img}" width="50px"></td>
            <td>${p.name}</td>
            <td>${p.brand}</td>
            <td>Rs.${p.price}</td>
            <td>
                <button class="edit-btn" onclick="editProduct(${p.id})">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        `;
    container.appendChild(tr);
  }
}

function renderAdminOrders() {
  const container = document.getElementById("admin_orders_container");
  if (!container) return;
  container.innerHTML = "";

  const reversedOrders = [...orders_list].reverse();

  for (let i = 0; i < reversedOrders.length; i++) {
    const o = reversedOrders[i];

    // Create image thumbnails for items in order
    let imagesHtml = "";
    o.items.forEach((item) => {
      imagesHtml += `<img src="${item.img}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 5px; object-fit: cover;" title="${item.name}">`;
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${o.id}</td>
        <td>${imagesHtml}</td>
        <td>${o.date}</td>
        <td>Rs.${o.total}</td>
        <td>${o.status}</td>
        <td>
           <button class="update-btn" onclick="updateOrderStatus(${o.id})">Update Status</button>
           <button class="delete-btn" onclick="deleteOrder(${o.id})">Delete</button>
        </td>
    `;
    container.appendChild(tr);
  }
}

function updateOrderStatus(orderId) {
  const order = orders_list.find((o) => o.id === orderId);
  if (order) {
    if (order.status === "Pending") order.status = "Received";
    else if (order.status === "Received") order.status = "Shipped";
    else if (order.status === "Shipped") order.status = "Delivered";
    else order.status = "Pending";

    saveData();
    renderAdminOrders();
  }
}

function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  const index = orders_list.findIndex((o) => o.id === orderId);
  if (index > -1) {
    // Optional: Deduct sales amount when deleting an order?
    // For now, let's keep sales cumulative or deduct it.
    // Usually 'Total Sales' implies gross revenue. If order deleted (refunded), maybe deduct.
    sales -= orders_list[index].total;
    orders_list.splice(index, 1);
    saveData();
    renderAdminOrders();

    // Update dashboard stats immediately
    document.getElementById("total_orders").innerText = orders_list.length;
    document.getElementById("total_sales").innerText = "Rs." + sales;
  }
}

function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  document.getElementById("p_name").value = product.name;
  document.getElementById("p_brand").value = product.brand;
  document.getElementById("p_price").value = product.price;

  if (product.img.startsWith("data:")) {
    document.getElementById("p_img").value = "";
  } else {
    document.getElementById("p_img").value = product.img;
  }

  editingProductId = id;

  const form = document.getElementById("upload_form");
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.innerText = "Update Product";
  form.scrollIntoView({ behavior: "smooth" });
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const index = products.findIndex((p) => p.id === id);
  if (index > -1) {
    products.splice(index, 1);
    saveData();
    renderAdminProducts();
  }
}

function renderShopProducts() {
  const container = document.querySelector(".pro-container");
  if (!container) return;

  container.innerHTML = "";
  let displayProducts = products;
  const path = window.location.pathname;

  if (path.endsWith("index.html") || path === "/") {
    displayProducts = products.slice(0, 8);
  }
  if (path.includes("sproducct.html")) {
    displayProducts = products.slice(0, 4);
  }

  for (let i = 0; i < displayProducts.length; i++) {
    const p = displayProducts[i];
    const div = document.createElement("div");
    div.className = "pro";
    div.onclick = function () {
      window.location.href = "sproducct.html?id=" + p.id;
    };
    div.innerHTML = `
            <img src="${p.img}" alt="">
            <div class="des">
                <span>${p.brand}</span>
                <h5>${p.name}</h5>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h4>Rs.${p.price}</h4>
            </div>
            <a href="#"><i class="fas fa-shopping-cart"></i></a>
        `;
    container.appendChild(div);
  }
}

function trackOrder() {
  const id = document.getElementById("track_order_id").value;
  if (!id) {
    alert("Please enter an Order ID");
    return;
  }
  const order = orders_list.find((o) => o.id == id);
  if (order) {
    alert("Order Status: " + order.status + "\nTotal: Rs." + order.total);
  } else {
    alert("Order not found!");
  }
}

// Global exposure for onClick handlers
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.updateOrderStatus = updateOrderStatus;
window.deleteOrder = deleteOrder;
window.trackOrder = trackOrder;
window.checkout = checkout;

// --- Auth Functions ---

function toggleAuth(mode) {
  if (mode === "login") {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("register-section").style.display = "none";
  } else {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("register-section").style.display = "block";
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg_name").value;
  const email = document.getElementById("reg_email").value;
  const password = document.getElementById("reg_password").value;

  if (users.find((u) => u.email === email)) {
    alert("User already exists!");
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  currentUser = newUser;
  saveData();
  alert("Registration Successful!");
  checkSession();
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login_email").value;
  const password = document.getElementById("login_password").value;

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    saveData();
    alert("Login Successful!");
    checkSession();
  } else {
    alert("Invalid Email or Password!");
  }
}

function handleLogout() {
  currentUser = null;
  saveData();
  checkSession();
}

function checkSession() {
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const dashboardSection = document.getElementById("dashboard-section");

  if (!loginSection || !dashboardSection) return; // Not on signin page

  if (currentUser) {
    loginSection.style.display = "none";
    registerSection.style.display = "none";
    dashboardSection.style.display = "block";
    document.getElementById("user_display_name").innerText = currentUser.name;
    renderUserOrders();
  } else {
    loginSection.style.display = "block";
    registerSection.style.display = "none";
    dashboardSection.style.display = "none";
  }
}

function renderUserOrders() {
  const container = document.getElementById("user_orders_container");
  if (!container || !currentUser) return;

  container.innerHTML = "";
  // Filter orders by current user's email
  const userOrders = orders_list.filter(
    (o) => o.customer && o.customer.email === currentUser.email
  );
  // Sort by newest first
  const reversedOrders = [...userOrders].reverse();

  if (reversedOrders.length === 0) {
    container.innerHTML = "<tr><td colspan='5'>No orders found.</td></tr>";
    return;
  }

  reversedOrders.forEach((o) => {
    let itemsSummary = o.items.map((i) => i.name).join(", ");
    if (itemsSummary.length > 30)
      itemsSummary = itemsSummary.substring(0, 30) + "...";

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.date}</td>
            <td title="${o.items
              .map((i) => i.name)
              .join("\n")}">${itemsSummary}</td>
            <td>Rs.${o.total}</td>
            <td>${o.status}</td>
        `;
    container.appendChild(tr);
  });
}

// Global expose
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.toggleAuth = toggleAuth;
