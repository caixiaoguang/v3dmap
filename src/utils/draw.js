function DrawTool() {
    this.drawList = [];

    this.startDraw = function(type, cb) {
        let drawInstance = new DrawItem(type, cb);
        drawInstance.startDraw();
        this.drawList.push(drawInstance);
    }

    this.clear = function() {
        this.drawList.forEach(el => { el.clear() });
        this.drawList = [];
    }
}



function DrawItem(type, cb) {
    this.drawingMode = type;
    this.activeShapePoints = [];
    this.activeShape;
    this.floatingPoint = "";
    this.collection = new Cesium.CustomDataSource('myData');
    viewer.dataSources.add(this.collection);

    viewer.selectedEntity = undefined;

    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.startDraw = function() {
        this.bindEvent();
    }

    this.cancelDraw = function() {
        this.handler.destroy()
    }

    this.clear = function() {
        this.activeShapePoints = [];
        viewer.entities.remove(this.activeShape);
        viewer.dataSources.remove(this.collection);
        this.floatingPoint = null;
        this.activeShape = null;
        this.collection = null;
    }

    this.bindEvent = () => {
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.handler.setInputAction(handleLeftClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(handleMouseMove.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(handleLeftDoubleClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }


    this.createPoint = function(worldPosition) {
        const point = new Cesium.Entity({
            position: worldPosition,
            point: {
                color: Cesium.Color.YELLOW,
                pixelSize: 10,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
        });
        this.collection.entities.add(point);
        return point;
    }


    function drawShape(positionData) {
        let shape;
        if (this.drawingMode === "line") {
            shape = viewer.entities.add({
                polyline: {
                    positions: positionData,
                    clampToGround: true,
                    width: 3,
                },
            });
        } else if (this.drawingMode === "polygon") {
            shape = viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(
                        Cesium.Color.YELLOW.withAlpha(0.7)
                    ),
                    outlineColor: Cesium.Color.GREEN,
                    outlineWidth: 10.0
                },
            });
        }
        return shape;
    }


    function handleLeftClick(event) {
        const earthPosition = viewer.scene.pickPosition(event.position);

        if (Cesium.defined(earthPosition)) {
            if (this.activeShapePoints.length === 0) {
                this.floatingPoint = this.createPoint(earthPosition);
                this.activeShapePoints.push(earthPosition);
                const dynamicPositions = new Cesium.CallbackProperty(() => {
                    if (this.drawingMode === "polygon") {
                        return new Cesium.PolygonHierarchy(this.activeShapePoints);
                    }
                    return this.activeShapePoints;
                }, false);
                this.activeShape = drawShape.call(this, dynamicPositions);
            }
            this.activeShapePoints.push(earthPosition);
            this.createPoint(earthPosition);
        }
    }

    function handleMouseMove(event) {
        if (this.floatingPoint) {
            const newPosition = viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
                this.floatingPoint.position.setValue(newPosition);
                this.activeShapePoints.pop();
                this.activeShapePoints.push(newPosition);
            }
        }
    }

    function handleLeftDoubleClick() {
        this.activeShapePoints.pop();
        this.activeShapePoints.pop();
        cb(this.activeShapePoints, this.activeShape);
        this.handler.destroy();
    }
}


export default DrawTool