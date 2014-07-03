//create global variables
var brain = new Brain(BRAIN_ABC);


//handler for the click event of the read button
function readDrawing() {
    //downsample the drawing to a 15x15 grid, with zeros for empty spots and ones for coloured spots
    //the inputs variable will therefore hold 255 items with zeros and ones.
    var drawing = getDownsampledDrawing();

    //the input layer is the first layer, the output layer is the last one
    var inputLayer = brain.Layers[0];
    var outputLayer = brain.Layers[brain.Layers.length - 1];

    //fill the input layer
    for (var i = 0; i < drawing.length; i++) {
        inputLayer.Neurons[i].AxonValue = drawing[i];
    }

    //make the network 'think'
    brain.Think();


    $("#outputValues").html("<h3>Output values</h3>");
    for (var i = 0; i < outputLayer.Neurons.length; i++) {
        var neuron = outputLayer.Neurons[i];
        $("#outputValues").append("<span>" + neuron.Name.toUpperCase() + ": " + neuron.AxonValue + "</span>");
    }
    var bestGuess = outputLayer.BestGuess();
    if (bestGuess !== null) {
        $("#bestGuess").text(bestGuess.Name.toUpperCase());

    }
    else {
        $("#outputValues").html("Could not read your drawing.");
    }

}

//starts the training action for a provided character
function trainCharacter() {
    var inputLayer = brain.Layers[0];
    var outputLayer = brain.Layers[brain.Layers.length - 1];

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
