import type { NextApiRequest, NextApiResponse } from 'next';
import { Client, PlacesNearbyResponse } from '@googlemaps/google-maps-services-js';
require('dotenv').config();

const client = new Client({});

interface Restaurant {
  name: string;
  address: string;
  rating?: number;
  priceLevel?: number;
}

// get nearby restaurants based on user's location and make a collection called nearbyRestaurants to store all the restaurants in an array called items

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Restaurant[] | { error: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { latitude, longitude } = req.query;

    try {
        const placesResponse: PlacesNearbyResponse = await client.placesNearby({
            params: {
                location: { lat: parseFloat(latitude as string), lng: parseFloat(longitude as string) },
                radius: 11000, // in meters
                type: 'restaurant',
                key: process.env.GOOGLE_MAPS_API_KEY as string,
            },
        });

        const nearbyRestaurants: Restaurant[] = placesResponse.data.results
        .filter(result => result.name && result.vicinity)
        .map(result => ({
            name: result.name!,
            address: result.vicinity!,
            rating: result.rating,
            priceLevel: result.price_level,
        }));
        
        res.status(200).json(nearbyRestaurants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching restaurants' });
    }

    // push the items to the nearbyRestaurants collection 
}