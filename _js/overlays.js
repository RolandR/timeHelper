/*
	Handles showing and hiding overlays, which are used
	for showing popup windows or the presentation player.
*/

var Overlays = new function(){
	function Overlay(overlayElement, onShow, onClose){
		// overlayElement: jQuery object of overlay HTML element.
		// onShow: Function to be called when opening the overlay.
		// onClose: Function to be called when closing the overlay.
		
		var element = overlayElement;
		
		function getElement(){
			return element;
		}
		
		function show(){
			if(onShow){
				onShow();
			}
			overlayElement.css("display", "block");
		}
		
		function hide(){
			overlayElement.css("display", "none");
			if(onClose){
				onClose();
			}
		}
		
		return {
			 getElement: getElement
			,show: show
			,hide: hide
		};
	}
	
	var overlays = [];
	
	overlays.push(new Overlay($('#aboutOverlay')));	
	overlays.push(new Overlay($('#documentPropertiesOverlay')));	
	overlays.push(new Overlay($('#timeHelperOverlay')), false, function(){timeHelper.pause()});
	
	// Get Overlay object by jQuery element
	function get(byElement){
		for(var i in overlays){
			if(overlays[i].getElement()[0] == byElement[0]){
				return overlays[i];
			}
		}
		return null;
	}
	
	// Close all overlays on Esc
	$('body').keyup(function(e){
		if(e.keyCode == 27){
			for(var i in overlays){
				overlays[i].hide();
			}
		}
	});
	
	return {
		 get: get
	};
}