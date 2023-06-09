import { getStrapiURL } from "./api";

export function getStrapiMedia(media) {

    if(media) {
        if(media.data){
            const url  = media.data.attributes.url;
            const imageUrl = url.startsWith("/") ? getStrapiURL(url) : url;
            return imageUrl;
        }
    } else {
        console.log("No media found");
    }
    
}