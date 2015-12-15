var container;
var camera, scene, renderer, materialDepth;

var sphereMesh;

var sunPosition;
var sunColor;
var screenSpacePosition = new THREE.Vector3();

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var postprocessing = { enabled : true };

var orbitRadius = 200;

var bgColor = 0x256FC4;
var sunColor_g = 0xffee00;

var light1;

var _VERTEX_SHADER = document.getElementById( 'vertexShader' ).textContent;
var _FRAGMENT_SHADER = document.getElementById( 'fragmentShader' ).textContent;
var _TEXTURE_FRAGMENT_SHADER = document.getElementById( 'textureFragmentShader' ).textContent;
var _PURE_TEXTURE_FRAGMENT_SHADER = document.getElementById( 'pureTextureFragmentShader' ).textContent;

//var shadowRenderFunction= [];

var meshObject = []; // Array Of MeshObject

init();

render();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	//

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 3000 );
	//camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
	camera.position.z = 200;

	scene = new THREE.Scene();
	
	//
	
	sunPosition = new THREE.Vector3( 0, 1000, -1000 );
	sunColor = new THREE.Vector3( 1.0, 1.0, 1.0 )
	
	//
	
	//scene.add( new THREE.AmbientLight( 0x666666 ) );
	
	//
	
	light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2, 1 );
	light.position.set( sunPosition.x, sunPosition.y, sunPosition.z );
	light.position.multiplyScalar( 1.5 );
	light.target.position.set( 0, 0, 0 );

	light.castShadow = true;

	/*light.shadowCameraNear = 1200;
	light.shadowCameraFar = 2500;
	light.shadowCameraFov = 50;

	//light.shadowCameraVisible = true;

	light.shadowBias = 0.0001;

	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;*/

	scene.add( light );
	
	light1 = new Light();
	light1.setPosition( sunPosition.x, sunPosition.y, sunPosition.z );
	light1.setColor(1.0,1.0,1.0);
	
	//

	materialDepth = new THREE.MeshDepthMaterial();

	var materialScene = new THREE.MeshPhongMaterial( { color: 0x666666 } );
	
	// Cube
	
	var cube1 = new MeshObject("cube1");
	cube1.loadTexture("box.jpg");
	cube1.loadObject(
		"cube.obj",
		light1, _VERTEX_SHADER, _TEXTURE_FRAGMENT_SHADER
	);
	cube1.mesh.position.y = 5;
	cube1.mesh.position.x = 5;
	cube1.mesh.position.z = -5;
	cube1.mesh.castShadow = true;
	cube1.mesh.receiveShadow = true;
	scene.add(cube1.mesh);
	meshObject.push({
		o: cube1,
		rotFac: new THREE.Vector3( 0.1, 0.1, 0.1 )
	});

	var cube2 = new MeshObject("cube2");
	cube2.loadTexture("box.jpg");
	cube2.loadObject(
		"cube.obj",
		light1, _VERTEX_SHADER, _FRAGMENT_SHADER
	);
	cube2.mesh.position.y = 5;
	cube2.mesh.position.x = -5;
	cube2.mesh.position.z = -5;
	cube2.mesh.castShadow = true;
	cube2.mesh.receiveShadow = true;
	scene.add(cube2.mesh);
	meshObject.push({
		o: cube2,
		rotFac: new THREE.Vector3( 0.01, 0.01, 0.0 )
	});

	// tree
	
	var tree1 = new MeshObject("tree1");
	tree1.loadTexture("box.jpg");
	tree1.loadObject(
		"tree.obj",
	light1, _VERTEX_SHADER, _TEXTURE_FRAGMENT_SHADER
	);
	//tree1.mesh.scale.multiplyScalar( 50 );
	tree1.mesh.position.y = 0;
	tree1.mesh.position.x = 5;
	tree1.mesh.position.z = -10;
	tree1.mesh.castShadow = true;
	tree1.mesh.receiveShadow = true;
	tree1.mesh.geometry.computeVertexNormals();
	scene.add(tree1.mesh);
	meshObject.push({
		o: tree1,
		rotFac: new THREE.Vector3( 0.0, 0.05, 0.0 )
	});
	
	/*var treeTexture = THREE.ImageUtils.loadTexture( "textures/terrain/grass.jpg" );
	treeTexture.wrapS = treeTexture.wrapT = THREE.RepeatWrapping;
	treeTexture.repeat.set( 25, 25 );
	treeTexture.anisotropy = 16;

	var loader = new THREE.OBJLoader();
	loader.load( "models/obj/tree.obj", function ( object ) {
		object.material = new THREE.MeshPhongMaterial( { color: 0x666666 , map: treeTexture } );
		object.position.set( 0, -150, -150 );
		object.scale.multiplyScalar( 50 );
		object.receiveShadow = true;
		object.castShadow = true;
		scene.add( object );

	} );*/

	// sphere

	/*var geo = new THREE.SphereGeometry( 1, 20, 10 );
	sphereMesh = new THREE.Mesh( geo, materialScene );
	sphereMesh.scale.multiplyScalar( 20 );
	sphereMesh.receiveShadow = true;
	sphereMesh.castShadow = true;
	scene.add( sphereMesh );*/
	
	//
	
	//addObject("mycube", "cube.obj", "box.jpg", 10, 10, -10, 0.1, 0.0, 0.0);
	
	// Sky
	
	/*var sky = new MeshObject("sky");
	sky.loadTexture("sky.jpg");
	sky.loadObject(
		"sky2.obj",
		light1, _VERTEX_SHADER, _TEXTURE_FRAGMENT_SHADER
	);
	sky.setSpecular(1,1,1);
	sky.mesh.position.x = 382;
	sky.mesh.position.y = 300;
	sky.mesh.position.z = 182;
	sky.mesh.geometry.computeVertexNormals();
	scene.add(sky.mesh);*/

	// Ground
	
	var groundTexture = THREE.ImageUtils.loadTexture( "textures/grass.jpg" );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 25, 25 );
	groundTexture.anisotropy = 16;

	var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 200, 200 ), groundMaterial );
	mesh.position.y = 0;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	//var ground = new MeshObject("ground");
	//ground.loadTexture("grass.jpg");
	//ground.loadObject(
	//	"cube2.obj",
	//	light1, _VERTEX_SHADER, _TEXTURE_FRAGMENT_SHADER
	//);
	//ground.mesh.position.y = -102;
	//ground.setSpecular(0,0,0);
	//scene.add(ground.mesh);
	
	/*var geometry = new THREE.CubeGeometry( 100, 1, 100);
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
	ground.receiveShadow = true;*/
	
	// Cloud
	
	var Plane = new MeshObject("cloud");
	var planeTexture = new RawTexture("cloud");
	planeTexture.newSize(64);
	for(var i=0;i<64;i++) {
		for(var j=0;j<64;j++) {
			if(i < 32 && j < 32) { // Must be Top-Left
				planeTexture.setRGB(i,j,1,0,0);
			}
			else if(i < 32) { // Must be Top-Right
				planeTexture.setRGB(i,j,0,1,0);
			}
			else if(j < 32) { // Must be Bottom-Left
				planeTexture.setRGB(i,j,0,0,1);
			}
			else { // Must be Bottom-Right
				if(i + j < 96)
					planeTexture.setRGB(i,j,0,0,0);
				else
					planeTexture.setRGB(i,j,1,1,1);
			}
		}
	}
	Plane.setTexture(planeTexture.getTexture());
	Plane.loadTHREEObject(
		new THREE.PlaneGeometry(50,50,10,10),
		light1, _VERTEX_SHADER, _PURE_TEXTURE_FRAGMENT_SHADER
	);
	Plane.mesh.position.y = 50;
	Plane.mesh.rotation.x = Math.PI/2;
	scene.add(Plane.mesh);
	
	// Push to render function
	/*shadowRenderFunction.push(function(){
		renderer.render( scene, camera );		
	});*/
	
	//removeObject("cube1");

	//

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setClearColor( bgColor );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	renderer.autoClear = false;
	renderer.sortObjects = false;
	
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	
	renderer.shadowMap.enabled	= true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//

	initPostprocessing();

}

function initPostprocessing() {

	postprocessing.scene = new THREE.Scene();

	postprocessing.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	postprocessing.camera.position.z = 100;

	postprocessing.scene.add( postprocessing.camera );

	var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
	postprocessing.rtTextureColors = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

	postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

	var w = window.innerWidth / 4.0;
	var h = window.innerHeight / 4.0;
	postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget( w, h, pars );
	postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget( w, h, pars );

	var godraysGenShader = THREE.ShaderGodRays[ "godrays_generate" ];
	postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone( godraysGenShader.uniforms );
	postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial( {

		uniforms: postprocessing.godrayGenUniforms,
		vertexShader: godraysGenShader.vertexShader,
		fragmentShader: godraysGenShader.fragmentShader

	} );

	var godraysCombineShader = THREE.ShaderGodRays[ "godrays_combine" ];
	postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone( godraysCombineShader.uniforms );
	postprocessing.materialGodraysCombine = new THREE.ShaderMaterial( {

		uniforms: postprocessing.godrayCombineUniforms,
		vertexShader: godraysCombineShader.vertexShader,
		fragmentShader: godraysCombineShader.fragmentShader

	} );

	var godraysFakeSunShader = THREE.ShaderGodRays[ "godrays_fake_sun" ];
	postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone( godraysFakeSunShader.uniforms );
	postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial( {

		uniforms: postprocessing.godraysFakeSunUniforms,
		vertexShader: godraysFakeSunShader.vertexShader,
		fragmentShader: godraysFakeSunShader.fragmentShader

	} );

	postprocessing.godraysFakeSunUniforms.bgColor.value.setHex( bgColor );
	postprocessing.godraysFakeSunUniforms.sunColor.value.setHex( sunColor_g );

	postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 0.5;

	postprocessing.quad = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight ),
		postprocessing.materialGodraysGenerate
	);
	postprocessing.quad.position.z = -9900;
	postprocessing.scene.add( postprocessing.quad );

}

function render() {
	
	var time = Date.now() / 4000;

	requestAnimationFrame( render );
	updateCamera();

	sunAngle += sunSpeed*sunDAngle;
	if (sunAngle > 2*Math.PI) sunAngle = 0;
	else if (sunAngle < 0) sunAngle = 2*Math.PI;
	
	/*shadowRenderFunction.forEach(function(func) {
		func(1, 1);
	});*/
	
	/*sphereMesh.position.x = orbitRadius * Math.cos( time );
	sphereMesh.position.z = orbitRadius * Math.sin( time ) - 100;*/
	
	meshObject.forEach(function(obj) {
		obj.o.mesh.rotation.x += obj.rotFac.x;
		obj.o.mesh.rotation.y += obj.rotFac.y;
		obj.o.mesh.rotation.z += obj.rotFac.z;
	});

	if ( postprocessing.enabled ) {

		screenSpacePosition.copy( sunPosition ).project( camera );

		screenSpacePosition.x = ( screenSpacePosition.x + 1 ) / 2;
		screenSpacePosition.y = ( screenSpacePosition.y + 1 ) / 2;

		postprocessing.godrayGenUniforms[ "vSunPositionScreenSpace" ].value.x = screenSpacePosition.x;
		postprocessing.godrayGenUniforms[ "vSunPositionScreenSpace" ].value.y = screenSpacePosition.y;

		postprocessing.godraysFakeSunUniforms[ "vSunPositionScreenSpace" ].value.x = screenSpacePosition.x;
		postprocessing.godraysFakeSunUniforms[ "vSunPositionScreenSpace" ].value.y = screenSpacePosition.y;

		renderer.clearTarget( postprocessing.rtTextureColors, true, true, false );

		var sunsqH = 0.74 * window.innerHeight; // 0.74 depends on extent of sun from shader
		var sunsqW = 0.74 * window.innerHeight; // both depend on height because sun is aspect-corrected

		screenSpacePosition.x *= window.innerWidth;
		screenSpacePosition.y *= window.innerHeight;

		renderer.setScissor( screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
		renderer.enableScissorTest( true );

		postprocessing.godraysFakeSunUniforms[ "fAspect" ].value = window.innerWidth / window.innerHeight;

		postprocessing.scene.overrideMaterial = postprocessing.materialGodraysFakeSun;
		renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureColors );

		renderer.enableScissorTest( false );

		scene.overrideMaterial = null;
		renderer.render( scene, camera, postprocessing.rtTextureColors );

		scene.overrideMaterial = materialDepth;
		renderer.render( scene, camera, postprocessing.rtTextureDepth, true );

		var filterLen = 1.0;

		var TAPS_PER_PASS = 6.0;

		var pass = 1.0;
		var stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

		postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
		postprocessing.godrayGenUniforms[ "tInput" ].value = postprocessing.rtTextureDepth;

		postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

		renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays2 );

		pass = 2.0;
		stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

		postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
		postprocessing.godrayGenUniforms[ "tInput" ].value = postprocessing.rtTextureGodRays2;

		renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays1  );

		pass = 3.0;
		stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

		postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
		postprocessing.godrayGenUniforms[ "tInput" ].value = postprocessing.rtTextureGodRays1;

		renderer.render( postprocessing.scene, postprocessing.camera , postprocessing.rtTextureGodRays2  );

		postprocessing.godrayCombineUniforms["tColors"].value = postprocessing.rtTextureColors;
		postprocessing.godrayCombineUniforms["tGodRays"].value = postprocessing.rtTextureGodRays2;

		postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;

		renderer.render( postprocessing.scene, postprocessing.camera );
		postprocessing.scene.overrideMaterial = null;

	} else {

		renderer.clear();
		renderer.render( scene, camera );

	}

}
