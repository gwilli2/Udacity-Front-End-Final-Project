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
        const response = await fetch("../starter/data/aboutMeData.json");
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

document.addEventListener('DOMContentLoaded', () => {
    aboutMeTitle();
    loadAboutMe();
})