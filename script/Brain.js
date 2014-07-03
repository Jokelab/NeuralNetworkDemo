/**
 * Classes for neural network demo
 * Author: Robert Beisicht
 * Date: July 1, 2014
 * 
 * Network class: the collection of layers. 
 * Layer class: the collection of neurons.
 * Neuron class: The unit that generates an output value based on the incoming connetions.
 * Dendrite class: the input 'sensors' for a single neuron.
 * 
 */


//The brain is the main neural network  class. It holds references to the network layer objects.
var Brain = (function () {

    function Brain() {
        this.Layers = [];
    }

    //make each layer in the network 'think' (generate output values)
    Brain.prototype.Think = function () {
        for (var i = 0; i < this.Layers.length; i++) {
            this.Layers[i].Think();
        }
    };

    //
    Brain.prototype.Train = function (inputData, outputNeuron) {

        //no layers, no glory
        if (this.Layers.length === 0) {
            return;
        }

        //fill the first layer with input data to feed the network
        var inputLayer = this.Layers[0]; 
        for (var i = 0; i < inputData.length; i++) {
            inputLayer.Neurons[i].AxonValue = inputData[i];
        }

        //generate output for the given inputs
        this.Think();

        //adjust weights using the delta 
        //the generated output is compared to the training input: the drawing in this case.
        //the subtraction is the error which will be corrected by adjusting the weight. 
        var delta = 0;
        var learningRate = 0.01;
        for (var i = 0; i < outputNeuron.Dendrites.length; i++) {
            var dendrite = outputNeuron.Dendrites[i];
            delta = parseFloat(Math.max(inputData[i], 0) - outputNeuron.AxonValue);
            dendrite.Weight += parseFloat(Math.max(inputData[i], 0) * delta * learningRate);
        }

    }
    return Brain;
}
)();

var Layer = (function () {

    //the constructor. 
    function Layer(neuronCount) {
        var neuronsToAdd = typeof neuronCount !== "undefined" ? neuronCount : 0;
        this.Neurons = [];

        //create the requested neuron objects
        for (var i = 0; i < neuronsToAdd; i++) {
            this.Neurons.push(new Neuron());
        }
    }

    //make all neurons in the layer generate an output value
    Layer.prototype.Think = function () {
        for (var i = 0; i < this.Neurons.length; i++) {
            this.Neurons[i].Think();
        }
    };

    //connects a neuron from another layer with all neurons in this layer 
    Layer.prototype.ConnectNeuron = function (neuron) {
        for (var i = 0; i < this.Neurons.length; i++) {
            neuron.Dendrites.push(new Dendrite(this.Neurons[i]))
        }
    };

    //Search for a neuron with the supplied name
    Layer.prototype.GetNeuron = function (name) {
        for (var i = 0; i < this.Neurons.length; i++) {
            if (this.Neurons[i].Name == name) {
                return this.Neurons[i];
            }
        }
        return null;
    };

    //returns the neuron with the heighest axon value in this layer
    Layer.prototype.BestGuess = function () {
        var max = 0;
        var bestGuessIndex = 0;

        //find index of the neuron with heighest axon value
        for (var i = 0; i < this.Neurons.length; i++) {
            if (this.Neurons[i].AxonValue > max) {
                max = this.Neurons[i].AxonValue;
                bestGuessIndex = i;
            }
        }
        return this.Neurons[bestGuessIndex];
    }



    return Layer;
}
)();

//a neuron is the calculation unit and is responsible for generating an output value.
var Neuron = (function () {

    //neuron constructor. They have names for easy retrieval.
    function Neuron(name) {
        this.Name = name;
        this.Dendrites = [];
        this.AxonValue = 0.5;
    }

    //generate an output value based on the input values multiplied by the corresponding weights.
    //the output value is always between 0 and 1 because of the sigmoid function (http://en.wikipedia.org/wiki/Sigmoid_function)
    Neuron.prototype.Think = function () {
        var sum = 0;
        if (this.Dendrites.length > 0) {
            for (var i = 0; i < this.Dendrites.length; i++) {
                sum += this.Dendrites[i].SourceNeuron.AxonValue * this.Dendrites[i].Weight;
            }

            //apply sigmoid function to transform the sum to a value between 0 and 1
            //AxonValue is simply a sexy name.
            this.AxonValue = 1 / (1 + Math.exp(-sum));
        }
    };
    return Neuron;
}
)();

//a dendrite represents a single connection to a neuron. The source neuron it is connected must be passed in the constructor.
var Dendrite = (function () {
    function Dendrite(sourceNeuron) {
        this.SourceNeuron = sourceNeuron;
        this.Weight = 0;//Math.random();//initialize with a random weight
    }
    return Dendrite;
}
)();
