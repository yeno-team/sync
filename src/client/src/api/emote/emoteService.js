import Axios from 'axios';
import config from '../../config';

// BTTV WRAPPER - api.betterttv.net

/**
 * Get the image link for the emote by its id
 * 
 * @param {string} id 
 * @param {string} size - 1x, 2x, 3x
 */
export const getEmoteImageUrlFromId = (id, size="3x") => {
    return `https://cdn.betterttv.net/emote/${id}/${size}`
}