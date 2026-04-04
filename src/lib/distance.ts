import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

/**
 * Calculates the distance between two cities using Google Maps Distance Matrix API.
 * 
 * @param originCity City of the band
 * @param destinationCity City of the gig
 * @returns Distance in kilometers
 */
export async function getDistanceBetweenCities(originCity: string, destinationCity: string): Promise<number | null> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn("GOOGLE_MAPS_API_KEY is not defined. Distance calculation skipped.");
        return null;
    }

    try {
        const response = await client.distancematrix({
            params: {
                origins: [originCity],
                destinations: [destinationCity],
                key: apiKey,
                mode: "driving" as any,
                units: "metric" as any,
            },
            timeout: 5000,
        });

        if (response.data.status === "OK") {
            const element = response.data.rows[0].elements[0];
            if (element.status === "OK") {
                // distance.value is in meters, convert to km
                return element.distance.value / 1000;
            }
        }

        console.error("Distance Matrix API returned non-OK status:", response.data.status);
        return null;
    } catch (error) {
        console.error("Error calculating distance:", error);
        return null;
    }
}
