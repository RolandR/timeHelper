var Presentation = new function(){
	
	/*
		A presentation is composed of presentationTopic objects.
		PresentationTopics can be nested to an arbitrary depht.
	*/
	var presentationTopic = function(title){
		this.displayTitle = title || "";
		this.duration = 10000;
		this.htmlElement = null;
		this.autoTime = true;
		this.setAutoTime = function(newAutoTime){
			this.autoTime = newAutoTime;
			var autoString = "";
			if(this.autoTime == true){
				autoString = "(auto)";
			}
			this.htmlElement.children(".topicInfo").children(".duration").children(".autoTime").html(autoString);
		}
		this.parent = null;
		
		var color = generateColor();
		
		this.color = "rgb("+color[0]+", "+color[1]+", "+color[2]+")";
		this.subElements = [];
		
		// Remove a particular subElement from the list.
		this.removeSubElement = function(subElement){
			for(var i in this.subElements){
				if(this.subElements[i] == subElement){
					this.subElements.splice(i, 1);
					if(this.subElements.length <= 0){
						this.htmlElement.addClass('noChild');
					}
					return subElement;
				}
			}
			console.error("Could not delete subElement because it does not exist.");
			console.trace();
		}
		
		// Delete this topic
		this.remove = function(){
			this.parent.removeSubElement(this);
			DomHandler.removeTopic(this);
		}
		
		// Add subtopic to this topic.
		this.newTopic = function(){
			var newElement = new presentationTopic()
			newElement.autoTime = false;
			newElement.parent = this;
			
			if(this.duration == 0){
				this.setAutoTime(true);
			}
			this.subElements.push(newElement);
			var newHtmlElement = DomHandler.addTopic(this.htmlElement, newElement);
			newHtmlElement.children(".topicInfo").children(".title").focus();
		}
	}

	//var presentation = samplePresentation;
	var presentation = {
		metadata: {
			 title: "Your Presentation"
			,author: "Roland Rytz"
			,created: "2014-09-01T14:00:21+01:00"
			,edited: "2014-09-02T13:53:10+01:00"
		}
		,topics: [
			new presentationTopic("New TimeHelper - Click to edit title")
		]
	};
	
	/*
		Builds and updates the HTML view of the presentation.
	*/
	var DomHandler = new function(){
		
		/*
			Initially create the HTML structure of the presentation
		*/
		function buildStructure(htmlParent, element){
			
			var topicElement = addTopic(htmlParent, element);
			
			for(var i in element.subElements){ // Recursion! \o/
				buildStructure(topicElement, element.subElements[i])
			}
			
		}

		/*
			Add a topic to the HTML structure.
			Returns the jQuery object of the newly inserted element.
		*/
		function addTopic(htmlParent, element){
			
			htmlParent.removeClass('noChild');
			
			// Create topic element, which will contain topicInfo and all child topicElements.
			var topicElement = $('<div></div>');
			topicElement.addClass('noChild');
			topicElement.addClass('topic');
			element.htmlElement = topicElement;
			
			// topicInfo contains information like the topic's title and its duration
			// as well as buttons for adding new children, deleting this topic and others.
			var topicInfo = $('<div></div>');
			topicInfo.addClass('topicInfo');
			
			var topicTitle = $('<p contenteditable spellcheck="false" class="title">'+element.displayTitle+'</p>');
			topicTitle.keypress(function(e){
				if(e.keyCode == 13){
					e.preventDefault();
					topicTitle.blur();
				}
				element.displayTitle = topicTitle.html();
			});
			topicInfo.append(topicTitle);
			
			var autoTimeString = "";
			if(element.autoTime){
				autoTimeString = "(auto)";
			}
			var durationSettings = $('<p class="duration">'+millisecondsToMinutes(element.duration).m + ":" +millisecondsToMinutes(element.duration).s + '<span class="autoTime">' + autoTimeString +'</span></p>');
			var durationButton = $('<button class="durationButton" title="Set duration"><img src="./_media/_icons/clock.png" alt="Change..."/></button>');
			durationSettings.append(durationButton);
			topicInfo.append(durationSettings);
			topicInfo.append('<button class="colorButton" title="Set Color"><img src="./_media/_icons/color.png" alt="c"/></button>');
			if(element.parent != null){
				var deleteTopicButton = $('<button class="deleteButton" title="Delete"><img src="./_media/_icons/delete.png" alt="x"/></button>');
				deleteTopicButton.click(function(){element.remove()});
				deleteTopicButton.mouseenter(function(){element.htmlElement.addClass("deleteCandidate")});
				deleteTopicButton.mouseleave(function(){element.htmlElement.removeClass("deleteCandidate")});
				topicInfo.append(deleteTopicButton);
			}
			var addTopicButton = $('<button class="addTopicButton" title="Add new subcategory">+</button>');
			addTopicButton.click(function(){element.newTopic()});
			topicInfo.append(addTopicButton);
			topicInfo.css("backgroundColor", element.color);
			topicElement.append(topicInfo);
			htmlParent.append(topicElement);
			
			return topicElement;
		}
		
		// Removes a presentation topic and all its children from the HTML structure.
		function removeTopic(element){
			element.htmlElement.remove();
		}
		
		return{
			 buildStructure: buildStructure
			,addTopic: addTopic
			,removeTopic: removeTopic
		};
		
	}
	
	// Shows the TimeHelper presentation player
	function openPresentationPlayer(){
		Overlays.get($('#timeHelperOverlay')).show();
		
		timeHelper = new TimeHelper(
			presentation.topics,
			$('#timeHelper'),
			$('#controls'),
			$('#playButton'),
			$('#toStartButton')
		);
	}
	
	function init(){
		DomHandler.buildStructure($("#presentation"), presentation.topics[0]);
	}
	
	init();
	
	return {
		 openPresentationPlayer: openPresentationPlayer
		
	};
}

function millisecondsToMinutes(milliseconds){
	var toSeconds = Math.ceil(milliseconds / 1000);
	var seconds = toSeconds % 60;
	if(seconds < 10){
		seconds = "0"+seconds;
	}
	var toSeconds =  toSeconds-seconds;
	var minutes = toSeconds / 60;
	if(minutes < 10){
		minutes = "0"+minutes;
	}
	return ({
		'm': minutes,
		's': seconds
	});
}

function generateColor(){
	var primaryColor = Math.floor(Math.random()*2.999);
	var secondaryColor = -1;
	if(Math.round(Math.random()) == 1){
		do{
		secondaryColor = Math.floor(Math.random()*2.999);
		}while (secondaryColor == primaryColor)
	}

	var r = 0;
	var g = 0;
	var b = 0;

	if(primaryColor == 0 || secondaryColor == 0){
		r = Math.floor(Math.random()*100 + 155);
	}

	if(primaryColor == 1 || secondaryColor == 1){
		g = Math.floor(Math.random()*100 + 155);
	}

	if(primaryColor == 2 || secondaryColor == 2){
		b = Math.floor(Math.random()*100 + 155);
	}

	return([r, g, b]);
}