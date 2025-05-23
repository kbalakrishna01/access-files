!(function (e) {
    function t(i) {
        if (r[i]) return r[i].exports;
        var a = (r[i] = { exports: {}, id: i, loaded: !1 });
        return e[i].call(a.exports, a, a.exports, t), (a.loaded = !0), a.exports;
    }
    var r = {};
    return (t.m = e), (t.c = r), (t.p = ""), t(0);
})([
    function (e, t, r) {
        var i = r(1);
        if ("undefined" == typeof AFRAME) throw new Error("Component attempted to register before AFRAME was available.");
        AFRAME.registerComponent("particle-system", {
            schema: {
                preset: { type: "string", default: "", oneOf: ["default", "dust", "snow", "rain"] },
                maxAge: { type: "number", default: 6 },
                positionSpread: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
                type: { type: "number", default: i.distributions.BOX },
                rotationAxis: { type: "string", default: "x" },
                rotationAngle: { type: "number", default: 0 },
                rotationAngleSpread: { type: "number", default: 0 },
                accelerationValue: { type: "vec3", default: { x: 0, y: -10, z: 0 } },
                accelerationSpread: { type: "vec3", default: { x: 10, y: 0, z: 10 } },
                velocityValue: { type: "vec3", default: { x: 0, y: 25, z: 0 } },
                velocitySpread: { type: "vec3", default: { x: 10, y: 7.5, z: 10 } },
                dragValue: { type: "number", default: 0 },
                dragSpread: { type: "number", default: 0 },
                dragRandomise: { type: "boolean", default: !1 },
                color: { type: "array", default: ["#0000FF", "#FF0000"] },
                size: { type: "array", default: ["1"] },
                sizeSpread: { type: "array", default: ["0"] },
                direction: { type: "number", default: 1 },
                duration: { type: "number", default: 1 / 0 },
                particleCount: { type: "number", default: 1e3 },
                texture: { type: "asset", default: "https://cdn.rawgit.com/IdeaSpaceVR/aframe-particle-system-component/master/dist/images/star2.png" },
                randomise: { type: "boolean", default: !1 },
                opacity: { type: "array", default: ["1"] },
                opacitySpread: { type: "array", default: ["0"] },
                maxParticleCount: { type: "number", default: 25e4 },
                blending: { type: "number", default: THREE.AdditiveBlending, oneOf: [THREE.NoBlending, THREE.NormalBlending, THREE.AdditiveBlending, THREE.SubtractiveBlending, THREE.MultiplyBlending] },
                enabled: { type: "boolean", default: !0 },
            },
            init: function () {
                (this.presets = {}),
                    (this.presets.dust = {
                        maxAge: 20,
                        positionSpread: { x: 100, y: 100, z: 100 },
                        rotationAngle: 3.14,
                        accelerationValue: { x: 0, y: 0, z: 0 },
                        accelerationSpread: { x: 0, y: 0, z: 0 },
                        velocityValue: { x: 1, y: 0.3, z: 1 },
                        velocitySpread: { x: 0.5, y: 1, z: 0.5 },
                        color: ["#FFFFFF"],
                        particleCount: 100,
                        texture: "https://cdn.rawgit.com/IdeaSpaceVR/aframe-particle-system-component/master/dist/images/smokeparticle.png",
                    }),
                    (this.presets.snow = {
                        maxAge: 20,
                        positionSpread: { x: 100, y: 100, z: 100 },
                        rotationAngle: 3.14,
                        accelerationValue: { x: 0, y: 0, z: 0 },
                        accelerationSpread: { x: 0.2, y: 0, z: 0.2 },
                        velocityValue: { x: 0, y: 8, z: 0 },
                        velocitySpread: { x: 2, y: 0, z: 2 },
                        color: ["#FFFFFF"],
                        particleCount: 200,
                        texture: "https://cdn.rawgit.com/IdeaSpaceVR/aframe-particle-system-component/master/dist/images/smokeparticle.png",
                    }),
                    (this.presets.rain = {
                        maxAge: 1,
                        positionSpread: { x: 100, y: 100, z: 100 },
                        rotationAngle: 3.14,
                        accelerationValue: { x: 0, y: 3, z: 0 },
                        accelerationSpread: { x: 2, y: 1, z: 2 },
                        velocityValue: { x: 0, y: 75, z: 0 },
                        velocitySpread: { x: 10, y: 50, z: 10 },
                        color: ["#FFFFFF"],
                        size: 0.4,
                        texture: "https://cdn.rawgit.com/IdeaSpaceVR/aframe-particle-system-component/master/dist/images/raindrop.png",
                    });
            },
            update: function (e) {
                this.particleGroup && this.el.removeObject3D("particle-system"), (this.preset = this.presets[this.data.preset] || {});
                for (var t in this.data) this.data[t] = this.applyPreset(t);
                this.initParticleSystem(this.data), this.data.enabled === !0 ? this.startParticles() : this.stopParticles();
            },
            applyPreset: function (e) {
                return !this.attrValue[e] && this.preset[e] ? this.preset[e] : this.data[e];
            },
            tick: function (e, t) {
                this.particleGroup.tick(t / 1e3);
            },
            remove: function () {
                this.particleGroup && this.el.removeObject3D("particle-system");
            },
            startParticles: function () {
                this.particleGroup.emitters.forEach(function (e) {
                    e.enable();
                });
            },
            stopParticles: function () {
                this.particleGroup.emitters.forEach(function (e) {
                    e.disable();
                });
            },
            initParticleSystem: function (e) {
                var t = new THREE.TextureLoader(),
                    r = t.load(
                        e.texture,
                        function (e) {
                            return e;
                        },
                        function (e) {
                            console.log((e.loaded / e.total) * 100 + "% loaded");
                        },
                        function (e) {
                            console.log("An error occurred");
                        }
                    );
                this.particleGroup = new i.Group({ texture: { value: r }, maxParticleCount: e.maxParticleCount, blending: e.blending });
                var a = new i.Emitter({
                    maxAge: { value: e.maxAge },
                    type: { value: e.type },
                    position: { spread: new THREE.Vector3(e.positionSpread.x, e.positionSpread.y, e.positionSpread.z), randomise: e.randomise },
                    rotation: {
                        axis: "x" == e.rotationAxis ? new THREE.Vector3(1, 0, 0) : "y" == e.rotationAxis ? new THREE.Vector3(0, 1, 0) : "z" == e.rotationAxis ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0),
                        angle: e.rotationAngle,
                        angleSpread: e.rotationAngleSpread,
                        static: !0,
                    },
                    acceleration: { value: new THREE.Vector3(e.accelerationValue.x, e.accelerationValue.y, e.accelerationValue.z), spread: new THREE.Vector3(e.accelerationSpread.x, e.accelerationSpread.y, e.accelerationSpread.z) },
                    velocity: { value: new THREE.Vector3(e.velocityValue.x, e.velocityValue.y, e.velocityValue.z), spread: new THREE.Vector3(e.velocitySpread.x, e.velocitySpread.y, e.velocitySpread.z) },
                    drag: { value: new THREE.Vector3(e.dragValue.x, e.dragValue.y, e.dragValue.z), spread: new THREE.Vector3(e.dragSpread.x, e.dragSpread.y, e.dragSpread.z), randomise: e.dragRandomise },
                    color: {
                        value: e.color.map(function (e) {
                            return new THREE.Color(e);
                        }),
                    },
                    size: {
                        value: e.size.map(function (e) {
                            return parseFloat(e);
                        }),
                        spread: e.sizeSpread.map(function (e) {
                            return parseFloat(e);
                        }),
                    },
                    direction: { value: e.direction },
                    duration: e.duration,
                    opacity: {
                        value: e.opacity.map(function (e) {
                            return parseFloat(e);
                        }),
                        spread: e.opacitySpread.map(function (e) {
                            return parseFloat(e);
                        }),
                    },
                    particleCount: e.particleCount,
                });
                this.particleGroup.addEmitter(a), (this.particleGroup.mesh.frustumCulled = !1), this.el.setObject3D("particle-system", this.particleGroup.mesh);
            },
        });
    },
    function (e, t, r) {
        var i,
            a,
            o = { distributions: { BOX: 1, SPHERE: 2, DISC: 3, LINE: 4 }, valueOverLifetimeLength: 4 };
        (i = o),
            (a = "function" == typeof i ? i.call(t, r, t, e) : i),
            !(void 0 !== a && (e.exports = a)),
            (o.TypedArrayHelper = function (e, t, r, i) {
                "use strict";
                (this.componentSize = r || 1), (this.size = t || 1), (this.TypedArrayConstructor = e || Float32Array), (this.array = new e(t * this.componentSize)), (this.indexOffset = i || 0);
            }),
            (o.TypedArrayHelper.constructor = o.TypedArrayHelper),
            (o.TypedArrayHelper.prototype.setSize = function (e, t) {
                "use strict";
                var r = this.array.length;
                return t || (e *= this.componentSize), e < r ? this.shrink(e) : e > r ? this.grow(e) : void console.info("TypedArray is already of size:", e + ".", "Will not resize.");
            }),
            (o.TypedArrayHelper.prototype.shrink = function (e) {
                "use strict";
                return (this.array = this.array.subarray(0, e)), (this.size = e), this;
            }),
            (o.TypedArrayHelper.prototype.grow = function (e) {
                "use strict";
                var t = this.array,
                    r = new this.TypedArrayConstructor(e);
                return r.set(t), (this.array = r), (this.size = e), this;
            }),
            (o.TypedArrayHelper.prototype.splice = function (e, t) {
                "use strict";
                (e *= this.componentSize), (t *= this.componentSize);
                for (var r = [], i = this.array, a = i.length, o = 0; o < a; ++o) (o < e || o >= t) && r.push(i[o]);
                return this.setFromArray(0, r), this;
            }),
            (o.TypedArrayHelper.prototype.setFromArray = function (e, t) {
                "use strict";
                var r = t.length,
                    i = e + r;
                return i > this.array.length ? this.grow(i) : i < this.array.length && this.shrink(i), this.array.set(t, this.indexOffset + e), this;
            }),
            (o.TypedArrayHelper.prototype.setVec2 = function (e, t) {
                "use strict";
                return this.setVec2Components(e, t.x, t.y);
            }),
            (o.TypedArrayHelper.prototype.setVec2Components = function (e, t, r) {
                "use strict";
                var i = this.array,
                    a = this.indexOffset + e * this.componentSize;
                return (i[a] = t), (i[a + 1] = r), this;
            }),
            (o.TypedArrayHelper.prototype.setVec3 = function (e, t) {
                "use strict";
                return this.setVec3Components(e, t.x, t.y, t.z);
            }),
            (o.TypedArrayHelper.prototype.setVec3Components = function (e, t, r, i) {
                "use strict";
                var a = this.array,
                    o = this.indexOffset + e * this.componentSize;
                return (a[o] = t), (a[o + 1] = r), (a[o + 2] = i), this;
            }),
            (o.TypedArrayHelper.prototype.setVec4 = function (e, t) {
                "use strict";
                return this.setVec4Components(e, t.x, t.y, t.z, t.w);
            }),
            (o.TypedArrayHelper.prototype.setVec4Components = function (e, t, r, i, a) {
                "use strict";
                var o = this.array,
                    s = this.indexOffset + e * this.componentSize;
                return (o[s] = t), (o[s + 1] = r), (o[s + 2] = i), (o[s + 3] = a), this;
            }),
            (o.TypedArrayHelper.prototype.setMat3 = function (e, t) {
                "use strict";
                return this.setFromArray(this.indexOffset + e * this.componentSize, t.elements);
            }),
            (o.TypedArrayHelper.prototype.setMat4 = function (e, t) {
                "use strict";
                return this.setFromArray(this.indexOffset + e * this.componentSize, t.elements);
            }),
            (o.TypedArrayHelper.prototype.setColor = function (e, t) {
                "use strict";
                return this.setVec3Components(e, t.r, t.g, t.b);
            }),
            (o.TypedArrayHelper.prototype.setNumber = function (e, t) {
                "use strict";
                return (this.array[this.indexOffset + e * this.componentSize] = t), this;
            }),
            (o.TypedArrayHelper.prototype.getValueAtIndex = function (e) {
                "use strict";
                return this.array[this.indexOffset + e];
            }),
            (o.TypedArrayHelper.prototype.getComponentValueAtIndex = function (e) {
                "use strict";
                return this.array.subarray(this.indexOffset + e * this.componentSize);
            }),
            (o.ShaderAttribute = function (e, t, r) {
                "use strict";
                var i = o.ShaderAttribute.typeSizeMap;
                (this.type = "string" == typeof e && i.hasOwnProperty(e) ? e : "f"),
                    (this.componentSize = i[this.type]),
                    (this.arrayType = r || Float32Array),
                    (this.typedArray = null),
                    (this.bufferAttribute = null),
                    (this.dynamicBuffer = !!t),
                    (this.updateMin = 0),
                    (this.updateMax = 0);
            }),
            (o.ShaderAttribute.constructor = o.ShaderAttribute),
            (o.ShaderAttribute.typeSizeMap = { f: 1, v2: 2, v3: 3, v4: 4, c: 3, m3: 9, m4: 16 }),
            (o.ShaderAttribute.prototype.setUpdateRange = function (e, t) {
                "use strict";
                (this.updateMin = Math.min(e * this.componentSize, this.updateMin * this.componentSize)), (this.updateMax = Math.max(t * this.componentSize, this.updateMax * this.componentSize));
            }),
            (o.ShaderAttribute.prototype.flagUpdate = function () {
                "use strict";
                var e = this.bufferAttribute,
                    t = e.updateRange;
                (t.offset = this.updateMin), (t.count = Math.min(this.updateMax - this.updateMin + this.componentSize, this.typedArray.array.length)), (e.needsUpdate = !0);
            }),
            (o.ShaderAttribute.prototype.resetUpdateRange = function () {
                "use strict";
                (this.updateMin = 0), (this.updateMax = 0);
            }),
            (o.ShaderAttribute.prototype.resetDynamic = function () {
                "use strict";
                this.bufferAttribute.usage = this.dynamicBuffer ? THREE.DynamicDrawUsage : THREE.StaticDrawUsage;
            }),
            (o.ShaderAttribute.prototype.splice = function (e, t) {
                "use strict";
                this.typedArray.splice(e, t), this.forceUpdateAll();
            }),
            (o.ShaderAttribute.prototype.forceUpdateAll = function () {
                "use strict";
                (this.bufferAttribute.array = this.typedArray.array),
                    (this.bufferAttribute.updateRange.offset = 0),
                    (this.bufferAttribute.updateRange.count = -1),
                    (this.bufferAttribute.usage = THREE.StaticDrawUsage),
                    (this.bufferAttribute.needsUpdate = !0);
            }),
            (o.ShaderAttribute.prototype._ensureTypedArray = function (e) {
                "use strict";
                (null !== this.typedArray && this.typedArray.size === e * this.componentSize) ||
                    (null !== this.typedArray && this.typedArray.size !== e ? this.typedArray.setSize(e) : null === this.typedArray && (this.typedArray = new o.TypedArrayHelper(this.arrayType, e, this.componentSize)));
            }),
            (o.ShaderAttribute.prototype._createBufferAttribute = function (e) {
                "use strict";
                return (
                    this._ensureTypedArray(e),
                    null !== this.bufferAttribute
                        ? ((this.bufferAttribute.array = this.typedArray.array),
                          parseFloat(THREE.REVISION) >= 81 && (this.bufferAttribute.count = this.bufferAttribute.array.length / this.bufferAttribute.itemSize),
                          void (this.bufferAttribute.needsUpdate = !0))
                        : ((this.bufferAttribute = new THREE.BufferAttribute(this.typedArray.array, this.componentSize)), void (this.bufferAttribute.usage = this.dynamicBuffer ? THREE.DynamicDrawUsage : THREE.StaticDrawUsage))
                );
            }),
            (o.ShaderAttribute.prototype.getLength = function () {
                "use strict";
                return null === this.typedArray ? 0 : this.typedArray.array.length;
            }),
            (o.shaderChunks = {
                defines: ["#define PACKED_COLOR_SIZE 256.0", "#define PACKED_COLOR_DIVISOR 255.0"].join("\n"),
                uniforms: ["uniform float deltaTime;", "uniform float runTime;", "uniform sampler2D tex;", "uniform vec4 textureAnimation;", "uniform float scale;"].join("\n"),
                attributes: [
                    "attribute vec4 acceleration;",
                    "attribute vec3 velocity;",
                    "attribute vec4 rotation;",
                    "attribute vec3 rotationCenter;",
                    "attribute vec4 params;",
                    "attribute vec4 size;",
                    "attribute vec4 angle;",
                    "attribute vec4 color;",
                    "attribute vec4 opacity;",
                ].join("\n"),
                varyings: ["varying vec4 vColor;", "#ifdef SHOULD_ROTATE_TEXTURE", "    varying float vAngle;", "#endif", "#ifdef SHOULD_CALCULATE_SPRITE", "    varying vec4 vSpriteSheet;", "#endif"].join("\n"),
                branchAvoidanceFunctions: [
                    "float when_gt(float x, float y) {",
                    "    return max(sign(x - y), 0.0);",
                    "}",
                    "float when_lt(float x, float y) {",
                    "    return min( max(1.0 - sign(x - y), 0.0), 1.0 );",
                    "}",
                    "float when_eq( float x, float y ) {",
                    "    return 1.0 - abs( sign( x - y ) );",
                    "}",
                    "float when_ge(float x, float y) {",
                    "  return 1.0 - when_lt(x, y);",
                    "}",
                    "float when_le(float x, float y) {",
                    "  return 1.0 - when_gt(x, y);",
                    "}",
                    "float and(float a, float b) {",
                    "    return a * b;",
                    "}",
                    "float or(float a, float b) {",
                    "    return min(a + b, 1.0);",
                    "}",
                ].join("\n"),
                unpackColor: [
                    "vec3 unpackColor( in float hex ) {",
                    "   vec3 c = vec3( 0.0 );",
                    "   float r = mod( (hex / PACKED_COLOR_SIZE / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );",
                    "   float g = mod( (hex / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );",
                    "   float b = mod( hex, PACKED_COLOR_SIZE );",
                    "   c.r = r / PACKED_COLOR_DIVISOR;",
                    "   c.g = g / PACKED_COLOR_DIVISOR;",
                    "   c.b = b / PACKED_COLOR_DIVISOR;",
                    "   return c;",
                    "}",
                ].join("\n"),
                unpackRotationAxis: [
                    "vec3 unpackRotationAxis( in float hex ) {",
                    "   vec3 c = vec3( 0.0 );",
                    "   float r = mod( (hex / PACKED_COLOR_SIZE / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );",
                    "   float g = mod( (hex / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );",
                    "   float b = mod( hex, PACKED_COLOR_SIZE );",
                    "   c.r = r / PACKED_COLOR_DIVISOR;",
                    "   c.g = g / PACKED_COLOR_DIVISOR;",
                    "   c.b = b / PACKED_COLOR_DIVISOR;",
                    "   c *= vec3( 2.0 );",
                    "   c -= vec3( 1.0 );",
                    "   return c;",
                    "}",
                ].join("\n"),
                floatOverLifetime: [
                    "float getFloatOverLifetime( in float positionInTime, in vec4 attr ) {",
                    "    highp float value = 0.0;",
                    "    float deltaAge = positionInTime * float( VALUE_OVER_LIFETIME_LENGTH - 1 );",
                    "    float fIndex = 0.0;",
                    "    float shouldApplyValue = 0.0;",
                    "    value += attr[ 0 ] * when_eq( deltaAge, 0.0 );",
                    "",
                    "    for( int i = 0; i < VALUE_OVER_LIFETIME_LENGTH - 1; ++i ) {",
                    "       fIndex = float( i );",
                    "       shouldApplyValue = and( when_gt( deltaAge, fIndex ), when_le( deltaAge, fIndex + 1.0 ) );",
                    "       value += shouldApplyValue * mix( attr[ i ], attr[ i + 1 ], deltaAge - fIndex );",
                    "    }",
                    "",
                    "    return value;",
                    "}",
                ].join("\n"),
                colorOverLifetime: [
                    "vec3 getColorOverLifetime( in float positionInTime, in vec3 color1, in vec3 color2, in vec3 color3, in vec3 color4 ) {",
                    "    vec3 value = vec3( 0.0 );",
                    "    value.x = getFloatOverLifetime( positionInTime, vec4( color1.x, color2.x, color3.x, color4.x ) );",
                    "    value.y = getFloatOverLifetime( positionInTime, vec4( color1.y, color2.y, color3.y, color4.y ) );",
                    "    value.z = getFloatOverLifetime( positionInTime, vec4( color1.z, color2.z, color3.z, color4.z ) );",
                    "    return value;",
                    "}",
                ].join("\n"),
                paramFetchingFunctions: [
                    "float getAlive() {",
                    "   return params.x;",
                    "}",
                    "float getAge() {",
                    "   return params.y;",
                    "}",
                    "float getMaxAge() {",
                    "   return params.z;",
                    "}",
                    "float getWiggle() {",
                    "   return params.w;",
                    "}",
                ].join("\n"),
                forceFetchingFunctions: [
                    "vec4 getPosition( in float age ) {",
                    "   return modelViewMatrix * vec4( position, 1.0 );",
                    "}",
                    "vec3 getVelocity( in float age ) {",
                    "   return velocity * age;",
                    "}",
                    "vec3 getAcceleration( in float age ) {",
                    "   return acceleration.xyz * age;",
                    "}",
                ].join("\n"),
                rotationFunctions: [
                    "#ifdef SHOULD_ROTATE_PARTICLES",
                    "   mat4 getRotationMatrix( in vec3 axis, in float angle) {",
                    "       axis = normalize(axis);",
                    "       float s = sin(angle);",
                    "       float c = cos(angle);",
                    "       float oc = 1.0 - c;",
                    "",
                    "       return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,",
                    "                   oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,",
                    "                   oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,",
                    "                   0.0,                                0.0,                                0.0,                                1.0);",
                    "   }",
                    "",
                    "   vec3 getRotation( in vec3 pos, in float positionInTime ) {",
                    "      if( rotation.y == 0.0 ) {",
                    "           return pos;",
                    "      }",
                    "",
                    "      vec3 axis = unpackRotationAxis( rotation.x );",
                    "      vec3 center = rotationCenter;",
                    "      vec3 translated;",
                    "      mat4 rotationMatrix;",
                    "      float angle = 0.0;",
                    "      angle += when_eq( rotation.z, 0.0 ) * rotation.y;",
                    "      angle += when_gt( rotation.z, 0.0 ) * mix( 0.0, rotation.y, positionInTime );",
                    "      translated = rotationCenter - pos;",
                    "      rotationMatrix = getRotationMatrix( axis, angle );",
                    "      return center - vec3( rotationMatrix * vec4( translated, 0.0 ) );",
                    "   }",
                    "#endif",
                ].join("\n"),
                rotateTexture: [
                    "    vec2 vUv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );",
                    "",
                    "    #ifdef SHOULD_ROTATE_TEXTURE",
                    "       float x = gl_PointCoord.x - 0.5;",
                    "       float y = 1.0 - gl_PointCoord.y - 0.5;",
                    "       float c = cos( -vAngle );",
                    "       float s = sin( -vAngle );",
                    "       vUv = vec2( c * x + s * y + 0.5, c * y - s * x + 0.5 );",
                    "    #endif",
                    "",
                    "    #ifdef SHOULD_CALCULATE_SPRITE",
                    "        float framesX = vSpriteSheet.x;",
                    "        float framesY = vSpriteSheet.y;",
                    "        float columnNorm = vSpriteSheet.z;",
                    "        float rowNorm = vSpriteSheet.w;",
                    "        vUv.x = gl_PointCoord.x * framesX + columnNorm;",
                    "        vUv.y = 1.0 - (gl_PointCoord.y * framesY + rowNorm);",
                    "    #endif",
                    "",
                    "    vec4 rotatedTexture = texture2D( tex, vUv );",
                ].join("\n"),
            }),
            (o.shaders = {
                vertex: [
                    o.shaderChunks.defines,
                    o.shaderChunks.uniforms,
                    o.shaderChunks.attributes,
                    o.shaderChunks.varyings,
                    THREE.ShaderChunk.common,
                    THREE.ShaderChunk.logdepthbuf_pars_vertex,
                    THREE.ShaderChunk.fog_pars_vertex,
                    o.shaderChunks.branchAvoidanceFunctions,
                    o.shaderChunks.unpackColor,
                    o.shaderChunks.unpackRotationAxis,
                    o.shaderChunks.floatOverLifetime,
                    o.shaderChunks.colorOverLifetime,
                    o.shaderChunks.paramFetchingFunctions,
                    o.shaderChunks.forceFetchingFunctions,
                    o.shaderChunks.rotationFunctions,
                    "void main() {",
                    "    highp float age = getAge();",
                    "    highp float alive = getAlive();",
                    "    highp float maxAge = getMaxAge();",
                    "    highp float positionInTime = (age / maxAge);",
                    "    highp float isAlive = when_gt( alive, 0.0 );",
                    "    #ifdef SHOULD_WIGGLE_PARTICLES",
                    "        float wiggleAmount = positionInTime * getWiggle();",
                    "        float wiggleSin = isAlive * sin( wiggleAmount );",
                    "        float wiggleCos = isAlive * cos( wiggleAmount );",
                    "    #endif",
                    "    vec3 vel = getVelocity( age );",
                    "    vec3 accel = getAcceleration( age );",
                    "    vec3 force = vec3( 0.0 );",
                    "    vec3 pos = vec3( position );",
                    "    float drag = 1.0 - (positionInTime * 0.5) * acceleration.w;",
                    "    force += vel;",
                    "    force *= drag;",
                    "    force += accel * age;",
                    "    pos += force;",
                    "    #ifdef SHOULD_WIGGLE_PARTICLES",
                    "        pos.x += wiggleSin;",
                    "        pos.y += wiggleCos;",
                    "        pos.z += wiggleSin;",
                    "    #endif",
                    "    #ifdef SHOULD_ROTATE_PARTICLES",
                    "        pos = getRotation( pos, positionInTime );",
                    "    #endif",
                    "    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
                    "    highp float pointSize = getFloatOverLifetime( positionInTime, size ) * isAlive;",
                    "    #ifdef HAS_PERSPECTIVE",
                    "        float perspective = scale / length( mvPosition.xyz );",
                    "    #else",
                    "        float perspective = 1.0;",
                    "    #endif",
                    "    float pointSizePerspective = pointSize * perspective;",
                    "    #ifdef COLORIZE",
                    "       vec3 c = isAlive * getColorOverLifetime(",
                    "           positionInTime,",
                    "           unpackColor( color.x ),",
                    "           unpackColor( color.y ),",
                    "           unpackColor( color.z ),",
                    "           unpackColor( color.w )",
                    "       );",
                    "    #else",
                    "       vec3 c = vec3(1.0);",
                    "    #endif",
                    "    float o = isAlive * getFloatOverLifetime( positionInTime, opacity );",
                    "    vColor = vec4( c, o );",
                    "    #ifdef SHOULD_ROTATE_TEXTURE",
                    "        vAngle = isAlive * getFloatOverLifetime( positionInTime, angle );",
                    "    #endif",
                    "    #ifdef SHOULD_CALCULATE_SPRITE",
                    "        float framesX = textureAnimation.x;",
                    "        float framesY = textureAnimation.y;",
                    "        float loopCount = textureAnimation.w;",
                    "        float totalFrames = textureAnimation.z;",
                    "        float frameNumber = mod( (positionInTime * loopCount) * totalFrames, totalFrames );",
                    "        float column = floor(mod( frameNumber, framesX ));",
                    "        float row = floor( (frameNumber - column) / framesX );",
                    "        float columnNorm = column / framesX;",
                    "        float rowNorm = row / framesY;",
                    "        vSpriteSheet.x = 1.0 / framesX;",
                    "        vSpriteSheet.y = 1.0 / framesY;",
                    "        vSpriteSheet.z = columnNorm;",
                    "        vSpriteSheet.w = rowNorm;",
                    "    #endif",
                    "    gl_PointSize = pointSizePerspective;",
                    "    gl_Position = projectionMatrix * mvPosition;",
                    THREE.ShaderChunk.logdepthbuf_vertex,
                    THREE.ShaderChunk.fog_vertex,
                    "}",
                ].join("\n"),
                fragment: [
                    o.shaderChunks.uniforms,
                    THREE.ShaderChunk.common,
                    THREE.ShaderChunk.fog_pars_fragment,
                    THREE.ShaderChunk.logdepthbuf_pars_fragment,
                    o.shaderChunks.varyings,
                    o.shaderChunks.branchAvoidanceFunctions,
                    "void main() {",
                    "    vec3 outgoingLight = vColor.xyz;",
                    "    ",
                    "    #ifdef ALPHATEST",
                    "       if ( vColor.w < float(ALPHATEST) ) discard;",
                    "    #endif",
                    o.shaderChunks.rotateTexture,
                    THREE.ShaderChunk.logdepthbuf_fragment,
                    "    outgoingLight = vColor.xyz * rotatedTexture.xyz;",
                    "    gl_FragColor = vec4( outgoingLight.xyz, rotatedTexture.w * vColor.w );",
                    THREE.ShaderChunk.fog_fragment,
                    "}",
                ].join("\n"),
            }),
            (o.utils = {
                types: { BOOLEAN: "boolean", STRING: "string", NUMBER: "number", OBJECT: "object" },
                ensureTypedArg: function (e, t, r) {
                    "use strict";
                    return typeof e === t ? e : r;
                },
                ensureArrayTypedArg: function (e, t, r) {
                    "use strict";
                    if (Array.isArray(e)) {
                        for (var i = e.length - 1; i >= 0; --i) if (typeof e[i] !== t) return r;
                        return e;
                    }
                    return this.ensureTypedArg(e, t, r);
                },
                ensureInstanceOf: function (e, t, r) {
                    "use strict";
                    return void 0 !== t && e instanceof t ? e : r;
                },
                ensureArrayInstanceOf: function (e, t, r) {
                    "use strict";
                    if (Array.isArray(e)) {
                        for (var i = e.length - 1; i >= 0; --i) if (void 0 !== t && e[i] instanceof t == !1) return r;
                        return e;
                    }
                    return this.ensureInstanceOf(e, t, r);
                },
                ensureValueOverLifetimeCompliance: function (e, t, r) {
                    "use strict";
                    (t = t || 3), (r = r || 3), Array.isArray(e._value) === !1 && (e._value = [e._value]), Array.isArray(e._spread) === !1 && (e._spread = [e._spread]);
                    var i = this.clamp(e._value.length, t, r),
                        a = this.clamp(e._spread.length, t, r),
                        o = Math.max(i, a);
                    e._value.length !== o && (e._value = this.interpolateArray(e._value, o)), e._spread.length !== o && (e._spread = this.interpolateArray(e._spread, o));
                },
                interpolateArray: function (e, t) {
                    "use strict";
                    for (var r = e.length, i = ["function" == typeof e[0].clone ? e[0].clone() : e[0]], a = (r - 1) / (t - 1), o = 1; o < t - 1; ++o) {
                        var s = o * a,
                            n = Math.floor(s),
                            u = Math.ceil(s),
                            l = s - n;
                        i[o] = this.lerpTypeAgnostic(e[n], e[u], l);
                    }
                    return i.push("function" == typeof e[r - 1].clone ? e[r - 1].clone() : e[r - 1]), i;
                },
                clamp: function (e, t, r) {
                    "use strict";
                    return Math.max(t, Math.min(e, r));
                },
                zeroToEpsilon: function (e, t) {
                    "use strict";
                    var r = 1e-5,
                        i = e;
                    return (i = t ? Math.random() * r * 10 : r), e < 0 && e > -r && (i = -i), i;
                },
                lerpTypeAgnostic: function (e, t, r) {
                    "use strict";
                    var i,
                        a = this.types;
                    return typeof e === a.NUMBER && typeof t === a.NUMBER
                        ? e + (t - e) * r
                        : e instanceof THREE.Vector2 && t instanceof THREE.Vector2
                        ? ((i = e.clone()), (i.x = this.lerp(e.x, t.x, r)), (i.y = this.lerp(e.y, t.y, r)), i)
                        : e instanceof THREE.Vector3 && t instanceof THREE.Vector3
                        ? ((i = e.clone()), (i.x = this.lerp(e.x, t.x, r)), (i.y = this.lerp(e.y, t.y, r)), (i.z = this.lerp(e.z, t.z, r)), i)
                        : e instanceof THREE.Vector4 && t instanceof THREE.Vector4
                        ? ((i = e.clone()), (i.x = this.lerp(e.x, t.x, r)), (i.y = this.lerp(e.y, t.y, r)), (i.z = this.lerp(e.z, t.z, r)), (i.w = this.lerp(e.w, t.w, r)), i)
                        : e instanceof THREE.Color && t instanceof THREE.Color
                        ? ((i = e.clone()), (i.r = this.lerp(e.r, t.r, r)), (i.g = this.lerp(e.g, t.g, r)), (i.b = this.lerp(e.b, t.b, r)), i)
                        : void console.warn("Invalid argument types, or argument types do not match:", e, t);
                },
                lerp: function (e, t, r) {
                    "use strict";
                    return e + (t - e) * r;
                },
                roundToNearestMultiple: function (e, t) {
                    "use strict";
                    var r = 0;
                    return 0 === t ? e : ((r = Math.abs(e) % t), 0 === r ? e : e < 0 ? -(Math.abs(e) - r) : e + t - r);
                },
                arrayValuesAreEqual: function (e) {
                    "use strict";
                    for (var t = 0; t < e.length - 1; ++t) if (e[t] !== e[t + 1]) return !1;
                    return !0;
                },
                randomFloat: function (e, t) {
                    "use strict";
                    return e + t * (Math.random() - 0.5);
                },
                randomVector3: function (e, t, r, i, a) {
                    "use strict";
                    var o = r.x + (Math.random() * i.x - 0.5 * i.x),
                        s = r.y + (Math.random() * i.y - 0.5 * i.y),
                        n = r.z + (Math.random() * i.z - 0.5 * i.z);
                    a && ((o = 0.5 * -a.x + this.roundToNearestMultiple(o, a.x)), (s = 0.5 * -a.y + this.roundToNearestMultiple(s, a.y)), (n = 0.5 * -a.z + this.roundToNearestMultiple(n, a.z))), e.typedArray.setVec3Components(t, o, s, n);
                },
                randomColor: function (e, t, r, i) {
                    "use strict";
                    var a = r.r + Math.random() * i.x,
                        o = r.g + Math.random() * i.y,
                        s = r.b + Math.random() * i.z;
                    (a = this.clamp(a, 0, 1)), (o = this.clamp(o, 0, 1)), (s = this.clamp(s, 0, 1)), e.typedArray.setVec3Components(t, a, o, s);
                },
                randomColorAsHex: (function () {
                    "use strict";
                    var e = new THREE.Color();
                    return function (t, r, i, a) {
                        for (var o = i.length, s = [], n = 0; n < o; ++n) {
                            var u = a[n];
                            e.copy(i[n]),
                                (e.r += Math.random() * u.x - 0.5 * u.x),
                                (e.g += Math.random() * u.y - 0.5 * u.y),
                                (e.b += Math.random() * u.z - 0.5 * u.z),
                                (e.r = this.clamp(e.r, 0, 1)),
                                (e.g = this.clamp(e.g, 0, 1)),
                                (e.b = this.clamp(e.b, 0, 1)),
                                s.push(e.getHex());
                        }
                        t.typedArray.setVec4Components(r, s[0], s[1], s[2], s[3]);
                    };
                })(),
                randomVector3OnLine: function (e, t, r, i) {
                    "use strict";
                    var a = r.clone();
                    a.lerp(i, Math.random()), e.typedArray.setVec3Components(t, a.x, a.y, a.z);
                },
                randomVector3OnSphere: function (e, t, r, i, a, o, s, n) {
                    "use strict";
                    var u = 2 * Math.random() - 1,
                        l = 6.2832 * Math.random(),
                        p = Math.sqrt(1 - u * u),
                        c = this.randomFloat(i, a),
                        d = 0,
                        h = 0,
                        y = 0;
                    s && (c = Math.round(c / s) * s), (d = p * Math.cos(l) * c), (h = p * Math.sin(l) * c), (y = u * c), (d *= o.x), (h *= o.y), (y *= o.z), (d += r.x), (h += r.y), (y += r.z), e.typedArray.setVec3Components(t, d, h, y);
                },
                seededRandom: function (e) {
                    var t = 1e4 * Math.sin(e);
                    return t - (0 | t);
                },
                randomVector3OnDisc: function (e, t, r, i, a, o, s) {
                    "use strict";
                    var n = 6.2832 * Math.random(),
                        u = Math.abs(this.randomFloat(i, a)),
                        l = 0,
                        p = 0,
                        c = 0;
                    s && (u = Math.round(u / s) * s), (l = Math.cos(n) * u), (p = Math.sin(n) * u), (l *= o.x), (p *= o.y), (l += r.x), (p += r.y), (c += r.z), e.typedArray.setVec3Components(t, l, p, c);
                },
                randomDirectionVector3OnSphere: (function () {
                    "use strict";
                    var e = new THREE.Vector3();
                    return function (t, r, i, a, o, s, n, u) {
                        e.copy(s), (e.x -= i), (e.y -= a), (e.z -= o), e.normalize().multiplyScalar(-this.randomFloat(n, u)), t.typedArray.setVec3Components(r, e.x, e.y, e.z);
                    };
                })(),
                randomDirectionVector3OnDisc: (function () {
                    "use strict";
                    var e = new THREE.Vector3();
                    return function (t, r, i, a, o, s, n, u) {
                        e.copy(s), (e.x -= i), (e.y -= a), (e.z -= o), e.normalize().multiplyScalar(-this.randomFloat(n, u)), t.typedArray.setVec3Components(r, e.x, e.y, 0);
                    };
                })(),
                getPackedRotationAxis: (function () {
                    "use strict";
                    var e = new THREE.Vector3(),
                        t = new THREE.Vector3(),
                        r = new THREE.Color(),
                        i = new THREE.Vector3(1, 1, 1);
                    return function (a, o) {
                        return (
                            e.copy(a).normalize(),
                            t.copy(o).normalize(),
                            (e.x += 0.5 * -o.x + Math.random() * o.x),
                            (e.y += 0.5 * -o.y + Math.random() * o.y),
                            (e.z += 0.5 * -o.z + Math.random() * o.z),
                            e.normalize().add(i).multiplyScalar(0.5),
                            r.setRGB(e.x, e.y, e.z),
                            r.getHex()
                        );
                    };
                })(),
            }),
            (o.Group = function (e) {
                "use strict";
                var t = o.utils,
                    r = t.types;
                (e = t.ensureTypedArg(e, r.OBJECT, {})),
                    (e.texture = t.ensureTypedArg(e.texture, r.OBJECT, {})),
                    (this.uuid = THREE.MathUtils.generateUUID()),
                    (this.fixedTimeStep = t.ensureTypedArg(e.fixedTimeStep, r.NUMBER, 0.016)),
                    (this.texture = t.ensureInstanceOf(e.texture.value, THREE.Texture, null)),
                    (this.textureFrames = t.ensureInstanceOf(e.texture.frames, THREE.Vector2, new THREE.Vector2(1, 1))),
                    (this.textureFrameCount = t.ensureTypedArg(e.texture.frameCount, r.NUMBER, this.textureFrames.x * this.textureFrames.y)),
                    (this.textureLoop = t.ensureTypedArg(e.texture.loop, r.NUMBER, 1)),
                    this.textureFrames.max(new THREE.Vector2(1, 1)),
                    (this.hasPerspective = t.ensureTypedArg(e.hasPerspective, r.BOOLEAN, !0)),
                    (this.colorize = t.ensureTypedArg(e.colorize, r.BOOLEAN, !0)),
                    (this.maxParticleCount = t.ensureTypedArg(e.maxParticleCount, r.NUMBER, null)),
                    (this.blending = t.ensureTypedArg(e.blending, r.NUMBER, THREE.AdditiveBlending)),
                    (this.transparent = t.ensureTypedArg(e.transparent, r.BOOLEAN, !0)),
                    (this.alphaTest = parseFloat(t.ensureTypedArg(e.alphaTest, r.NUMBER, 0))),
                    (this.depthWrite = t.ensureTypedArg(e.depthWrite, r.BOOLEAN, !1)),
                    (this.depthTest = t.ensureTypedArg(e.depthTest, r.BOOLEAN, !0)),
                    (this.fog = t.ensureTypedArg(e.fog, r.BOOLEAN, !0)),
                    (this.scale = t.ensureTypedArg(e.scale, r.NUMBER, 300)),
                    (this.emitters = []),
                    (this.emitterIDs = []),
                    (this._pool = []),
                    (this._poolCreationSettings = null),
                    (this._createNewWhenPoolEmpty = 0),
                    (this._attributesNeedRefresh = !1),
                    (this._attributesNeedDynamicReset = !1),
                    (this.particleCount = 0),
                    (this.uniforms = {
                        tex: { type: "t", value: this.texture },
                        textureAnimation: { type: "v4", value: new THREE.Vector4(this.textureFrames.x, this.textureFrames.y, this.textureFrameCount, Math.max(Math.abs(this.textureLoop), 1)) },
                        fogColor: { type: "c", value: this.fog ? new THREE.Color() : null },
                        fogNear: { type: "f", value: 10 },
                        fogFar: { type: "f", value: 200 },
                        fogDensity: { type: "f", value: 0.5 },
                        deltaTime: { type: "f", value: 0 },
                        runTime: { type: "f", value: 0 },
                        scale: { type: "f", value: this.scale },
                    }),
                    (this.defines = {
                        HAS_PERSPECTIVE: this.hasPerspective,
                        COLORIZE: this.colorize,
                        VALUE_OVER_LIFETIME_LENGTH: o.valueOverLifetimeLength,
                        SHOULD_ROTATE_TEXTURE: !1,
                        SHOULD_ROTATE_PARTICLES: !1,
                        SHOULD_WIGGLE_PARTICLES: !1,
                        SHOULD_CALCULATE_SPRITE: this.textureFrames.x > 1 || this.textureFrames.y > 1,
                    }),
                    (this.attributes = {
                        position: new o.ShaderAttribute("v3", !0),
                        acceleration: new o.ShaderAttribute("v4", !0),
                        velocity: new o.ShaderAttribute("v3", !0),
                        rotation: new o.ShaderAttribute("v4", !0),
                        rotationCenter: new o.ShaderAttribute("v3", !0),
                        params: new o.ShaderAttribute("v4", !0),
                        size: new o.ShaderAttribute("v4", !0),
                        angle: new o.ShaderAttribute("v4", !0),
                        color: new o.ShaderAttribute("v4", !0),
                        opacity: new o.ShaderAttribute("v4", !0),
                    }),
                    (this.attributeKeys = Object.keys(this.attributes)),
                    (this.attributeCount = this.attributeKeys.length),
                    (this.material = new THREE.ShaderMaterial({
                        uniforms: this.uniforms,
                        vertexShader: o.shaders.vertex,
                        fragmentShader: o.shaders.fragment,
                        blending: this.blending,
                        transparent: this.transparent,
                        alphaTest: this.alphaTest,
                        depthWrite: false,
                        depthTest: false,
                        defines: this.defines,
                        fog: this.fog,
                    })),
                    (this.geometry = new THREE.BufferGeometry()),
                    (this.mesh = new THREE.Points(this.geometry, this.material)),
                    null === this.maxParticleCount && console.warn("SPE.Group: No maxParticleCount specified. Adding emitters after rendering will probably cause errors.");
            }),
            (o.Group.constructor = o.Group),
            (o.Group.prototype._updateDefines = function () {
                "use strict";
                var e,
                    t = this.emitters,
                    r = t.length - 1,
                    i = this.defines;
                for (r; r >= 0; --r)
                    (e = t[r]),
                        i.SHOULD_CALCULATE_SPRITE || (i.SHOULD_ROTATE_TEXTURE = i.SHOULD_ROTATE_TEXTURE || !!Math.max(Math.max.apply(null, e.angle.value), Math.max.apply(null, e.angle.spread))),
                        (i.SHOULD_ROTATE_PARTICLES = i.SHOULD_ROTATE_PARTICLES || !!Math.max(e.rotation.angle, e.rotation.angleSpread)),
                        (i.SHOULD_WIGGLE_PARTICLES = i.SHOULD_WIGGLE_PARTICLES || !!Math.max(e.wiggle.value, e.wiggle.spread));
                this.material.needsUpdate = !0;
            }),
            (o.Group.prototype._applyAttributesToGeometry = function () {
                "use strict";
                var e,
                    t,
                    r = this.attributes,
                    i = this.geometry,
                    a = i.attributes;
                for (var o in r) r.hasOwnProperty(o) && ((e = r[o]), (t = a[o]), t ? (t.array = e.typedArray.array) : i.setAttribute(o, e.bufferAttribute), (e.bufferAttribute.needsUpdate = !0));
                this.geometry.setDrawRange(0, this.particleCount);
            }),
            (o.Group.prototype.addEmitter = function (e) {
                "use strict";
                if (e instanceof o.Emitter == !1) return void console.error("`emitter` argument must be instance of SPE.Emitter. Was provided with:", e);
                if (this.emitterIDs.indexOf(e.uuid) > -1) return void console.error("Emitter already exists in this group. Will not add again.");
                if (null !== e.group) return void console.error("Emitter already belongs to another group. Will not add to requested group.");
                var t = this.attributes,
                    r = this.particleCount,
                    i = r + e.particleCount;
                (this.particleCount = i),
                    null !== this.maxParticleCount && this.particleCount > this.maxParticleCount && console.warn("SPE.Group: maxParticleCount exceeded. Requesting", this.particleCount, "particles, can support only", this.maxParticleCount),
                    e._calculatePPSValue(e.maxAge._value + e.maxAge._spread),
                    e._setBufferUpdateRanges(this.attributeKeys),
                    e._setAttributeOffset(r),
                    (e.group = this),
                    (e.attributes = this.attributes);
                for (var a in t) t.hasOwnProperty(a) && t[a]._createBufferAttribute(null !== this.maxParticleCount ? this.maxParticleCount : this.particleCount);
                for (var s = r; s < i; ++s)
                    e._assignPositionValue(s),
                        e._assignForceValue(s, "velocity"),
                        e._assignForceValue(s, "acceleration"),
                        e._assignAbsLifetimeValue(s, "opacity"),
                        e._assignAbsLifetimeValue(s, "size"),
                        e._assignAngleValue(s),
                        e._assignRotationValue(s),
                        e._assignParamsValue(s),
                        e._assignColorValue(s);
                return (
                    this._applyAttributesToGeometry(), this.emitters.push(e), this.emitterIDs.push(e.uuid), this._updateDefines(e), (this.material.needsUpdate = !0), (this.geometry.needsUpdate = !0), (this._attributesNeedRefresh = !0), this
                );
            }),
            (o.Group.prototype.removeEmitter = function (e) {
                "use strict";
                var t = this.emitterIDs.indexOf(e.uuid);
                if (e instanceof o.Emitter == !1) return void console.error("`emitter` argument must be instance of SPE.Emitter. Was provided with:", e);
                if (t === -1) return void console.error("Emitter does not exist in this group. Will not remove.");
                for (var r = e.attributeOffset, i = r + e.particleCount, a = this.attributes.params.typedArray, s = r; s < i; ++s) (a.array[4 * s] = 0), (a.array[4 * s + 1] = 0);
                this.emitters.splice(t, 1), this.emitterIDs.splice(t, 1);
                for (var n in this.attributes) this.attributes.hasOwnProperty(n) && this.attributes[n].splice(r, i);
                (this.particleCount -= e.particleCount), e._onRemove(), (this._attributesNeedRefresh = !0);
            }),
            (o.Group.prototype.getFromPool = function () {
                "use strict";
                var e = this._pool,
                    t = this._createNewWhenPoolEmpty;
                if (e.length) return e.pop();
                if (t) {
                    var r = new o.Emitter(this._poolCreationSettings);
                    return this.addEmitter(r), r;
                }
                return null;
            }),
            (o.Group.prototype.releaseIntoPool = function (e) {
                "use strict";
                return e instanceof o.Emitter == !1 ? void console.error("Argument is not instanceof SPE.Emitter:", e) : (e.reset(), this._pool.unshift(e), this);
            }),
            (o.Group.prototype.getPool = function () {
                "use strict";
                return this._pool;
            }),
            (o.Group.prototype.addPool = function (e, t, r) {
                "use strict";
                var i;
                (this._poolCreationSettings = t), (this._createNewWhenPoolEmpty = !!r);
                for (var a = 0; a < e; ++a) (i = Array.isArray(t) ? new o.Emitter(t[a]) : new o.Emitter(t)), this.addEmitter(i), this.releaseIntoPool(i);
                return this;
            }),
            (o.Group.prototype._triggerSingleEmitter = function (e) {
                "use strict";
                var t = this.getFromPool(),
                    r = this;
                return null === t
                    ? void console.log("SPE.Group pool ran out.")
                    : (e instanceof THREE.Vector3 && (t.position.value.copy(e), (t.position.value = t.position.value)),
                      t.enable(),
                      setTimeout(function () {
                          t.disable(), r.releaseIntoPool(t);
                      }, 1e3 * Math.max(t.duration, t.maxAge.value + t.maxAge.spread)),
                      this);
            }),
            (o.Group.prototype.triggerPoolEmitter = function (e, t) {
                "use strict";
                if ("number" == typeof e && e > 1) for (var r = 0; r < e; ++r) this._triggerSingleEmitter(t);
                else this._triggerSingleEmitter(t);
                return this;
            }),
            (o.Group.prototype._updateUniforms = function (e) {
                "use strict";
                (this.uniforms.runTime.value += e), (this.uniforms.deltaTime.value = e);
            }),
            (o.Group.prototype._resetBufferRanges = function () {
                "use strict";
                var e = this.attributeKeys,
                    t = this.attributeCount - 1,
                    r = this.attributes;
                for (t; t >= 0; --t) r[e[t]].resetUpdateRange();
            }),
            (o.Group.prototype._updateBuffers = function (e) {
                "use strict";
                var t,
                    r,
                    i,
                    a = this.attributeKeys,
                    o = this.attributeCount - 1,
                    s = this.attributes,
                    n = e.bufferUpdateRanges;
                for (o; o >= 0; --o) (t = a[o]), (r = n[t]), (i = s[t]), i.setUpdateRange(r.min, r.max), i.flagUpdate();
            }),
            (o.Group.prototype.tick = function (e) {
                "use strict";
                var t,
                    r = this.emitters,
                    i = r.length,
                    a = e || this.fixedTimeStep,
                    o = this.attributeKeys,
                    s = this.attributes;
                if ((this._updateUniforms(a), this._resetBufferRanges(), 0 !== i || this._attributesNeedRefresh !== !1 || this._attributesNeedDynamicReset !== !1)) {
                    for (var n, t = 0; t < i; ++t) (n = r[t]), n.tick(a), this._updateBuffers(n);
                    if (this._attributesNeedDynamicReset === !0) {
                        for (t = this.attributeCount - 1; t >= 0; --t) s[o[t]].resetDynamic();
                        this._attributesNeedDynamicReset = !1;
                    }
                    if (this._attributesNeedRefresh === !0) {
                        for (t = this.attributeCount - 1; t >= 0; --t) s[o[t]].forceUpdateAll();
                        (this._attributesNeedRefresh = !1), (this._attributesNeedDynamicReset = !0);
                    }
                }
            }),
            (o.Group.prototype.dispose = function () {
                "use strict";
                return this.geometry.dispose(), this.material.dispose(), this;
            }),
            (o.Emitter = function (e) {
                "use strict";
                var t = o.utils,
                    r = t.types,
                    i = o.valueOverLifetimeLength;
                (e = t.ensureTypedArg(e, r.OBJECT, {})),
                    (e.position = t.ensureTypedArg(e.position, r.OBJECT, {})),
                    (e.velocity = t.ensureTypedArg(e.velocity, r.OBJECT, {})),
                    (e.acceleration = t.ensureTypedArg(e.acceleration, r.OBJECT, {})),
                    (e.radius = t.ensureTypedArg(e.radius, r.OBJECT, {})),
                    (e.drag = t.ensureTypedArg(e.drag, r.OBJECT, {})),
                    (e.rotation = t.ensureTypedArg(e.rotation, r.OBJECT, {})),
                    (e.color = t.ensureTypedArg(e.color, r.OBJECT, {})),
                    (e.opacity = t.ensureTypedArg(e.opacity, r.OBJECT, {})),
                    (e.size = t.ensureTypedArg(e.size, r.OBJECT, {})),
                    (e.angle = t.ensureTypedArg(e.angle, r.OBJECT, {})),
                    (e.wiggle = t.ensureTypedArg(e.wiggle, r.OBJECT, {})),
                    (e.maxAge = t.ensureTypedArg(e.maxAge, r.OBJECT, {})),
                    e.onParticleSpawn && console.warn("onParticleSpawn has been removed. Please set properties directly to alter values at runtime."),
                    (this.uuid = THREE.MathUtils.generateUUID()),
                    (this.type = t.ensureTypedArg(e.type, r.NUMBER, o.distributions.BOX)),
                    (this.position = {
                        _value: t.ensureInstanceOf(e.position.value, THREE.Vector3, new THREE.Vector3()),
                        _spread: t.ensureInstanceOf(e.position.spread, THREE.Vector3, new THREE.Vector3()),
                        _spreadClamp: t.ensureInstanceOf(e.position.spreadClamp, THREE.Vector3, new THREE.Vector3()),
                        _distribution: t.ensureTypedArg(e.position.distribution, r.NUMBER, this.type),
                        _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1),
                        _radius: t.ensureTypedArg(e.position.radius, r.NUMBER, 10),
                        _radiusScale: t.ensureInstanceOf(e.position.radiusScale, THREE.Vector3, new THREE.Vector3(1, 1, 1)),
                        _distributionClamp: t.ensureTypedArg(e.position.distributionClamp, r.NUMBER, 0),
                    }),
                    (this.velocity = {
                        _value: t.ensureInstanceOf(e.velocity.value, THREE.Vector3, new THREE.Vector3()),
                        _spread: t.ensureInstanceOf(e.velocity.spread, THREE.Vector3, new THREE.Vector3()),
                        _distribution: t.ensureTypedArg(e.velocity.distribution, r.NUMBER, this.type),
                        _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1),
                    }),
                    (this.acceleration = {
                        _value: t.ensureInstanceOf(e.acceleration.value, THREE.Vector3, new THREE.Vector3()),
                        _spread: t.ensureInstanceOf(e.acceleration.spread, THREE.Vector3, new THREE.Vector3()),
                        _distribution: t.ensureTypedArg(e.acceleration.distribution, r.NUMBER, this.type),
                        _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1),
                    }),
                    (this.drag = { _value: t.ensureTypedArg(e.drag.value, r.NUMBER, 0), _spread: t.ensureTypedArg(e.drag.spread, r.NUMBER, 0), _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1) }),
                    (this.wiggle = { _value: t.ensureTypedArg(e.wiggle.value, r.NUMBER, 0), _spread: t.ensureTypedArg(e.wiggle.spread, r.NUMBER, 0) }),
                    (this.rotation = {
                        _axis: t.ensureInstanceOf(e.rotation.axis, THREE.Vector3, new THREE.Vector3(0, 1, 0)),
                        _axisSpread: t.ensureInstanceOf(e.rotation.axisSpread, THREE.Vector3, new THREE.Vector3()),
                        _angle: t.ensureTypedArg(e.rotation.angle, r.NUMBER, 0),
                        _angleSpread: t.ensureTypedArg(e.rotation.angleSpread, r.NUMBER, 0),
                        _static: t.ensureTypedArg(e.rotation.static, r.BOOLEAN, !1),
                        _center: t.ensureInstanceOf(e.rotation.center, THREE.Vector3, this.position._value.clone()),
                        _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1),
                    }),
                    (this.maxAge = { _value: t.ensureTypedArg(e.maxAge.value, r.NUMBER, 2), _spread: t.ensureTypedArg(e.maxAge.spread, r.NUMBER, 0) }),
                    (this.color = {
                        _value: t.ensureArrayInstanceOf(e.color.value, THREE.Color, new THREE.Color()),
                        _spread: t.ensureArrayInstanceOf(e.color.spread, THREE.Vector3, new THREE.Vector3()),
                        _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1),
                    }),
                    (this.opacity = { _value: t.ensureArrayTypedArg(e.opacity.value, r.NUMBER, 1), _spread: t.ensureArrayTypedArg(e.opacity.spread, r.NUMBER, 0), _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1) }),
                    (this.size = { _value: t.ensureArrayTypedArg(e.size.value, r.NUMBER, 1), _spread: t.ensureArrayTypedArg(e.size.spread, r.NUMBER, 0), _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1) }),
                    (this.angle = { _value: t.ensureArrayTypedArg(e.angle.value, r.NUMBER, 0), _spread: t.ensureArrayTypedArg(e.angle.spread, r.NUMBER, 0), _randomise: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1) }),
                    (this.particleCount = t.ensureTypedArg(e.particleCount, r.NUMBER, 100)),
                    (this.duration = t.ensureTypedArg(e.duration, r.NUMBER, null)),
                    (this.isStatic = t.ensureTypedArg(e.isStatic, r.BOOLEAN, !1)),
                    (this.activeMultiplier = t.ensureTypedArg(e.activeMultiplier, r.NUMBER, 1)),
                    (this.direction = t.ensureTypedArg(e.direction, r.NUMBER, 1)),
                    (this.alive = t.ensureTypedArg(e.alive, r.BOOLEAN, !0)),
                    (this.particlesPerSecond = 0),
                    (this.activationIndex = 0),
                    (this.attributeOffset = 0),
                    (this.attributeEnd = 0),
                    (this.age = 0),
                    (this.activeParticleCount = 0),
                    (this.group = null),
                    (this.attributes = null),
                    (this.paramsArray = null),
                    (this.resetFlags = {
                        position: t.ensureTypedArg(e.position.randomise, r.BOOLEAN, !1) || t.ensureTypedArg(e.radius.randomise, r.BOOLEAN, !1),
                        velocity: t.ensureTypedArg(e.velocity.randomise, r.BOOLEAN, !1),
                        acceleration: t.ensureTypedArg(e.acceleration.randomise, r.BOOLEAN, !1) || t.ensureTypedArg(e.drag.randomise, r.BOOLEAN, !1),
                        rotation: t.ensureTypedArg(e.rotation.randomise, r.BOOLEAN, !1),
                        rotationCenter: t.ensureTypedArg(e.rotation.randomise, r.BOOLEAN, !1),
                        size: t.ensureTypedArg(e.size.randomise, r.BOOLEAN, !1),
                        color: t.ensureTypedArg(e.color.randomise, r.BOOLEAN, !1),
                        opacity: t.ensureTypedArg(e.opacity.randomise, r.BOOLEAN, !1),
                        angle: t.ensureTypedArg(e.angle.randomise, r.BOOLEAN, !1),
                    }),
                    (this.updateFlags = {}),
                    (this.updateCounts = {}),
                    (this.updateMap = {
                        maxAge: "params",
                        position: "position",
                        velocity: "velocity",
                        acceleration: "acceleration",
                        drag: "acceleration",
                        wiggle: "params",
                        rotation: "rotation",
                        size: "size",
                        color: "color",
                        opacity: "opacity",
                        angle: "angle",
                    });
                for (var a in this.updateMap) this.updateMap.hasOwnProperty(a) && ((this.updateCounts[this.updateMap[a]] = 0), (this.updateFlags[this.updateMap[a]] = !1), this._createGetterSetters(this[a], a));
                (this.bufferUpdateRanges = {}),
                    (this.attributeKeys = null),
                    (this.attributeCount = 0),
                    t.ensureValueOverLifetimeCompliance(this.color, i, i),
                    t.ensureValueOverLifetimeCompliance(this.opacity, i, i),
                    t.ensureValueOverLifetimeCompliance(this.size, i, i),
                    t.ensureValueOverLifetimeCompliance(this.angle, i, i);
            }),
            (o.Emitter.constructor = o.Emitter),
            (o.Emitter.prototype._createGetterSetters = function (e, t) {
                "use strict";
                var r = this;
                for (var i in e)
                    if (e.hasOwnProperty(i)) {
                        var a = i.replace("_", "");
                        Object.defineProperty(e, a, {
                            get: (function (e) {
                                return function () {
                                    return this[e];
                                };
                            })(i),
                            set: (function (e) {
                                return function (i) {
                                    var a = r.updateMap[t],
                                        s = this[e],
                                        n = o.valueOverLifetimeLength;
                                    "_rotationCenter" === e ? ((r.updateFlags.rotationCenter = !0), (r.updateCounts.rotationCenter = 0)) : "_randomise" === e ? (r.resetFlags[a] = i) : ((r.updateFlags[a] = !0), (r.updateCounts[a] = 0)),
                                        r.group._updateDefines(),
                                        (this[e] = i),
                                        Array.isArray(s) && o.utils.ensureValueOverLifetimeCompliance(r[t], n, n);
                                };
                            })(i),
                        });
                    }
            }),
            (o.Emitter.prototype._setBufferUpdateRanges = function (e) {
                "use strict";
                (this.attributeKeys = e), (this.attributeCount = e.length);
                for (var t = this.attributeCount - 1; t >= 0; --t) this.bufferUpdateRanges[e[t]] = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
            }),
            (o.Emitter.prototype._calculatePPSValue = function (e) {
                "use strict";
                var t = this.particleCount;
                this.duration ? (this.particlesPerSecond = t / (e < this.duration ? e : this.duration)) : (this.particlesPerSecond = t / e);
            }),
            (o.Emitter.prototype._setAttributeOffset = function (e) {
                (this.attributeOffset = e), (this.activationIndex = e), (this.activationEnd = e + this.particleCount);
            }),
            (o.Emitter.prototype._assignValue = function (e, t) {
                "use strict";
                switch (e) {
                    case "position":
                        this._assignPositionValue(t);
                        break;
                    case "velocity":
                    case "acceleration":
                        this._assignForceValue(t, e);
                        break;
                    case "size":
                    case "opacity":
                        this._assignAbsLifetimeValue(t, e);
                        break;
                    case "angle":
                        this._assignAngleValue(t);
                        break;
                    case "params":
                        this._assignParamsValue(t);
                        break;
                    case "rotation":
                        this._assignRotationValue(t);
                        break;
                    case "color":
                        this._assignColorValue(t);
                }
            }),
            (o.Emitter.prototype._assignPositionValue = function (e) {
                "use strict";
                var t = o.distributions,
                    r = o.utils,
                    i = this.position,
                    a = this.attributes.position,
                    s = i._value,
                    n = i._spread,
                    u = i._distribution;
                switch (u) {
                    case t.BOX:
                        r.randomVector3(a, e, s, n, i._spreadClamp);
                        break;
                    case t.SPHERE:
                        r.randomVector3OnSphere(a, e, s, i._radius, i._spread.x, i._radiusScale, i._spreadClamp.x, i._distributionClamp || this.particleCount);
                        break;
                    case t.DISC:
                        r.randomVector3OnDisc(a, e, s, i._radius, i._spread.x, i._radiusScale, i._spreadClamp.x);
                        break;
                    case t.LINE:
                        r.randomVector3OnLine(a, e, s, n);
                }
            }),
            (o.Emitter.prototype._assignForceValue = function (e, t) {
                "use strict";
                var r,
                    i,
                    a,
                    s,
                    n,
                    u = o.distributions,
                    l = o.utils,
                    p = this[t],
                    c = p._value,
                    d = p._spread,
                    h = p._distribution;
                switch (h) {
                    case u.BOX:
                        l.randomVector3(this.attributes[t], e, c, d);
                        break;
                    case u.SPHERE:
                        (r = this.attributes.position.typedArray.array),
                            (n = 3 * e),
                            (i = r[n]),
                            (a = r[n + 1]),
                            (s = r[n + 2]),
                            l.randomDirectionVector3OnSphere(this.attributes[t], e, i, a, s, this.position._value, p._value.x, p._spread.x);
                        break;
                    case u.DISC:
                        (r = this.attributes.position.typedArray.array), (n = 3 * e), (i = r[n]), (a = r[n + 1]), (s = r[n + 2]), l.randomDirectionVector3OnDisc(this.attributes[t], e, i, a, s, this.position._value, p._value.x, p._spread.x);
                        break;
                    case u.LINE:
                        l.randomVector3OnLine(this.attributes[t], e, c, d);
                }
                if ("acceleration" === t) {
                    var y = l.clamp(l.randomFloat(this.drag._value, this.drag._spread), 0, 1);
                    this.attributes.acceleration.typedArray.array[4 * e + 3] = y;
                }
            }),
            (o.Emitter.prototype._assignAbsLifetimeValue = function (e, t) {
                "use strict";
                var r,
                    i = this.attributes[t].typedArray,
                    a = this[t],
                    s = o.utils;
                s.arrayValuesAreEqual(a._value) && s.arrayValuesAreEqual(a._spread)
                    ? ((r = Math.abs(s.randomFloat(a._value[0], a._spread[0]))), i.setVec4Components(e, r, r, r, r))
                    : i.setVec4Components(
                          e,
                          Math.abs(s.randomFloat(a._value[0], a._spread[0])),
                          Math.abs(s.randomFloat(a._value[1], a._spread[1])),
                          Math.abs(s.randomFloat(a._value[2], a._spread[2])),
                          Math.abs(s.randomFloat(a._value[3], a._spread[3]))
                      );
            }),
            (o.Emitter.prototype._assignAngleValue = function (e) {
                "use strict";
                var t,
                    r = this.attributes.angle.typedArray,
                    i = this.angle,
                    a = o.utils;
                a.arrayValuesAreEqual(i._value) && a.arrayValuesAreEqual(i._spread)
                    ? ((t = a.randomFloat(i._value[0], i._spread[0])), r.setVec4Components(e, t, t, t, t))
                    : r.setVec4Components(e, a.randomFloat(i._value[0], i._spread[0]), a.randomFloat(i._value[1], i._spread[1]), a.randomFloat(i._value[2], i._spread[2]), a.randomFloat(i._value[3], i._spread[3]));
            }),
            (o.Emitter.prototype._assignParamsValue = function (e) {
                "use strict";
                this.attributes.params.typedArray.setVec4Components(e, this.isStatic ? 1 : 0, 0, Math.abs(o.utils.randomFloat(this.maxAge._value, this.maxAge._spread)), o.utils.randomFloat(this.wiggle._value, this.wiggle._spread));
            }),
            (o.Emitter.prototype._assignRotationValue = function (e) {
                "use strict";
                this.attributes.rotation.typedArray.setVec3Components(
                    e,
                    o.utils.getPackedRotationAxis(this.rotation._axis, this.rotation._axisSpread),
                    o.utils.randomFloat(this.rotation._angle, this.rotation._angleSpread),
                    this.rotation._static ? 0 : 1
                ),
                    this.attributes.rotationCenter.typedArray.setVec3(e, this.rotation._center);
            }),
            (o.Emitter.prototype._assignColorValue = function (e) {
                "use strict";
                o.utils.randomColorAsHex(this.attributes.color, e, this.color._value, this.color._spread);
            }),
            (o.Emitter.prototype._resetParticle = function (e) {
                "use strict";
                for (var t, r, i = this.resetFlags, a = this.updateFlags, o = this.updateCounts, s = this.attributeKeys, n = this.attributeCount - 1; n >= 0; --n)
                    (t = s[n]), (r = a[t]), (i[t] !== !0 && r !== !0) || (this._assignValue(t, e), this._updateAttributeUpdateRange(t, e), r === !0 && o[t] === this.particleCount ? ((a[t] = !1), (o[t] = 0)) : 1 == r && ++o[t]);
            }),
            (o.Emitter.prototype._updateAttributeUpdateRange = function (e, t) {
                "use strict";
                var r = this.bufferUpdateRanges[e];
                (r.min = Math.min(t, r.min)), (r.max = Math.max(t, r.max));
            }),
            (o.Emitter.prototype._resetBufferRanges = function () {
                "use strict";
                var e,
                    t = this.bufferUpdateRanges,
                    r = this.bufferUpdateKeys,
                    i = this.bufferUpdateCount - 1;
                for (i; i >= 0; --i) (e = r[i]), (t[e].min = Number.POSITIVE_INFINITY), (t[e].max = Number.NEGATIVE_INFINITY);
            }),
            (o.Emitter.prototype._onRemove = function () {
                "use strict";
                (this.particlesPerSecond = 0), (this.attributeOffset = 0), (this.activationIndex = 0), (this.activeParticleCount = 0), (this.group = null), (this.attributes = null), (this.paramsArray = null), (this.age = 0);
            }),
            (o.Emitter.prototype._decrementParticleCount = function () {
                "use strict";
                --this.activeParticleCount;
            }),
            (o.Emitter.prototype._incrementParticleCount = function () {
                "use strict";
                ++this.activeParticleCount;
            }),
            (o.Emitter.prototype._checkParticleAges = function (e, t, r, i) {
                "use strict";
                for (var a, o, s, n, u = t - 1; u >= e; --u)
                    (a = 4 * u),
                        (n = r[a]),
                        0 !== n &&
                            ((s = r[a + 1]),
                            (o = r[a + 2]),
                            1 === this.direction ? ((s += i), s >= o && ((s = 0), (n = 0), this._decrementParticleCount())) : ((s -= i), s <= 0 && ((s = o), (n = 0), this._decrementParticleCount())),
                            (r[a] = n),
                            (r[a + 1] = s),
                            this._updateAttributeUpdateRange("params", u));
            }),
            (o.Emitter.prototype._activateParticles = function (e, t, r, i) {
                "use strict";
                for (var a, o, s = this.direction, n = e; n < t; ++n)
                    (a = 4 * n),
                        (0 != r[a] && 1 !== this.particleCount) ||
                            (this._incrementParticleCount(), (r[a] = 1), this._resetParticle(n), (o = i * (n - e)), (r[a + 1] = s === -1 ? r[a + 2] - o : o), this._updateAttributeUpdateRange("params", n));
            }),
            (o.Emitter.prototype.tick = function (e) {
                "use strict";
                if (!this.isStatic) {
                    null === this.paramsArray && (this.paramsArray = this.attributes.params.typedArray.array);
                    var t = this.attributeOffset,
                        r = t + this.particleCount,
                        i = this.paramsArray,
                        a = this.particlesPerSecond * this.activeMultiplier * e,
                        o = this.activationIndex;
                    if ((this._resetBufferRanges(), this._checkParticleAges(t, r, i, e), this.alive === !1)) return void (this.age = 0);
                    if (null !== this.duration && this.age > this.duration) return (this.alive = !1), void (this.age = 0);
                    var s = 1 === this.particleCount ? o : 0 | o,
                        n = Math.min(s + a, this.activationEnd),
                        u = (n - this.activationIndex) | 0,
                        l = u > 0 ? e / u : 0;
                    this._activateParticles(s, n, i, l), (this.activationIndex += a), this.activationIndex > r && (this.activationIndex = t), (this.age += e);
                }
            }),
            (o.Emitter.prototype.reset = function (e) {
                "use strict";
                if (((this.age = 0), (this.alive = !1), e === !0)) {
                    for (var t, r = this.attributeOffset, i = r + this.particleCount, a = this.paramsArray, o = this.attributes.params.bufferAttribute, s = i - 1; s >= r; --s) (t = 4 * s), (a[t] = 0), (a[t + 1] = 0);
                    (o.updateRange.offset = 0), (o.updateRange.count = -1), (o.needsUpdate = !0);
                }
                return this;
            }),
            (o.Emitter.prototype.enable = function () {
                "use strict";
                return (this.alive = !0), this;
            }),
            (o.Emitter.prototype.disable = function () {
                "use strict";
                return (this.alive = !1), this;
            }),
            (o.Emitter.prototype.remove = function () {
                "use strict";
                return null !== this.group ? this.group.removeEmitter(this) : console.error("Emitter does not belong to a group, cannot remove."), this;
            });
    },
]);
