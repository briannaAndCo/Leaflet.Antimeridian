/*
 * @namespace L.Wrapped
 * Utility functions to calculate various aspects of linear geometry to
 * calculate if lines should be wrapped as well as common functionality used by both Polygons and Polylines.
 */

// @function calculateAntimeridianLat (latLngA: LatLng, latLngB: latLng)
// Returns the calculated latitude where a line drawn between
// two Latitude/Longitude points will cross the antimeridian.
export function calculateAntimeridianLat(latLngA, latLngB) {
	// Ensure that the latitude A is less than latidue B. This will allow the
	// crossing point to be calculated based on the purportional similarity of
	// right triangles.
	if (latLngA.lat > latLngB.lat) {
		var temp = latLngA;
		latLngA = latLngB;
		latLngB = temp;
	}

	var A = 360 - Math.abs(latLngA.lng - latLngB.lng);
	var B = latLngB.lat - latLngA.lat;
	var a = Math.abs(180 - Math.abs(latLngA.lng));

	return latLngA.lat + ((B * a) / A);
}

// @function isCrossAntimeridian(latLngA: LatLng, latLngB: LatLng)
// Returns true if the line between the two points will cross either
// the prime meridian (Greenwich) or its antimeridian (International Date Line)
export function isCrossMeridian(latLngA, latLngB) {
	// Returns true if the signs are not the same.
	return sign(latLngA.lng) * sign(latLngB.lng) < 0;
}

// @function sign(Number)
// Returns NaN for non-numbers, 0 for 0, -1 for negative numbers,
// 1 for positive numbers
export function sign(x) {
	return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : 0 : NaN;
}


// @function pushLatLng(ring: Point[], projectedBounds: LatLngBounds, latlng: LatLng, map: Map)
// Adds the latlng to the current ring as a layer point and expands the projected bounds.
export function pushLatLng(ring, projectedBounds, latlng, map) {
	ring.push(map.latLngToLayerPoint(latlng));
	projectedBounds.extend(ring[ring.length - 1]);
}

// @function isBreakRing(latLngA: LatLng, latLngB: LatLng)
// Determines when the ring should be broken and a new one started.
export function isBreakRing(latLngA, latLngB) {
	return isCrossMeridian(latLngA, latLngB)  &&
	Math.abs(latLngA.lng) > 90 &&
	Math.abs(latLngB.lng) > 90;
}

// @function breakRing(currentLat: LatLng, nextLat: LatLng, rings: Point[][],
//  projectedBounds: LatLngBounds, map: Map)
// Breaks the existing ring along the anti-meridian.
// returns the starting latLng for the next ring.
export function breakRing(currentLat, nextLat, rings, projectedBounds, map) {
	var ring = rings[rings.length - 1];

	// Calculate two points for the anti-meridian crossing.
	var breakLat = calculateAntimeridianLat(currentLat, nextLat);
	var breakLatLngs = [new L.LatLng(breakLat, 180), new L.LatLng(breakLat, -180)];

	// Add in first anti-meridian latlng to this ring to finish it.
	// Positive if positive, negative if negative.
	if (sign(currentLat.lng) > 0) {
		pushLatLng(ring, projectedBounds, breakLatLngs.shift(), map);
	} else {
		pushLatLng(ring, projectedBounds, breakLatLngs.pop(), map);
	}

	// Return the second anti-meridian latlng
	return breakLatLngs.pop();
}
