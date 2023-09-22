const photoContainer = document.querySelector('.photos-container');
const addPhotoButton = document.querySelector('.add-btn');
const titleInput = document.querySelector('.title-input');
const descriptionInput = document.querySelector('.description-input');
const imageInput = document.querySelector('.image-input');

let indexPhotos = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/photos');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        json.forEach(photo => {
            let container = document.createElement('div'); // Create a container div
            let imgContainer = document.createElement('div'); // Create a container for the image and buttons
            let buttonContainer = document.createElement('div');
            buttonContainer.classList.add('buttons-container', 'btn-group', 'position-absolute', 'top-50', 'start-50');
            imgContainer.classList.add('image-container', 'position-relative');
            let img = document.createElement('img');
            let p = document.createElement('p');

            // Create "Edit" button
            let editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button', 'photo-button', 'btn', 'btn-success', 'mt-2');

            // Create "Delete" button
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button', 'photo-button', 'btn', 'btn-danger', 'mt-2');

            // Create "Show" button
            let showButton = document.createElement('button');
            showButton.textContent = 'Show';
            showButton.classList.add('show-button', 'photo-button', 'btn', 'btn-primary', 'mt-2')

            // Hide buttons initially
            editButton.style.display = 'none';
            deleteButton.style.display = 'none';
            showButton.style.display = 'none';

            editButton.addEventListener('click', () => {
                openModal(photo.id);
            })

            showButton.addEventListener('click', () => {
                showPhoto(photo.id);
            })

            deleteButton.addEventListener('click', () => {
                const confirmDelete = window.confirm('Are you sure you want to delete this photo?');
                if (confirmDelete) {
                    deletePhoto(photo.id);
                }
            })

            img.src = photo.image_path;
            img.alt = photo.description;
            img.classList.add('fixed-size-img');
            p.textContent = photo.title;
            p.classList.add('photo-text', 'mt-2');

            imgContainer.appendChild(img);
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(showButton);
            buttonContainer.appendChild(deleteButton);
            imgContainer.appendChild(buttonContainer);
            container.appendChild(imgContainer);
            container.appendChild(p);
            photoContainer.appendChild(container);

            // Add hover event listeners to show/hide buttons
            imgContainer.addEventListener('mouseenter', () => {
                editButton.style.display = 'block';
                deleteButton.style.display = 'block';
                showButton.style.display = 'block';
            });

            imgContainer.addEventListener('mouseleave', () => {
                editButton.style.display = 'none';
                deleteButton.style.display = 'none';
                showButton.style.display = 'none';
            });
        });

    } catch (error) {
        console.error('Fetch error:', error);
    }
};

addPhotoButton.addEventListener('click', async () => {
    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('description', descriptionInput.value);
    formData.append('image', file);

    const response = await fetch('http://localhost:8000/api/photos', {
        method: 'POST',
        body: formData
    });
    const json = await response.json();
    console.log(json);
    window.location.reload();
    titleInput.value = "";
    descriptionInput.value = "";
    imageInput.value = "";
})

let openModal = async (photoId) => {
    $('.edit-title-input').val(''); // Clear the title input
    $('.edit-image-input').val(''); // Clear the image input

    $('#editModal').modal('show');

    $('.add-btn').click(function () {
        let title = $('.edit-title-input').val();
        let fileInput = $('.edit-image-input')[0];
        let selectedFile = fileInput.files[0];
        editPhoto(photoId, title, selectedFile);
    });
}

let editPhoto = async (photoId, title, selectedFile) => {
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', selectedFile);

        console.log(formData);

        const response = await fetch(`http://localhost:8000/api/photos/${photoId}`, {
            method: 'POST',
            body: formData,
        });

        const json = await response.json();

        window.location.reload();

    } catch (error) {
        console.error('Fetch error:', error);
    }
};

let showPhoto = async (photoId) => {
    try {
        const response = await fetch(`http://localhost:8000/api/photos/${photoId}`);
        const json = await response.json();

        // Set the JSON data in the modal
        $("#showModal .modal-title").text(json.title);
        $("#showModal .modal-body").html(`
            <div class="d-flex align-items-center flex-column">
            <p><strong>Description:</strong> ${json.description}</p>
            <img class="show-img" src='${json.image_path}' alt="Photo Image">
            </div>
        `);

        // Open the modal
        $("#showModal").modal("show");

    } catch (error) {
        console.error('Fetch error: ', error);
    }
}

let deletePhoto = async (photoId) => {
    try {
        const response = await fetch(`http://localhost:8000/api/photos/${photoId}`, {
            method: 'DELETE'
        });
        const json = await response.json();
        window.location.reload();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

indexPhotos();