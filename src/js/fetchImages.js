import axios from "axios";

const KEY = "27581732-0707b0b7b189b4d21132a1f5b";

async function fetchImages({ value, page }) {
    try {
        const params = new URLSearchParams({
            key: KEY,
            q: encodeURIComponent(value),
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: page || 1,
            per_page: 40,
        });
        const response = await axios.get(`https://pixabay.com/api/?${params}`);
        const images = response.data;

        return images;
    } catch (error) {
        console.log(error.message);
    }
}

export { fetchImages };