function populateStudentModulesBody(studentsBody, students) {
    studentsBody.innerHTML = '';
    const template = document.getElementById('template');
    students.forEach((student) => {
        const node = template.content.firstElementChild.cloneNode(true);
        node.querySelector('.student-id').textContent = student.id;
        node.querySelector('.name').value = student.name;

        const updateButton = node.querySelector('.update');
        updateButton.onclick = function () {
            const originalValue = updateButton.textContent;
            updateButton.textContent = 'loading...';
            updateButton.disabled = true;
            fetch(`/api/students/${student.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name: node.querySelector('.name').value }),
                headers: { 'Content-Type': 'application/json' },
            })
                .then((response) => {
                    if (response.ok) return {};
                    return response.json();
                })
                .then((body) => {
                    if (body.error) {
                        alert(body.error);
                    } else alert('Success!');
                })
                .finally(() => {
                    updateButton.textContent = originalValue;
                    updateButton.disabled = false;
                });
        };

        const deleteButton = node.querySelector('.delete');
        deleteButton.onclick = function () {
            const originalValue = deleteButton.textContent;
            deleteButton.textContent = 'loading...';
            deleteButton.disabled = true;
            fetch(`/api/students/${student.id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) return {};
                    return response.json();
                })
                .then((body) => {
                    if (body.error) {
                        alert(body.error);
                    } else {
                        studentsBody.removeChild(node);
                        alert('Success!');
                    }
                })
                .finally(() => {
                    deleteButton.textContent = originalValue;
                    deleteButton.disabled = false;
                });
        };

        studentsBody.appendChild(node);
    });
}

function refreshStudentsBody(studentsBody) {
    fetch('/api/students')
        .then((res) => res.json())
        .then((body) => {
            const students = body.data;
            populateStudentModulesBody(studentsBody, students);
        });
}

window.addEventListener('DOMContentLoaded', function () {
    // Get the modules table body
    const studentsBody = document.getElementById('students-body');

    // Fetch all modules and display them
    refreshStudentsBody(studentsBody);

    // Add event listener to the form to submit a new module
    const studentForm = document.getElementById('student-form');
    const studentFormFieldset = studentForm.querySelector('fieldset');
    studentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const studentId = document.getElementById('student-id').value;
        const name = document.getElementById('name').value;
        studentFormFieldset.disabled = true;
        fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId: studentId,
                name: name,
            }),
        })
            .then((response) => {
                if (response.ok) return {};
                return response.json();
            })
            .then((body) => {
                if (body.error) {
                    return alert(body.error);
                }
                return refreshStudentsBody(studentsBody);
            })
            .finally(() => {
                studentFormFieldset.disabled = false;
            });
    });
});
