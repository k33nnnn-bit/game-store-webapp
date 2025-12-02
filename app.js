// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Расширяем на весь экран
tg.expand();

// Настраиваем основную кнопку
tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#6c5ce7";

// Данные пользователя
let userData = {
    balance: 1000,
    cart: [],
    selectedProduct: null
};

// Массив товаров
const products = {
    hot: [
        {
            id: 1,
            name: "Cyberpunk 2077",
            category: "pc",
            price: 3499,
            platform: "PC",
            genre: "RPG",
            description: "Игра в открытом мире от создателей Ведьмака. Действие происходит в Найт-Сити."
        },
        {
            id: 2,
            name: "Spider-Man 2",
            category: "console",
            price: 4999,
            platform: "PlayStation 5",
            genre: "Экшен",
            description: "Новое приключение Питера Паркера и Майлза Моралеса."
        },
        {
            id: 3,
            name: "Logitech G Pro X",
            category: "accessories",
            price: 12999,
            type: "Мышь",
            brand: "Logitech",
            description: "Профессиональная беспроводная игровая мышь."
        },
        {
            id: 4,
            name: "Steam ключ: Elden Ring",
            category: "keys",
            price: 2999,
            platform: "Steam",
            description: "Цифровой ключ для активации в Steam."
        }
    ],
    pc: [
        {
            id: 5,
            name: "Baldur's Gate 3",
            price: 4299,
            platform: "PC",
            genre: "RPG",
            description: "Новая глава легендарной RPG серии."
        },
        {
            id: 6,
            name: "Call of Duty: MW3",
            price: 4499,
            platform: "PC",
            genre: "Шутер",
            description: "Продолжение популярного шутера."
        }
    ],
    console: [
        {
            id: 7,
            name: "Zelda: Tears Kingdom",
            price: 5499,
            platform: "Nintendo Switch",
            genre: "Приключение",
            description: "Продолжение Breath of the Wild."
        }
    ],
    accessories: [
        {
            id: 8,
            name: "Razer BlackWidow",
            price: 21999,
            type: "Клавиатура",
            brand: "Razer",
            description: "Механическая игровая клавиатура."
        }
    ],
    keys: [
        {
            id: 9,
            name: "Steam ключ: Witcher 3",
            price: 599,
            platform: "Steam",
            description: "Цифровой ключ The Witcher 3."
        }
    ]
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateBalance();
    loadHotProducts();
    loadCart();
    
    // Отображаем данные пользователя из Telegram
    if (tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('balance').textContent = userData.balance.toLocaleString();
        
        // Можно добавить приветствие
        // document.querySelector('.subtitle').textContent = `Привет, ${user.first_name}!`;
    }
});

// Загрузка горячих предложений
function loadHotProducts() {
    const container = document.getElementById('hotProducts');
    container.innerHTML = '';
    
    products.hot.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.onclick = () => showProductModal(product);
    
    // Иконка в зависимости от категории
    let icon = '🎮';
    let bgColor = '#6c5ce7';
    
    switch(product.category) {
        case 'pc': icon = '🖥️'; bgColor = '#0984e3'; break;
        case 'console': icon = '🎮'; bgColor = '#e17055'; break;
        case 'accessories': icon = '🎧'; bgColor = '#00b894'; break;
        case 'keys': icon = '🔑'; bgColor = '#fdcb6e'; break;
    }
    
    div.innerHTML = `
        <div class="product-image" style="background: ${bgColor}">
            ${icon}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${product.price.toLocaleString()} руб.</div>
            <button class="btn-add" onclick="event.stopPropagation(); addToCart(${product.id})">
                🛒 В корзину
            </button>
        </div>
    `;
    
    return div;
}

// Показ модального окна с товаром
function showProductModal(product) {
    userData.selectedProduct = product;
    
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    let details = '';
    if (product.platform) details += `<p><strong>Платформа:</strong> ${product.platform}</p>`;
    if (product.genre) details += `<p><strong>Жанр:</strong> ${product.genre}</p>`;
    if (product.type) details += `<p><strong>Тип:</strong> ${product.type}</p>`;
    if (product.brand) details += `<p><strong>Бренд:</strong> ${product.brand}</p>`;
    
    content.innerHTML = `
        <h2>${product.name}</h2>
        ${details}
        <p><strong>Описание:</strong> ${product.description}</p>
        <div style="margin-top: 20px;">
            <h3>${product.price.toLocaleString()} руб.</h3>
            <button class="btn-buy" onclick="addToCart(${product.id}); closeModal()" style="margin-top: 10px;">
                🛒 Добавить в корзину
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Добавление в корзину
function addToCart(productId) {
    // Находим товар во всех категориях
    let product = null;
    
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    // Проверяем, есть ли уже в корзине
    const existingItem = userData.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        userData.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Обновляем отображение корзины
    loadCart();
    
    // Показываем уведомление
    tg.showPopup({
        title: 'Товар добавлен!',
        message: `${product.name} добавлен в корзину`,
        buttons: [{ type: 'ok' }]
    });
}

// Загрузка корзины
function loadCart() {
    const cartContainer = document.getElementById('cart');
    const emptyCart = document.getElementById('emptyCart');
    const cartTotal = document.getElementById('cartTotal');
    const totalAmount = document.getElementById('totalAmount');
    
    if (userData.cart.length === 0) {
        emptyCart.style.display = 'block';
        cartTotal.style.display = 'none';
        tg.MainButton.hide();
        return;
    }
    
    emptyCart.style.display = 'none';
    cartTotal.style.display = 'block';
    
    // Очищаем контейнер кроме пустой корзины
    const items = cartContainer.querySelectorAll('.cart-item');
    items.forEach(item => item.remove());
    
    let total = 0;
    
    // Добавляем товары в корзину
    userData.cart.forEach(item => {
        total += item.price * item.quantity;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price.toLocaleString()} руб. × ${item.quantity}</div>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">🗑️</button>
        `;
        
        cartContainer.appendChild(itemDiv);
    });
    
    // Обновляем итоговую сумму
    totalAmount.textContent = total.toLocaleString();
    
    // Показываем основную кнопку в Telegram
    tg.MainButton.setText(`Оформить заказ (${total.toLocaleString()} руб.)`);
    tg.MainButton.show();
}

// Удаление из корзины
function removeFromCart(productId) {
    userData.cart = userData.cart.filter(item => item.id !== productId);
    loadCart();
}

// Оформление заказа
function checkout() {
    if (userData.cart.length === 0) return;
    
    const total = userData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (userData.balance < total) {
        tg.showPopup({
            title: 'Недостаточно средств',
            message: `Пополните баланс на ${(total - userData.balance).toLocaleString()} руб.`,
            buttons: [{ type: 'ok' }]
        });
        return;
    }
    
    // Подтверждение покупки
    tg.showConfirm("Подтвердите покупку", (confirmed) => {
        if (confirmed) {
            userData.balance -= total;
            
            // Отправляем данные в Telegram бота
            const orderData = {
                products: userData.cart,
                total: total,
                timestamp: new Date().toISOString()
            };
            
            tg.sendData(JSON.stringify(orderData));
            
            // Очищаем корзину
            userData.cart = [];
            loadCart();
            updateBalance();
            
            tg.showPopup({
                title: 'Заказ оформлен!',
                message: `Спасибо за покупку! Сумма: ${total.toLocaleString()} руб.`,
                buttons: [{ type: 'ok' }]
            });
        }
    });
}

// Пополнение баланса
function addFunds() {
    tg.showPopup({
        title: 'Пополнение баланса',
        message: 'Выберите сумму для пополнения:',
        buttons: [
            { id: '500', text: '500 руб.', type: 'default' },
            { id: '1000', text: '1000 руб.', type: 'default' },
            { id: '5000', text: '5000 руб.', type: 'default' },
            { type: 'cancel' }
        ]
    }, (buttonId) => {
        if (buttonId && buttonId !== 'cancel') {
            const amount = parseInt(buttonId);
            userData.balance += amount;
            updateBalance();
            
            tg.showPopup({
                title: 'Баланс пополнен!',
                message: `На счет зачислено ${amount.toLocaleString()} руб.`,
                buttons: [{ type: 'ok' }]
            });
        }
    });
}

// Обновление отображения баланса
function updateBalance() {
    document.getElementById('balance').textContent = userData.balance.toLocaleString();
}

// Показ категорий
function showCategory(category) {
    const categoryNames = {
        'pc': '🖥️ PC игры',
        'console': '🎮 Консольные игры',
        'accessories': '🎧 Аксессуары',
        'keys': '🔑 Цифровые ключи'
    };
    
    tg.showAlert(`Категория: ${categoryNames[category]}\n\nЗдесь будут товары выбранной категории. В полной версии здесь будет полный каталог товаров.`);
}

// Информация о магазине
function showAbout() {
    tg.showAlert("🎮 GameStore\n\nКрупнейший магазин видеоигр и аксессуаров. Работаем с 2015 года. Официальный дистрибьютор крупнейших издателей.");
}

// Контакты
function showContacts() {
    tg.showAlert("📞 Контакты\n\nТелефон: 8-800-555-35-35\nEmail: support@gamestore.ru\nСайт: https://gamestore.ru\n\nГрафик работы: 24/7");
}

// Поддержка
function showSupport() {
    tg.showAlert("🆘 Поддержка\n\nПо вопросам:\n• Возврата товаров\n• Технической поддержки\n• Сотрудничества\n\nОбращайтесь в Telegram: @gamestore_support");
}

// Обработчик нажатия основной кнопки Telegram
tg.MainButton.onClick(function() {
    checkout();
});

// Закрытие по нажатию вне модального окна
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
};
