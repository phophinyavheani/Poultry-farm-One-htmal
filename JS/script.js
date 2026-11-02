
document.addEventListener("DOMContentLoaded", function () {

    //  AUTOMATIC COPYRIGHT YEAR//
    const year = document.getElementById("current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    //  PRODUCT SEARCH AND CATEGORY FILTER // 
    const searchInput = document.getElementById("product-search");
    const categoryFilter = document.getElementById("category-filter");

    const productCards = Array.from(
        document.querySelectorAll(".product-card")
    );

    const noProducts = document.getElementById("no-products");
    const productCount = document.getElementById("product-count");

    function filterProducts() {
        if (!searchInput || !categoryFilter) {
            return;
        }

        const term = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;
        let visible = 0;

        productCards.forEach(function (card) {
            const productName = (
                card.dataset.name || card.textContent
            ).toLowerCase();

            const matchesSearch = productName.includes(term);

            const matchesCategory =
                category === "all" ||
                card.dataset.category === category;

            const show = matchesSearch && matchesCategory;

            card.hidden = !show;

            if (show) {
                visible++;
            }
        });

        if (noProducts) {
            noProducts.hidden = visible !== 0;
        }

        if (productCount) {
            productCount.textContent =
                `Showing ${visible} of ${productCards.length} products`;
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterProducts);
    }

    if (searchInput && categoryFilter) {
        filterProducts();
    }


    // ENQUIRY PRODUCT SELECTION// 
    const productSelect = document.getElementById("product");

    if (productSelect) {
        const parameters = new URLSearchParams(window.location.search);
        const requestedProduct = parameters.get("product");

        if (requestedProduct) {
            const option = Array.from(productSelect.options).find(
                function (item) {
                    return item.text.trim().toLowerCase() ===
                        requestedProduct.trim().toLowerCase();
                }
            );

            if (option) {
                productSelect.value = option.value;
            }
        }

        // Prevent customers from selecting a date in the past.
        const dateInput = document.getElementById("date");

        if (dateInput) {
            const today = new Date();

            const localDate = new Date(
                today.getTime() -
                today.getTimezoneOffset() * 60000
            ).toISOString().split("T")[0];

            dateInput.min = localDate;
        }
    }


    //  PRODUCT IMAGE GALLERY / LIGHTBOX// 
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeLightbox = document.getElementById("close-lightbox");

    let previousFocus = null;

    function closeViewer() {
        if (!lightbox) {
            return;
        }

        lightbox.hidden = true;
        document.body.classList.remove("no-scroll");

        if (previousFocus) {
            previousFocus.focus();
        }
    }

    document.querySelectorAll("[data-lightbox]").forEach(
        function (button) {
            button.addEventListener("click", function () {
                if (!lightbox || !lightboxImage) {
                    return;
                }

                previousFocus = button;

                lightboxImage.src = button.dataset.lightbox;
                lightboxImage.alt =
                    button.dataset.alt || "Enlarged product image";

                lightbox.hidden = false;
                document.body.classList.add("no-scroll");

                if (closeLightbox) {
                    closeLightbox.focus();
                }
            });
        }
    );

    if (closeLightbox) {
        closeLightbox.addEventListener("click", closeViewer);
    }

    if (lightbox) {
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeViewer();
            }
        });
    }

    // Close the image viewer when Escape is pressed.
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            lightbox &&
            !lightbox.hidden
        ) {
            closeViewer();
        }
    });


    
    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("visible");
        });
    }


    

    // Confirm this email address is correct before using the forms.
    const recipient = "popzela@67gmail.com";

    document.querySelectorAll(".validated-form").forEach(
        function (form) {
            const status = document.getElementById(
                form.id === "enquiry-form"
                    ? "enquiry-status"
                    : "contact-status"
            );

            // Clear an individual field's validation error.
            function clearFieldError(field) {
                field.removeAttribute("aria-invalid");

                const error = document.getElementById(
                    `${field.id}-error`
                );

                if (error) {
                    error.textContent = "";
                }
            }

            // Display a validation error beside a field.
            function showFieldError(field, message) {
                field.setAttribute("aria-invalid", "true");

                const error = document.getElementById(
                    `${field.id}-error`
                );

                if (error) {
                    error.textContent = message;
                }
            }

            // Clear errors when customers edit fields.
            form.querySelectorAll("input, select, textarea").forEach(
                function (field) {
                    field.addEventListener("input", function () {
                        clearFieldError(field);
                    });

                    field.addEventListener("change", function () {
                        clearFieldError(field);
                    });
                }
            );

            // Clear validation messages when the form is reset.
            form.addEventListener("reset", function () {
                window.setTimeout(function () {
                    form.querySelectorAll(
                        "input, select, textarea"
                    ).forEach(clearFieldError);

                    if (status) {
                        status.textContent = "";
                    }
                }, 0);
            });

            // Validate the form before creating an email draft.
            form.addEventListener("submit", function (event) {
                event.preventDefault();

                let isValid = true;
                let firstInvalid = null;

                form.querySelectorAll(
                    "input, select, textarea"
                ).forEach(function (field) {
                    clearFieldError(field);

                    if (!field.checkValidity()) {
                        isValid = false;

                        if (!firstInvalid) {
                            firstInvalid = field;
                        }

                        let message = "Please check this field.";

                        if (field.validity.valueMissing) {
                            message = "This field is required.";
                        } else if (field.validity.typeMismatch) {
                            message =
                                "Please enter a valid email address.";
                        } else if (field.validity.patternMismatch) {
                            message =
                                "Enter a valid South African phone number, " +
                                "for example 0712345678 or +27712345678.";
                        } else if (field.validity.tooShort) {
                            message = "Please enter more information.";
                        } else if (field.validity.rangeUnderflow) {
                            message =
                                "Please enter a valid quantity or future date.";
                        }

                        showFieldError(field, message);
                    }
                });

                if (!isValid) {
                    if (status) {
                        status.textContent =
                            "Please correct the errors above and try again.";
                    }

                    if (firstInvalid) {
                        firstInvalid.focus();
                    }

                    return;
                }

                const data = new FormData(form);
                let subject;
                let body;

                // Build an enquiry email.
                if (form.dataset.formType === "enquiry") {
                    subject = "Poultry Product Enquiry";

                    body =
                        "Customer name: " + (data.get("fullname") || "") + "\n" +
                        "Email: " + (data.get("email") || "") + "\n" +
                        "Phone: " + (data.get("phone") || "") + "\n" +
                        "Product: " + (data.get("product") || "") + "\n" +
                        "Quantity: " + (data.get("quantity") || "") + "\n" +
                        "Preferred collection date: " +
                        (data.get("date") || "Not specified") + "\n" +
                        "Additional details: " +
                        (data.get("message") || "None");
                } else {
                    // Build a contact email.
                    subject =
                        "Website Contact: " + (data.get("subject") || "");

                    body =
                        "Customer name: " + (data.get("name") || "") + "\n" +
                        "Email: " + (data.get("email") || "") + "\n" +
                        "Phone: " + (data.get("phone") || "Not provided") + "\n" +
                        "Message type: " + (data.get("subject") || "") + "\n" +
                        "Message: " + (data.get("message") || "");
                }

                if (
                    !recipient ||
                    recipient.includes("example.com") ||
                    recipient.includes("YOUR-BUSINESS-EMAIL")
                ) {
                    if (status) {
                        status.textContent =
                            "The form is valid, but the business email " +
                            "address must be configured before sending.";
                    }

                    return;
                }

                if (status) {
                    status.textContent =
                        "Your email draft is opening. Review it and " +
                        "press Send in your email application.";
                }

                const mailto =
                    "mailto:" + recipient +
                    "?subject=" + encodeURIComponent(subject) +
                    "&body=" + encodeURIComponent(body);

                window.location.href = mailto;
            });
        }
    );


    
    const mapElement = document.getElementById("farm-map");

    // Only initialise the map on pages that contain it.
    if (mapElement && typeof L !== "undefined") {

        // Approximate starting point for the Thononda area.
        // Replace with verified farm coordinates when available.
        const farmCoordinates = [-22.9, 29.8];

        const map = L.map("farm-map").setView(
            farmCoordinates,
            12
        );

        // Add OpenStreetMap tiles.
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">' +
                    "OpenStreetMap</a> contributors"
            }
        ).addTo(map);

        // Add the farm-area marker.
        L.marker(farmCoordinates)
            .addTo(map)
            .bindPopup(
                "<strong>Nyavhas M Poultry Farm</strong><br>" +
                "Thononda Village area, Limpopo"
            );

        // Correct the map size after the page has rendered.
        window.setTimeout(function () {
            map.invalidateSize();
        }, 200);
    }

});


/* FARM GALLERY LIGHTBOX */
document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.querySelector(".farm-gallery");
    const lightbox = document.getElementById("farm-lightbox");

    if (!gallery || !lightbox) {
        return;
    }

    const galleryItems = Array.from(
        gallery.querySelectorAll(".gallery-item")
    );

    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.getElementById("lightbox-close");
    const previousButton = document.getElementById("lightbox-prev");
    const nextButton = document.getElementById("lightbox-next");

    let currentIndex = 0;
    let previouslyFocusedElement = null;

    function showImage(index) {
        currentIndex =
            (index + galleryItems.length) % galleryItems.length;

        const button = galleryItems[currentIndex];
        const image = button.querySelector("img");
        const caption = button.querySelector("span");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = caption.textContent;
    }

    function openLightbox(index) {
        previouslyFocusedElement = document.activeElement;

        showImage(index);

        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        lightboxImage.src = "";
        lightboxImage.alt = "";

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    }

    galleryItems.forEach(function (item, index) {
        item.addEventListener("click", function () {
            openLightbox(index);
        });
    });

    closeButton.addEventListener("click", closeLightbox);

    previousButton.addEventListener("click", function () {
        showImage(currentIndex - 1);
    });

    nextButton.addEventListener("click", function () {
        showImage(currentIndex + 1);
    });

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (lightbox.hidden) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            showImage(currentIndex - 1);
        } else if (event.key === "ArrowRight") {
            showImage(currentIndex + 1);
        }
    });

});



// NYAVHAS M POULTRY FARM - LEAFLET MAP // 

document.addEventListener("DOMContentLoaded", function () {

    // Get the map container from contact.html
    const mapContainer = document.getElementById("farm-map");

    // Stop if the map container or Leaflet library is unavailable
    if (!mapContainer || typeof L === "undefined") {
        return;
    }

    // Prevent the map from being initialised more than once
    if (mapContainer._leaflet_id) {
        return;
    }

    // Create the map and set the starting location to Thononda
    const map = L.map("farm-map").setView([-22.95, 30.45], 12);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Farm and service area locations
    // IMPORTANT: These coordinates are approximate placeholders.
    // Verify the exact village coordinates before submitting.

    const locations = [
        {
            name: "Nyavhas M Poultry Farm - Thononda",
            coordinates: [-22.95, 30.45],
            description: "Main farm and collection point."
        },
        {
            name: "Tshiheni",
            coordinates: [-22.96, 30.43],
            description: "Nyavhas M Poultry Farm service area."
        },
        {
            name: "Tshithuthuni",
            coordinates: [-22.94, 30.47],
            description: "Nyavhas M Poultry Farm service area."
        },
        {
            name: "Tshiendelu",
            coordinates: [-22.97, 30.44],
            description: "Nyavhas M Poultry Farm service area."
        },
        {
            name: "Mazwimba",
            coordinates: [-22.93, 30.46],
            description: "Nyavhas M Poultry Farm service area."
        },
        {
            name: "Maname",
            coordinates: [-22.98, 30.42],
            description: "Nyavhas M Poultry Farm service area."
        }
    ];

    // Add a marker and popup for every location
    locations.forEach(function (location) {

        L.marker(location.coordinates)
            .addTo(map)
            .bindPopup(
                "<strong>" + location.name + "</strong><br>" +
                location.description
            );

    });

    // Automatically adjust the map to show all markers
    const markerLocations = locations.map(function (location) {
        return location.coordinates;
    });

    map.fitBounds(markerLocations, {
        padding: [30, 30]
    });

});
