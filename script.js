var gl;

const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;  

function testGLError(functionLastCalled) {
    /* gl.getError returns the last error that occurred using WebGL for debugging */ 
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}

var shaderProgram;

var chkpage = 1;
var vertexData = [];
var vertexData2 = [
    // Backface (RED/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
     0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
     0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
    -0.5, -0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
    -0.5,  0.5, -0.5,  1.0, 0.0, 0.0, 1.0,
     0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 
    // Front (BLUE/WHITE) -> z = 0.5
    -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
     0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
    -0.5, -0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 
    // LEFT (GREEN/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 0.0, 1.0,
    -0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 1.0,
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0,
    -0.5, -0.5,  0.5,  0.0, 1.0, 0.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0, 
    // RIGHT (YELLOW/WHITE) -> z = 0.5
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 1.0, 0.0, 1.0,
     0.5,  0.5, -0.5,  1.0, 1.0, 0.0, 1.0,
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0,
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 
    // BOTTON (MAGENTA/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,
     0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0,
     0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0,
    -0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0,
     0.5, -0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 
    // TOP (CYAN/WHITE) -> z = 0.5
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,
     0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,
     0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0 
];

function initialiseBuffer() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    return testGLError("initialiseBuffers");
}

function initialiseBuffer2() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData2), gl.STATIC_DRAW);

    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = `  
            varying highp vec4 col; 
			void main(void) 
			{ 
				gl_FragColor = col;
			}`;

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = `
			attribute highp vec4 myVertex; 
			uniform mediump mat4 transformationMatrix; 
			void main(void)  
			{ 
				gl_Position = transformationMatrix * myVertex; 
                gl_PointSize = 5.0;
			}`;
    
    var vertexShaderSource2 = `
            attribute highp vec4 myVertex; 
            attribute highp vec4 myColor; 
            uniform mediump mat4 transformationMatrix; 
            varying  highp vec4 col;
            void main(void)  
            { 
                gl_Position = transformationMatrix * myVertex; 
                gl_PointSize = 5.0;
                col = myColor; 
            }`;

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.shaderSource(gl.vertexShader, vertexShaderSource2);
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();
    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);
    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

var draw_mode = 0;
var draw_mode2 = 0;
var trx = 0;
var tryy = 0;
var sca = 1.0;
var drag = false;
var befx = 0;
var befy = 0;
var defx = 0;
var defy = 0;
var roty = 0;
var rotx = 0;
var AMORTIZATION = 0.95;

function main() {
    var canvas = document.getElementById("mycanvas");
    loadPage(1)
    canvas.addEventListener("click", function(e) {
        var x= e.layerX
        var y= e.layerY
        var orix = (x-canvas.width/2) / (canvas.width/2)
        var oriy = (-y+canvas.height/2) / (canvas.height/2)
        var retx = orix - trx
        retx /= sca
        var rety = oriy - tryy
        rety /= sca
        vertexData.push(retx,rety,0.0,1.0, 0.0, 0.0, 0.5)
        loadPage(1)
    });
    var canvas2 = document.getElementById("mycanvas2");
    canvas2.addEventListener("mousedown",function(e){
        drag = true;
        befx = e.pageX, befy = e.pageY;
        e.preventDefault();
        return false;
    });
    canvas2.addEventListener("mouseup",function(e){
        drag = false;
    });
    canvas2.addEventListener("mousemove",function(e){
        if (!drag) return false;
        defx = (e.pageX - befx) * 2 * Math.PI / canvas2.width,
        defy = (e.pageY - befy) * 2 * Math.PI / canvas2.height;
        roty += defx;
        rotx += defy;
        befx = e.pageX, befy = e.pageY;
        e.preventDefault();
        defx *= AMORTIZATION, defy *= AMORTIZATION;
        roty += defx, rotx += defy;
        loadPage(2);
    });

    var modeSelect = document.getElementById("modeSelect");
    modeSelect.addEventListener('change',(event)=>{
        draw_mode = event.target.value;
        loadPage(1)
    })
    var modeSelect = document.getElementById("modeSelect2");
    modeSelect.addEventListener('change',(event)=>{
        draw_mode2 = event.target.value;
        loadPage(2)
    })

	// renderScene();
    // Render loop
    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();
}

function clearVertex(){
    vertexData = [];
    loadPage(1)
}

function trx_update(val){
    var canvas = document.getElementById("mycanvas");
    trx = val/canvas.width;
    loadPage(1)
}
function try_update(val){
    var canvas = document.getElementById("mycanvas");
    tryy = val/canvas.height;
    loadPage(1)
}
function sca_update(val){
    sca = val;
    loadPage(1)
}

function loadPage(val){
    if(val===1){
        var canvas = document.getElementById("mycanvas");

        if (!initialiseGL(canvas)) {
            return;
        }
    
        if (!initialiseBuffer()) {
            return;
        }
    
        if (!initialiseShaders()) {
            return;
        }

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	//gl.clearDepth(1.0);										// Added for depth Test 
	//gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);		// Added for depth Test 
	//gl.enable(gl.DEPTH_TEST);								// Added for depth Test 

    var matrixLocation = gl.getUniformLocation(gl.programObject, "transformationMatrix");
    // rotate부분
    // var transformationMatrix = mat4.create();
    // mat4.rotateX(transformationMatrix,transformationMatrix,xRot);
    // mat4.rotateY(transformationMatrix,transformationMatrix,yRot);
    // mat4.rotateZ(transformationMatrix,transformationMatrix,zRot);

    var transformationMatrix = [
        sca, 0.0, 0.0, 0.0,
        0.0, sca, 0.0, 0.0,
        0.0, 0.0, sca, 0.0,
        trx, tryy, 0.0, 1.0
    ];

    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, transformationMatrix );

        if (!testGLError("gl.uniformMatrix4fv")) {
            return false;
        }

        
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 28, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 28, 12);

        if (!testGLError("gl.vertexAttribPointer")) {
            return false;
        }

        gl.drawArrays(draw_mode,0,vertexData.length/7)

        chkpage = 1;
        var tmppage = document.getElementById("Page2");
        tmppage.style.display = "none";    
        var nowpage = document.getElementById("Page1");
        nowpage.style.display = "block";    
    }
    else{
        var canvas2 = document.getElementById("mycanvas2");
        if (!initialiseGL(canvas2)) {
            return;
        }
    
        if (!initialiseBuffer2()) {
            return;
        }
    
        if (!initialiseShaders()) {
            return;
        }
        // Generate a buffer object
    gl.vertexBuffer = gl.createBuffer();
    // Bind buffer as a vertex buffer so we can fill it with data
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    // Set the buffer's size, data and usage 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData2), gl.STATIC_DRAW);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var matrixLocation = gl.getUniformLocation(gl.programObject, "transformationMatrix");
    var transformationMatrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
    rotateY(transformationMatrix,roty);
    rotateX(transformationMatrix,rotx);
    

    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, transformationMatrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 28, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 28, 12);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

    gl.drawArrays(draw_mode2, 0, 36);
    if (!testGLError("gl.drawArrays")) {
        return false;
    }
        chkpage = 2;
        var tmppage = document.getElementById("Page1");
        tmppage.style.display = "none"   
        var nowpage = document.getElementById("Page2");
        nowpage.style.display = "block";    
    }
}

function rotateX(m, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let mv1 = m[1], mv5 = m[5], mv9 = m[9];

    m[1] = m[1] * c - m[2] * s;
    m[5] = m[5] * c - m[6] * s;
    m[9] = m[9] * c - m[10] * s;

    m[2] = m[2] * c + mv1 * s;
    m[6] = m[6] * c + mv5 * s;
    m[10] = m[10] * c + mv9 * s;
}

function rotateY(m, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c * m[0] + s * m[2];
    m[4] = c * m[4] + s * m[6];
    m[8] = c * m[8] + s * m[10];

    m[2] = c * m[2] - s * mv0;
    m[6] = c * m[6] - s * mv4;
    m[10] = c * m[10] - s * mv8;
}