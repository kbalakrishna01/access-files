!(function () {
    const e = "mesh",
        t = 131072,
        { degToRad: i } = THREE,
        a = {
            acceleration: "USE_PARTICLE_ACCELERATION",
            angularAcceleration: "USE_PARTICLE_ANGULAR_ACCELERATION",
            angularVelocity: "USE_PARTICLE_ANGULAR_VELOCITY",
            color: "USE_PARTICLE_COLOR",
            textureFrame: "USE_PARTICLE_FRAMES",
            textureCount: "USE_PARTICLE_FRAMES",
            textureLoop: "USE_PARTICLE_FRAMES",
            position: "USE_PARTICLE_OFFSET",
            opacity: "USE_PARTICLE_OPACITY",
            radialAcceleration: "USE_PARTICLE_RADIAL_ACCELERATION",
            radialPosition: "USE_PARTICLE_RADIAL_OFFSET",
            radialVelocity: "USE_PARTICLE_RADIAL_VELOCITY",
            scale: "USE_PARTICLE_SCALE",
            velocity: "USE_PARTICLE_VELOCITY",
            orbitalVelocity: "USE_PARTICLE_ORBITAL",
            orbitalAcceleration: "USE_PARTICLE_ORBITAL",
            drag: "USE_PARTICLE_DRAG",
            destinationWeight: "USE_PARTICLE_DESTINATION",
            screenDepthOffset: "USE_PARTICLE_SCREEN_DEPTH_OFFSET",
            source: "USE_PARTICLE_SOURCE",
            model: "USE_PARTICLE_SOURCE",
        },
        n = ["overtime", "interval"],
        r = ["newest", "oldest", "original"],
        o = ["x", "y", "z"],
        l = (e) => e.reduce((e, t) => (Array.isArray(t) ? e.concat(l(t)) : e.concat(t)), []),
        s = (e, t) => {
            const i = e.split("..").map((e) =>
                e
                    .trim()
                    .split(" ")
                    .map((e) => {
                        const t = Number(e);
                        return isNaN(t) ? void 0 : t;
                    })
            );
            return 1 === i.length && (i[1] = i[0]), (i.length = 2), l(i.map((e) => t.map((t, i) => (void 0 === e[i] ? t : e[i]))));
        },
        c = (e, t) => l(e.split(",").map((e) => s(e, t))),
        d = (e) => e.toLowerCase(),
        f = new THREE.DataTexture(new Uint8Array(4).fill(255), 1, 1, THREE.RGBAFormat);
    f.needsUpdate = !0;
    const m = { none: THREE.NoBlending, normal: THREE.NormalBlending, additive: THREE.AdditiveBlending, subtractive: THREE.SubtractiveBlending, multiply: THREE.MultiplyBlending },
        u = { double: THREE.DoubleSide, front: THREE.FrontSide, back: THREE.BackSide };
    AFRAME.registerComponent("sprite-particles", {
        schema: {
            enableInEditor: { default: !1 },
            texture: { type: "map" },
            delay: { default: 0 },
            duration: { default: -1 },
            spawnType: { default: "continuous", oneOf: ["continuous", "burst"], parse: d },
            spawnRate: { default: 10 },
            source: { type: "selector" },
            textureFrame: { type: "vec2", default: { x: 1, y: 1 } },
            textureCount: { type: "int", default: 0 },
            textureLoop: { default: 1 },
            randomizeFrames: { default: !1 },
            trailInterval: { default: 0 },
            trailLifeTime: { default: "0" },
            trailType: { default: "particle", oneOf: ["particle", "ribbon", "ribbon3d"] },
            ribbonWidth: { default: 1 },
            ribbonShape: { default: "flat", oneOf: ["flat", "taperin", "taperout", "taper"], parse: d },
            ribbonUVType: { default: "overtime", oneOf: n, parse: d },
            emitterColor: { type: "color" },
            lifeTime: { default: "1" },
            position: { default: "0 0 0" },
            velocity: { default: "0 0 0" },
            acceleration: { default: "0 0 0" },
            radialType: { default: "circle", oneOf: ["circle", "sphere", "circlexy", "circlexz"], parse: d },
            radialPosition: { default: "0" },
            radialVelocity: { default: "0" },
            radialAcceleration: { default: "0" },
            angularVelocity: { default: "0 0 0" },
            angularAcceleration: { default: "0 0 0" },
            orbitalVelocity: { default: "0" },
            orbitalAcceleration: { default: "0" },
            scale: { default: "1" },
            color: { default: "white", parse: d },
            rotation: { default: "0" },
            opacity: { default: "1" },
            velocityScale: { default: 0 },
            velocityScaleMinMax: { type: "vec2", default: { x: 0, y: 3 } },
            drag: { default: 0 },
            destination: { type: "selector" },
            destinationOffset: { default: "0 0 0" },
            destinationWeight: { default: "0" },
            enable: { default: !0 },
            emitterTime: { default: 0 },
            model: { type: "selector" },
            modelFill: { default: "triangle", oneOf: ["triangle", "edge", "vertex"], parse: d },
            direction: { default: "forward", oneOf: ["forward", "backward"], parse: d },
            particleOrder: { default: "original", oneOf: r },
            ribbonUVMultiplier: { default: 1 },
            materialSide: { default: "front", oneOf: ["double", "front", "back"], parse: d },
            screenDepthOffset: { default: 0 },
            alphaTest: { default: 0 },
            fog: { default: !0 },
            depthWrite: { default: !1 },
            depthTest: { default: !0 },
            blending: { default: "normal", oneOf: ["none", "normal", "additive", "subtractive", "multiply"], parse: d },
            transparent: { default: !0 },
            particleSize: { default: 100 },
            usePerspective: { default: !0 },
            seed: { type: "number", default: -1 },
            overTimeSlots: { type: "int", default: 5 },
            frustumCulled: { default: !0 },
            editorObject: { default: !0 },
        },
        multiple: !0,
        help: "https://github.com/harlyq/aframe-sprite-particles-component",
        init() {
            (this.pauseTick = this.pauseTick.bind(this)),
                (this.handleObject3DSet = this.handleObject3DSet.bind(this)),
                (this.count = 0),
                (this.trailCount = 0),
                (this.overTimeArrayLength = 0),
                (this.emitterTime = 0),
                (this.delayTime = 0),
                (this.lifeTime = [1, 1]),
                (this.trailLifeTime = [0, 0]),
                (this.textureFrames = new Float32Array(4)),
                (this.offset = new Float32Array(8).fill(0)),
                (this.velocity = new Float32Array(8).fill(0)),
                (this.acceleration = new Float32Array(8).fill(0)),
                (this.angularVelocity = new Float32Array(8).fill(0)),
                (this.angularAcceleration = new Float32Array(8).fill(0)),
                (this.orbital = new Float32Array(4).fill(0)),
                this.colorOverTime,
                this.rotationScaleOverTime,
                (this.params = new Float32Array(20).fill(0)),
                (this.velocityScale = new Float32Array(3).fill(0)),
                (this.emitterColor = new THREE.Vector3()),
                (this.destination = new Float32Array(8).fill(0)),
                this.destinationOffset,
                this.destinationWeight,
                (this.nextID = 0),
                (this.nextTime = 0),
                (this.numDisabled = 0),
                (this.numEnabled = 0),
                (this.startDisabled = !this.data.enable),
                (this.manageIDs = !1),
                (this.params[1] = -1);
        },
        remove() {
            this.mesh && this.el.removeObject3D(this.mesh.name), this.data.model && this.data.model.removeEventListener("object3dset", this.handleObject3DSet);
        },
        update(t) {
            const { data: i } = this;
            let a = i.particleSize !== t.particleSize,
                r = !1;
            if (
                (i.overTimeSlots === t.overTimeSlots ||
                    this.isPlaying ||
                    ((this.overTimeArrayLength = 2 * this.data.overTimeSlots + 1),
                    (this.colorOverTime = new Float32Array(4 * this.overTimeArrayLength).fill(0)),
                    (this.rotationScaleOverTime = new Float32Array(2 * this.overTimeArrayLength).fill(0)),
                    (r = !0)),
                (this.params[8] = i.particleSize),
                (this.params[9] = i.usePerspective ? 1 : 0),
                (this.params[10] = "forward" === i.direction ? 0 : 1),
                (this.params[11] = THREE.MathUtils.clamp(i.drag, 0, 1)),
                (this.params[15] = 1e-5 * i.screenDepthOffset),
                (this.params[16] = i.ribbonWidth),
                (this.params[17] = i.ribbonUVMultiplier),
                (this.textureFrames[0] = i.textureFrame.x),
                (this.textureFrames[1] = i.textureFrame.y),
                (this.textureFrames[2] = i.textureCount > 0 ? i.textureCount : i.textureFrame.x * i.textureFrame.y),
                (this.textureFrames[3] = i.textureLoop),
                (this.velocityScale[0] = i.velocityScale),
                (this.velocityScale[1] = i.velocityScaleMinMax.x),
                (this.velocityScale[2] = i.velocityScaleMinMax.y),
                this.material && ((this.material.alphaTest = i.alphaTest), (this.material.depthTest = i.depthTest), (this.material.depthWrite = i.depthWrite), (this.material.blending = m[i.blending]), (this.material.fog = i.fog)),
                i.seed !== t.seed && ((this.seed = i.seed), (this.params[6] = i.seed >= 0 ? i.seed : Math.random())),
                i.ribbonUVType !== t.ribbonUVType && (this.params[18] = -1 === n.indexOf(i.ribbonUVType) ? 0 : n.indexOf(i.ribbonUVType)),
                i.radialType !== t.radialType && ((this.params[2] = ["sphere", "circlexy", "circle"].includes(i.radialType) ? 1 : 0), (this.params[19] = ["sphere", "circlexz"].includes(i.radialType) ? 1 : 0)),
                this.mesh && i.frustumCulled !== t.frustumCulled && (this.mesh.frustumCulled = i.frustumCulled),
                i.emitterColor !== t.emitterColor)
            ) {
                const e = new THREE.Color(i.emitterColor);
                this.emitterColor.set(e.r, e.g, e.b);
            }
            if (
                ((i.position === t.position && i.radialPosition === t.radialPosition) || (this.updateVec4XYZRange(i.position, "offset"), this.updateVec4WRange(i.radialPosition, [0], "offset"), (a = !0)),
                (i.velocity === t.velocity && i.radialVelocity === t.radialVelocity) || (this.updateVec4XYZRange(i.velocity, "velocity"), this.updateVec4WRange(i.radialVelocity, [0], "velocity"), (a = !0)),
                (i.acceleration === t.acceleration && i.radialAcceleration === t.radialAcceleration) || (this.updateVec4XYZRange(i.acceleration, "acceleration"), this.updateVec4WRange(i.radialAcceleration, [0], "acceleration"), (a = !0)),
                (i.rotation !== t.rotation || i.scale !== t.scale || r) && (this.updateRotationScaleOverTime(), (a = !0)),
                (i.color !== t.color || i.opacity !== t.opacity || r) && this.updateColorOverTime(),
                i.lifeTime !== t.lifeTime && (this.lifeTime = this.updateVec4WRange(i.lifeTime, [1], "angularVelocity")),
                i.angularVelocity !== t.angularVelocity && this.updateAngularVec4XYZRange(i.angularVelocity, "angularVelocity"),
                i.trailLifeTime !== t.trailLifeTime &&
                    ((this.trailLifeTime = s(i.trailLifeTime, [0]).map((e, t) => (e > 0 ? e : this.lifeTime[t]))), (this.angularAcceleration[3] = this.trailLifeTime[0]), (this.angularAcceleration[7] = this.trailLifeTime[1])),
                i.angularAcceleration !== t.angularAcceleration && this.updateAngularVec4XYZRange(i.angularAcceleration, "angularAcceleration"),
                i.orbitalVelocity !== t.orbitalVelocity && this.updateAngularVec2PartRange(i.orbitalVelocity, [0], "orbital", 0),
                i.orbitalAcceleration !== t.orbitalAcceleration && this.updateAngularVec2PartRange(i.orbitalAcceleration, [0], "orbital", 1),
                i.destinationOffset !== t.destinationOffset && (this.destinationOffset = this.updateVec4XYZRange(i.destinationOffset, "destination")),
                i.destinationWeight !== t.destinationWeight && (this.destinationWeight = this.updateVec4WRange(i.destinationWeight, [0], "destination")),
                (i.duration === t.duration && i.delay === t.delay && i.emitterTime === t.emitterTime) || ((this.params[3] = i.duration), (this.emitterTime = i.emitterTime), (this.delayTime = i.delay)),
                i.spawnType !== t.spawnType || i.spawnRate !== t.spawnRate || i.lifeTime !== t.lifeTime || i.trailInterval !== t.trailInterval)
            ) {
                const e = this.lifeTime[1],
                    t = i.trailInterval > 0 ? this.trailLifeTime[1] : 0,
                    a = e + t,
                    n = Math.max(1, Math.ceil(a * i.spawnRate));
                (this.trailCount = 1 + (i.trailInterval > 0 ? Math.ceil(Math.min(t, e) / i.trailInterval) : 0)),
                    this.isRibbon() ? (this.trailCount++, (this.count = n * this.trailCount * 2)) : (this.count = n * this.trailCount),
                    (this.params[4] = "burst" === i.spawnType ? 0 : 1),
                    (this.params[5] = i.spawnRate),
                    (this.params[7] = this.count),
                    (this.params[13] = n),
                    (this.params[12] = i.trailInterval),
                    (this.params[14] = this.trailCount),
                    this.updateAttributes();
            }
            i.enableInEditor !== t.enableInEditor && this.enablePauseTick(i.enableInEditor),
                i.enable && this.startDisabled && (this.startDisabled = !1),
                i.model !== t.model &&
                    i.model &&
                    "getObject3D" in i.model &&
                    (t.model && t.model.removeEventListener("object3dset", this.handleObject3DSet), this.updateModelMesh(i.model.getObject3D(e)), i.model && i.model.addEventListener("object3dset", this.handleObject3DSet)),
                "original" !== i.particleOrder && i.source && console.warn(`changing particleOrder to 'original' (was '${i.particleOrder}'), because particles use a source`),
                this.mesh ? this.updateDefines() : this.createMesh(),
                i.materialSide !== t.materialSide && (this.material.side = u[i.materialSide]),
                a && this.updateBounds(),
                this.paused && i.editorObject !== t.editorObject && this.enableEditorObject(i.editorObject),
                (this.manageIDs = this.manageIDs || !i.enable || i.source || void 0 !== this.el.getDOMAttribute(this.attrName).enable || i.model || i.delay > 0),
                i.texture !== t.texture && this.loadTexture(i.texture);
        },
        tick(e, t) {
            const { data: i } = this;
            if (this.startDisabled) return;
            t > 100 && (t = 100);
            const a = t / 1e3;
            i.enable && (this.delayTime -= a),
                this.delayTime >= 0 ||
                    (i.model && !this.modelVertices) ||
                    ((this.emitterTime += a),
                    (this.params[0] = this.emitterTime),
                    this.geometry && this.manageIDs ? this.updateWorldTransform(this.emitterTime) : (this.params[1] = -1),
                    i.destination && i.destination.object3D && (this.destinationWeight[0] > 0 || this.destinationWeight[1] > 0) && this.updateDestinationEntity());
        },
        pause() {
            (this.paused = !0), this.enablePauseTick(this.data.enableInEditor), this.enableEditorObject(this.data.editorObject);
        },
        play() {
            (this.paused = !1), this.enableEditorObject(!1), this.enablePauseTick(!1);
        },
        enablePauseTick(e) {
            e ? (this.pauseRAF = requestAnimationFrame(this.pauseTick)) : cancelAnimationFrame(this.pauseRAF);
        },
        pauseTick() {
            this.tick(0, 16), this.enablePauseTick(!0);
        },
        handleObject3DSet(t) {
            t.target === this.data.model && t.detail.type === e && this.updateModelMesh(this.data.model.getObject3D(e));
        },
        loadTexture(e) {
            if (e) {
                this.el.sceneEl.systems.material.loadTexture(e, { src: e }, (e) => {
                    this.isRibbon() && (e.wrapS = THREE.RepeatWrapping), (this.material.uniforms.map.value = e);
                });
            } else this.material.uniforms.map.value = f;
        },
        isRibbon() {
            return this.data.trailInterval > 0 && "particle" !== this.data.trailType;
        },
        createMesh() {
            const { data: e } = this;
            (this.geometry = new THREE.BufferGeometry()),
                this.updateAttributes(),
                (this.material = new THREE.ShaderMaterial({
                    uniforms: {
                        map: { type: "t", value: f },
                        textureFrames: { value: this.textureFrames },
                        params: { value: this.params },
                        offset: { value: this.offset },
                        velocity: { value: this.velocity },
                        acceleration: { value: this.acceleration },
                        angularVelocity: { value: this.angularVelocity },
                        angularAcceleration: { value: this.angularAcceleration },
                        orbital: { value: this.orbital },
                        colorOverTime: { value: this.colorOverTime },
                        rotationScaleOverTime: { value: this.rotationScaleOverTime },
                        velocityScale: { value: this.velocityScale },
                        emitterColor: { value: this.emitterColor },
                        destination: { value: this.destination },
                        fogDensity: { value: 25e-5 },
                        fogNear: { value: 1 },
                        fogFar: { value: 2e3 },
                        fogColor: { value: new THREE.Color(16777215) },
                    },
                    fragmentShader: E,
                    vertexShader: g,
                    transparent: e.transparent,
                    alphaTest: e.alphaTest,
                    blending: m[e.blending],
                    fog: e.fog,
                    depthWrite: e.depthWrite,
                    depthTest: e.depthTest,
                    defines: {},
                })),
                this.updateDefines(),
                this.isRibbon() ? (this.mesh = new THREE.Mesh(this.geometry, [this.material])) : (this.mesh = new THREE.Points(this.geometry, this.material)),
                (this.mesh.frustumCulled = e.frustumCulled),
                (this.mesh.name = this.attrName),
                (this.material.name = this.mesh.name),
                this.el.setObject3D(this.mesh.name, this.mesh);
        },
        updateColorOverTime() {
            const e =
                ((t = this.data.color),
                l(
                    t.split(",").map((e) => {
                        const t = e.split("..");
                        return 1 === t.length && (t[1] = t[0]), (t.length = 2), t.map((e) => new THREE.Color(e.trim()));
                    })
                ));
            var t;
            const i = c(this.data.opacity, [1]),
                a = this.data.overTimeSlots;
            e.length > 2 * a && (e.length = 2 * a), i.length > 2 * a && (i.length = 2 * a), this.colorOverTime.fill(0), (this.colorOverTime[0] = e.length / 2), (this.colorOverTime[1] = i.length / 2);
            let n = e.length;
            for (let t = 0, i = 4; t < n; t++, i += 4) {
                const a = e[t];
                (this.colorOverTime[i] = a.r), (this.colorOverTime[i + 1] = a.g), (this.colorOverTime[i + 2] = a.b);
            }
            n = i.length;
            for (let e = 0, t = 4; e < n; e++, t += 4) {
                const a = i[e];
                this.colorOverTime[t + 3] = a;
            }
        },
        updateRotationScaleOverTime() {
            const e = this.data.overTimeSlots,
                t = c(this.data.rotation, [0]),
                i = c(this.data.scale, [1]);
            t.length > 2 * e && (t.length = 2 * e), i.length > 2 * e && (i.length = 2 * e), this.rotationScaleOverTime.fill(0), (this.rotationScaleOverTime[0] = t.length / 2), (this.rotationScaleOverTime[1] = i.length / 2);
            let a = t.length;
            for (let e = 0, i = 2; e < a; e++, i += 2) this.rotationScaleOverTime[i] = THREE.MathUtils.degToRad(t[e]);
            a = i.length;
            for (let e = 0, t = 2; e < a; e++, t += 2) this.rotationScaleOverTime[t + 1] = i[e];
        },
        updateVec4XYZRange(e, t) {
            const i = s(e, [0, 0, 0]);
            for (let e = 0, a = 0; e < i.length; ) (this[t][a++] = i[e++]), (this[t][a++] = i[e++]), (this[t][a++] = i[e++]), a++;
            return i;
        },
        updateAngularVec4XYZRange(e, t) {
            const i = s(e, [0, 0, 0]);
            for (let e = 0, a = 0; e < i.length; ) (this[t][a++] = THREE.MathUtils.degToRad(i[e++])), (this[t][a++] = THREE.MathUtils.degToRad(i[e++])), (this[t][a++] = THREE.MathUtils.degToRad(i[e++])), a++;
        },
        updateAngularVec2PartRange(e, t, i, a) {
            const n = s(e, t);
            (this[i][a] = THREE.MathUtils.degToRad(n[0])), (this[i][a + 2] = THREE.MathUtils.degToRad(n[1]));
        },
        updateVec4WRange(e, t, i) {
            const a = s(e, t);
            return (this[i][3] = a[0]), (this[i][7] = a[1]), a;
        },
        updateBounds() {
            const { data: e } = this;
            let t = Math.max(this.lifeTime[0], this.lifeTime[1]);
            const i = [new Array(4), new Array(4)];
            e.drag > 0 && (t *= 1 - 0.5 * e.drag);
            for (let e = 0; e < 2; e++) {
                const a = 0 === e ? Math.min : Math.max;
                for (let n = 0; n < 4; n++) {
                    const r = a(this.offset[n], this.offset[n + 4]),
                        o = a(this.velocity[n], this.velocity[n + 4]),
                        l = a(this.acceleration[n], this.acceleration[n + 4]);
                    (i[e][n] = r + (o + 0.5 * l * t) * t), (i[e][n] = a(i[e][n], r));
                    const s = -o / l;
                    s > 0 && s < t && (i[e][n] = a(i[e][n], r - (0.5 * o * o) / l));
                }
            }
            this.modelBounds &&
                ((i[0][0] += this.modelBounds.min.x), (i[0][1] += this.modelBounds.min.y), (i[0][2] += this.modelBounds.min.z), (i[1][0] += this.modelBounds.max.x), (i[1][1] += this.modelBounds.max.y), (i[1][2] += this.modelBounds.max.z));
            const a = this.el.getDOMAttribute(this.attrName),
                n = this.rotationScaleOverTime.reduce((e, t, i) => (1 & i ? Math.max(e, t) : e), 0),
                r = Math.max(Math.abs(i[0][3]), Math.abs(i[1][3])) + 45e-5 * e.particleSize * n,
                o = "sphere" === e.radialType || a.angularVelocity || a.angularAcceleration || a.orbitalVelocity || a.orbitalAcceleration;
            (i[0][0] -= r), (i[0][1] -= r), (i[0][2] -= o ? r : 0), (i[1][0] += r), (i[1][1] += r), (i[1][2] += o ? r : 0), (i[0].length = 3), (i[0].length = 3);
            const l = Math.max(...i[0].map(Math.abs), ...i[1].map(Math.abs));
            this.geometry.boundingSphere || (this.geometry.boundingSphere = new THREE.Sphere()),
                (this.geometry.boundingSphere.radius = l),
                this.geometry.boundingBox || (this.geometry.boundingBox = new THREE.Box3()),
                this.geometry.boundingBox.min.set(...i[0]),
                this.geometry.boundingBox.max.set(...i[1]);
            const s = this.el.getObject3D("mesh");
            s && s.isParticlesEditorObject && this.enableEditorObject(!0);
        },
        updateDestinationEntity: (function () {
            const e = new THREE.Vector3(),
                t = new THREE.Vector3();
            return function () {
                const { data: i } = this;
                i.destination.object3D.getWorldPosition(e), this.el.object3D.getWorldPosition(t), e.sub(t);
                for (let t = 0, i = o.length; t < i; t++) (this.destination[t] = e[o[t]] + this.destinationOffset[t]), (this.destination[t + 4] = e[o[t]] + this.destinationOffset[t + 3]);
            };
        })(),
        enableEditorObject(e) {
            const t = this.el.getObject3D("mesh");
            if (!e || (t && !t.isParticlesEditorObject)) !e && t && t.isParticlesEditorObject && this.el.removeObject3D("mesh");
            else {
                const e = 0.25,
                    t = new THREE.Vector3(e, e, e).max(this.geometry.boundingBox.max),
                    i = new THREE.Vector3(-e, -e, -e).min(this.geometry.boundingBox.min),
                    a = new THREE.Box3(i, t),
                    n = new THREE.Box3Helper(a, 8421376);
                (n.isParticlesEditorObject = !0), (n.visible = !1), this.el.setObject3D("mesh", n);
            }
        },
        updateAttributes() {
            if (this.geometry) {
                const e = this.count,
                    t = new Float32Array(e);
                if (this.startDisabled || this.data.delay > 0 || this.data.model) t.fill(-1), (this.numEnabled = 0), (this.numDisabled = e);
                else {
                    for (let i = 0; i < e; i++) t[i] = i;
                    (this.numEnabled = e), (this.numDisabled = 0);
                }
                if (
                    (this.geometry.setAttribute("vertexID", new THREE.Float32BufferAttribute(t, 1)),
                    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(3 * e).fill(0), 3)),
                    this.data.source && this.geometry.setAttribute("quaternion", new THREE.Float32BufferAttribute(new Float32Array(4 * e).fill(0), 4)),
                    this.isRibbon())
                ) {
                    this.geometry.clearGroups();
                    const t = 2 * this.trailCount;
                    for (let i = 0; i < e; i += t) this.geometry.addGroup(i, t, 0);
                }
            }
        },
        updateDefines() {
            const { data: e } = this,
                i = Object.keys(this.el.getDOMAttribute(this.attrName)),
                n = i.map((e) => a[e]).filter((e) => e),
                o = { PARAMS_LENGTH: 5, OVER_TIME_ARRAY_LENGTH: this.overTimeArrayLength, RANDOM_REPEAT_COUNT: t, USE_MAP: !0 };
            for (const e of n) o[e] = !0;
            e.velocityScale > 0 && (o.USE_PARTICLE_VELOCITY_SCALE = !0),
                e.trailInterval > 0 && (this.isRibbon() ? ("ribbon" === e.trailType ? (o.USE_RIBBON_TRAILS = !0) : (o.USE_RIBBON_3D_TRAILS = !0)) : (o.USE_PARTICLE_TRAILS = !0)),
                e.randomizeFrames && (o.USE_PARTICLE_RANDOMIZE_FRAMES = !0),
                i.includes("rotation") && (this.isRibbon() ? (o.USE_RIBBON_ROTATION = !0) : (o.USE_PARTICLE_ROTATION = !0));
            let l = "1.";
            "taperout" === e.ribbonShape ? (l = "1. - p") : "taperin" === e.ribbonShape ? (l = "p") : "taper" === e.ribbonShape ? (l = "2. * ( p < .5 ? p : 1. - p )") : "=" === e.ribbonShape[0] && (l = e.ribbonShape.slice(1)),
                (o.RIBBON_SHAPE_FUNCTION = l),
                e.source ? (o.PARTICLE_ORDER = 2) : (o.PARTICLE_ORDER = r.indexOf(e.particleOrder)),
                (o.PARTICLE_TRAIL_ORDER = r.indexOf(e.particleOrder));
            if (Object.keys(o).filter((e) => this.material.defines[e] !== o[e]).length > 0)
                if (this.isPlaying) {
                    const e = i.filter((e) => {
                        const t = a[e];
                        return t && !this.material.defines[t];
                    });
                    console.error(`cannot add attributes (${e.join(",")}) at run-time`);
                } else (this.material.defines = o), (this.material.needsUpdate = !0);
        },
        updateModelMesh(e) {
            if (!e) return;
            (this.modelBounds = new THREE.Box3()), this.modelVertices;
            let t = 0,
                i = 0,
                a = 0;
            const n = (e) => {
                if (!e.geometry) return;
                const n = e.geometry.getAttribute("position");
                (n && 3 !== n.itemSize) || (0 == a ? (i += n.array.length) : (this.modelVertices.set(n.array, t), (t += n.array.length)));
            };
            (a = 0), e.traverse(n), i > 0 && ((a = 1), (this.modelVertices = new Float32Array(i)), e.traverse(n), h(this.modelVertices, e.el.object3D.scale), this.modelBounds.setFromArray(this.modelVertices), this.updateBounds());
        },
        updateWorldTransform: (function () {
            const e = new THREE.Vector3(),
                i = new THREE.Quaternion(),
                a = new THREE.Vector3(),
                n = new THREE.Vector3(),
                r = new THREE.Matrix4();
            return function (o) {
                const { data: l } = this,
                    s = this.count,
                    { spawnRate: c } = this.data,
                    d = "burst" === l.spawnType,
                    f = d ? 0 : 1 / c,
                    m = l.enable ? this.numEnabled < s : this.numDisabled < s,
                    u = l.source && null != l.source.object3D,
                    h = this.modelVertices && this.modelVertices.length,
                    g = this.isRibbon(),
                    E = h || u,
                    R = this.geometry.getAttribute("vertexID"),
                    A = this.geometry.getAttribute("position"),
                    y = this.geometry.getAttribute("quaternion");
                u &&
                    (this.el.object3D.updateMatrixWorld(),
                    l.source.object3D.updateMatrixWorld(),
                    r.copy(this.el.object3D.matrixWorld).invert(),
                    r.multiply(l.source.object3D.matrixWorld),
                    r.decompose(e, i, a),
                    this.geometry.boundingSphere.center.copy(e));
                let b = this.nextID % s,
                    I = 0,
                    _ = b,
                    S = this.nextID,
                    x = p;
                switch (l.modelFill) {
                    case "edge":
                        x = v;
                        break;
                    case "vertex":
                        x = T;
                }
                for (; this.nextTime < o && I < this.count; ) {
                    h && x(this.modelVertices, n);
                    for (let t = 0, a = g ? 2 : 1; t < a; t++)
                        for (let t = 0; t < this.trailCount; t++)
                            (S = this.nextID),
                                h && A.setXYZ(_, n.x, n.y, n.z),
                                u && (A.setXYZ(_, e.x, e.y, e.z), y.setXYZW(_, i.x, i.y, i.z, i.w)),
                                R.setX(_, l.enable ? S : -1),
                                m && ((this.numEnabled = l.enable ? this.numEnabled + 1 : 0), (this.numDisabled = l.enable ? 0 : this.numDisabled + 1)),
                                (_ = (_ + 1) % s),
                                I++,
                                E ? this.nextID++ : (this.nextID = _);
                    this.nextTime += f;
                }
                if (I > 0) {
                    const e = this.trailCount * (g ? 2 : 1);
                    (this.params[1] = Math.floor(S / e)),
                        d && ((this.nextTime += this.lifeTime[1]), l.trailInterval > 0 && (this.nextTime += this.trailLifeTime[1])),
                        _ < b && ((b = 0), (I = this.count)),
                        (u || h) && ((A.updateRange.offset = b), (A.updateRange.count = I), (A.needsUpdate = !0)),
                        u && ((y.updateRange.offset = b), (y.updateRange.count = I), (y.needsUpdate = !0)),
                        (R.updateRange.offset = b),
                        (R.updateRange.count = I),
                        (R.needsUpdate = !0),
                        (this.nextID %= t);
                }
            };
        })(),
    });
    const h = (e, t) => {
            if (1 !== t.x && 1 !== t.y && 1 !== t.z) for (let i = 0, a = e.length; i < a; i += 3) (e[i] *= t.x), (e[i + 1] *= t.y), (e[i + 2] *= t.z);
        },
        p = (function () {
            const e = new THREE.Vector3(),
                t = new THREE.Vector3();
            return function (i, a) {
                const n = 9 * Math.floor((Math.random() * i.length) / 9);
                let r, o;
                e.fromArray(i, n), t.fromArray(i, n + 3), a.fromArray(i, n + 6);
                do {
                    (r = Math.random()), (o = Math.random());
                } while (r + o > 1);
                t.sub(e).multiplyScalar(r), a.sub(e).multiplyScalar(o).add(t).add(e);
            };
        })(),
        v = (function () {
            const e = new THREE.Vector3(),
                t = new THREE.Vector3(),
                i = new THREE.Vector3();
            return function (a, n) {
                const r = 9 * Math.floor((Math.random() * a.length) / 9);
                e.fromArray(a, r),
                    t.fromArray(a, r + 3),
                    i.fromArray(a, r + 6),
                    (r1 = Math.random()),
                    r1 > 2 / 3
                        ? n
                              .copy(e)
                              .sub(i)
                              .multiplyScalar(3 * r1 - 2)
                              .add(i)
                        : r1 > 1 / 3
                        ? n
                              .copy(i)
                              .sub(t)
                              .multiplyScalar(3 * r1 - 1)
                              .add(t)
                        : n
                              .copy(t)
                              .sub(e)
                              .multiplyScalar(3 * r1)
                              .add(e);
            };
        })();
    function T(e, t) {
        const i = 3 * Math.floor((Math.random() * e.length) / 3);
        t.fromArray(e, i);
    }
    const g =
            "\n  #include <common>\n  // #include <color_pars_vertex>\n  #include <fog_pars_vertex>\n  // #include <morphtarget_pars_vertex>\n  // #include <logdepthbuf_pars_vertex>\n  // #include <clipping_planes_pars_vertex>\n  \n  attribute float vertexID;\n  \n  #if defined(USE_PARTICLE_SOURCE)\n  attribute vec4 quaternion;\n  #endif\n  \n  uniform vec4 params[PARAMS_LENGTH];\n  uniform vec4 offset[2];\n  uniform vec4 velocity[2];\n  uniform vec4 acceleration[2];\n  uniform vec4 angularVelocity[2];\n  uniform vec4 angularAcceleration[2];\n  uniform vec2 orbital[2];\n  uniform vec4 colorOverTime[OVER_TIME_ARRAY_LENGTH];\n  uniform vec2 rotationScaleOverTime[OVER_TIME_ARRAY_LENGTH];\n  uniform vec4 textureFrames;\n  uniform vec3 velocityScale;\n  uniform vec4 destination[2];\n  \n  varying vec4 vParticleColor;\n  varying vec2 vCosSinRotation;\n  varying vec2 vUv;\n  varying float vOverTimeRatio;\n  varying float vFrame;\n  \n  float VERTS_PER_RIBBON = 2.;\n  \n  // alternative random algorithm, used for the initial seed.  Provides a better\n  // result than using rand()\n  float pseudoRandom( const float seed )\n  {\n    return mod( 1664525.*seed + 1013904223., 4294967296. )/4294967296.; // we don't have enough precision in 32-bit float, but results look ok\n  }\n  \n  // each call to random will produce a different result by varying randI\n  float randI = 0.;\n  float random( const float seed )\n  {\n    randI += 0.001;\n    return rand( vec2( seed, randI ));\n  }\n  \n  vec3 randVec3Range( const vec3 range0, const vec3 range1, const float seed )\n  {\n    vec3 lerps = vec3( random( seed ), random( seed ), random( seed ) );\n    return mix( range0, range1, lerps );\n  }\n  \n  vec2 randVec2Range( const vec2 range0, const vec2 range1, const float seed )\n  {\n    vec2 lerps = vec2( random( seed ), random( seed ) );\n    return mix( range0, range1, lerps );\n  }\n  \n  float randFloatRange( const float range0, const float range1, const float seed )\n  {\n    float lerps = random( seed );\n    return mix( range0, range1, lerps );\n  }\n  \n  // theta.x is the angle in XY, theta.y is the angle in XZ\n  vec3 radialToVec3( const float r, const vec2 theta )\n  {\n    vec2 cosTheta = cos(theta);\n    vec2 sinTheta = sin(theta);\n    float rc = r * cosTheta.x;\n    float x = rc * cosTheta.y;\n    float y = r * sinTheta.x;\n    float z = rc * sinTheta.y;\n    return vec3( x, y, z );\n  }\n  \n  // array lengths are stored in the first slot, followed by actual values from slot 1 onwards\n  // colors are packed min,max,min,max,min,max,...\n  // color is packed in xyz and opacity in w, and they may have different length arrays\n  \n  vec4 calcColorOverTime( const float r, const float seed )\n  {\n    vec3 color = vec3(1.);\n    float opacity = 1.;\n  \n  #if defined(USE_PARTICLE_COLOR)\n    int colorN = int( colorOverTime[0].x );\n    if ( colorN == 1 )\n    {\n      color = randVec3Range( colorOverTime[1].xyz, colorOverTime[2].xyz, seed );\n    }\n    else if ( colorN > 1 )\n    {\n      float ck = r * ( float( colorN ) - 1. );\n      float ci = floor( ck );\n      int i = int( ci )*2 + 1;\n      vec3 sColor = randVec3Range( colorOverTime[i].xyz, colorOverTime[i + 1].xyz, seed );\n      vec3 eColor = randVec3Range( colorOverTime[i + 2].xyz, colorOverTime[i + 3].xyz, seed );\n      color = mix( sColor, eColor, ck - ci );\n    }\n  #endif\n  \n  #if defined(USE_PARTICLE_OPACITY)\n    int opacityN = int( colorOverTime[0].y );\n    if ( opacityN == 1 )\n    {\n      opacity = randFloatRange( colorOverTime[1].w, colorOverTime[2].w, seed );\n    }\n    else if ( opacityN > 1 )\n    {\n      float ok = r * ( float( opacityN ) - 1. );\n      float oi = floor( ok );\n      int j = int( oi )*2 + 1;\n      float sOpacity = randFloatRange( colorOverTime[j].w, colorOverTime[j + 1].w, seed );\n      float eOpacity = randFloatRange( colorOverTime[j + 2].w, colorOverTime[j + 3].w, seed );\n      opacity = mix( sOpacity, eOpacity, ok - oi );\n    }\n  #endif\n  \n    return vec4( color, opacity );\n  }\n  \n  // as per calcColorOverTime but euler rotation is packed in xyz and scale in w\n  \n  vec2 calcRotationScaleOverTime( const float r, const float seed )\n  {\n    float rotation = 0.;\n    float scale = 1.;\n  \n  #if defined(USE_PARTICLE_ROTATION) || defined(USE_RIBBON_ROTATION)\n    int rotationN = int( rotationScaleOverTime[0].x );\n    if ( rotationN == 1 )\n    {\n      rotation = randFloatRange( rotationScaleOverTime[1].x, rotationScaleOverTime[2].x, seed );\n    }\n    else if ( rotationN > 1 )\n    {\n      float rk = r * ( float( rotationN ) - 1. );\n      float ri = floor( rk );\n      int i = int( ri )*2 + 1; // *2 because each range is 2 vectors, and +1 because the first vector is for the length info\n      float sRotation = randFloatRange( rotationScaleOverTime[i].x, rotationScaleOverTime[i + 1].x, seed );\n      float eRotation = randFloatRange( rotationScaleOverTime[i + 2].x, rotationScaleOverTime[i + 3].x, seed );\n      rotation = mix( sRotation, eRotation, rk - ri );\n    }\n  #endif\n  \n  #if defined(USE_PARTICLE_SCALE)\n    int scaleN = int( rotationScaleOverTime[0].y );\n    if ( scaleN == 1 )\n    {\n      scale = randFloatRange( rotationScaleOverTime[1].y, rotationScaleOverTime[2].y, seed );\n    }\n    else if ( scaleN > 1 )\n    {\n      float sk = r * ( float( scaleN ) - 1. );\n      float si = floor( sk );\n      int j = int( si )*2 + 1; // *2 because each range is 2 vectors, and +1 because the first vector is for the length info\n      float sScale = randFloatRange( rotationScaleOverTime[j].y, rotationScaleOverTime[j + 1].y, seed );\n      float eScale = randFloatRange( rotationScaleOverTime[j + 2].y, rotationScaleOverTime[j + 3].y, seed );\n      scale = mix( sScale, eScale, sk - si );\n    }\n  #endif\n  \n    return vec2( rotation, scale );\n  }\n  \n  // assumes euler order is YXZ (standard convention for AFrame)\n  vec4 eulerToQuaternion( const vec3 euler )\n  {\n    // from https://github.com/mrdoob/three.js/blob/master/src/math/Quaternion.js\n  \n    vec3 c = cos( euler * .5 );\n    vec3 s = sin( euler * .5 );\n  \n    return vec4(\n      s.x * c.y * c.z + c.x * s.y * s.z,\n      c.x * s.y * c.z - s.x * c.y * s.z,\n      c.x * c.y * s.z - s.x * s.y * c.z,\n      c.x * c.y * c.z + s.x * s.y * s.z\n    );\n  }\n  \n  // from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm\n  vec4 axisAngleToQuaternion( const vec3 axis, const float angle ) \n  {\n    return vec4( axis * sin( angle*.5 ), cos( angle*.5 ) );\n  }\n  \n  vec3 applyQuaternion( const vec3 v, const vec4 q )\n  {\n    return v + 2. * cross( q.xyz, cross( q.xyz, v ) + q.w * v );\n  }\n  \n  vec3 displacement( const vec3 v, const vec3 a, const float t )\n  {\n    return (v + 0.5 * a * t) * t;\n  }\n  \n  float displacement1D( const float v, const float a, const float t )\n  {\n    return (v + 0.5 * a * t) * t;\n  }\n  \n  float ribbonShape( const float p )\n  {\n    return RIBBON_SHAPE_FUNCTION;\n  }\n  \n  vec3 particleMotion( const vec3 p, const vec3 v, const vec3 a, const vec3 av, const vec3 aa, const vec3 axis, const float ov, const float oa, const vec3 dest, const float weight, const float t )\n  {\n    vec3 pos = p + displacement(v, a, t);\n  \n  #if defined(USE_PARTICLE_ANGULAR_VELOCITY) || defined(USE_PARTICLE_ANGULAR_ACCELERATION)\n    pos = applyQuaternion( pos, eulerToQuaternion( displacement(av, aa, t) ) );\n  #endif\n  \n  #if defined(USE_PARTICLE_ORBITAL)\n    pos = applyQuaternion( pos, axisAngleToQuaternion( axis, displacement1D(ov, oa, t) ) );\n  #endif\n  \n  #if defined(USE_PARTICLE_SOURCE)\n    pos = applyQuaternion( pos, quaternion );\n  #endif\n  \n  pos += position;\n  \n  #if defined(USE_PARTICLE_DESTINATION)\n    pos = mix( pos, dest, weight );\n  #endif\n  \n    return pos;\n  }\n  \n  vec2 toScreen( const vec4 clipSpacePos )\n  {\n    return clipSpacePos.xy / clipSpacePos.w;\n  }\n  \n  void main() {\n  \n    float time = params[0].x;\n    float cpuID = params[0].y;\n    float radialTypeX = params[0].z;\n    float radialTypeY = params[4].w;\n    float duration = params[0].w;\n    float spawnType = params[1].x;\n    float spawnRate = params[1].y;\n    float baseSeed = params[1].z;\n    float vertexCount = params[1].w;\n    float direction = params[2].z; // 0 is forward, 1 is backward  \n    float trailInterval = params[3].x;\n    float particleCount = params[3].y;\n    float trailCount = params[3].z;\n    float maxParticleLifeTime = angularVelocity[1].w; // lifeTime packed into w component of angularVelocity\n    float maxTrailLifeTime = angularAcceleration[1].w; // trailLifeTime packed into angularAcceleration.w\n    float particleLoopTime = particleCount / spawnRate;\n    float motionAge = -1.; // used to determine the age for particle movement\n  \n  #if defined(USE_PARTICLE_TRAILS) || defined(USE_RIBBON_TRAILS) || defined(USE_RIBBON_3D_TRAILS)\n    float maxAge = maxParticleLifeTime + maxTrailLifeTime;\n  #else\n    float maxAge = maxParticleLifeTime;\n  #endif\n  \n    // the CPU manages IDs if it sets the position or disables particles, otherwise cpuID is -1\n    float particleID0 = cpuID > -EPSILON ? cpuID : floor( mod( time, particleLoopTime ) * spawnRate ); // this will lose precision eventually\n  \n    vOverTimeRatio = -1.; // the vOverTimeRatio will be used for the lerps on over-time attributes\n  \n    // particles are either emitted in a burst (spawnType == 0) or spread evenly\n    // throughout 0..particleLoopTime (spawnType == 1).  We calculate the ID of the last spawned particle particleID0 \n    // for this frame, any vertex IDs after particleID0 are assumed to belong to the previous loop\n  \n    // vertex 0 = trail0 of particle0, vertex 1 = trail1 of particle0, ..., vertex k = trail0 of particle1, ...\n  #if defined(USE_RIBBON_TRAILS) || defined(USE_RIBBON_3D_TRAILS)\n    float rawParticleID = floor( vertexID / VERTS_PER_RIBBON / trailCount );\n  #else\n    float rawParticleID = floor( vertexID / trailCount );\n  #endif\n  \n    float particleLoop = floor( time / particleLoopTime );\n  \n  #if defined(USE_PARTICLE_SOURCE)\n    // find particleID relative to the last loop\n    float particleID = rawParticleID - floor( particleID0 / particleCount ) * particleCount;\n  #else // defined(USE_PARTICLE_SOURCE)\n  \n  #if PARTICLE_ORDER == 0\n    float particleID = particleID0 - (particleCount - 1. - rawParticleID); // newest last\n  #elif PARTICLE_ORDER == 1\n    float particleID = particleID0 - rawParticleID; // oldest last\n  #else\n    float particleID = rawParticleID > particleID0 ? rawParticleID - particleCount : rawParticleID; // cyclic (original)\n  #endif\n  \n  #endif // defined(USE_PARTICLE_SOURCE)\n  \n    // for burst mode we use the rawParticleID, because the concept of particleID0 is irrelevant\n    particleID = mix( rawParticleID, particleID, spawnType ); \n  \n    float particleStartTime = particleLoop * particleLoopTime + particleID / spawnRate * spawnType;\n  \n    // we use the id as a seed for the randomizer, but because the IDs are fixed in \n    // the range 0..particleCount we calculate a virtual ID by taking into account\n    // the number of loops that have occurred (note, particles from the previous \n    // loop will have a negative particleID). We use the modoulo of the RANDOM_REPEAT_COUNT \n    // to ensure that the virtualID doesn't exceed the floating point precision\n  \n    float virtualID = mod( particleID + particleLoop * particleCount, float( RANDOM_REPEAT_COUNT ) );\n    float seed = pseudoRandom( virtualID*baseSeed*110. );\n  \n    float particleLifeTime = randFloatRange( angularVelocity[0].w, angularVelocity[1].w, seed );\n  \n    float particleAge = time - particleStartTime;\n    particleAge = particleAge + direction * ( particleLoopTime - 2. * particleAge );\n  \n    // don't show particles that would be emitted after the duration\n    if ( duration > 0. && time - particleAge >= duration ) \n    {\n      particleAge = -1.;\n    } \n  \n    // always calculate the trailLifeTime, even if we don't use it, so the particles\n    // with the same seed give consistent results\n    float trailLifeTime = randFloatRange( angularAcceleration[0].w, angularAcceleration[1].w, seed );\n  \n  #if defined(USE_PARTICLE_TRAILS)\n  \n    // +1 beceause we show both the lead particle and the first trail at the start\n    // we cap the particleAge to ensure it never goes past the particleLifeTime\n    float cappedParticleAge = min( particleLifeTime - trailInterval, particleAge );\n    float trailID0 = floor( cappedParticleAge / trailInterval ) + 1.;\n    float rawTrailID = mod( vertexID, trailCount );\n  \n  #if PARTICLE_TRAIL_ORDER == 0\n    float trailID = trailID0 - ( trailCount - 1. - rawTrailID ); // newest last\n  #elif PARTICLE_TRAIL_ORDER == 1\n    float trailID = trailID0 - rawTrailID; // oldest last\n  #else\n    float trailID = floor( trailID0 / trailCount ) * trailCount;\n    trailID += rawTrailID > mod( trailID0, trailCount ) ? rawTrailID - trailCount : rawTrailID; // cyclic (original)\n  #endif\n  \n    float trailStartAge = trailID * trailInterval;\n    \n    if (particleAge > -EPSILON && trailStartAge > -EPSILON && trailStartAge < particleLifeTime + EPSILON)\n    {\n      if (particleAge < trailStartAge)\n      {\n        motionAge = particleAge;\n        vOverTimeRatio = 0.;\n      }\n      else if (particleAge < trailStartAge + trailLifeTime)\n      {\n        motionAge = trailStartAge;\n        vOverTimeRatio = (particleAge - trailStartAge)/trailLifeTime;\n      }\n    }\n  \n  #elif defined(USE_RIBBON_TRAILS) || defined(USE_RIBBON_3D_TRAILS)\n  \n    // +1 to the trailID0 because the ribbon needs two elements to start\n    // we cap the particleAge to ensure it never goes past the particleLifeTime\n    float cappedParticleAge = min( particleLifeTime - trailInterval, particleAge );\n    float trailID0 = floor( cappedParticleAge / trailInterval ) + 1.;\n    float rawTrailID = floor( mod( vertexID / VERTS_PER_RIBBON, trailCount ) );\n    float trailID = max( 0., trailID0 - ( trailCount - 1. - rawTrailID ) ); // newest last\n  \n    float trailStartAge = trailID * trailInterval;\n  \n    if (particleAge > -EPSILON && trailStartAge > -EPSILON && trailStartAge < particleLifeTime + EPSILON)\n    {\n      // motionAge will typically be the trailStartAge, but the lead particle will be the \n      // cappedParticleAge, and the last particle will be the particleAge - trailLifeTime\n  \n      motionAge = min( cappedParticleAge, max( particleAge - trailLifeTime, trailStartAge ) );\n      vOverTimeRatio = ( particleAge - motionAge ) / trailLifeTime;\n    }\n    else\n    {\n      motionAge = particleLifeTime;\n      vOverTimeRatio = 1.0;\n    }\n  \n  #else // defined(USE_PARTICLE_TRAILS) || defined(USE_RIBBON_TRAILS) || defined(USE_RIBBON_3D_TRAILS)\n  \n    motionAge = particleAge;\n    vOverTimeRatio = particleAge/particleLifeTime;\n  \n  #endif // defined(USE_PARTICLE_TRAILS) || defined(USE_RIBBON_TRAILS) || defined(USE_RIBBON_3D_TRAILS)\n  \n    // these checks were around large blocks of code above, but this caused instability\n    // in some of the particle systems, so instead we do all of the work, then cancel \n    // it out here\n    if ( particleStartTime < 0. || vertexID < 0. )\n    {\n      vOverTimeRatio = -1.;\n    }\n  \n  #if defined(USE_PARTICLE_DRAG)\n    // simulate drag by blending the motionAge to (1-.5*drag)*particleLifeTime\n    float drag = params[2].w;\n    motionAge = mix( .5*drag*vOverTimeRatio, 1. - .5*drag, vOverTimeRatio ) * particleLifeTime;\n  #endif\n  \n    vec3 p = vec3(0.); // position\n    vec3 v = vec3(0.); // velocity\n    vec3 a = vec3(0.); // acceleration\n    vec3 av = vec3(0.); // angular velocity\n    vec3 aa = vec3(0.); // angular acceleration\n    vec3 axis = vec3( 1., 0., 0. ); // axis of orbital motion\n    float ov = 0.; // orbital velocity\n    float oa = 0.; // orbital acceleration\n    vec3 dest = vec3(0.); // destination position\n    float destWeight = 0.; // destination weighting\n  \n  #if defined(USE_PARTICLE_OFFSET)\n    p = randVec3Range( offset[0].xyz, offset[1].xyz, seed );\n  #endif\n  \n  #if defined(USE_PARTICLE_VELOCITY)\n    v = randVec3Range( velocity[0].xyz, velocity[1].xyz, seed );\n  #endif\n  \n  #if defined(USE_PARTICLE_ACCELERATION)\n    a = randVec3Range( acceleration[0].xyz, acceleration[1].xyz, seed );\n  #endif\n  \n  #if defined(USE_PARTICLE_RADIAL_OFFSET) || defined(USE_PARTICLE_RADIAL_VELOCITY) || defined(USE_PARTICLE_RADIAL_ACCELERATION)\n    vec2 ANGLE_RANGE[2];\n    vec2 radialDir = vec2( radialTypeX, radialTypeY );\n    ANGLE_RANGE[0] = vec2( 0., 0. ) * radialDir;\n    ANGLE_RANGE[1] = vec2( 2.*PI, 2.*PI ) * radialDir;\n  \n    vec2 theta = randVec2Range( ANGLE_RANGE[0], ANGLE_RANGE[1], seed );\n  #endif\n  \n  #if defined(USE_PARTICLE_RADIAL_OFFSET)\n    float pr = randFloatRange( offset[0].w, offset[1].w, seed );\n    vec3 p2 = radialToVec3( pr, theta );\n    p += p2;\n  #endif\n  \n  #if defined(USE_PARTICLE_RADIAL_VELOCITY)\n    float vr = randFloatRange( velocity[0].w, velocity[1].w, seed );\n    vec3 v2 = radialToVec3( vr, theta );\n    v += v2;\n  #endif\n  \n  #if defined(USE_PARTICLE_RADIAL_ACCELERATION)\n    float ar = randFloatRange( acceleration[0].w, acceleration[1].w, seed );\n    vec3 a2 = radialToVec3( ar, theta );\n    a += a2;\n  #endif\n  \n  #if defined(USE_PARTICLE_ANGULAR_VELOCITY)\n    av = randVec3Range( angularVelocity[0].xyz, angularVelocity[1].xyz, seed );\n  #endif\n  \n  #if defined(USE_PARTICLE_ANGULAR_ACCELERATION)\n    aa = randVec3Range( angularAcceleration[0].xyz, angularAcceleration[1].xyz, seed );\n  #endif\n  \n  #if defined(USE_PARTICLE_ORBITAL)\n    if ( length(p) > EPSILON ) {\n      ov = randFloatRange( orbital[0].x, orbital[1].x, seed );\n      float oa = randFloatRange( orbital[0].y, orbital[1].y, seed );\n      float angle = displacement1D(ov, oa, motionAge);\n  \n      vec3 randomOribit = vec3( random( seed ), random( seed ), random( seed ) ); // should never equal p or 0,0,0\n      axis = normalize( cross( normalize( p ), normalize( randomOribit ) ) );\n    }\n  #endif\n  \n  #if defined(USE_PARTICLE_DESTINATION)\n    destWeight = randFloatRange( destination[0].w, destination[1].w, seed );\n    dest = randVec3Range( destination[0].xyz, destination[1].xyz, seed );\n  #endif\n  \n    vec3 transformed = particleMotion( p, v, a, av, aa, axis, ov, oa, dest, motionAge/particleLifeTime*destWeight, motionAge );\n  \n    vec2 rotScale = calcRotationScaleOverTime( vOverTimeRatio, seed );\n    float particleScale = rotScale.y;\n    float c = cos( rotScale.x );\n    float s = sin( rotScale.x );\n  \n    vParticleColor = calcColorOverTime( vOverTimeRatio, seed ); // rgba format\n  \n  #if defined(USE_PARTICLE_VELOCITY_SCALE)\n    // We repeat all of the displacement calculations at motionAge + a small amount (velocityScaleDelta).\n    // We convert the current position and the future position in screen space and determine\n    // the screen space velocity. VelocityScaleDelta is reasonably small to give better\n    // results for the angular and orbital displacement, and when drag is applied the effective\n    // velocity will tend to 0 as the vOverTimeRatio increases\n  \n    float velocityScaleDelta = .02;\n  \n  #if defined(USE_PARTICLE_DRAG)\n    float futureT = motionAge + velocityScaleDelta*mix(1., 1. - drag, vOverTimeRatio);\n  #else\n    float futureT = motionAge + velocityScaleDelta;\n  #endif\n  \n    vec4 pos2D = projectionMatrix * modelViewMatrix * vec4( transformed, 1. );\n  \n    // use min(1) to ensure the particle stops at the destination position\n    vec3 transformedFuture = particleMotion( p, v, a, av, aa, axis, ov, oa, dest, min( 1., futureT/particleLifeTime )*destWeight, futureT );\n  \n    vec4 pos2DFuture = projectionMatrix * modelViewMatrix * vec4( transformedFuture, 1. );\n  \n    vec2 screen = pos2DFuture.xy / pos2DFuture.z - pos2D.xy / pos2D.z; // TODO divide by 0?\n    screen /= velocityScaleDelta; // gives screen units per second\n  \n    float lenScreen = length( screen );\n    vec2 sinCos = vec2(screen.x, screen.y)/max( EPSILON, lenScreen); // 0 degrees is y == 1, x == 0\n    float c2 = c*sinCos.y + s*sinCos.x; // cos(a-b)\n    float s2 = s*sinCos.y - c*sinCos.x; // sin(a-b)\n  \n    // replace rotation with our new rotation\n    c = c2;\n    s = s2;\n  \n    // rescale the particle length by the z depth, because perspective will be applied later\n    float screenScale = clamp( lenScreen * pos2D.z * velocityScale.x, velocityScale.y, velocityScale.z );\n  \n    particleScale *= screenScale;\n  \n  #endif // defined(USE_PARTICLE_VELOCITY_SCALE)\n  \n    vCosSinRotation = vec2( c, s );\n  \n    // #include <color_vertex>\n    // #include <begin_vertex> replaced by code above\n    // #include <morphtarget_vertex>\n    // #include <project_vertex> replaced below\n  \n  #if defined(USE_RIBBON_3D_TRAILS)\n    float ribbonID = mod( vertexID, VERTS_PER_RIBBON );\n    \n    {\n      float nextT = motionAge + trailInterval;\n      float ribbonWidth = params[4].x * ribbonShape( vOverTimeRatio );\n  \n      vec3 nextPosition = particleMotion( p, v, a, av, aa, axis, ov, oa, dest, min( 1., nextT/particleLifeTime )*destWeight, nextT );\n      vec3 dir = nextPosition - transformed;\n      float dirLen = length( dir );\n  \n      vec3 normal = dir;\n      vec3 up = vec3( 0., c, -s ); // rotation in YZ\n      if ( dirLen > EPSILON && abs( dot( dir, up ) ) < dirLen * 0.99 ) {\n        normal = normalize( cross( up, dir ) );\n      }\n  \n      transformed += ribbonWidth * normal * ( 0.5 - ribbonID );  // +normal for ribbonID 0, -normal for ribbonID 1\n    }\n  #endif\n  \n    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n    gl_Position = projectionMatrix * mvPosition;\n  \n    float usePerspective = params[2].y;\n  \n  #if defined(USE_RIBBON_TRAILS)\n    float ribbonID = mod( vertexID, VERTS_PER_RIBBON );\n    \n    {\n      mat4 m = projectionMatrix * modelViewMatrix;\n      vec2 curr = toScreen( gl_Position );\n  \n      float nextT = motionAge + trailInterval;\n      vec3 nextPosition = particleMotion( p, v, a, av, aa, axis, ov, oa, dest, min( 1., nextT/particleLifeTime )*destWeight, nextT );\n      vec2 next2D = toScreen( m * vec4( nextPosition, 1. ) ) - curr;\n  \n      vec2 dir = normalize( next2D );\n      vec2 normal = vec2( -dir.y, dir.x );\n  \n      float ribbonWidth = params[4].x * ribbonShape( vOverTimeRatio );\n      float halfWidth = .5 * ribbonWidth * mix( 1., 1. / - mvPosition.z, usePerspective );\n    \n      gl_Position.xy += halfWidth * normal * ( 1. - ribbonID * 2. ); // +normal for ribbonID 0, -normal for ribbonID 1\n    }\n  #endif\n  \n  #if defined(USE_PARTICLE_SCREEN_DEPTH_OFFSET)\n    float screenDepthOffset = params[3].w;\n  \n  #if defined(USE_PARTICLE_TRAILS) || defined(USE_RIBBON_TRAILS) || defined(USE_RIBBON_3D_TRAILS)\n    // multiply trailCount by 2 because trailID ranges from [-trailCount, trailCount]\n    gl_Position.z -= (particleID*trailCount*2. + trailID - trailID0)*gl_Position.w*screenDepthOffset/vertexCount;\n  #else\n    gl_Position.z -= particleID*gl_Position.w*screenDepthOffset/vertexCount;\n  #endif\n  \n  #endif // defined(USE_PARTICLE_SCREEN_DEPTH_OFFSET)\n  \n  // vFrame is an int, but we must pass it as a float, so add .5 now and floor() in the\n  // fragment shader to ensure there is no rounding error\n  #if defined(USE_PARTICLE_RANDOMIZE_FRAMES)\n    vFrame = floor ( random( seed ) * textureFrames.z ) + .5;\n  #else\n    float textureCount = textureFrames.z;\n    float textureLoop = textureFrames.w;\n  \n    vFrame = floor( mod( vOverTimeRatio * textureCount * textureLoop, textureCount ) ) + .5;\n  #endif\n  \n  #if !defined(USE_RIBBON_TRAILS) && !defined(USE_RIBBON_3D_TRAILS)\n    float particleSize = params[2].x;\n  \n    gl_PointSize = particleSize * particleScale * mix( 1., 1. / - mvPosition.z, usePerspective );\n  #endif\n  \n    // #include <logdepthbuf_vertex>\n    // #include <clipping_planes_vertex>\n    // #include <worldpos_vertex>\n    #include <fog_vertex>\n  \n  #if defined(USE_RIBBON_TRAILS) || defined(USE_RIBBON_3D_TRAILS)\n    float ribbonUVMultiplier = params[4].y;\n    float ribbonUVType = params[4].z;\n  \n    vUv = vec2( mix( 1. - vOverTimeRatio, motionAge/trailInterval, ribbonUVType ) * ribbonUVMultiplier, 1. - ribbonID );\n  #endif\n  }",
        E =
            "\n  #include <common>\n  #include <packing>\n  // #include <color_pars_fragment>\n  #include <map_particle_pars_fragment>\n  #include <fog_pars_fragment>\n  // #include <logdepthbuf_pars_fragment>\n  // #include <clipping_planes_pars_fragment>\n  \n  uniform vec4 textureFrames;\n  uniform vec3 emitterColor;\n  \n  varying vec4 vParticleColor;\n  varying vec2 vCosSinRotation;\n  varying vec2 vUv;\n  varying float vOverTimeRatio;\n  varying float vFrame;\n  \n  void main() {\n    if ( vOverTimeRatio < 0. || vOverTimeRatio > 1. ) {\n      discard;\n    }\n  \n    #include <clipping_planes_fragment>\n  \n    vec3 outgoingLight = vec3( 0. );\n    vec4 diffuseColor = vec4( emitterColor, 1. );\n    mat3 uvTransform = mat3( 1. );\n  \n  #if defined(USE_PARTICLE_ROTATION) || defined(USE_PARTICLE_FRAMES) || defined(USE_PARTICLE_VELOCITY_SCALE)\n    {\n      vec2 invTextureFrame = 1. / textureFrames.xy;\n      float textureCount = textureFrames.z;\n      float textureLoop = textureFrames.w;\n  \n      float frame = floor(vFrame);\n      float c = vCosSinRotation.x;\n      float s = vCosSinRotation.y;\n      float tx = mod( frame, textureFrames.x ) * invTextureFrame.x;\n      float ty = (textureFrames.y - 1. - floor( frame * invTextureFrame.x )) * invTextureFrame.y; // assumes textures are flipped on y\n      float sx = invTextureFrame.x;\n      float sy = invTextureFrame.y;\n      float cx = tx + invTextureFrame.x * .5;\n      float cy = ty + invTextureFrame.y * .5;\n    \n      uvTransform[0][0] = sx * c;\n      uvTransform[0][1] = -sx * s;\n      uvTransform[1][0] = sy * s;\n      uvTransform[1][1] = sy * c;\n      uvTransform[2][0] = c * tx + s * ty - ( c * cx + s * cy ) + cx;\n      uvTransform[2][1] = -s * tx + c * ty - ( -s * cx + c * cy ) + cy;\n    }\n  #endif // defined(USE_PARTICLE_ROTATION) || defined(USE_PARTICLE_FRAMES) || defined(USE_PARTICLE_VELOCITY_SCALE)\n  \n    // #include <logdepthbuf_fragment>\n    // #include <map_particle_fragment>\n    // #include <color_fragment>\n  \n  #ifdef USE_MAP\n  \n  #if defined(USE_RIBBON_TRAILS) || defined(USE_RIBBON_3D_TRAILS)\n    vec2 uv = ( uvTransform * vec3( vUv, 1. ) ).xy;\n  #else\n    vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1. ) ).xy;\n  #endif\n  \n    vec4 mapTexel = texture2D( map, uv );\n    // diffuseColor *= mapTexelToLinear( mapTexel );\n    diffuseColor *= mapTexel;\n  #endif // USE_MAP\n  \n    #ifdef USE_ALPHATEST\n      if ( diffuseColor.a < 0.1 ) discard;\n    #endif\n  \n    diffuseColor *= vParticleColor;\n    outgoingLight = diffuseColor.rgb;\n  \n    gl_FragColor = diffuseColor;\n  \n    // #include <premultiplied_alpha_fragment>\n    // #include <tonemapping_fragment>\n    // #include <encodings_fragment>\n    #include <fog_fragment>\n  }";
})();
