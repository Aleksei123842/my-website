document.addEventListener('DOMContentLoaded', function() {
  loadInventory();
});

const form = document.getElementById('inventory-form');
const tableBody = document.getElementById('inventory-table').querySelector('tbody');
let inventory = [];

// Сохранение данных в localStorage
function saveInventory() {
  localStorage.setItem('inventoryData', JSON.stringify(inventory));
}

// Загрузка данных при старте страницы
function loadInventory() {
  const data = localStorage.getItem('inventoryData');
  if (data) {
    inventory = JSON.parse(data) || [];
  }
  updateTable();
}

// Обновление таблицы
function updateTable() {
  tableBody.innerHTML = '';

  inventory.forEach((item, index) => {
    const row = document.createElement('tr');
    row.dataset.index = index;
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>
        <button class="quantity-btn">+</button>
        <button class="quantity-btn">-</button>
        <button class="delete-btn">Удалить</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updateTotalQuantity();
}

// Функция для подсчёта общего количества
function updateTotalQuantity() {
  const total = inventory.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('total-quantity').textContent = total;
}

// Добавление товара
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('item-name').value.trim();
  const category = document.getElementById('item-category').value.trim();
  const quantity = parseInt(document.getElementById('item-quantity').value, 10);

  if (!name || !category || isNaN(quantity)) {
    alert('Заполните все поля корректно.');
    return;
  }

  inventory.push({ name, category, quantity });

  updateTable();
  saveInventory();
  form.reset();
});

// Управление кнопками через `event delegation`
tableBody.addEventListener('click', function(event) {
  const index = event.target.closest('tr')?.dataset.index;
  if (index === undefined) return;

  if (event.target.classList.contains('quantity-btn')) {
    if (event.target.textContent === '+') {
      increaseQuantity(index);
    } else {
      decreaseQuantity(index);
    }
  }

  if (event.target.classList.contains('delete-btn')) {
    deleteItem(index);
  }
});

// Увеличение количества товара
function increaseQuantity(index) {
  inventory[index].quantity += 1;
  updateTable();
  saveInventory();
}

// Уменьшение количества товара
function decreaseQuantity(index) {
  
    inventory[index].quantity -= 1;
    updateTable();
    saveInventory();
  }


// Удаление товара
function deleteItem(index) {
  inventory.splice(index, 1);
  updateTable();
  saveInventory();
}

// Скачивание данных в TXT
function downloadTXT() {
  let content = "Название\tКатегория\tКоличество\n";
  inventory.forEach(item => {
    content += `${item.name}\t${item.category}\t${item.quantity}\n`;
  });

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "inventory.txt";

  link.click();
}