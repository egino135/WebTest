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
	mouseSensitivity:	0.2,
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
		-0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0])
function createShader(gl, source, type) 
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	return shader;
}
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
function main()
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
	document.getElementById("2d-vertex-shader").innerHTML, 
	document.getElementById("2d-fragment-shader").innerHTML);

	const programInfo =
	{
		program: shaderProgram,
		uniformLocations: 
		{
			projection:		gl.getUniformLocation(shaderProgram, "u_projection"),
			view:			gl.getUniformLocation(shaderProgram, "u_view"),
			model:			gl.getUniformLocation(shaderProgram, "u_model"),
			color:			gl.getUniformLocation(shaderProgram, "u_color"),
		},
	};
	
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
	
	var then = 0.0;

	//initial camera
	updateCameraVectors();
	
	// Draw the scene repeatedly
	function render(now)
	{
		now *= 0.01;  // convert to seconds
		deltaTime = now - then;
		then = now;

		drawScene(gl, programInfo, vao, now);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}
function drawScene(gl, programInfo, vao, now)
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
	model = glm.scale(model, glm.vec3(10.1, 10.1, 10.1));
	model = glm.rotate(model, now, glm.vec3(0.0, 1.0, 0.0));
	
	gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model.elements);
	gl.uniform4fv(programInfo.uniformLocations.color, [0.0, 0.0, 1.0, 1.0]);

	gl.bindVertexArray(vao);
	
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6 * 6;
	gl.drawArrays(primitiveType, offset, count);
}
function moveCamera(camera, direction)
{
	var velocity = camera.moveSpeed * deltaTime;
	
	//velocity = glm.vec3(velocity, velocity, velocity);
	
	const front = glm.mul(camera.front, velocity);
	if (direction == FORWARD)
		camera.position = glm.add(camera.position, glm.mul(camera.front, velocity));
	if (direction == BACKWARD)
		camera.position = glm.add(camera.position, glm.mul(camera.front, velocity * -1.0));
	if (direction == LEFT)
		camera.position = glm.add(camera.position, glm.mul(camera.right, velocity * -1.0));
	if (direction == RIGHT)
		camera.position = glm.add(camera.position, glm.mul(camera.right, velocity));
	
	
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
}
$(document).ready(main());


