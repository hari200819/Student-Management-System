const API_URL = "http://127.0.0.1:8000/api/students/";

const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");


// READ - Get all students
async function loadStudents() {
    const response = await fetch(API_URL);
    const students = await response.json();

    studentTable.innerHTML = "";

    students.forEach(student => {
        studentTable.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.department}</td>
                <td>${student.age}</td>
                <td>${student.phone}</td>
                <td>
                    <button onclick="editStudent(${student.id})">
                        Edit
                    </button>

                    <button onclick="deleteStudent(${student.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// CREATE - Add student
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const studentId = document.getElementById("studentId").value;

    const studentData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        age: document.getElementById("age").value,
        phone: document.getElementById("phone").value
    };

    if (studentId) {
        // UPDATE
        await fetch(API_URL + studentId + "/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });
    } else {
        // CREATE
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });
    }

    form.reset();
    document.getElementById("studentId").value = "";

    loadStudents();
});


// UPDATE - Edit student
async function editStudent(id) {
    const response = await fetch(API_URL + id + "/");
    const student = await response.json();

    document.getElementById("studentId").value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("department").value = student.department;
    document.getElementById("age").value = student.age;
    document.getElementById("phone").value = student.phone;
}


// DELETE - Delete student
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {

        await fetch(API_URL + id + "/", {
            method: "DELETE"
        });

        loadStudents();
    }
}


// Load students when page opens
loadStudents();
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {
    const searchText = searchInput.value.toLowerCase();
    const rows = studentTable.querySelectorAll("tr");

    rows.forEach(row => {
        const name = row.cells[1].innerText.toLowerCase();
        const email = row.cells[2].innerText.toLowerCase();
        const department = row.cells[3].innerText.toLowerCase();

        if (
            name.includes(searchText) ||
            email.includes(searchText) ||
            department.includes(searchText)
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});