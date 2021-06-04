function Snow(Cesium, viewer) {
    var scene = viewer.scene;
    var snowParticleSize = 12.0;
    var snowRadius = 100000.0;
    var minimumSnowImageSize = new Cesium.Cartesian2(
        snowParticleSize,
        snowParticleSize
    );
    var maximumSnowImageSize = new Cesium.Cartesian2(
        snowParticleSize * 2.0,
        snowParticleSize * 2.0
    );
    var snowSystem;

    var snowGravityScratch = new Cesium.Cartesian3();
    
    var snowUpdate = function (particle, dt) {
        snowGravityScratch = Cesium.Cartesian3.normalize(
            particle.position,
            snowGravityScratch
        );
        Cesium.Cartesian3.multiplyByScalar(
            snowGravityScratch,
            Cesium.Math.randomBetween(-30.0, -300.0),
            snowGravityScratch
        );
        particle.velocity = Cesium.Cartesian3.add(
            particle.velocity,
            snowGravityScratch,
            particle.velocity
        );

        var distance = Cesium.Cartesian3.distance(
            scene.camera.position,
            particle.position
        );
        if (distance > snowRadius) {
            particle.endColor.alpha = 0.0;
        } else {
            particle.endColor.alpha =
                snowSystem.endColor.alpha / (distance / snowRadius + 0.1);
        }
    };

    snowSystem = new Cesium.ParticleSystem({
        modelMatrix: new Cesium.Matrix4.fromTranslation(
            scene.camera.position
        ),
        minimumSpeed: -1.0,
        maximumSpeed: 0.0,
        lifetime: 15.0,
        emitter: new Cesium.SphereEmitter(snowRadius),
        startScale: 0.5,
        endScale: 1.0,
        image: "../SampleData/snowflake_particle.png",
        emissionRate: 7000.0,
        startColor: Cesium.Color.WHITE.withAlpha(0.0),
        endColor: Cesium.Color.WHITE.withAlpha(1.0),
        minimumImageSize: minimumSnowImageSize,
        maximumImageSize: maximumSnowImageSize,
        updateCallback: snowUpdate,
    });
    scene.primitives.add(snowSystem);
}






// rain
var rainParticleSize = 15.0;
var rainRadius = 100000.0;
var rainImageSize = new Cesium.Cartesian2(
    rainParticleSize,
    rainParticleSize * 2.0
);

var rainSystem;

var rainGravityScratch = new Cesium.Cartesian3();
var rainUpdate = function (particle, dt) {
    rainGravityScratch = Cesium.Cartesian3.normalize(
        particle.position,
        rainGravityScratch
    );
    rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
        rainGravityScratch,
        -1050.0,
        rainGravityScratch
    );

    particle.position = Cesium.Cartesian3.add(
        particle.position,
        rainGravityScratch,
        particle.position
    );

    var distance = Cesium.Cartesian3.distance(
        scene.camera.position,
        particle.position
    );
    if (distance > rainRadius) {
        particle.endColor.alpha = 0.0;
    } else {
        particle.endColor.alpha =
            rainSystem.endColor.alpha / (distance / rainRadius + 0.1);
    }
};

rainSystem = new Cesium.ParticleSystem({
    modelMatrix: new Cesium.Matrix4.fromTranslation(
        scene.camera.position
    ),
    speed: -1.0,
    lifetime: 15.0,
    emitter: new Cesium.SphereEmitter(rainRadius),
    startScale: 1.0,
    endScale: 0.0,
    image: "../SampleData/circular_particle.png",
    emissionRate: 9000.0,
    startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
    endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
    imageSize: rainImageSize,
    updateCallback: rainUpdate,
});
scene.primitives.add(rainSystem);

// button
Sandcastle.addToolbarButton("Reset Camera", resetCameraFunction);

// drop down
var options = [
    {
        text: "Snow",
        onselect: function () {
            rainSystem.show = false;
            snowSystem.show = true;

            scene.skyAtmosphere.hueShift = -0.8;
            scene.skyAtmosphere.saturationShift = -0.7;
            scene.skyAtmosphere.brightnessShift = -0.33;

            scene.fog.density = 0.001;
            scene.fog.minimumBrightness = 0.8;
        },
    },
    {
        text: "Rain",
        onselect: function () {
            rainSystem.show = true;
            snowSystem.show = false;

            scene.skyAtmosphere.hueShift = -0.97;
            scene.skyAtmosphere.saturationShift = 0.25;
            scene.skyAtmosphere.brightnessShift = -0.4;

            scene.fog.density = 0.00025;
            scene.fog.minimumBrightness = 0.01;
        },
    },
];
Sandcastle.addToolbarMenu(options);
