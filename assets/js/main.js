document.addEventListener("DOMContentLoaded", function() {

    let cart = JSON.parse(localStorage.getItem("elekkoCart")) || [];
    const cartIcon = document.getElementById("cart-icon");
    const cartPanel = document.getElementById("cart-panel");
    const closeCart = document.getElementById("close-cart");
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const toast = document.getElementById("toast");

    // Mobile nav toggle
    const hamburger = document.getElementById("hamburger");
    const navUl = document.querySelector("#nav ul");
    hamburger.addEventListener("click", () => navUl.classList.toggle("show"));

    // Show/hide cart panel
    cartIcon.addEventListener("click", () => cartPanel.classList.add("open"));
    closeCart.addEventListener("click", () => cartPanel.classList.remove("open"));

    // Add to cart buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            const product = this.closest(".product");
            const id = product.dataset.id;
            const name = product.dataset.name;
            const price = parseInt(product.dataset.price);
            const existing = cart.find(item => item.id === id);
            if (existing) existing.quantity += 1;
            else cart.push({ id, name, price, quantity: 1 });
            saveCart();
            showToast(`${name} added to cart`);
        });
    });

    function saveCart() {
        localStorage.setItem("elekkoCart", JSON.stringify(cart));
        renderCart();
    }

    function renderCart() {
        cartItems.innerHTML = "";
        let total=0, count=0;
        cart.forEach(item=>{
            total += item.price * item.quantity;
            count += item.quantity;
            const div = document.createElement("div");
            div.classList.add("cart-item");
              div.innerHTML = `
            <div style="flex:1;">
                <p style="margin:0;font-weight:600;">${item.name}</p>
                <p style="margin:0;">₦${(item.price * item.quantity).toLocaleString()}</p>
            </div>

            <div style="display:flex;align-items:center;gap:px;">

                <button class="qtyBtn"
                    data-id="${item.id}"
                    data-action="decrease"
                    style="width:36px;height:36px;font-size:18px;border:none;background:#0b3d91;color:white;border-radius:6px;cursor:pointer;">
                    −
                </button>

                <input type="number"
                    min="1"
                    value="${item.quantity}"
                    data-id="${item.id}"
                    class="qtyInput"
                    style="width:45px;height:36px;text-align:center;font-size:16px;border:1px solid #ccc;border-radius:6px;">

                <button class="qtyBtn"
                    data-id="${item.id}"
                    data-action="increase"
                    style="width:36px;height:36px;font-size:18px;border:none;background:#0b3d91;color:white;border-radius:6px;cursor:pointer;">
                    +
                </button>

                <button class="deleteBtn"
                    data-id="${item.id}"
                    style="width:36px;height:36px;font-size:18px;border:none;background:#ff3c3c;color:white;border-radius:6px;cursor:pointer;">
                    🗑
                </button>

            </div>
            `;
            cartItems.appendChild(div);
        });
        cartTotal.innerText = total.toLocaleString();
        cartCount.innerText = count;
    }

    cartItems.addEventListener("click", function(e){
        const id = e.target.dataset.id;
        if(!id) return;
        const item = cart.find(i=>i.id===id);
        if(!item) return;
        if(e.target.classList.contains("deleteBtn")) cart = cart.filter(i=>i.id!==id);
        if(e.target.classList.contains("qtyBtn")){
            if(e.target.dataset.action==="increase") item.quantity++;
            if(e.target.dataset.action==="decrease") item.quantity--;
            if(item.quantity<1) cart = cart.filter(i=>i.id!==id);
        }
        saveCart();
    });

    cartItems.addEventListener("keydown", function(e){
        if(e.target.classList.contains("qtyInput") && e.key==="Enter"){
            const id = e.target.dataset.id;
            const item = cart.find(i=>i.id===id);
            if(!item) return;
            let val = parseInt(e.target.value);
            if(isNaN(val) || val<1) val=1;
            item.quantity = val;
            saveCart();
        }
    });

    function showToast(message){
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(()=>toast.classList.remove("show"),2500);
    }

    renderCart();
});