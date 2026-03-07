document.addEventListener("DOMContentLoaded", function() {

    let cart = JSON.parse(localStorage.getItem("elekkoCart")) || [];

    const cartIcon = document.getElementById("cart-icon");
    const cartPanel = document.getElementById("cart-panel");
    const closeCart = document.getElementById("close-cart");
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const toast = document.getElementById("toast");

    // Show/hide cart panel
    cartIcon.addEventListener("click", () => cartPanel.classList.add("active"));
    closeCart.addEventListener("click", () => cartPanel.classList.remove("active"));

    // Add to cart buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            const product = this.closest(".product");
            const id = product.dataset.id;
            const name = product.dataset.name;
            const price = parseInt(product.dataset.price);

            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            saveCart();
            showToast(name + " added to cart");
        });
    });

    // Save cart and render
    function saveCart() {
        localStorage.setItem("elekkoCart", JSON.stringify(cart));
        renderCart();
        renderCheckout();
    }

    // Render cart panel with horizontal delete + quantity
    function renderCart() {
        cartItems.innerHTML = "";
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.alignItems = "center";
            div.style.marginBottom = "10px";

           div.innerHTML = `
    <div style="flex:1;">
        <p style="margin:0;font-weight:600;">${item.name}</p>
        <p style="margin:0;">₦${(item.price*item.quantity).toLocaleString()}</p>
    </div>

    <div style="display:flex;align-items:center;gap:5px;">
        <button class="qtyBtn" data-id="${item.id}" data-action="decrease" 
                style="padding:2px 6px;font-size:14px;">−</button>
        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="qtyInput" 
               style="width:50px;text-align:center;">
        <button class="qtyBtn" data-id="${item.id}" data-action="increase" 
                style="padding:2px 6px;font-size:14px;">+</button>
        <button class="deleteBtn" data-id="${item.id}" 
                style="background:red;color:white;border:none;border-radius:5px;padding:5px;cursor:pointer;">🗑</button>
    </div>
`;
            cartItems.appendChild(div);
        });

        cartTotal.innerText = total.toLocaleString();
        cartCount.innerText = count;
    }

    // Cart buttons
    cartItems.addEventListener("click", function(e) {
        const id = e.target.dataset.id;
        if (!id) return;

        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (e.target.classList.contains("deleteBtn")) {
            cart = cart.filter(i => i.id !== id);
            saveCart();
        } else if (e.target.classList.contains("qtyBtn")) {
            if (e.target.dataset.action === "increase") item.quantity += 1;
            if (e.target.dataset.action === "decrease") item.quantity -= 1;
            if (item.quantity < 1) cart = cart.filter(i => i.id !== id);
            saveCart();
        }
    });

    // Quantity input with Enter key
    cartItems.addEventListener("keydown", function(e) {
        if (e.target.classList.contains("qtyInput") && e.key === "Enter") {
            const id = e.target.dataset.id;
            const item = cart.find(i => i.id === id);
            if (!item) return;

            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1) val = 1;
            item.quantity = val;
            saveCart();
        }
    });

    // Checkout page rendering
    const checkoutTableBody = document.querySelector("#checkout-table tbody");
    const checkoutTotal = document.getElementById("checkout-total");
    const whatsappBtn = document.getElementById("checkout-whatsapp");

    function renderCheckout() {
        if (!checkoutTableBody) return;
        checkoutTableBody.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            let subtotal = item.price * item.quantity;
            total += subtotal;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="checkoutQty" style="width:50px;text-align:center;">
                </td>
                <td>₦${subtotal.toLocaleString()}</td>
                <td><button class="deleteCheckout" data-id="${item.id}">🗑</button></td>
            `;
            checkoutTableBody.appendChild(tr);
        });

        checkoutTotal.innerText = total.toLocaleString();
        updateWhatsAppLink(total);
    }

    function updateWhatsAppLink(total) {
        if (!whatsappBtn) return;
        let message = "Hello, I want to order the following from Elekko Agrovet:%0A";
        cart.forEach(item => {
            message += `${item.name} x${item.quantity} - ₦${(item.price*item.quantity).toLocaleString()}%0A`;
        });
        message += `Total: ₦${total.toLocaleString()}`;
        whatsappBtn.href = `https://wa.me/2348084322551?text=${message}`;
    }

    // Checkout table actions
    if (checkoutTableBody) {
        checkoutTableBody.addEventListener("click", function(e) {
            const id = e.target.dataset.id;
            if (e.target.classList.contains("deleteCheckout")) {
                cart = cart.filter(i => i.id !== id);
                saveCart();
            }
        });

        checkoutTableBody.addEventListener("keydown", function(e) {
            if (e.target.classList.contains("checkoutQty") && e.key === "Enter") {
                const id = e.target.dataset.id;
                const item = cart.find(i => i.id === id);
                if (!item) return;

                let val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) val = 1;
                item.quantity = val;
                saveCart();
            }
        });
    }

    renderCart();
    renderCheckout();

});