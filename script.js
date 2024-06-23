const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const nameModalInput = document.getElementById("name-modal")
const nameModalWarn = document.getElementById("name-modal-warn")
const deliveryOption = document.getElementById("delivery-option")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn")

  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    addToCart(name, price)
  }
})

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    const itemTotalPrice = item.price * item.quantity;  // Calcula o preço total do item

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${itemTotalPrice.toFixed(2)}</p> <!-- Exibe o preço total do item -->
        </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
      </div>
    `;

    total += itemTotalPrice;  // Adiciona o preço total do item ao total
    itemCount += item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = itemCount;

  document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const itemName = this.getAttribute('data-name');
      removeFromCart(itemName);
    });
  });
}

function removeFromCart(name) {
  const itemIndex = cart.findIndex(item => item.name === name);
  
  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    updateCartModal();
  }
}

nameModalInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    nameModalInput.classList.remove("border-red-500")
    nameModalWarn.classList.add("hidden")
  }
})

deliveryOption.addEventListener("change", function (event) {
  if (event.target.value === "entrega") {
    addressInput.classList.remove("hidden")
  } else {
    addressInput.classList.add("hidden")
    addressInput.value = ""
  }
})

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})

checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) return;
  
  if (nameModalInput.value === "") {
    nameModalWarn.classList.remove("hidden")
    nameModalInput.classList.add("border-red-500")
    return;
  }

  if (deliveryOption.value === "entrega" && addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  let message = `Olá, meu nome é ${nameModalInput.value} e gostaria de fazer o seguinte pedido:\n`;

  const cartItems = cart.map((item) => {
    return `(${item.quantity}) ${item.name} - Valor: R$${(item.price * item.quantity).toFixed(2)}`;
  }).join("\n");

  message += cartItems;

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  message += `\nValor Total do pedido: R$${totalAmount.toFixed(2)}`;

  if (deliveryOption.value === "entrega") {
    message += `\nEndereço para entrega: ${addressInput.value}`;
  } else {
    message += `\nPedido para retirada no local.`;
  }

  const phone = "16997155358";
  const encodedMessage = encodeURIComponent(message);

  window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");

  cart = [];
  updateCartModal();
})

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
} else {
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
