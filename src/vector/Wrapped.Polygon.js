import * as LineUtils from './Wrapped.LineUtils';
/*
 * @namespace L.Wrapped
 * A polygon that will automatically split and wrap around the Antimeridian (Internation Date Line).
 */
export var Polygon = L.Polygon.extend({

	// recursively turns latlngs into a set of rings with projected coordinates
	_projectLatlngs: function (latlngs, result, projectedBounds) {
		var flat = latlngs[0] instanceof L.LatLng;

		if (flat) {
			this._createRings(latlngs, result, projectedBounds);
		} else {
			for (var i = 0; i < latlngs.length; i++) {
				this._projectLatlngs(latlngs[i], result, projectedBounds);
			}
		}
	},

	// Creates the rings used to render the latlngs.
	_createRings: function (latlngs, rings, projectedBounds) {
		var len = latlngs.length;
		rings.push([]);

		for (var i = 0; i < len; i++) {
			// Because this is a polygon, there will always be a comparison latlng
			var compareLatLng = this._getCompareLatLng(i, len, latlngs);

			LineUtils.pushLatLng(rings[rings.length - 1], projectedBounds, latlngs[i], this._map);

			// Check to see if the ring should be broken.
			if (LineUtils.isBreakRing(compareLatLng, latlngs[i])) {
				var secondMeridianLatLng = LineUtils.breakRing(latlngs[i], compareLatLng,
					rings, projectedBounds, this._map);

				this._startNextRing(rings, projectedBounds, secondMeridianLatLng, i === len - 1);
			}
		}

		// Join the last two rings if needed.
		this._joinLastRing(rings, latlngs);
	},

	// Starts a new ring if needed and adds the second meridian point to the
	// correct ring.
	_startNextRing: function (rings, projectedBounds, secondMeridianLatLng, isLastLatLng) {
		var ring;
		if (!isLastLatLng) {
			ring = [];
			rings.push(ring);
			LineUtils.pushLatLng(ring, projectedBounds, secondMeridianLatLng, this._map);
		} else {
			// If this is the last latlng, don't bother starting a new ring.
			// instead, join the last meridian point to the first point, to connect
			// the shape correctly.
			ring = rings[0];
			ring.unshift(this._map.latLngToLayerPoint(secondMeridianLatLng));
			projectedBounds.extend(ring[0]);
		}
	},

	// returns the latlng to compare the current latlng to.
	_getCompareLatLng: function (i, len, latlngs) {
		return (i + 1 < len) ? latlngs[i + 1] : latlngs[0];
	},

	// Joins the last ring to the first if they were accidently disconnected by
	// crossing the anti-meridian
	_joinLastRing: function (rings, latlngs) {
		var firstRing = rings[0];
		var lastRing = rings[rings.length - 1];

		// If both either the first or last latlng cross the meridian immediately, then
		// they have accidently been split by turning one ring into mulitiple.
		// Rejoin them.
		if (rings.length > 1 && (firstRing.length === 2 || lastRing.length === 2) &&
			 !LineUtils.isCrossMeridian(latlngs[0], latlngs[latlngs.length - 1])) {
			var len = lastRing.length;
			for (var i = 0; i < len; i++) {
				firstRing.unshift(lastRing.pop());
			}
			// Remove the empty ring.
			rings.pop();
		}
	}
});

// @factory L.wrappedPolygon(latlngs: LatLng[], options?: Polygon options)
// Instantiates a polygon that will automatically split around the
// antimeridian (Internation Date Line) if that is a shorter path.
export function wrappedPolygon(latlngs, options) {
	return new L.Wrapped.Polygon(latlngs, options);
}
