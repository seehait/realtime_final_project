// Constructor
var Light = function() {
	this.fogDensity = 0.45;
	this.lightPos = new THREE.Vector3( 0, 100, 200 );
	this.lightCol = new THREE.Vector3( 1, 0.5, 1 );
};

// Uniforms
Light.prototype.getUniforms = function() {
	return (
	{
		fogDensity: { type: "f", value: this.fogDensity },
		lightPos: { type: "v3", value: this.lightPos },
		lightCol: { type: "v3", value: this.lightCol }
	}
	);
};

// Getter
Light.prototype.getR = function() {
	return this.lightCol.x;
};
Light.prototype.getG = function() {
	return this.lightCol.y;
};
Light.prototype.getB = function() {
	return this.lightCol.z;
};

// Setter
Light.prototype.setColor = function(r, g, b ) {
	this.lightCol.set(r, g, b );
};
Light.prototype.setR = function(r ) {
	this.lightCol.setX(r );
};
Light.prototype.setG = function(g ) {
	this.lightCol.setY(g );
};
Light.prototype.setB = function(b ) {
	this.lightCol.setZ(b );
};
Light.prototype.setPosition = function(x, y, z ) {
	this.lightPos.set(x, y, z );
};

