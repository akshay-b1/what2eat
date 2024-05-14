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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Restaurant[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { latitude, longitude, cuisine } = req.query;

  if (!latitude || !longitude || !cuisine) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const placesResponse: PlacesNearbyResponse = await client.placesNearby({
      params: {
        location: { lat: parseFloat(latitude as string), lng: parseFloat(longitude as string) },
        radius: 5000,
        type: 'restaurant',
        keyword: cuisine as string,
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });

    const restaurants: Restaurant[] = placesResponse.data.results
    .filter(result => result.name && result.vicinity)
    .map(result => ({
      name: result.name!,
      address: result.vicinity!,
      rating: result.rating,
      priceLevel: result.price_level,
    }));
    
    res.status(200).json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching restaurants' });
  }
}