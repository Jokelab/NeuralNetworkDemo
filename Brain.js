/**
 * Classes for neural network demo
 * Author: Robert Beisicht
 * Date: 2014-07-01
 * 
 * Network class: the collection of layers. 
 * Layer class: the collection of neurons.
 * Neuron class: The unit that generates an output value based on the incoming connetions.
 * Dendrite class: the input 'sensors' for a single neuron.
 * 
 */

var Network = (function () {

    function Network() {
        this.Layers = [];
    }

    Network.prototype.Think = function () {
        for (var i = 0; i < this.Layers.length; i++) {
            this.Layers[i].Think();
        }
    };

    return Network;
}
)();

var Layer = (function () {
    function Layer(neuronCount) {
        var neuronsToAdd = typeof neuronCount !== "undefined" ? neuronCount : 0;
        this.Neurons = [];

        //create the requested neuron objects
        for (var i = 0; i < neuronsToAdd; i++) {
            this.Neurons.push(new Neuron());
        }
    }

    Layer.prototype.Think = function () {
        for (var i = 0; i < this.Neurons.length; i++) {
            this.Neurons[i].Think();
        }
    };

    //connects a neuron from -another- with all neurons in this layer 
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
        var bestGuessIndex=0;
        
        //find index of the neuron with heighest axon value
        for (var i = 0; i < this.Neurons.length; i++) {
            if (this.Neurons[i].AxonValue > max) {
                bestGuessIndex = i;
            }
        }
        return this.Neurons[bestGuessIndex];
    }

    

    return Layer;
}
)();

var Neuron = (function () {

    function Neuron(name) {
        this.Name = name;
        this.Dendrites = [];
        this.AxonValue = 0.5;
    }

    Neuron.prototype.Think = function () {
        var sum = 0;
        for (var i = 0; i < this.Dendrites.length; i++) {
            if (this.Dendrites[i].SourceNeuron !== null) {
                this.Dendrites[i].Value = this.Dendrites[i].SourceNeuron.AxonValue;
                sum += this.Dendrites[i].Value * this.Dendrites[i].Weight;
            }
        }
        console.log(sum);
        //apply sigmoid function to transform the sum to a value between 0 and 1
        this.AxonValue = 1 / (1 + Math.exp(-sum));

    };
    return Neuron;
}
)();

var Dendrite = (function () {
    function Dendrite(sourceNeuron) {
        this.SourceNeuron = sourceNeuron;
        this.Weight = Math.random();
    }
    return Dendrite;
}
)();
