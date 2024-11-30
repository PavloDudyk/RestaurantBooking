// Load initial data from the server
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/admin/reservations')
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error('Error:', error));
});

const tableBody = document.getElementById("table-body");

// Render rows in the table
function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(reservation => {
        console.log(reservation);
        addRow(reservation);
    });
}

function addRow(reservation = {
    reservationId: "",
    guest: { fullName: "", phoneNumber: "", email: "", telegramId: "" },
    table: { tableId: "", location: "" },
    guestCount: "",
    reservationDate: "",
    reservationTime: ""
}) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" value="${reservation.reservationId}" readonly></td>
        <td><input type="text" value="${reservation.guest ? reservation.guest.fullName : ''}"></td>
        <td><input type="text" value="${reservation.guest ? reservation.guest.phoneNumber : ''}"></td>
        <td><input type="email" value="${reservation.guest ? reservation.guest.email : '—'}"></td>
        <td><input type="text" value="${reservation.guest ? reservation.guest.telegramId : '—'}"></td>
        <td><input type="number" value="${reservation.table ? reservation.table.tableId : ''}"></td>
        <td><input type="text" value="${reservation.table ? reservation.table.location : ''}"></td>
        <td><input type="number" value="${reservation.guestCount}"></td>
        <td><input type="date" value="${reservation.reservationDate}"></td>
        <td><input type="time" value="${reservation.reservationTime}"></td>
        <td>
            <button class="btn btn-success save-btn">Save</button>
            <button class="btn btn-danger delete-btn">Delete</button>
        </td>
    `;

    // Save button logic
    row.querySelector(".save-btn").addEventListener("click", () => saveRow(reservation.reservationId, row));
    // Delete button logic
    row.querySelector(".delete-btn").addEventListener("click", () => deleteRow(reservation.reservationId, row));

    tableBody.appendChild(row);
}

function createReservation(reservationData) {
    fetch('/api/admin/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData),
    })
        .then(response => {
            if (response.ok) {
                alert("Reservation created successfully!");
                return response.json();
            } else {
                throw new Error("Failed to create reservation.");
            }
        })
        .then(data => console.log("New Reservation:", data))
        .catch(error => console.error("Error:", error));
}

function updateReservation(id, reservationData) {
    fetch(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData),
    })
        .then(response => {
            if (response.ok) {
                alert("Reservation updated successfully!");
                return response.json();
            } else {
                throw new Error("Failed to update reservation.");
            }
        })
        .then(data => console.log("Updated Reservation:", data))
        .catch(error => console.error("Error:", error));
}


// Save row to the server
function saveRow(id, row) {
    const reservationData = {
        fullName: row.children[1].querySelector("input").value,
        phoneNumber: row.children[2].querySelector("input").value,
        email: row.children[3].querySelector("input").value,
        telegramId: row.children[4].querySelector("input").value,
        tableNumber: parseInt(row.children[5].querySelector("input").value),
        location: row.children[6].querySelector("input").value, // Не обов’язкове поле, якщо потрібно
        guestCount: parseInt(row.children[7].querySelector("input").value),
        reservationDate: row.children[8].querySelector("input").value,
        reservationTime: row.children[9].querySelector("input").value,
    };

    if (id) {
        console.log("updateReservation "+ id +" "+ reservationData)
        updateReservation(id, reservationData); // Оновлення
    } else {
        console.log("createReservation "+ reservationData)
        createReservation(reservationData); // Створення
    }
}

// Delete row from the server
function deleteRow(id, row) {
    if (!id) {
        row.remove(); // Remove unsaved row directly
        return;
    }

    fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
    })
        .then(response => {
            if (response.ok) {
                row.remove();
                alert("Reservation deleted successfully!");
            } else {
                throw new Error("Failed to delete reservation.");
            }
        })
        .catch(error => console.error("Error:", error));
}

// Add new row logic
document.getElementById("add-row-btn").addEventListener("click", () => addRow());

// Update table button logic
document.getElementById("update-table-btn").addEventListener("click", () => {
    fetch('/api/admin/reservations')
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error('Error:', error));
});

document.getElementById("filter-input").addEventListener("input", function () {
    const filterValue = this.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {
        const fullName = row.children[1].querySelector("input").value.toLowerCase();
        const phoneNumber = row.children[2].querySelector("input").value.toLowerCase();

        if (fullName.includes(filterValue) || phoneNumber.includes(filterValue)) {
            row.style.display = ""; // Показати рядок
        } else {
            row.style.display = "none"; // Сховати рядок
        }
    });
});

document.querySelectorAll("#reservations-table th").forEach((header, index) => {
    if (index === 10) return; // Пропустити стовпець "Actions"

    header.style.cursor = "pointer";
    header.addEventListener("click", () => sortTable(index));
});

function sortTable(columnIndex) {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    const isNumeric = !isNaN(rows[0].children[columnIndex].querySelector("input").value);

    rows.sort((a, b) => {
        const aValue = a.children[columnIndex].querySelector("input").value;
        const bValue = b.children[columnIndex].querySelector("input").value;

        return isNumeric
            ? parseFloat(aValue) - parseFloat(bValue) // Для числових стовпців
            : aValue.localeCompare(bValue); // Для текстових стовпців
    });

    tableBody.innerHTML = ""; // Очистити таблицю
    rows.forEach(row => tableBody.appendChild(row)); // Додати відсортовані рядки
}


