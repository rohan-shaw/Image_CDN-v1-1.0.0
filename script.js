const defaultUsername = '123';
const defaultPassword = '123';



function isAuthenticated() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    // Replace 'vrindh' and '@shaw' with your preferred username and password
    return (username == defaultUsername && password == defaultPassword);
}

// Function to show the login modal
function showLoginModal() {
    $('#loginModal').modal('show');
}

// Function to handle login form submission
function handleLogin() {
    const username = $('#username').val();
    const password = $('#password').val();

    // Replace 'vrindh' and '@shaw' with your preferred username and password
    if (username == defaultUsername && password == defaultPassword) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        $('#loginModal').modal('hide');
        loadGallery();
        // showLoginAlert()
    } else {
        showLoginError()
    }
}

$("#login-btn").on("click", function(event) {
    handleLogin();
});

// Function to handle logout
function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.reload();
}

// Function to fetch image filenames from the "images" folder
function getImageData(callback) {
    $.ajax({
        url: './Media/images/', // Adjust the path if needed 
        success: function(data) {
            console.log(data)
                // 'data' contains the list of files in the "images" folder
                // Filter out non-image files if needed
            let imageFiles = $(data).find('a').filter(function() {
                return this.href.match(/\.(jpe?g|png|gif|webp|svg)$/i);
            }).map(function() {
                return {
                    filename: this.href.substring(this.href.lastIndexOf('/') + 1),
                    url: this.href
                };
            }).get();
            console.log(imageFiles)

            callback(imageFiles);
        }
    });
}

// Function to generate the gallery for a specific page
function generateGalleryPage(imageData, pageNumber, itemsPerPage) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = imageData.slice(startIndex, endIndex);

    let galleryHtml = '';
    pageData.forEach(function(image) {
        galleryHtml += `
                    <div data-bs-toggle="modal" data-bs-target="#myModal" class="col-md-3 col-sm-6 mb-4 mdl-clk">
                        <div class="card p-0 card-border-animation">
                            <img class="img-responsive" src="${image.url}" data-fn="${image.filename}">
                        </div>
                    </div>
                `;
    });

    $('#gallery').html(galleryHtml);
}

// Function to generate pagination links
function generatePagination(imageData, itemsPerPage) {
    const totalPages = Math.ceil(imageData.length / itemsPerPage);
    let paginationHtml = '';

    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
                    <li class="page-item card-border-animation"><a class="page-link" href="#" data-page="${i}">${i}</a></li>
                `;
    }

    $('#pagination').html(paginationHtml);
}

// Fetch the image data, generate the gallery and pagination
function loadGallery() {
    if (isAuthenticated()) {

        console.log("showing images");
        const itemsPerPage = 8;
        let imageData;

        getImageData(function(data) {
            imageData = data;
            generateGalleryPage(imageData, 1, itemsPerPage);
            generatePagination(imageData, itemsPerPage);
        });

        // Handle pagination click events
        $(document).on('click', '.page-link', function(e) {
            e.preventDefault();
            const pageNumber = parseInt($(this).attr('data-page'));
            generateGalleryPage(imageData, pageNumber, itemsPerPage);

            // Scroll to the top of the gallery after pagination change
            window.scrollTo(0, 0);
        });

        // Handle "Copy URL" button click events
        $(document).on('click', '.copy-url', function() {
            const url = $(this).attr('data-url');
            copyToClipboard(url);
            showSuccessAlert();
        });
    } else {
        showLoginModal();
    }
};

// Function to copy URL to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    // document.execCommand('copy');
    navigator.clipboard.writeText(text);
    document.body.removeChild(textarea);
}

// Function to show success alert
function showSuccessAlert() {
    const alertHtml = `
                <div class="alert alert-info alert-dismissible fade show mx-2" role="alert">
                    URL copied to clipboard successfully!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
    $('#alert-container').html(alertHtml);
    // setTimeout(function () {
    //     $('.alert').alert('close');
    // }, 10000); // Close alert after 2 seconds
}

function showLoginAlert() {
    const alertHtml = `
                <div class="alert alert-success alert-dismissible fade show mx-2" role="alert">
                    Logged out!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
    $('#li-alert-container').html(alertHtml);
    // setTimeout(function () {
    //     $('.alert').alert('close');
    // }, 10000); // Close alert after 2 seconds
}

function showLogoutAlert() {
    const alertHtml = `
                <div class="alert alert-success alert-dismissible fade show mx-2" role="alert">
                    Logged In!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
    $('#lo-alert-container').html(alertHtml);
    // setTimeout(function () {
    //     $('.alert').alert('close');
    // }, 10000); // Close alert after 2 seconds
}

// For Image Modal
$(document).on('click', 'img', function() {
    const imgSrc = $(this).attr('src');
    const imgFilename = $(this).attr('data-fn');
    const data = `
                <center>
                    <img src="${imgSrc}" width="50%">
                    <div class="input-group mb-3 mt-3">
                        <span class="input-group-text" id="basic-addon1">File</span>
                        <input type="text" readonly value="${imgFilename}" class="form-control" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon2">URL</span>
                        <input type="text" readonly value="${imgSrc}" class="form-control" aria-describedby="basic-addon2">
                    </div>
                    <button class="btn btn-outline-danger copy-url" data-url="${imgSrc}">Copy URL</button>
                </center>
            `;
    $('#myModal').find('.modal-body').html(data);
    $('#myModal').modal();
});

// Load the gallery on document ready
$(document).ready(function() {
    loadGallery();

    // Handle logout button click event
    $('#logout-btn').on('click', function() {
        handleLogout();
        showLogoutAlert()
    });
});

// ===========================================================================================