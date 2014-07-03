/* Don't judge the code in this file please :)
It is only here to facilitate the user interface of the demo
*/

$(document).ready(function () {
    context = document.getElementById("canvas").getContext("2d");

    //create outline context
    outlineContext = document.getElementById("outlines").getContext("2d");
    outlineContext.fillStyle = "red";
    outlineContext.strokeStyle = "gray";

    $('#canvas').mousedown(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });

    $('#canvas').mousemove(function (e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });

    $('#canvas').mouseup(function (e) {
        paint = false;
    });

    $('#canvas').mouseleave(function (e) {
        paint = false;
    });

    $("#clear").on("click", function () {
        //clear drawing context
        clickX = [];
        clickY = [];
        clickDrag = [];
        paint = false;
        redraw();

        //clear outline context
        outlineContext.clearRect(0, 0, outlineContext.canvas.width, outlineContext.canvas.height);

        //clear the guess
        $("#bestGuess").text("");
        $("#outputValues").html("");

    });

    $("#read").on("click", readDrawing);
    $("#trainCharacter").on("click", trainCharacter);

    var clickX = [];
    var clickY = [];
    var clickDrag = [];
    var paint;

    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    function redraw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

        context.strokeStyle = "green";
        context.lineJoin = "round";
        context.lineWidth = 5;

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }
}
);

//Create and return an array with 225 items (15x15) which represents a downsampled image
function getDownsampledDrawing() {
    var output = [];
    var blockSize = 10;
    var canvasSizeX = context.canvas.width;
    var canvasSizeY = context.canvas.height;

    for (var x = 0; x < canvasSizeX; x += blockSize) {
        for (var y = 0; y < canvasSizeY; y += blockSize) {
            //get the RGBA value per pixel
            var data = context.getImageData(x, y, blockSize, blockSize).data;
            var found = false;
            for (var i = 0; i < data.length; i++) {
                //if at least one of the values is greater than 0, the square is hit by the user
                if (data[i]) {
                    output.push(1);

                    //draw red square on the outline context
                    outlineContext.fillRect(x, y, blockSize, blockSize);
            

                    found = true;
                    break;
                }
            }
            if (!found) {
                output.push(-1);
            }

            outlineContext.strokeRect(x, y, blockSize, blockSize);

        }
    }

    return output;
}