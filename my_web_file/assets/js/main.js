/*
	Verti by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
document.addEventListener("DOMContentLoaded", function(){

let cart = JSON.parse(localStorage.getItem("elekkoCart")) || [];

const cartIcon = document.getElementById("cart-icon");
const cartPanel = document.getElementById("cart-panel");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const toast = document.getElementById("toast");

cartIcon.addEventListener("click", function(){
    cartPanel.classList.add("active"); // overlay the icon
});

closeCart.addEventListener("click", function(){
    cartPanel.classList.remove("active");
});

document.querySelectorAll(".add-to-cart").forEach(button=>{
    button.addEventListener("click", function(){
        let product = this.closest(".product");
        let id = product.dataset.id;
        let name = product.dataset.name;
        let price = parseInt(product.dataset.price);

        let existing = cart.find(item=>item.id===id);

        if(existing){
            existing.quantity += 1;
        } else {
            cart.push({id,name,price,quantity:1});
        }

        saveCart();
        showToast(name + " added to cart");
    });
});

function saveCart(){
    localStorage.setItem("elekkoCart", JSON.stringify(cart));
    renderCart();
}

function renderCart(){
    cartItems.innerHTML="";
    let total=0;
    let count=0;

    cart.forEach(item=>{
        total += item.price * item.quantity;
        count += item.quantity;

        let div=document.createElement("div");
        div.innerHTML=`
            <p>${item.name} x${item.quantity}</p>
            <p>₦${(item.price*item.quantity).toLocaleString()}</p>
            <hr>
        `;
        cartItems.appendChild(div);
    });

    cartTotal.innerText = total.toLocaleString();
    cartCount.innerText = count;
}

function showToast(message){
    toast.innerText=message;
    toast.style.display="block";
    setTimeout(()=>{
        toast.style.display="none";
    },2000);
}

renderCart();

});
(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			noOpenerFade: true,
			speed: 300
		});

	// Nav.

		// Toggle.
			$(
				'<div id="navToggle">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

})(jQuery);