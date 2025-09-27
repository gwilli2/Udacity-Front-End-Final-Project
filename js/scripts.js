/* Set page title to author's/my name. */
const aboutMeTitle = async() => {
    const heading = document.querySelector('h1');
    heading.textContent = "Gregory Williams II";
}

/* Fill the About Me Section with a paragraph and a picture from the AboutMeData.json file. */
async function loadAboutMe() {
    try {
        const response = await fetch("./data/aboutMeData.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const aboutMeDiv = document.querySelector("#aboutMe");

        const aboutMeParagraph = document.createElement("p");
        aboutMeParagraph.textContent = data.aboutMe;

        const headshotContainer = document.createElement("div");
        headshotContainer.classList.add("headshotContainer");

        const headshotImage = document.createElement("img");
        headshotImage.src = data.headshot;
        headshotImage.alt = "Headshot of Gregory Williams II";
        headshotImage.classList.add("headshot");

        aboutMeDiv.appendChild(aboutMeParagraph);
        aboutMeDiv.appendChild(headshotContainer);
        headshotContainer.appendChild(headshotImage);
    } catch (error) {
        console.error("Error loading about me data:", error);
    }
}
async function loadProjects() {
    try {
        const response = await fetch("./data/projectsData.json"); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const projectsDiv = document.querySelector("#projectList");
        const spotlightDiv = document.querySelector("#projectSpotlight");

        //helper to update the spotlight section
        function updateSpotlight(project) {
            const title = project.project_name ?? "Untitled Project";
            const description = project.long_description ?? "No description available.";
            const spotlightImage = project.spotlight_image ?? "./images/spotlight_placeholder_bg.webp";
            const url = project.url ?? "#";

            spotlightDiv.querySelector("#spotlightTitles").textContent = title;
            
            //Create new p and a elements if they don't exist
            if (!spotlightDiv.querySelector("p")) {
                const p = document.createElement("p");
                spotlightDiv.appendChild(p);
            }
            if (!spotlightDiv.querySelector("a")) {
                const a = document.createElement("a");
                spotlightDiv.appendChild(a);
            }
            
            //Update content of existing p and a elements
            spotlightDiv.querySelector("p").textContent = description;
            spotlightDiv.querySelector("a").setAttribute("href", url);
            spotlightDiv.style.backgroundImage = `url(${spotlightImage})`;
            
        }

        data.forEach(project => {
            const card = document.createElement("div");
            card.classList.add("projectCard");
            card.dataset.projectId = project.project_id;

            //title
            const cardTitle = document.createElement("h3");
            cardTitle.textContent = project.project_name ?? "Untitled Project";

            //short description
            const cardDescription = document.createElement("p");
            cardDescription.textContent = project.short_description ?? "No description available.";

            //background image
            card.style.backgroundImage = `url(${project.card_image ?? "./images/card_placeholder_bg.webp"})`;

            //append
            card.appendChild(cardTitle);
            card.appendChild(cardDescription);
            projectsDiv.appendChild(card);

            //listener to update spotlight on click
            card.addEventListener("pointerdown", () => {
                updateSpotlight(project);
            });
        });

        if (data.length > 0) {
            updateSpotlight(data[0]);
        }

        //nav arrows
        const leftArrow = document.querySelector(".arrow-left");
        const rightArrow = document.querySelector(".arrow-right");

        function navigateProjects(direction) {
            const isMobile = window.matchMedia("(max-width: 768px)").matches;
            const scrollamount = 200;

            if(isMobile) { //horizontal scroll for mobile
                projectsDiv.scrollBy({
                    left: direction * scrollamount,
                    behavior: 'smooth'
                });
            } else { //vertical scroll for desktop
                projectsDiv.scrollBy({
                    top: direction * scrollamount,
                    behavior: 'smooth'
                });
            }
        }

        leftArrow.addEventListener("pointerdown", () => {
            navigateProjects(-1);
        });

        rightArrow.addEventListener("pointerdown", () => {
            navigateProjects(1);
        });
    } catch (error) {
        console.error("Error loading projects data:", error);
    }
}

function submitContactForm() {
    const email = document.querySelector("#contactEmail");
    
    const message = document.querySelector("#contactMessage");
    const maxCharacters = 300;
    const charCounter = document.querySelector("#charactersLeft");

    const btn = document.querySelector("#formsubmit");

    //check character count on user input
    message.addEventListener("input", () => {
        const currCharacters = message.value.length;
        const remainingCharacters = maxCharacters - currCharacters;

        charCounter.textContent = `Characters: ${currCharacters}/${maxCharacters}`;

        if (remainingCharacters < 0) {
            charCounter.style.color = "red";
        }
        else {
            charCounter.style.color = "black";
        }

    });

    //validate email
    function isEmailValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isMessageValid(message) {
        const regex = /[^a-zA-Z0-9@._-]/;
        return !regex.test(message);
    }

    //handle Submit button click
    btn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const emailInput = email.value.trim();
        const emailError = document.querySelector("#emailError");

        const messageInput = message.value.trim();
        const errorMessage = document.querySelector("#messageError");

        let valid = true;

        //set error messages to empty if user re-submits
        errorMessage.textContent = "";
        emailError.textContent = "";
    
        //user must have < 300 characters
        if (message.value.length > maxCharacters) {
            errorMessage.textContent = "You have exceeded the 300 character limit. Please shorten your message and try submitting again.";
            valid = false;
        }

        //user must enter a message
        if (message.value.length === 0) {
            errorMessage.textContent = "Please enter a message before submitting.";
            valid = false;
        }

        //validate message content
        if (!isMessageValid(messageInput)) {
            errorMessage.textContent = "Your message contains invalid characters. Please remove them and try submitting again.";
            valid = false;
        }

        //user must enter an email
        if (email.value.length === 0) {
            emailError.textContent = "You must enter an email address to submit the contact form.";
            valid = false;
        }

        //validate email format
        if (!isEmailValid(emailInput)) {
            emailError.textContent = "Please enter a valid email address.";
            valid = false;
        }

        //check email for invalid characters
        if (!isMessageValid(emailInput)) {
            emailError.textContent = "Your email address contains invalid characters. Please remove them and try submitting again.";
            valid = false;
        }

        //Return if any validation failed
        if(!valid) {
            return;
        }

        // Successful submission. Clear the form fields
        email.value = "";
        message.value = "";
        errorMessage.textContent = "";
        emailError.textContent = "";
        charCounter.textContent = `Characters: ${message.value.length}/${maxCharacters}`;
        charCounter.style.color = "black";

        // Simulate form submission
        alert("Thank you for your message! I will get back to you soon.");

    });
    
}

document.addEventListener('DOMContentLoaded', () => {
    aboutMeTitle();
    loadAboutMe();
    loadProjects();
    submitContactForm();
});