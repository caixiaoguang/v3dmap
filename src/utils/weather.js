export const Snow = function () {
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
        image: "data:image/png;base64,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",
        emissionRate: 7000.0,
        startColor: Cesium.Color.WHITE.withAlpha(0.0),
        endColor: Cesium.Color.WHITE.withAlpha(1.0),
        minimumImageSize: minimumSnowImageSize,
        maximumImageSize: maximumSnowImageSize,
        updateCallback: snowUpdate,
    });
    return snowSystem
}





export const Rain = function () {
    var scene = viewer.scene;

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
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xOdTWsmQAAANMSURBVFhH7dc9j41BGMbx3bVrNwQJEq+dlwpB+AB0FEoaJQU+goSOEC3fAAndNgpaGq0CBRWV0ImIOK7fyT2bk33snuMUu4qd5J9M5r7ua56ZuWfO7sRa++9br9drTIapMB1mwmyYK/SNidHQ9vPGbs2gzNaF9WFD2BK2hR1hV6FvTIyGVs54H9KSgtVYGdOtYXfYFw6F4+FkoW9MjIZWjlweo39EE1eilWwKO8OBcCKcDufChXCx0DcmRkMrRy6P0T+ihG1yW7onHA6nwvlwNVwPt8K9Qt+YGA2tHLk8Fj5i2UYQnJut8/UMjoYz4VK4Ee6HR2E+PCv0jYnR0MqRy4MXz35NLNkEg+JxfrbQKhhdCXfCw/A8vA5vwttC35gYDa0cuTx48eRds/2lJegLbZcico620moYPgkvw7vwKXwJ3wp9Y2I0tHLk8uDFk/dkTddtCTonX6qSFZPztKVWxfhD+Bq+h5/hV6FvTIyGVo5cHrx48p6q6botQQ+JonGdVLSicq621upM8COY9PcijInR0MqRy4MXT97TNV23JahQPCjutGulshWX87XFVjk4eWuDH0FDK0cuD148ec/UdN2WoCfVq+ZhcbddLxWuyJyzrV48eWttnIZWjlwevHjynq3pui1B77qn1evmgXHHXTOVrtja6pdqYjS0cuTy4MWT91xN122CJVq1D1j1I1CE28NgET4OCupzGLUIaeXIHSxC3ssWYbuG+4Orcy08CC/C+zDqNaSVI5cHL55Dr2F7iLzfHg9bdzO4Tq/Cx2ACq7TVJoW+MTEaWjlyefDiOfQhGnyKDwZffjncDU8DY6uzxc5ZsUHfmBgNrRy5PHiN9BTDD8bG4AfkSDgbvGYMrcrWOl9FptKhb0yMhlaOXB68eA79MWq7oBg3h73hWGBkNbbUuSouFe6aQd+YGA2tHLk8eA3/OdYIglpwJRUNA6uwlc5TUans28Edh74xMRpaOXJ58Br+B4lGVLSP8PW20DkqJuaulYk8MNA3JkZDK0fuwuQYqTVxJdo656eIVLLr5E57WLxu0DcmRkMrR+6/Td5aSwrOTfGoYNfIlnpQvGqeVugbE6OhldM/c4zdmkGZWc3K/GOy1lamTUz8Af7rUXt1Ah4SAAAAAElFTkSuQmCC",
        emissionRate: 9000.0,
        startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
        endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
        imageSize: rainImageSize,
        updateCallback: rainUpdate,
    });
    return rainSystem
}



