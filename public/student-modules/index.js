function populateStudentModulesBody(studentModulesBody, studentModules) {
    studentModulesBody.innerHTML = '';
    const template = document.getElementById('template');
    studentModules.forEach((studentModule) => {
        const node = template.content.firstElementChild.cloneNode(true);
        node.querySelector('.student-id').textContent = studentModule.studentId;
        node.querySelector('.student-name').textContent = studentModule.studentName;
        node.querySelector('.module-code').textContent = studentModule.moduleCode;
        node.querySelector('.module-credit').textContent = studentModule.moduleCredit;
        node.querySelector('.grade').value = studentModule.grade;

        const updateButton = node.querySelector('.update');
        updateButton.onclick = function () {
            const originalValue = updateButton.textContent;
            updateButton.textContent = 'loading...';
            updateButton.disabled = true;
            fetch(`/api/studentModules/student/${studentModule.studentId}/module/${studentModule.moduleCode}`, {
                method: 'PUT',
                body: JSON.stringify({ grade: node.querySelector('.grade').value }),
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
            fetch(`/api/studentModules/student/${studentModule.studentId}/module/${studentModule.moduleCode}`, {
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
                        studentModulesBody.removeChild(node);
                        alert('Success!');
                    }
                })
                .finally(() => {
                    deleteButton.textContent = originalValue;
                    deleteButton.disabled = false;
                });
        };

        studentModulesBody.appendChild(node);
    });
}

function refreshStudentModulesBody(studentModulesBody) {
    Promise.all([fetch('/api/studentModules'), fetch('/api/modules'), fetch('/api/students')])
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((body) => {
            const studentModules = body[0].data;
            const modules = body[1].data;
            const students = body[2].data;

            const modulesLookup = {};
            const studentsLookup = {};

            modules.forEach((module) => (modulesLookup[module.code] = module));
            students.forEach((student) => (studentsLookup[student.id] = student));

            const expandedStudentModules = studentModules.map((studentModule) => {
                return {
                    studentId: studentModule.student_id,
                    studentName: studentsLookup[studentModule.student_id].name,
                    moduleCode: studentModule.code,
                    moduleCredit: modulesLookup[studentModule.code].credit,
                    grade: studentModule.grade,
                };
            });

            populateStudentModulesBody(studentModulesBody, expandedStudentModules);
        });
}

window.addEventListener('DOMContentLoaded', function () {
    // Get the modules table body
    const studentModulesBody = document.getElementById('student-modules-body');

    // Fetch all modules and display them
    refreshStudentModulesBody(studentModulesBody);

    // Add event listener to the form to submit a new module
    const studentModuleForm = document.getElementById('student-module-form');
    const studentModuleFormFieldset = studentModuleForm.querySelector('fieldset');
    studentModuleForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const studentId = document.getElementById('student-id').value;
        const moduleCode = document.getElementById('module-code').value;
        const grade = document.getElementById('grade').value;
        studentModuleFormFieldset.disabled = true;
        fetch('/api/studentModules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId: studentId,
                moduleCode: moduleCode,
                grade: grade,
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
                return refreshStudentModulesBody(studentModulesBody);
            })
            .finally(() => {
                studentModuleFormFieldset.disabled = false;
            });
    });
});
