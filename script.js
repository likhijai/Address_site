const pages = {
    registration: document.getElementById('registration'),
    menu: document.getElementById('menu'),
    summary: document.getElementById('summary')
};

function showPage(name) {
    Object.values(pages).forEach(p => p.classList.add('hidden'));
    pages[name].classList.remove('hidden');
    pages[name].classList.add('active');
}

async function saveUser() {
    const name = document.getElementById('fullName');
    const email = document.getElementById('gmail');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    let valid = true;
    document.querySelectorAll('.error').forEach(e => e.textContent = '');

    if (!name.value.trim()) {
        document.getElementById('nameErr').textContent = 'Required';
        valid = false;
    }
    if (!email.checkValidity()) {
        document.getElementById('emailErr').textContent = 'Enter valid Gmail';
        valid = false;
    }
    if (!phone.checkValidity()) {
        document.getElementById('phoneErr').textContent = 'Enter 10-digit phone';
        valid = false;
    }
    if (!address.value.trim()) {
        document.getElementById('addrErr').textContent = 'Required';
        valid = false;
    }
    if (!valid) return false;

    const user = {
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        address: address.value.trim()
    };
    localStorage.setItem('user', JSON.stringify(user));

    try {
        await fetch('/api/save-address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const msg = document.getElementById('regSuccess');
        if (msg) msg.classList.remove('hidden');
    } catch (err) {
        console.error('Failed to save address:', err);
    }

    return true;
}

const menuData = {
    south: [
        { id: 'idly', name: 'Idly', price: 20 },
        { id: 'dosa', name: 'Dosa', price: 40 }
    ],
    snacks: [
        { id: 'samosa', name: 'Samosa', price: 15 },
        { id: 'puffs', name: 'Veg Puffs', price: 25 }
    ],
    chinese: [
        { id: 'noodles', name: 'Noodles', price: 60 },
        { id: 'manchurian', name: 'Manchurian', price: 70 }
    ]
};
let cart = JSON.parse(localStorage.getItem('cart') || '{}');
let currentCat = 'south';

function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = '';
    Object.keys(menuData).forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.onclick = () => {
            currentCat = cat;
            renderItems();
        };
        container.appendChild(btn);
    });
}

function renderItems() {
    const list = document.getElementById('items');
    list.innerHTML = '';
    menuData[currentCat].forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span>${item.name} - Rs.${item.price}</span>`;
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.value = cart[item.id] ? cart[item.id].qty : 0;
        input.onchange = () => {
            const qty = parseInt(input.value) || 0;
            if (qty) cart[item.id] = { ...item, qty };
            else delete cart[item.id];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartButtons();
        };
        div.appendChild(input);
        list.appendChild(div);
    });
}

function updateCartButtons() {
    const count = Object.keys(cart).reduce((t, id) => t + cart[id].qty, 0);
    document.getElementById('viewCart').classList.toggle('hidden', count === 0);
    document.getElementById('toCheckout').classList.toggle('hidden', count === 0);
}

function buildSummary() {
    const container = document.getElementById('orderItems');
    container.innerHTML = '';
    let total = 0;
    Object.values(cart).forEach(item => {
        const row = document.createElement('div');
        row.textContent = `${item.name} x ${item.qty} - Rs.${item.price * item.qty}`;
        container.appendChild(row);
        total += item.price * item.qty;
    });
    document.getElementById('total').textContent = `Total: Rs.${total}`;
    return total;
}

function confirmOrder() {
    document.getElementById('loading').classList.remove('hidden');
    const order = {
        user: JSON.parse(localStorage.getItem('user')),
        cart,
        total: buildSummary()
    };

    fetch('/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    }).catch(err => console.error('Failed to log order:', err));

    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('success').classList.remove('hidden');
        localStorage.setItem('lastOrder', JSON.stringify(order));
        localStorage.removeItem('cart');
        cart = {};
    }, 2000);
}

document.getElementById('registrationForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (await saveUser()) {
        showPage('menu');
        renderCategories();
        renderItems();
        updateCartButtons();
        const msg = document.getElementById('regSuccess');
        if (msg) msg.classList.add('hidden');
    }
});

document.getElementById('toCheckout').addEventListener('click', () => {
    buildSummary();
    showPage('summary');
});

document.getElementById('confirm').addEventListener('click', confirmOrder);

showPage('registration');
