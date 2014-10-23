function ColorPicker(htmlParent, onColorPick, onCancel, initialValue){
	/*
		htmlParent: jQuery html element reference
		onColorPick: function to which to pass the picked value
		onCancel: function to call on cancel
		initialValue: initial color [r, g, b]
	*/
	var color = [0, 0, 0];
	
	if(initialValue){
		color = initialValue;
	}
	
	// Add colorPicker div to parent
	var colorPickerDiv = $('\
	<div class="cp">\
		<label for="r">Red</label></div>');
		
	// Add slider for red
	var rSlider = $('<input name="r" class="cp-r" type="range" min="0" max="255" step="1" value="'+color[0]+'"/>');
	rSlider.mousemove(function(){color[0] = Math.floor(rSlider.val()); updateColorPreview();});
	colorPickerDiv.append(rSlider);
	colorPickerDiv.append('<br />\
		<label for="g">Green</label>');
		
	// Add slider for green
	var gSlider = $('<input name="g" class="cp-g" type="range" min="0" max="255" step="1" value="'+color[1]+'"/>');
	gSlider.mousemove(function(){color[1] = Math.floor(gSlider.val()); updateColorPreview();});
	colorPickerDiv.append(gSlider);
	colorPickerDiv.append('<br />\
		<label for="b">Blue</label>');
	
	// Add slider for blue
	var bSlider = $('<input name="b" class="cp-b" type="range" min="0" max="255" step="1" value="'+color[2]+'"/>');
	bSlider.mousemove(function(){color[2] = Math.floor(bSlider.val()); updateColorPreview();});
	colorPickerDiv.append(bSlider);
	
	colorPickerDiv.click(function(e){
		e.stopPropagation();
	});
	
	// Add color preview field
	var colorPreview = $('<div class="cp-colorPreview"></div>');
	updateColorPreview();
	colorPickerDiv.append(colorPreview);
	
	// Add hex input field
	var hexInput = $('<input type="text" class="cp-textInput" />');
	hexInput.click(function(e){
		e.stopPropagation();
	});
	colorPickerDiv.append(hexInput);
	
	// Add cancel button
	var cancelButton = $('<button class="cp-button">Cancel</button>');
	cancelButton.click(function(e){
		e.stopPropagation();
		colorPickerDiv.remove();
		onCancel(color);
	});
	colorPickerDiv.append(cancelButton);
	
	// Add ok button
	var pickColorButton = $('<button class="cp-button">OK</button>');
	pickColorButton.click(function(e){
		e.stopPropagation();
		colorPickerDiv.remove();
		onColorPick(color);
	});
	colorPickerDiv.append(pickColorButton);
	
	htmlParent.append(colorPickerDiv);
	
	function updateColorPreview(){
		colorPreview.css("background-color", "rgb("+color[0]+", "+color[1]+", "+color[2]+")");
	}
	
	function fromHex(hexString){
		if(hexString.substr(0, 1) == "#"){
			hexString = hexString.substring(1, hexString.length);
		}
		var newColor = [];
		newColor.push(hexString.substr(0, 2));
		newColor.push(hexString.substr(2, 2));
		newColor.push(hexString.substr(4, 2));
		
		for(var i in newColor){
			if(newColor[i].length == 2){
				
			}
		}
		
	}
}

















