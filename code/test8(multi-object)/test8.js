"use strict";
var debug = 0.0;
var floatSize = 4;
var keys = [];
var firstMouse = true;
var mouseDownInCanvas = false;
var lastPos;
var camera = 
{
	zoom:		45.0,
	position:	glm.vec3(0.0, 0.0, 50.0),
	worldUp:	glm.vec3(0.0, 1.0, 0.0),
	up:			glm.vec3(0.0, 1.0, 0.0),
	right:		glm.vec3(-1.0, 0.0, 0.0),
	front:		glm.vec3(0.0, 0.0, -1.0),
	yaw:		-90.0,
	pitch:		0.0,
	moveSpeed:	5.0,
	mouseSensitivity:	0.15,
}
var deltaTime = 0.0;
//direction
var FORWARD = 1;
var BACKWARD = 2;
var LEFT = 3;
var RIGHT = 4;
var vertexPos = new Float32Array([
	  // positions          // normals           // texture coords
		-0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 0.0,
		0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 0.0,
		0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 1.0,
		0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 1.0,
		-0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 1.0,
		-0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 0.0,

		-0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0,
		0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.0,
		0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
		0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
		-0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0,
		-0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0,

		-0.5, 0.5, 0.5, -1.0, 0.0, 0.0, 1.0, 0.0,
		-0.5, 0.5, -0.5, -1.0, 0.0, 0.0, 1.0, 1.0,
		-0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 0.0, 1.0,
		-0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 0.0, 1.0,
		-0.5, -0.5, 0.5, -1.0, 0.0, 0.0, 0.0, 0.0,
		-0.5, 0.5, 0.5, -1.0, 0.0, 0.0, 1.0, 0.0,

		0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,
		0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0,
		0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0,
		0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0,
		0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0,
		0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,

		-0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0,
		0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 1.0, 1.0,
		0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 1.0, 0.0,
		0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 1.0, 0.0,
		-0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 0.0, 0.0,
		-0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0,

		-0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
		0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0,
		0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
		0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
		-0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 0.0,
		-0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0]);
var SquareVertex = new Float32Array([
		// positions        // normals		// texture coords
		-0.5, -0.5, 0.0, 	0.0, 0.0, 		-1.0, 0.0, 0.0,
		0.5, -0.5, 0.0, 	0.0, 0.0, 		-1.0, 1.0, 0.0,
		0.5, 0.5, 0.0, 		0.0, 0.0, 		-1.0, 1.0, 1.0,
		0.5, 0.5, 0.0, 		0.0, 0.0, 		-1.0, 1.0, 1.0,
		-0.5, 0.5, 0.0, 	0.0, 0.0, 		-1.0, 0.0, 1.0,
		-0.5, -0.5, 0.0, 	0.0, 0.0, 		-1.0, 0.0, 0.0]);
var imgInfo = [
	{path: "../img/graffiti/kurumi.png", 		width: 600, height:800, texture: null},
	{path: "../img/graffiti/Raven_ Branwen.png", 	width: 600, height:800, texture: null},
	{path: "../img/graffiti/chiya.png", 		width: 600, height:800, texture: null},
	{path: "../img/graffiti/zero_two.png", 		width: 600, height:800, texture: null},
	{path: "../img/graffiti/Sorceress.png", 	width: 600, height:800, texture: null}];
var imgPos = [
	{translate: glm.vec3(100.0, 0.0, 0.0),	rotate: -90.0},
	{translate: glm.vec3(100.0, 0.0, -50.0), rotate: -90.0},
	{translate: glm.vec3(100.0, 0.0, -100.0),rotate: -90.0},
	{translate: glm.vec3(100.0, 0.0, -150.0),rotate: -90.0},
	{translate: glm.vec3(100.0, 0.0, -200.0),rotate: -90.0}];
var floorPos = {width: 500, height: 5, length: 500}
var wallPos = [
	{translate: glm.vec3(-floorPos.width / 2.0, 0.0, 0.0),			width: 10.0,			height: 300.0, length: floorPos.length}, 
	{translate: glm.vec3(floorPos.width / 2.0, 0.0, 0.0),			width: 10.0,			height: 300.0, length: floorPos.length}, 
	{translate: glm.vec3(0.0, 0.0, -floorPos.length * 3.0 / 2.0),	width: floorPos.width,	height: 300.0, length: 10.0}, 
	{translate: glm.vec3(0.0, 0.0, floorPos.length / 2.0),			width: floorPos.width,	height: 300.0, length: 10.0},
	{translate: glm.vec3(-floorPos.width / 2.0, 0.0, -floorPos.length),	width: 10.0,	height: 300.0, length: floorPos.length},
	{translate: glm.vec3(floorPos.width /2.0, 0.0, -floorPos.length),	width: 10.0,	height: 300.0, length: floorPos.length},	];
function createShader(gl, source, type) 
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	return shader;
}
var floorTexture = null;
var wallTexture = null;


function createProgram(gl, vertexShaderSource, fragmentShaderSource) 
{
	var program = gl.createProgram();
	var vshader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
	var fshader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
	gl.attachShader(program, vshader);
	gl.deleteShader(vshader);
	gl.attachShader(program, fshader);
	gl.deleteShader(fshader);
	gl.linkProgram(program);

	var log = gl.getProgramInfoLog(program);
	if (log) {
		console.log(log);
	}

	log = gl.getShaderInfoLog(vshader);
	if (log) {
		console.log(log);
	}

	log = gl.getShaderInfoLog(fshader);
	if (log) {
		console.log(log);
	}

	return program;
};
function requestCORSIfNotSameOrigin(img, url) 
{
	if ((new URL(url)).origin !== window.location.origin) 
	{
	  img.crossOrigin = "";
	}
}
// creates a texture info { width: w, height: h, texture: tex }
// The texture will start with 1x1 pixels and be updated
// when the image has loaded
function loadImageAndCreateTextureInfo(gl, url) 
{
	var tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	// Fill the texture with a 1x1 blue pixel.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
				  new Uint8Array([0, 0, 255, 255]));

	// let's assume all images are not a power of 2
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	var textureInfo = {
	  width: 1,   // we don't know the size until it loads
	  height: 1,
	  texture: tex,
	};
	var img = new Image();
	img.addEventListener('load', function() {
	  textureInfo.width = img.width;
	  textureInfo.height = img.height;

	  gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	});
	requestCORSIfNotSameOrigin(img, url);
	img.src = url;

	return textureInfo;
}
function initialKeys()
{
	//initial keys
	//keyboard have 256 type
	for(var i = 0;i<256;i++)
	{
		keys.push(false);
	}
	$(document).keydown(function(e)
	{
		var key = event.which || event.keyCode;
		keys[key] = true;
		//console.log("key number: " + key + " now is " + keys[key]);	
	});
	$(document).keyup(function(e)
	{
		var key = event.which || event.keyCode;
		keys[key] = false;
		//console.log("key number: " + key + " now is " + keys[key]);		
	});
}
function createCubeVAO(gl)
{
	// Create a buffer.
	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);	

	// Create a vertex array object (attribute state)
	var vao = gl.createVertexArray();
	// and make it the one we're currently working with
	gl.bindVertexArray(vao);
	//vbo already create
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * floatSize, 0);
	gl.enableVertexAttribArray(0);
	
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * floatSize, 3 * floatSize );
	gl.enableVertexAttribArray(1);
	
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * floatSize , 6 * floatSize );
	gl.enableVertexAttribArray(2);
	
	//unbind
	gl.bindVertexArray(null);
	
	return {vaoNumber: vao, offset: 0, count: 36};
}
function createSquareVAO(gl)
{
	// Create a buffer.
	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);	

	// Create a vertex array object (attribute state)
	var vao = gl.createVertexArray();
	// and make it the one we're currently working with
	gl.bindVertexArray(vao);
	//vbo already create
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * floatSize, 0);
	gl.enableVertexAttribArray(0);
	
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * floatSize, 3 * floatSize );
	gl.enableVertexAttribArray(1);
	
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * floatSize , 6 * floatSize );
	gl.enableVertexAttribArray(2);
	
	//unbind
	gl.bindVertexArray(null);
	
	return {vaoNumber: vao, offset: 0, count: 6};
}
function loadImg2Texture(gl, path)
{
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Fill the texture with a 1x1 blue pixel.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
				  new Uint8Array([0, 0, 255, 255]));

	// let's assume all images are not a power of 2
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
	

	var img = new Image();
	img.src = path;
	img.crossOrigin = "anonymous";
	img.addEventListener('load', function()
	{
		img.crossOrigin = "anonymous";
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	});
	
	return texture;
}
function renderImage(gl, programInfo, squareVaoInfo, imgPos, imgInfo)
{
	var model = glm.mat4();
	model = glm.translate(model, imgPos.translate);
	model = glm.rotate(model, glm.radians(imgPos.rotate), glm.vec3(0.0, 1.0, 0.0));
	model = glm.scale(model, glm.vec3(imgInfo.width / 20.0, imgInfo.height / 20.0, 1.0));
	
	gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model.elements);
	
	gl.bindTexture(gl.TEXTURE_2D, imgInfo.texture);
	
	gl.bindVertexArray(squareVaoInfo.vaoNumber);
	gl.uniform1i(programInfo.uniformLocations.u_texture, 0);
	
	gl.drawArrays(gl.TRIANGLES, squareVaoInfo.offset, squareVaoInfo.count);
}
function renderFloor(gl, programInfo, cubeVaoInfo, floorPos, floorTexture)
{
	var model = glm.mat4();
	model = glm.translate(model, glm.vec3(0.0, -50.0, 0.0));
	model = glm.scale(model, glm.vec3(floorPos.width, floorPos.height, floorPos.length));
	
	gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model.elements);

	gl.bindTexture(gl.TEXTURE_2D, floorTexture);
	
	gl.bindVertexArray(cubeVaoInfo.vaoNumber);
	gl.uniform1i(programInfo.uniformLocations.u_texture, 0);
	
	gl.drawArrays(gl.TRIANGLES, cubeVaoInfo.offset, cubeVaoInfo.count);
	
	
	
	model = glm.mat4();
	model = glm.translate(model, glm.vec3(0.0, -50.0, -floorPos.length));
	model = glm.scale(model, glm.vec3(floorPos.width, floorPos.height, floorPos.length));
	
	gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model.elements);

	gl.bindTexture(gl.TEXTURE_2D, floorTexture);
	
	gl.bindVertexArray(cubeVaoInfo.vaoNumber);
	gl.uniform1i(programInfo.uniformLocations.u_texture, 0);
	
	gl.drawArrays(gl.TRIANGLES, cubeVaoInfo.offset, cubeVaoInfo.count);
}
function renderWalls(gl, programInfo, cubeVaoInfo, wallPos, wallTexture)
{
	var model = glm.mat4();
	model = glm.translate(model, wallPos.translate);
	model = glm.scale(model, glm.vec3(wallPos.width, wallPos.height, wallPos.length));
	
	gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model.elements);

	gl.bindTexture(gl.TEXTURE_2D, wallTexture);
	
	gl.bindVertexArray(cubeVaoInfo.vaoNumber);
	gl.uniform1i(programInfo.uniformLocations.u_texture, 0);
	
	gl.drawArrays(gl.TRIANGLES, cubeVaoInfo.offset, cubeVaoInfo.count);
}
function main()
{
	
	initialKeys();
	$("#canvas").mousewheel(mouseWheel);
	
	// Get A WebGL context
	/** @type {HTMLCanvasElement} */
	var	canvas = document.getElementById("canvas");
	var gl = canvas.getContext("webgl2");
	if (!gl) 
	{
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	// setup GLSL program
	var shaderProgram = createProgram(gl, 
	document.getElementById("3d-vertex-shader").innerHTML, 
	document.getElementById("3d-fragment-shader").innerHTML);

	const programInfo =
	{
		program: shaderProgram,
		uniformLocations: 
		{
			projection:		gl.getUniformLocation(shaderProgram, "u_projection"),
			view:			gl.getUniformLocation(shaderProgram, "u_view"),
			model:			gl.getUniformLocation(shaderProgram, "u_model"),
			texture:		gl.getUniformLocation(shaderProgram, "u_texture"),
		},
	};
	gl.enableVertexAttribArray(programInfo.uniformLocations.u_texture);
	
	var cubeVaoInfo = createCubeVAO(gl);
	var squareVaoInfo = createSquareVAO(gl);

	for(var info of imgInfo)
	{
		info.texture = loadImg2Texture(gl, info.path);
	}
	
	floorTexture = loadImg2Texture(gl, "../img/scene/floor.jpg");
	wallTexture = loadImg2Texture(gl, "../img/scene/wall.jpg")
		//var texInfo = loadImageAndCreateTextureInfo(gl, "https://c1.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg");
	
	
	var then = 0.0;

	//initial camera
	updateCameraVectors();
	
	// Draw the scene repeatedly
	function render(now)
	{
		now *= 0.01;  // convert to seconds
		deltaTime = now - then;
		then = now;

		drawScene(gl, programInfo, cubeVaoInfo, squareVaoInfo, now);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}
function drawScene(gl, programInfo, cubeVaoInfo, squareVaoInfo, now)
{
	keyReaction(camera);
	
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas.
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.enable(gl.DEPTH_TEST);   
	
	
	// Tell it to use our program (pair of shaders)
	gl.useProgram(programInfo.program);

		
	// Compute the matrix
	var projection = glm.perspective(
	camera.zoom * Math.PI / 180,
	gl.canvas.clientWidth / gl.canvas.clientHeight ,
	0.1, 1000.0);
	
	var view = glm.lookAt( 
	camera.position,
	glm.add(camera.position, camera.front),
	camera.up);

	gl.uniformMatrix4fv(programInfo.uniformLocations.projection, false, projection.elements);
	gl.uniformMatrix4fv(programInfo.uniformLocations.view, false, view.elements);

	
	var model = glm.mat4();
	model = glm.scale(model, glm.vec3(10.0, 10.0, 10.0));
	model = glm.rotate(model, now, glm.vec3(0.0, 1.0, 0.0));
	
	gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model.elements);

	gl.bindTexture(gl.TEXTURE_2D, imgInfo[0].texture);
	
	gl.bindVertexArray(cubeVaoInfo.vaoNumber);
	gl.uniform1i(programInfo.uniformLocations.u_texture, 0);
	
	gl.drawArrays(gl.TRIANGLES, cubeVaoInfo.offset, cubeVaoInfo.count);
	
	renderFloor(gl, programInfo, cubeVaoInfo, floorPos, floorTexture);
	
	
	for(var i = 0;i < imgPos.length;i++)
	{
		renderImage(gl, programInfo, squareVaoInfo, imgPos[i], imgInfo[i]);
	}
	for(var w of wallPos)
	{
		renderWalls(gl, programInfo, cubeVaoInfo, w, wallTexture)	
	}
	
	
}
function moveCamera(camera, direction)
{
	var velocity = camera.moveSpeed * deltaTime;

	var front = glm.mul(camera.front, velocity);
	front = glm.vec3(front.x, 0.0, front.z);
	var right = glm.mul(camera.right, velocity);
	right = glm.vec3(right.x, 0.0, right.z);
	if (direction == FORWARD)
		camera.position = glm.add(camera.position, front);
	if (direction == BACKWARD)
		camera.position = glm.add(camera.position, glm.mul(front, -1.0));
	if (direction == LEFT)
		camera.position = glm.add(camera.position, glm.mul(right, -1.0));
	if (direction == RIGHT)
		camera.position = glm.add(camera.position, right);
	
	
	
}
function keyReaction(camera)
{
	if(keys[87])	//type w
	{
		moveCamera(camera, FORWARD);
	}
	if(keys[83])	//type s
	{
		moveCamera(camera, BACKWARD);
	}
	if(keys[65])	//type a
	{
		moveCamera(camera, LEFT);
	}
	if(keys[68])	//type d
	{
		moveCamera(camera, RIGHT);
	}
	
	
}

function getMousePos(canvas, evt) 
{
	var rect = canvas.getBoundingClientRect();
	return{
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

function updateCameraVectors()
{
	// Calculate the new Front vector
	var front = [];
	front.x = Math.cos(glm.radians(camera.yaw)) * Math.cos(glm.radians(camera.pitch));
	front.y = Math.sin(glm.radians(camera.pitch));
	front.z = Math.sin(glm.radians(camera.yaw)) * Math.cos(glm.radians(camera.pitch));
	front = glm.vec3(front.x, front.y, front.z);
	
	camera.front = glm.normalize(front);
	
	// Also re-calculate the Right and Up vector
	camera.right = glm.normalize(glm.cross(camera.front, camera.worldUp));  // Normalize the vectors, because their length gets closer to 0 the more you look up or down which results in slower movement.
	camera.up = glm.normalize(glm.cross(camera.right, camera.front));
	
}
function processMouseMovement(xoffset, yoffset, constrainPitch = true)
{
	xoffset *= camera.mouseSensitivity;
	yoffset *= camera.mouseSensitivity;

	camera.yaw -= xoffset;
	camera.pitch -= yoffset;

	// Make sure that when pitch is out of bounds, screen doesn't get flipped
	if (constrainPitch)
	{
		if (camera.pitch > 89.0)
			camera.pitch = 89.0;
		if (camera.pitch < -89.0)
			camera.pitch = -89.0;
	}

	// Update Front, Right and Up Vectors using the updated Eular angles
	updateCameraVectors();
}
function mouseMoveCallBack(event)
{
	if(!mouseDownInCanvas)
		return;
	
	var mousePos = getMousePos(event.target, event);
	//console.log("X: " + mousePos.x + " Y: " + mousePos.y);
	if(firstMouse)
	{
		lastPos = mousePos;
		
		firstMouse = false;
	}
	
	var xoffset = mousePos.x - lastPos.x;
	var yoffset = lastPos.y - mousePos.y;  // Reversed since y-coordinates go from bottom to left

	lastPos = mousePos;
	
	processMouseMovement(xoffset, yoffset);
}
function mouseDown()
{
	mouseDownInCanvas = true;
	//console.log(mouseDownInCanvas);
}
function mouseUp()
{
	mouseDownInCanvas = false;
	//console.log(mouseDownInCanvas);
	firstMouse = true;
}
function processMouseScroll(yoffset)
{
	if (camera.zoom >= 1.0 && camera.zoom <= 45.0)
		camera.zoom -= yoffset * 0.1;
	if (camera.zoom <= 1.0)
		camera.zoom = 1.0;
	if (camera.zoom >= 45.0)
		camera.zoom = 45.0;
}
function mouseWheel(event)
{
	processMouseScroll(event.deltaFactor * event.deltaY);
	return false;	//avoid page move
}
$(document).ready(main());


