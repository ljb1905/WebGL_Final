# WebGL Tutorial
2021-1 컴퓨터 그래픽스 WebGL Tutorial 프로젝트

201620897 이종빈


## 개요 및 목적

이번 학기 컴퓨터 그래픽스 수업에서 WebGL에 대한 강의가 진행되었다. postscript와는 다르게 WebGL은 기본적인 도형을 그리고, 이를 변형하는 것이 생소하고 어렵게 느껴졌다. 나처럼 이렇게 기본적인 vertex입력과 그에 대한 속성값을 통해 원하는 도형을 그리는 것이 어렵게 느껴지는 사람을 위해 이번 프로젝트의 주제를 WebGL의 기초가 되는 primitives와 transformation로 선정하게 되었다. 


처음 페이지에서는 2차원 캔버스를 통해 WebGL에서 그릴 수 있는 primitives 도형들을 이해하고, 이를 transformation해볼 수 있다. 그리고 그 학습이 완료된다면 두번째 페이지에서 3차원 도형이 어떻게 그려지는지, 그 3차원 도형은 어떤식으로 회전하는지에 대해 학습할 수 있다. 또한 이러한 주제 속에서 Homogeneous coordinate의 장점과 transformation 행렬을 미리 계산해두고 입력된 vertex를 계산하면 계산 수를 줄일 수 있다는 것을 깨달을 수 있을 것이다.



## 첫번째 페이지 사용 방법

첫번째 페이지는 Primities와 Transformation에 대한 페이지다. 학습 방법은 간단하다. 설명에 써있는 대로 주어진 검은 캔버스를 클릭하여 원하는 대로 좌표를 찍고, translate 바와 scale 바를 조정하거나 mode를 바꿔가며 좌표가 입력으로 주어졌을 때 primitives가 어떻게 그려지는지, translate와 scale은 어떻게 좌표들을 변화시키는지를 이해할 수 있다. 또한 캔버스 밑에 그림과 설명을 통해 사용자는 조금 더 쉽게 이해할 수 있다.



## 두번째 페이지 사용 방법

두번째 페이지는 3D 도형과 이를 회전시킬 수 있는 페이지이다. 사용자에게 보여지는 도형은 정육면체다. 사용자에게 총 36개의 vertex가 존재하는 것을 알려주고, 사용자는 mode를 변경해가면서 정육면체가 어떤 식으로 그려지는지 유추해볼 수 있다. 또한, 캔버스를 드래그하면서 정육면체가 회전하는 모습을 확인할 수 있다. 그리고 앞에서 배운 rotate행렬의 곱셈 결과를 이용한다는 것을 사용자에게 알려줘, 첫번째 페이지에서 학습한 내용을 적용한 결과를 두번째 페이지에서 확인하고, 학습할 수 있다.



## 구현 방법

렌더링을 자동으로 해주는 것이 아니라 도형의 변화가 일어날 때만 렌더링이 일어나게 구현하였다.
<h4>첫번째 페이지 구현 방법</h4>

첫번째 페이지의 핵심 구현 부분은 3가지로 나눌 수 있다.

<h5>1. 캔버스를 클릭했을 때 x,y좌표를 변화된 좌표계에서 올바르게 vertexData에 넣는 코드</h5>

```Javascript
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
```
click event로 들어온 마우스의 좌표를 캔버스 크기에 맞춰 normalize하고, rotate, scale된 좌표를 초기의 좌표로 맞춰 vertexData에 넣어준다. 이때 vertex의 attribute는 7개로 지정하였는데, x,y,z,r,g,b,a값을 의미한다. 2차원 도형을 표현하기 때문에 z좌표는 0.0으로 고정해두고, 색도 1.0,0.0,0.0,0.5로 고정하여 붉은 빛 색으로 고정해두었다. 그리고 loadPage를 통해 렌더링해준다. 

**(주의사항) e.layerX와 e.layerY가 browser마다 다르게 적용될 수 있다. 이럴 때에는 e.offsetX를 활용할 수 있다.**


<h5>2. 사용자가 입력한 scale값, translate값에 맞춰 Transformation Matrix값 변화시키기</h5>

```Javascript
var transformationMatrix = [
        sca, 0.0, 0.0, 0.0,
        0.0, sca, 0.0, 0.0,
        0.0, 0.0, sca, 0.0,
        trx, tryy, 0.0, 1.0
    ];
```
sca는 사용자가 입력한 scale비율이고, trx와 tryy는 사용자가 입력한 x축 translate, y축 translate 입력값이다. 이러한 transformationMatrix를 통해 사용자는 transformation이 하나의 homogeneous coordinate 행렬로 표현될 수 있고, 이를 통해 각 vertex에 이 행렬을 곱함으로써 간단하고, 적은 회수의 계산으로 결과를 도출할 수 있다는 것을 알 수 있다.


<h5>3. mode변화에 맞는 도형 그리기</h5>

```Javascript
gl.drawArrays(draw_mode,0,vertexData.length/7)
```
현재 좌표의 정보를 나타내는 attribute는 7개이다. 따라서 vertexData.length/7 계산을 통해 vertex의 개수를 계산할 수 있고, draw_mode를 파라미터 입력으로 해, 사용자가 원하는 도형이 출력되게 하였다.



<h4>두번째 페이지 구현 방법</h4>

두번째 페이지에서는 좌표가 고정되어있고, mode나 transformation matrix만을 조정할 수 있다. 핵심 구현 부분은 3가지로 나눌 수 있다.

<h5>1. vertexData입력</h5>

```Javascript
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
```
이러한 vertexData입력을 통해 사용자는 하나의 vertex에 7개의 attribute가 있고, 총 36개의 vertex가 입력으로 주어진다는 것을 알 수 있다.


<h5>2. transformationMatrix 구현</h5>

```Javascript
var transformationMatrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
    rotateY(transformationMatrix,roty);
    rotateX(transformationMatrix,rotx);
```
기존의 transformationMatrix에 구현한 rotateY,rotateX(두번째 페이지에 있는 이미지 파일의 계산과 동일하다. theta에 따른 X축 회전행렬, Y축 회전행렬을 곱해 transformationMatrix에 적용한다.)를 적용하여 rotate시킨다.


<h5>3. 마우스 드래그 좌표계산 및 transformationMatrix에 변수로 제공</h5>

```Javascript
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
```
마우스를 드래그하면서 변화한 좌표를 실시간으로 갱신해주고, 차이를 계산하면서 rotate 함수의 파라미터에 변수로 제공해준다.


## 참조
https://www.youtube.com/watch?v=77cmqAEcvJU

https://www.youtube.com/watch?v=tDalT3a-1rI

https://git.ajou.ac.kr/hwan/webgl-tutorial/-/tree/master/student2020/better_project/201420976