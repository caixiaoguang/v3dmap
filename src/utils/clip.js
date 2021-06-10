function TerrainClipPlan(viewer, options) {
    this.viewer = viewer;
    this.options = options || {};
    this._positions = options.positions;
    this._height = this.options.height || 0;
    this.bottomImg = options.bottomImg;
    this.wallImg = options.wallImg;
    this.splitNum = Cesium.defaultValue(options.splitNum, 50);
    this._positions && this._positions.length > 0 && this.updateData(this._positions);

    this.updateData = function (positions) {
        // this.clear();
        const planes = [];
        const length = positions.length;
        const cartesian3 = new Cesium.Cartesian3;
        let n = Cesium.Cartesian3.subtract(positions[0], positions[1], cartesian3);
        n = n.x > 0;

        this.excavateMinHeight = 9999;

        for (var r = 0; r < length; ++r) {
            var s = (r + 1) % length,
                l = Cesium.Cartesian3.midpoint(positions[r], positions[s], new Cesium.Cartesian3),
                u = Cesium.Cartographic.fromCartesian(positions[r]),
                c = viewer.scene.globe.getHeight(u) || u.height;
            c < this.excavateMinHeight && (this.excavateMinHeight = c);
            var d, h = Cesium.Cartesian3.normalize(l, new Cesium.Cartesian3);
            d = n ? Cesium.Cartesian3.subtract(positions[r], l, new Cesium.Cartesian3) : Cesium.Cartesian3.subtract(positions[s], l, new Cesium.Cartesian3), d = Cesium.Cartesian3.normalize(d, d);
            var f = Cesium.Cartesian3.cross(d, h, new Cesium.Cartesian3);
            f = Cesium.Cartesian3.normalize(f, f);
            var p = new Cesium.Plane(f, 0),
                m = Cesium.Plane.getPointDistance(p, l);
                
                console.log(f);
            planes.push(new Cesium.ClippingPlane(f, m))
        }

        // console.log(planes);

        this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: planes,
            edgeWidth: 1,
            edgeColor: Cesium.Color.WHITE
        });
        // this._prepareWell(positions);
        // this._createWell(this.wellData);
    }
}



export default TerrainClipPlan;