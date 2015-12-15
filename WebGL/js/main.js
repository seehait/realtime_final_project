var _VERTEX_SHADER = document.getElementById( 'vertexShader' ).textContent;
var _FRAGMENT_SHADER = document.getElementById( 'fragmentShader' ).textContent;
var _TEXTURE_FRAGMENT_SHADER = document.getElementById( 'textureFragmentShader' ).textContent;
var _PURE_TEXTURE_FRAGMENT_SHADER = document.getElementById( 'pureTextureFragmentShader' ).textContent;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );

var light = new Light();
light.setColor(1.0,1.0,1.0);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Set Shadow Map
renderer.shadowMap.enabled	= true;
renderer.shadowMap.type 		= THREE.PCFSoftShadowMap;

var shadowRenderFunction= [];

var light2 = new THREE.DirectionalLight( 0xffffff, 2 );
	light2.position.set( 1, -1, 1 ).normalize();
	scene.add( light2 );

	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.target.position.set( 0, 2, 0 );
	spotLight.shadowCameraNear = 0.01;		
	spotLight.castShadow = true;
	spotLight.shadowDarkness = 0.5;
	scene.add( spotLight );	

	shadowRenderFunction.push(function(){
		spotLight.position.x	= light.lightPos.x;
		spotLight.position.y	= light.lightPos.y;
		spotLight.position.z	= light.lightPos.z;		
	});

// Cube
var cube1 = new MeshObject("cube1");
cube1.loadTexture("box.jpg");
cube1.loadObject(
	"cube.obj",
	light, _VERTEX_SHADER, _TEXTURE_FRAGMENT_SHADER
);
cube1.mesh.position.y = 5;
cube1.mesh.position.x = 5;
cube1.mesh.position.z = -5;
cube1.mesh.castShadow = true;
cube1.mesh.receiveShadow = true;
scene.add(cube1.mesh);

var cube2 = new MeshObject("cube2");
cube2.loadTexture("box.jpg");
cube2.loadObject(
	"cube.obj",
	light, _VERTEX_SHADER, _FRAGMENT_SHADER
);
cube2.mesh.position.y = 5;
cube2.mesh.position.x = -5;
cube2.mesh.position.z = -5;
cube2.mesh.castShadow = true;
cube2.mesh.receiveShadow = true;
scene.add(cube2.mesh);

// Tree Test
var tree1 = new MeshObject("tree1");
tree1.loadTexture("box.jpg");
tree1.loadObject(
	"tree.obj",
	light, _VERTEX_SHADER, _TEXTURE_FRAGMENT_SHADER
);
tree1.mesh.position.y = 0;
tree1.mesh.position.x = 5;
tree1.mesh.position.z = -10;
tree1.mesh.castShadow = true;
tree1.mesh.receiveShadow = true;
tree1.mesh.geometry.computeVertexNormals();
scene.add(tree1.mesh);

/*
var ground = new MeshObject("ground");
ground.loadTexture("grass.jpg");
ground.loadObject(
	"cube2.obj",
	light, _VERTEX_SHADER, _TEXTURE_FRAGMENT_SHADER
);
ground.mesh.position.y = -102;
ground.setSpecular(0,0,0);
scene.add(ground.mesh);
*/

// Sky
var sky = new MeshObject("sky");
sky.loadTexture("sky.jpg");
sky.loadObject(
	"sky2.obj",
	light, _VERTEX_SHADER, _TEXTURE_FRAGMENT_SHADER
);
sky.setSpecular(1,1,1);
sky.mesh.position.x = 382;
sky.mesh.position.y = 300;
sky.mesh.position.z = 182;
sky.mesh.geometry.computeVertexNormals();
scene.add(sky.mesh);

// New Ground
var geometry = new THREE.CubeGeometry( 100, 1, 100);
var texture	= THREE.ImageUtils.loadTexture('textures/grass.jpg');
texture.repeat.set( 10, 10 );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
var material = new THREE.MeshPhongMaterial({
	ambient	: 0xffffff,
	color : 0x00ff00,
	shininess : 0, 
	specular : 0x000000,
	shading	: THREE.SmoothShading,
	map	: texture
});
var ground = new THREE.Mesh( geometry, material );
ground.scale.multiplyScalar(3);
ground.position.y = -1;
scene.add( ground );

ground.castShadow = false;
ground.receiveShadow = true;

// Push to render function
shadowRenderFunction.push(function(){
	renderer.render( scene, camera );		
});

var Plane = new MeshObject("cloud");
var nL = 64;
var L = nL<<5;
var planeTexture = new RawTexture("cloud");
planeTexture.newSize(L);
var noise = new RawTexture("noise");
noise.newSize(nL+1)
for(var i=0;i<nL+1;i++) {
	for(var j=0;j<nL+1;j++) {
		var rand = Math.random();
		noise.setRGB(i,j,rand,rand,rand);
	}
}
function BilinearInterpolate(v1,v2,v3,v4,x,y) {
	var cX1 = v1 + x*(v2-v1);
	var cX2 = v3 + x*(v4-v3);
	return  cX1 + y*(cX2-cX1);
}
for(var i=0;i<L;i++) {
	for(var j=0;j<L;j++) {
		var x = i/L*nL, y = j/L*nL;
		var x1 = Math.floor(x), x2 = Math.ceil(x);
		var y1 = Math.floor(y), y2 = Math.ceil(y);
		var v1 = noise.getGray(x1,y1);
		var v2 = noise.getGray(x2,y1);
		var v3 = noise.getGray(x1,y2);
		var v4 = noise.getGray(x2,y2);
		var s = BilinearInterpolate(v1,v2,v3,v4,x-x1,y-y1);
		planeTexture.setRGBA(i,j,s,s,s,s);
	}
}
var blendTimes = 0;
for(var k=nL;k<L;k<<=1) {
	blendTimes++;
	for(var i=0;i<k;i++) {
		for(var j=0;j<k;j++) {
			var x = i/k*nL, y = j/k*nL;
			var x1 = Math.floor(x), x2 = Math.ceil(x);
			var y1 = Math.floor(y), y2 = Math.ceil(y);
			var v1 = noise.getGray(x1,y1);
			var v2 = noise.getGray(x2,y1);
			var v3 = noise.getGray(x1,y2);
			var v4 = noise.getGray(x2,y2);
		var s = BilinearInterpolate(v1,v2,v3,v4,x-x1,y-y1);
			for(var p=0;p<L;p+=k) {
				for(var q=0;q<L;q+=k) {
					planeTexture.blend(p+i,q+j,s,blendTimes);
					//planeTexture.setRGB(p+i,q+j,s,s,s);
				}
			}
		}
	}
}
/*
var CloudCover = 150; // 0 - 255
var CloudSharpness = 0.9; // < 1.0
for(var i=0;i<L;i++) {
	for(var j=0;j<L;j++) {
		var c = 255*planeTexture.getGray(i,j) - CloudCover;
		if(c < 0) c = 0;
		var CloudDensity  = (255 - 255*Math.pow(CloudSharpness,c))/255;
		planeTexture.setRGBA(i,j,CloudDensity,CloudDensity,CloudDensity,CloudDensity);
	}
}
*/
Plane.setTexture(planeTexture.dataTexture);
Plane.loadTHREEObject(
	new THREE.PlaneGeometry(100,100,10,10),
	light, _VERTEX_SHADER, _PURE_TEXTURE_FRAGMENT_SHADER
);
Plane.mesh.position.y = 50;
Plane.mesh.rotation.x = Math.PI/2;
Plane.mesh.material.needsUpdate = true;
scene.add(Plane.mesh);


var render = function () {
	requestAnimationFrame( render );
	updateCamera();
	cube1.mesh.rotation.y += 0.01;
	cube1.mesh.rotation.x += 0.01;
	cube2.mesh.rotation.y += 0.01;
	cube2.mesh.rotation.x -= 0.01;

	sunAngle += sunSpeed*sunDAngle;
	if (sunAngle > 2*Math.PI) sunAngle = 0;
	else if (sunAngle < 0) sunAngle = 2*Math.PI;

	// Sun Position
	// document.getElementById("footer-text").innerHTML = "Sun Position: (" + light.lightPos.x.toFixed(2) + "," + light.lightPos.y.toFixed(2) + "," + light.lightPos.z.toFixed(2) + ")";

	renderer.render(scene, camera);

	shadowRenderFunction.forEach(function(func){
		func(1, 1);
	});
};

render();
