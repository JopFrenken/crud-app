let photoContainer = document.querySelector('.photos-container');
let addPhotoButton = document.querySelector('.add-btn');
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
            let img = document.createElement('img');
            let p = document.createElement('p');

            // Create "Edit" button
            let editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button', 'photo-button', 'btn', 'btn-primary', 'mt-2');

            // Create "Delete" button
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button', 'photo-button', 'btn', 'btn-danger', 'mt-2');

            // Hide buttons initially
            editButton.style.display = 'none';
            deleteButton.style.display = 'none';

            img.src = photo.image_path;
            img.alt = photo.description;
            img.classList.add('fixed-size-img');
            p.textContent = photo.title;
            p.classList.add('photo-text', 'mt-2');

            imgContainer.appendChild(img);
            imgContainer.appendChild(editButton);
            imgContainer.appendChild(deleteButton);
            imgContainer.classList.add('image-container');
            container.appendChild(imgContainer);
            container.appendChild(p);
            photoContainer.appendChild(container);

            // Add hover event listeners to show/hide buttons
            imgContainer.addEventListener('mouseenter', () => {
                editButton.style.display = 'block';
                deleteButton.style.display = 'block';
            });

            imgContainer.addEventListener('mouseleave', () => {
                editButton.style.display = 'none';
                deleteButton.style.display = 'none';
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

indexPhotos();