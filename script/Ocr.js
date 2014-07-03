//create global variables
var brain;
var inputLayer;
var outputLayer;

//fetch the already trained version of the brain from a txt file (which contains pure json).
$.getJSON("brainfiles/ABC.txt", function (data) {
    initializeBrain(data);
});

function initializeBrain(data) {
    //init the artificial neural network
    brain = new Brain();

    //add two layers to the network
    inputLayer = new Layer(225); //225 input neurons: one for each pixel in a 15x15 grid
     outputLayer = new Layer(0); //0 output neurons at this point

    //add the layers to the network
    brain.Layers.push(inputLayer, outputLayer);

    //debugger;
    //$.extend(brain.Layers, data.Layers);

    /*
    debugger;
    brain.Layers = data.Layers;
    for (var i = 0; i < brain.Layers.length; i++) {
        brain.Layers[i].__proto__ = Layer.prototype;
        for (var j = 0; j < brain.Layers[i].Neurons.length; j++) {
            brain.Layers[i].Neurons[j].__proto__ = Neuron.prototype;
            for (var k = 0; k < brain.Layers[i].Neurons[j].Dendrites.length; k++) {
                brain.Layers[i].Neurons[j].Dendrites[k].__proto__ = Dendrite.prototype;
            }
        }
    }*/
    
  



   
}


//handler for the click event of the read button
function readDrawing() {
    //downsample the drawing to a 15x15 grid, with zeros for empty spots and ones for coloured spots
    //the inputs variable will therefore hold 255 items with zeros and ones.
    var drawing = getDownsampledDrawing();

    //fill the input layer
    for (var i = 0; i < drawing.length; i++) {
        inputLayer.Neurons[i].AxonValue = drawing[i];
    }

    //make the network 'think'
    brain.Think();


    $("#outputValues").html("");
    for (var i = 0; i < outputLayer.Neurons.length; i++) {
        var neuron = outputLayer.Neurons[i];
        //$("#outputValues").append("<span>" + neuron.Name + ": " + neuron.AxonValue + "</span>");
    }
    var bestGuess = outputLayer.BestGuess();
    if (bestGuess !== null) {
        $("#bestGuess").text(bestGuess.Name);

    }
    else {
        $("#outputValues").html("Could not read your drawing.");
    }

}

//starts the training action for a provided character
function trainCharacter() {

    //determine the character to be trained
    var character = $("#txtCharacter").val().toUpperCase();
    if (character.length === 0) {
        //no character, no glory
        return;
    }

    //lookup the output neuron for the character to train
    var outputNeuron = outputLayer.GetNeuron(character);

    //if the character has not been trained before, add it to the output layer
    if (outputNeuron === null) {
        var outputNeuron = new Neuron(character)
        inputLayer.ConnectNeuron(outputNeuron);
        outputLayer.Neurons.push(outputNeuron);
    }

    //train the network with the current drawing applied to the output neuron
    brain.Train(getDownsampledDrawing(), outputNeuron);

}
