const bookingForm = document.getElementById("bookingForm");
const requestsTable = document.getElementById("requestsTable");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const formMessage = document.getElementById("formMessage");
const emptyMessage = document.getElementById("emptyMessage");

const STORAGE_KEY = "fixItRepairRequests";
const statuses = ["Pending", "In Progress", "Completed"];

let requests = [];

try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    requests = savedData ? JSON.parse(savedData) : [];

    if (!Array.isArray(requests)) {
        requests = [];
    }
} catch (error) {
    requests = [];
}

function saveRequests() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
        return true;
    } catch (error) {
        alert("Unable to save data. Browser storage may be full.");
        return false;
    }
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = "message " + type;
}

function updateStatistics() {
    document.getElementById("totalCount").textContent =
        requests.length;

    document.getElementById("pendingCount").textContent =
        requests.filter(r => r.status === "Pending").length;

    document.getElementById("progressCount").textContent =
        requests.filter(r => r.status === "In Progress").length;

    document.getElementById("completedCount").textContent =
        requests.filter(r => r.status === "Completed").length;
}

function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
}

function renderRequests() {
    requestsTable.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    const filteredRequests = requests.filter(request => {
        const searchableText = [
            request.id,
            request.name,
            request.appliance,
            request.phone
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);
        const matchesStatus =
            selectedStatus === "All" ||
            request.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    filteredRequests.forEach(request => {
        const row = document.createElement("tr");

        row.appendChild(createCell(request.id));
        row.appendChild(createCell(request.name));
        row.appendChild(createCell(request.appliance));
        row.appendChild(createCell(request.date));
        row.appendChild(createCell(request.problem));

        // Status dropdown
        const statusCell = document.createElement("td");
        const statusSelect = document.createElement("select");
        statusSelect.className = "status-select";
        statusSelect.setAttribute(
            "aria-label",
            "Update status for " + request.id
        );

        statuses.forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            statusSelect.appendChild(option);
        });

        statusSelect.value = statuses.includes(request.status)
            ? request.status
            : "Pending";

        statusSelect.addEventListener("change", () => {
            const oldStatus = request.status;
            request.status = statusSelect.value;

            if (!saveRequests()) {
                request.status = oldStatus;
                renderRequests();
                return;
            }

            updateStatistics();
            renderRequests();
        });

        statusCell.appendChild(statusSelect);
        row.appendChild(statusCell);

        // Delete button
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.setAttribute(
            "aria-label",
            "Delete request " + request.id
        );

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(
                "Are you sure you want to delete this request?"
            );

            if (!confirmed) return;

            const previousRequests = requests;
            requests = requests.filter(r => r.id !== request.id);

            if (!saveRequests()) {
                requests = previousRequests;
                return;
            }

            renderRequests();
            updateStatistics();
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        requestsTable.appendChild(row);
    });

    emptyMessage.hidden = filteredRequests.length > 0;
    emptyMessage.textContent = requests.length === 0
        ? "No repair requests yet. Book your first repair above."
        : "No matching requests found. Try another search or filter.";
}

// Set today's date as the earliest selectable date.
const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

const dateInput = document.getElementById("date");
dateInput.min = localToday;

// Handle booking form submission.
bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("customerName")
        .value.trim();
    const phone = document.getElementById("phone")
        .value.trim();
    const appliance = document.getElementById("appliance").value;
    const date = dateInput.value;
    const address = document.getElementById("address")
        .value.trim();
    const problem = document.getElementById("problem")
        .value.trim();

    if (!name || !phone || !appliance || !date ||
        !address || !problem) {
        showMessage("Please fill in all fields.", "error");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        showMessage(
            "Please enter a valid 10-digit phone number.",
            "error"
        );
        return;
    }

    if (date < localToday) {
        showMessage("Please select today or a future date.", "error");
        return;
    }

    const newRequest = {
        id: "AR" + Date.now().toString().slice(-8),
        name: name,
        phone: phone,
        appliance: appliance,
        date: date,
        address: address,
        problem: problem,
        status: "Pending"
    };

    requests.push(newRequest);

    if (!saveRequests()) {
        requests.pop();
        showMessage(
            "Booking could not be saved. Please try again.",
            "error"
        );
        return;
    }

    bookingForm.reset();
    dateInput.min = localToday;

    showMessage(
        "Repair request submitted successfully! ID: " +
        newRequest.id,
        "success"
    );

    renderRequests();
    updateStatistics();

    document.getElementById("requests").scrollIntoView({
        behavior: "smooth"
    });
});

// Search and filter events.
searchInput.addEventListener("input", renderRequests);
statusFilter.addEventListener("change", renderRequests);

// Display previously saved bookings on page load.
renderRequests();
updateStatistics();


