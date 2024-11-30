document.addEventListener('DOMContentLoaded', function() {
    const tableElements = document.querySelectorAll('.table-svg');
    const selectedTableDisplay = document.getElementById('selectedTable');
    let previousSelectedTable = null;

    // Обробник кліків по столиках
    tableElements.forEach(table => {
        table.addEventListener('click', function(event) {
            event.stopPropagation(); // Запобігаємо спливанню події
            if (previousSelectedTable) {
                previousSelectedTable.classList.remove('selected-table');
            }

            this.classList.add('selected-table');
            previousSelectedTable = this;

            const tableNumber = this.getAttribute('data-table-number');
            selectedTableDisplay.innerText = `Столик номер ${tableNumber}`;
        });
    });

    // Обробник кліку на карті (поза столиками)
    document.getElementById('mapImage').addEventListener('click', function() {
        if (previousSelectedTable) {
            previousSelectedTable.classList.remove('selected-table');
            previousSelectedTable = null;
        }

        selectedTableDisplay.innerText = 'Столик не вибрано';
    });

    // Регулярні вирази для перевірки
    const namePattern = /^[a-zA-Zа-яА-Я\s]+$/; // Ім'я: лише літери та пробіли
    const phonePattern = /^\+380\d{9}$|^\d{10,15}$/; // Телефон: може починатися з +380 або лише цифри
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/; // Правильна пошта
    const telegramPattern = /^@[a-zA-Z0-9_]{5,32}$/; // Telegram ID

    // Обробник форми
    document.getElementById('reservationForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Запобігаємо перезавантаженню сторінки

        // Отримання значень полів форми
        const fullName = document.getElementById('fullName');
        const phoneNumber = document.getElementById('phoneNumber');
        const email = document.getElementById('email');
        const tgId = document.getElementById('telegramId');
        const allergens = document.getElementById('allergens');
        const reservationDate = document.getElementById('reservationDate');
        const reservationTime = document.getElementById('reservationTime');
        const tableId = document.getElementById('selectedTable')
        const tableIdNum = parseInt(document.getElementById('selectedTable').textContent.trim().split(" ").pop(),10);

        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        // Перевірка правильності імені (лише латиниця, кирилиця та пробіли)
        if (!namePattern.test(fullName.value)) {
            fullName.style.borderColor = 'red';
            errorMessage.textContent = "Ім'я може містити лише літери (латиниця та кирилиця) та пробіли.";
            errorMessage.classList.remove('d-none');
            return;
        } else {
            fullName.style.borderColor = '';
            errorMessage.classList.add('d-none');
        }

        // Перевірка номера телефону
        if (!phonePattern.test(phoneNumber.value)) {
            phoneNumber.style.borderColor = 'red';
            errorMessage.textContent = "Номер телефону має бути коректним (наприклад, +380XXXXXXXXX).";
            errorMessage.classList.remove('d-none');
            return;
        } else {
            phoneNumber.style.borderColor = '';
            errorMessage.classList.add('d-none');
        }

        // Перевірка email i tgId
        if (!emailPattern.test(email.value) && !telegramPattern.test(tgId.value)) {
            email.style.borderColor = 'yellow';
            tgId.style.borderColor = 'yellow';
            errorMessage.textContent = "Будь ласка, введіть коректну електронну пошту або телеграм id.";
            errorMessage.classList.remove('d-none');
            return;
        } else {
            email.style.borderColor = '';
            tgId.style.borderColor = '';
            errorMessage.classList.add('d-none');
        }

        // Перевірка вибору столика
        if (!previousSelectedTable) {
            tableId.style.border = '1px solid red';
            errorMessage.textContent = "Будь ласка, виберіть столик.";
            errorMessage.classList.remove('d-none');
            return;
        } else {
            tableId.style.border = '';
            errorMessage.classList.add('d-none');
        }

        // Перевірка дати
        const selectedDate = new Date(reservationDate.value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Очищаємо час поточної дати для порівняння
        if (selectedDate < currentDate || !reservationDate.value) {
            reservationDate.style.borderColor = 'red';
            errorMessage.textContent = "Введіть коректну дату.";
            errorMessage.classList.remove('d-none');
            return;
        } else {
            reservationDate.style.borderColor = '';
            errorMessage.classList.add('d-none');
        }

        // Перевірка часу
        const selectedTime = reservationTime.value;
        const selectedText = reservationTime.options[reservationTime.selectedIndex].text;

        console.log(selectedTime+" "+reservationTime.value+" "+selectedText);

        if (selectedText === "--:--") {
            reservationTime.style.borderColor = 'red';
            errorMessage.textContent = "Будь ласка, виберіть час.";
            errorMessage.classList.remove('d-none');
            return;
        } else {
            reservationTime.style.borderColor = '';
            errorMessage.classList.add('d-none');
        }

        // Якщо всі перевірки пройшли успішно, можна відправити форму
        errorMessage.classList.add('d-none');
        successMessage.textContent = "Дані відправлені.";
        successMessage.classList.remove('d-none');
        console.log('Форма надіслана', { fullName: fullName.value, phoneNumber: phoneNumber.value, email: email.value, tgId: tgId.value, allergens:allergens.value });

        // Формуємо об'єкт із даними
        const reservationData = {
            fullName: fullName.value,
            phoneNumber: phoneNumber.value,
            email: email.value,
            telegramId: tgId.value,
            allergens: allergens.value,
            reservationDate: reservationDate.value,
            reservationTime: selectedText,
            tableNumber: tableIdNum
        };

        const reservationData1 = {
            fullName: "John Doe",
            phoneNumber: "123456789",
            email: "johndoe@example.com",
            telegramId: "john_telegram",
            allergens: "Peanuts",
            reservationDate: "2024-11-24",  // Формат дати як рядок
            reservationTime: "18:00",  // Формат часу як рядок
            tableNumber: 5
        };

        console.log("\n\nreservationData\n" + JSON.stringify(reservationData)); // Перевірте, що виводиться в консоль
        console.log("\n\nreservationData1\n" + JSON.stringify(reservationData1)); // Перевірте, що виводиться в консоль

        // Відправка POST-запиту на сервер
        fetch('/api/reservations', { // Замініть URL на ваш ендпоінт
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        })
            .then(response => {
                if (response.ok) {
                    alert('Бронювання успішно створено!');
                } else {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Щось пішло не так');
                    });
                }
            })
            .catch(error => {
                alert(`Помилка: ${error.message}`);
            });


        // fetch('http://localhost:8080/api/reservations', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(reservationData)  // де data - це об'єкт, який ви відправляєте на сервер
        // })
        //     .then(response => response.json())
        //     .then(data => console.log(data))
        //     .catch(error => console.error('Error:', error));

        // fetch('http://localhost:8080/api/reservations', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(reservationData) // Перетворення об'єкта на JSON
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error(`HTTP error! Status: ${response.status}`);
        //         }
        //         return response.json();
        //     })
        //     .then(data => console.log('Success:', data))
        //     .catch(error => console.error('Error:', error));


    });
});


function createOption(value, text) {
    var option = document.createElement('option');
    option.text = text;
    option.value = value;
    return option;
}

var hourSelect = document.getElementById('reservationTime');
    hourSelect.add(createOption(0, "--:--"));

for(var i = 11; i <= 18; i++){
    let val = i;
    let txt = i+":00";
    hourSelect.add(createOption(val, txt));
    txt = i+":30";
    hourSelect.add(createOption(val, txt));
}