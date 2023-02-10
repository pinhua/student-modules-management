function populateStudentModulesBody(modulesBody, modules) {
    modulesBody.innerHTML = '';
    const template = document.getElementById('template');
    modules.forEach((module) => {
        const node = template.content.firstElementChild.cloneNode(true);
        node.querySelector('.code').textContent = module.code;
        node.querySelector('.credit').value = module.credit;

        const updateButton = node.querySelector('.update');
        updateButton.onclick = function () {
            const originalValue = updateButton.textContent;
            updateButton.textContent = 'loading...';
            updateButton.disabled = true;
            fetch(`/api/modules/${module.code}`, {
                method: 'PUT',
                body: JSON.stringify({ credit: node.querySelector('.credit').value }),
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
            fetch(`/api/modules/${module.code}`, {
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
                        modulesBody.removeChild(node);
                        alert('Success!');
                    }
                })
                .finally(() => {
                    deleteButton.textContent = originalValue;
                    deleteButton.disabled = false;
                });
        };

        modulesBody.appendChild(node);
    });
}

function refreshStudentModulesBody(modulesBody) {
    fetch('/api/modules')
        .then((res) => res.json())
        .then((body) => {
            const modules = body.data;
            populateStudentModulesBody(modulesBody, modules);
        });
}

window.addEventListener('DOMContentLoaded', function () {
    // Get the modules table body
    const modulesBody = document.getElementById('modules-body');

    // Fetch all modules and display them
    refreshStudentModulesBody(modulesBody);

    // Add event listener to the form to submit a new module
    const moduleForm = document.getElementById('module-form');
    const moduleFormFieldset = moduleForm.querySelector('fieldset');
    moduleForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const moduleCode = document.getElementById('module-code').value;
        const moduleCredit = document.getElementById('module-credit').value;
        moduleFormFieldset.disabled = true;
        fetch('/api/modules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: moduleCode,
                credit: moduleCredit,
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
                return refreshStudentModulesBody(modulesBody);
            })
            .finally(() => {
                moduleFormFieldset.disabled = false;
            });
    });
});
