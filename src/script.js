console.clear();

// Selecting all the icons - Twitter & Codepen
const socialIcons = Array.from(document.querySelectorAll('.fab'));

const sliderProps = {
	fill: "#fff",
	background: "rgba(255, 255, 255, 0.214)",
};

// Selecting All the Slider Containers
const sliderContainers = Array.from(document.querySelectorAll(".color"));
const displayText = document.querySelector(".text");

// This function is responsible to create the trailing color and setting the fill.
function applyFill(slider) {
	const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
	const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
			0.1}%)`;
	slider.style.background = bg;
}

// Using Event Listener to apply the fill and also change the value of the text also the bgcolor based on brightness.
sliderContainers.forEach(sliderContainer => {
	const rangeInput = sliderContainer.querySelector("input");
	const rangeValue = sliderContainer.querySelector(".value");
	rangeInput.addEventListener("input", event => {
		rangeValue.innerHTML = event.target.value;
		applyFill(event.target, rangeValue);

		let redSlider = document.getElementById("redSlider").value;
		let greenSlider = document.getElementById("greenSlider").value;
		let blueSlider = document.getElementById("blueSlider").value;

		// use ML to determine result
		let networkObject = createNetworkObject(redSlider, greenSlider, blueSlider);
		let MLresult = network.run(networkObject);

		MLresult = networkLabel(MLresult);

		// change colors
		changeBackgroundColor(redSlider, greenSlider, blueSlider);
		changeElementsColor(MLresult);
	});
});

// Neural Network part

const network = new brain.NeuralNetwork();

// train algorithm with known data
network.train([
	{ input: { r: 0.62, g: 0.72, b: 0.88 }, output: { light: 1 } },
	{ input: { r: 0.1, g: 0.84, b: 0.72 }, output: { light: 1 } },
	{ input: { r: 0.74, g: 0.78, b: 0.86 }, output: { light: 1 } },
	{ input: { r: 0.33, g: 0.24, b: 0.29 }, output: { dark: 1 } },
	{ input: { r: 0.31, g: 0.35, b: 0.41 }, output: { dark: 1 } },
	{ input: { r: 1, g: 0.42, b: 0.52 }, output: { dark: 1 } },
	{ input: { r: 0, g: 0, b: 1 }, output: { dark: 1 } },
	{ input: { r: 0.8, g: 0.44, b: 1 }, output: { dark: 1 } },
	{ input: { r: 0, g: 0.44, b: 1 }, output: { dark: 1 } },
	{ input: { r: 0.3, g: 0.6, b: 1 }, output: { dark: 1 } },
	{ input: { r: 0.1, g: 0.6, b: 0 }, output: { dark: 1 } },
]);

// creating an object for neural network
function createNetworkObject(r, g, b) {
	let networkObject = { r: null, g: null, b: null };
	networkObject.r = r / 255;
	networkObject.g = g / 255;
	networkObject.b = b / 255;

	return networkObject;
}

// Machine learning probability label - determining the result : Light OR Dark
function networkLabel(result) {
	if (result.light > result.dark) {
		result = "light";
	} else {
		result = "dark";
	}
	return result;
}
// Change the background color based on the slider value.
function changeBackgroundColor(r, g, b) {
	document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}
// change colors on page relative to background
function changeElementsColor(result) {
	sliderContainers.forEach(sliderContainer => {
		const slider = sliderContainer.querySelector("input");
		if (result == "light") {
			sliderProps.fill = "#000";
			sliderProps.background = "rgba(0, 0, 0, 0.214)";
			applyFill(slider);

			sliderContainer.style.background = "rgba(0, 0, 0, 0.15)";
			sliderContainer.querySelector("label").style.color = "#000";

			slider.style.setProperty("--slider-thumb-color", "#000");

			displayText.style.color = "#000";
			displayText.innerHTML = "Now It's Bright!!";

			socialIcons.forEach(icon => {
				icon.style.color = '#000'
			})
		} else if (result == "dark") {
			sliderProps.fill = "#fff";
			sliderProps.background = "rgba(255, 255, 255, 0.214)";
			applyFill(slider);

			sliderContainer.style.background = "rgba(255, 255, 255, 0.15)";
			sliderContainer.querySelector("label").style.color = "#fff";

			slider.style.setProperty("--slider-thumb-color", "#fff");

			displayText.style.color = "#fff";
			displayText.innerHTML = "It's Quite Dark!!";

			socialIcons.forEach(icon => {
				icon.style.color = '#fff'
			})
		}
	});
}
