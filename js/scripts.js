let aboutMe
let projects

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
            card.addEventListener("click", () => {
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

        leftArrow.addEventListener("click", () => {
            navigateProjects(-1);
        });

        rightArrow.addEventListener("click", () => {
            navigateProjects(1);
        });
    } catch (error) {
        console.error("Error loading projects data:", error);
    }
}

/* Original Attempt for loading Projects Section from projectsData.json file.
async function loadProjects() {
    try {
        const response = await fetch("../starter/data/projectsData.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const projectsDiv = document.querySelector("#projects");

        data.projects.forEach(project => {
            const projectContainer = document.createElement("div");
            projectContainer.classList.add("projectContainer");

            const projectTitle = document.createElement("h3");
            projectTitle.textContent = project.title;

            const projectDescription = document.createElement("p");
            projectDescription.textContent = project.description;

            const projectLink = document.createElement("a");
            projectLink.href = project.link;
            projectLink.textContent = "View Project";
            projectLink.target = "_blank";
            projectLink.rel = "noopener noreferrer";

            projectsDiv.appendChild(projectContainer);
            projectContainer.appendChild(projectTitle);
            projectContainer.appendChild(projectDescription);
            projectContainer.appendChild(projectLink);
        });
    } catch (error) {
        console.error("Error loading projects data:", error);
    }
}*/

document.addEventListener('DOMContentLoaded', () => {
    aboutMeTitle();
    loadAboutMe();
    loadProjects();
});