"use strict";
var debug = 0.0;
var vertexPos = new Float32Array([
	  // left column front
	  0,   0,  0,
	  0, 150,  0,
	  30,   0,  0,
	  0, 150,  0,
	  30, 150,  0,
	  30,   0,  0,

	  // top rung front
	  30,   0,  0,
	  30,  30,  0,
	  100,   0,  0,
	  30,  30,  0,
	  100,  30,  0,
	  100,   0,  0,

	  // middle rung front
	  30,  60,  0,
	  30,  90,  0,
	  67,  60,  0,
	  30,  90,  0,
	  67,  90,  0,
	  67,  60,  0,

	  // left column back
		0,   0,  30,
	   30,   0,  30,
		0, 150,  30,
		0, 150,  30,
	   30,   0,  30,
	   30, 150,  30,

	  // top rung back
	   30,   0,  30,
	  100,   0,  30,
	   30,  30,  30,
	   30,  30,  30,
	  100,   0,  30,
	  100,  30,  30,

	  // middle rung back
	   30,  60,  30,
	   67,  60,  30,
	   30,  90,  30,
	   30,  90,  30,
	   67,  60,  30,
	   67,  90,  30,

	  // top
		0,   0,   0,
	  100,   0,   0,
	  100,   0,  30,
		0,   0,   0,
	  100,   0,  30,
		0,   0,  30,

	  // top rung right
	  100,   0,   0,
	  100,  30,   0,
	  100,  30,  30,
	  100,   0,   0,
	  100,  30,  30,
	  100,   0,  30,

	  // under top rung
	  30,   30,   0,
	  30,   30,  30,
	  100,  30,  30,
	  30,   30,   0,
	  100,  30,  30,
	  100,  30,   0,

	  // between top rung and middle
	  30,   30,   0,
	  30,   60,  30,
	  30,   30,  30,
	  30,   30,   0,
	  30,   60,   0,
	  30,   60,  30,

	  // top of middle rung
	  30,   60,   0,
	  67,   60,  30,
	  30,   60,  30,
	  30,   60,   0,
	  67,   60,   0,
	  67,   60,  30,

	  // right of middle rung
	  67,   60,   0,
	  67,   90,  30,
	  67,   60,  30,
	  67,   60,   0,
	  67,   90,   0,
	  67,   90,  30,

	  // bottom of middle rung.
	  30,   90,   0,
	  30,   90,  30,
	  67,   90,  30,
	  30,   90,   0,
	  67,   90,  30,
	  67,   90,   0,

	  // right of bottom
	  30,   90,   0,
	  30,  150,  30,
	  30,   90,  30,
	  30,   90,   0,
	  30,  150,   0,
	  30,  150,  30,

	  // bottom
	  0,   150,   0,
	  0,   150,  30,
	  30,  150,  30,
	  0,   150,   0,
	  30,  150,  30,
	  30,  150,   0,

	  // left side
	  0,   0,   0,
	  0,   0,  30,
	  0, 150,  30,
	  0,   0,   0,
	  0, 150,  30,
	  0, 150,   0])
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
	
	
	// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 3;          // 3 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(0, size, type, normalize, stride, offset);
	gl.enableVertexAttribArray(0);
	//unbind
	gl.bindVertexArray(null);
	
	
	 var then = 0.0;

	// Draw the scene repeatedly
	function render(now)
	{
		now *= 0.01;  // convert to seconds
		const deltaTime = now - then;
		then = now;

		drawScene(gl, programInfo, vao, now);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
	
}
function drawScene(gl, programInfo, vao, deltaTime)
{
	
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas.
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.enable(gl.DEPTH_TEST);   
	
	
	// Tell it to use our program (pair of shaders)
	gl.useProgram(programInfo.program);

		
	var camera = 
	{
		zoom:		45.0,
		position:	glm.vec3(0.0, 0.0, 50.0),
		up:			glm.vec3(0.0, 1.0, 0.0),
		front:		glm.vec3(0.0, 0.0, -1.0),		
	}	
		
	// Compute the matrix
	var projection = glm.perspective(
	camera.zoom * Math.PI / 180,
	gl.canvas.clientWidth / gl.canvas.clientHeight ,
	0.1, 100.0);
	
	var view = glm.lookAt( 
	camera.position,
	glm.add(camera.position, camera.front),
	camera.up);

	gl.uniformMatrix4fv(programInfo.uniformLocations.projection, false, projection.elements);
	gl.uniformMatrix4fv(programInfo.uniformLocations.view, false, view.elements);

	debug = debug + 1.0;
	console.log(deltaTime);
	
	var model = glm.mat4();
	model = glm.scale(model, glm.vec3(0.1, 0.1, 0.1));
	model = glm.rotate(model, deltaTime, glm.vec3(0.0, 1.0, 0.0));
	
	gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model.elements);
	gl.uniform4fv(programInfo.uniformLocations.color, [0.0, 0.0, 1.0, 1.0]);

	gl.bindVertexArray(vao);
	
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6 * 16;
	gl.drawArrays(primitiveType, offset, count);
}
main();
