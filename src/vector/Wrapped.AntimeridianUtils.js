/*
 * @namespace L.Wrapped
 * Utility functions to calculate various shared aspects of mapping a line
 * accross the antimeridian.
 */

import * as MathUtils from './Wrapped.MathUtils';

// @function calculateAntimeridianLat (latLngA: L.LatLng, latLngB: L.LatLng)
// Returns the calculated latitude where a line drawn between
// two Latitude/Longitude points will cross the antimeridian.
export function calculateAntimeridianLat(latLngA, latLngB) {
	if (latLngA instanceof L.LatLng && latLngB instanceof L.LatLng) {
		// Ensure that the latitude A is less than latidue B. This will allow the
		// crossing point to be calculated based on the proportional similarity of
		// right triangles.

		// Locate which latitude is lower on the map. This will be the most
		// accute angle of the right triangle. If the lowest latitude is not latLngA
		// then swap the latlngs so it is.
		if (latLngA.lat > latLngB.lat) {
			var temp = latLngA;
			latLngA = latLngB;
			latLngB = temp;
		}

		// This gets the width of the distance between the two points
		// (The bottom of a large right triangle drawn between them)
		var A = 360 - Math.abs(latLngA.lng - latLngB.lng);
		// This gets the height of the of distance between the two points
		// (The vertical line of a large right triange drawn between them)
		var B = latLngB.lat - latLngA.lat;
		// This gets the bottom distance of a proportional triangle inside the large
		// trangle where the vertical line instead sits at the 180 mark.
		var a = Math.abs(180 - Math.abs(latLngA.lng));

		// Because triangle with identical angles must be proportional along the sides,
		// find the length of the vertical side of that inner triangle and then
		// add it to the lower point to predict the crossing point of the Antimeridian.
		return latLngA.lat + ((B * a) / A);
	} else {
		throw new Error('In order to calculate the Antimeridian latitude, two valid LatLngs are required.');
	}
}

// @function isCrossAntimeridian(latLngA: L.LatLng, latLngB: L.LatLng)
// Returns true if the line between the two points will cross either
// the prime meridian (Greenwich) or its antimeridian (International Date Line)
export function isCrossMeridian(latLngA, latLngB) {
	if (latLngA instanceof L.LatLng && latLngB instanceof L.LatLng) {
		// Returns true if the signs are not the same.
		return MathUtils.sign(latLngA.lng) * MathUtils.sign(latLngB.lng) < 0;
	} else {
		throw new Error('In order to calculate whether two LatLngs cross a meridian, two valid LatLngs are required.');
	}
}


// @function pushLatLng(ring: L.Point[], projectedBounds: L.Bounds, latlng: L.LatLng, map: L.Map)
// Adds the latlng to the current ring as a layer point and expands the projected bounds.
export function pushLatLng(ring, projectedBounds, latlng, map) {
	if (ring instanceof Array && projectedBounds instanceof L.Bounds && latlng instanceof L.LatLng && map instanceof L.Map) {
		ring.push(map.latLngToLayerPoint(latlng));
		projectedBounds.extend(ring[ring.length - 1]);
	} else {
		throw new Error('In order to push a LatLng into a ring, the ring point array, the LatLng, the projectedBounds, and the map must all be valid.');
	}
}

// @function isBreakRing(latLngA: L.LatLng, latLngB: L.LatLng)
// Determines when the ring should be broken and a new one started.
// This will return true if the distance is smaller when mapped across the Antimeridian.
export function isBreakRing(latLngA, latLngB) {
	if (latLngA instanceof L.LatLng && latLngB instanceof L.LatLng) {
		return isCrossMeridian(latLngA, latLngB)  &&
		(360 - Math.abs(latLngA.lng) - Math.abs(latLngB.lng) < 180);

	} else {
		throw new Error('In order to calculate whether the ring created by two LatLngs should be broken, two valid LatLngs are required.');
	}
}

// @function breakRing(currentLat: L.LatLng, nextLat: L.LatLng, rings: L.Point[][],
//  projectedBounds: L.Bounds, map: L.Map)
// Breaks the existing ring along the anti-meridian.
// returns the starting latLng for the next ring.
export function breakRing(currentLat, nextLat, rings, projectedBounds, map) {
	if (currentLat instanceof L.LatLng && nextLat instanceof L.LatLng && rings instanceof Array && projectedBounds instanceof L.Bounds && map instanceof L.Map) {
		var ring = rings[rings.length - 1];

		// Calculate two points for the anti-meridian crossing.
		var breakLat = calculateAntimeridianLat(currentLat, nextLat);
		var breakLatLngs = [new L.LatLng(breakLat, 180), new L.LatLng(breakLat, -180)];

		// Add in first anti-meridian latlng to this ring to finish it.
		// Positive if positive, negative if negative.
		if (MathUtils.sign(currentLat.lng) > 0) {
			pushLatLng(ring, projectedBounds, breakLatLngs.shift(), map);
		} else {
			pushLatLng(ring, projectedBounds, breakLatLngs.pop(), map);
		}

		// Return the second anti-meridian latlng
		return breakLatLngs.pop();
	} else {
		throw new Error('In order to break a ring, all the inputs must exist and be valid.');
	}
}
