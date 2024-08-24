document.addEventListener("DOMContentLoaded", () => {
    const contactList = document.getElementById("contactList");
    const addBtn = document.getElementById("add-button");
    const deleteAllBtn = document.getElementById("deleteall-button");
    const modal = document.getElementById('myModal');

    let contacts = [
        { name: "Mohammad Zaaroura", phone: "052-209-0019", email: "zaaroura@gmail.com", image: "images/zaaroura.jpg" },
        { name: "Mohammad Mansor", phone: "054-288-0776", email: "mansor@gmail.com", image: "images/mansor.jpg" },
        { name: "Amir Fahmawi", phone: "050-733-1341", email: "fahmawi@gmail.com", image: "images/Amir Fahmawi.png" },
        { name: "Natan Albat", phone: "054-447-5586", email: "bat@gmail.com", image: "images/Natan Albat.png" },
        { name: "Hazem Habrat", phone: "054-687-6987", email: "habrat@gmail.com", image: "images/Hazem.png" },
        { name: "Bolous Salman", phone: "054-203-1690", email: "salman@gmail.com", image: "images/Bolous.png" },
        { name: "Moran Rohana", phone: "052-890-9505", email: "rohana@gmail.com", image: "images/Moran.png" },
        { name: "Rouge Nijim", phone: "053-432-6646", email: "nijim@gmail.com", image: "images/Rouge.png" }
    ];

    addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showAddContactForm();
    });

    deleteAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteAllContacts();
    });

    function deleteAllContacts() {
        if (confirm("Are you sure you want to delete all contacts?")) {
            contacts = [];
            updateContactList();
            alert("All contacts have been deleted.");
        }
    }

    function deleteContact(index) {
        if (confirm("Are you sure you want to delete this contact?")) {
            contacts.splice(index, 1);
            updateContactList();
            alert("Contact has been deleted.");
        }
    }

    function showAddContactForm(contact = {}, index = null) {
        openModal(`
            <h2>${index !== null ? "Edit" : "Add"} Contact</h2>
            <label for="name">Name:</label>
            <input type="text" id="name" value="${contact.name || ''}" required>
            <label for="phone">Phone:</label>
            <input type="text" id="phone" value="${contact.phone || ''}" required>
            <label for="email">Email:</label>
            <input type="email" id="email" value="${contact.email || ''}" required>
            <label for="image">Image:</label>
            <input type="file" id="imageInput" accept="image/*"${contact.image ? ' value="' + contact.image + '"' : ''}>
            <img id="imagePreview" src="${contact.image || ''}" alt="Image Preview" style="display: ${contact.image ? 'block' : 'none'}; max-width: 200px; margin-top: 10px;">
            <button id="saveContact">${index !== null ? "Update" : "Save"} Contact</button>
            <button id="cancelContact">Cancel</button>
        `);

        const imageInput = document.getElementById("imageInput");
        const imagePreview = document.getElementById("imagePreview");

        imageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById("saveContact").addEventListener("click", (e) => {
            e.preventDefault();
            saveContact(index);
        });
        document.getElementById("cancelContact").addEventListener("click", (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    function saveContact(index) {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const imageInput = document.getElementById("imageInput");
        let image = '';

        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                image = e.target.result;
                const contact = { name, phone, email, image };
                if (index !== null) {
                    contacts[index] = contact;
                } else {
                    contacts.push(contact);
                }
                updateContactList();
                closeModal();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            const contact = { name, phone, email, image: '' };
            if (index !== null) {
                contacts[index] = contact;
            } else {
                contacts.push(contact);
            }
            updateContactList();
            closeModal();
        }
    }

    function updateContactList() {
        contactList.innerHTML = '';
        contacts.forEach((contact, index) => {
            const contactHTML = `
                <li>
                    <img src="${contact.image}" alt="${contact.name}" class="profile-pic">
                    <div class="info">
                        <div class="name">${contact.name}</div>
                        <div class="additional-info" id="info-${index}"></div>
                    </div>
                    <div class="button-group">
                        <button class="info-button" data-index="${index}"><img src="images/info.png" class="icon" alt=" Info"></button>
                        <button class="edit-button" data-index="${index}"><img src="images/edit.png" class="icon" alt=" Edit"></button>
                        <button class="delete-button" data-index="${index}"><img src="images/bin.png" class="icon" alt=" Delete"></button>
                    </div>
                </li>
            `;
            contactList.insertAdjacentHTML('beforeend', contactHTML);
        });

        document.querySelectorAll(".info-button").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.closest("button").getAttribute("data-index");
                showContactInfo(index);
            });
        });

        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.closest("button").getAttribute("data-index");
                showAddContactForm(contacts[index], index);
            });
        });

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.closest("button").getAttribute("data-index");
                deleteContact(index);
            });
        });
    }

    function showContactInfo(index) {
        const contact = contacts[index];
        const infoDiv = document.getElementById(`info-${index}`);
        if (infoDiv.innerHTML === '') {
            infoDiv.innerHTML = `
                <div class="phone">${contact.phone}</div>
                <div class="email">${contact.email}</div>
            `;
        } else {
            infoDiv.innerHTML = '';
        }
    }

    function openModal(content) {
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = content;
        modalContent.insertAdjacentHTML('afterbegin', '<span id="closeModalBtn">&times;</span>');
        modal.style.display = 'flex';

        document.getElementById('closeModalBtn').addEventListener("click", closeModal);
        modal.addEventListener("click", closeModal);
    }

    function closeModal(event) {
        if (!event || event.target === modal || event.target.id === 'closeModalBtn') {
            modal.style.display = 'none';
        }
    }

    // Initialize contact list
    updateContactList();
});
