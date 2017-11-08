describe('Wrapped.Polygon', function () {

	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(55.8, 37.6), 6);

	describe("#_project", function () {

		it("should split polygons that cross the International Date Line", function () {
			var latLngs = [L.latLng([45, 107]), L.latLng([50, 127]), L.latLng([50, -127])];
			var polygon = new L.Wrapped.Polygon(latLngs);
			polygon.addTo(map);

			expect(polygon._rings.length).to.eql(2);
			expect(polygon._rings[0].length).to.eql(4);
			expect(polygon._rings[1].length).to.eql(3);
		});

		it("should not split polygons that do not cross the International Date Line", function () {
			var latLngs = [L.latLng([45, -90]), L.latLng([50, -70]), L.latLng([50, 90])];
			var polygon = new L.Wrapped.Polygon(latLngs);
			polygon.addTo(map);

			expect(polygon._rings.length).to.eql(1);
			expect(polygon._rings[0].length).to.eql(3);
		});
	});

});
