/*

	This project uses jQuery: http://jquery.com/
	
	Icons from the Iconic icon set have been used: http://somerandomdude.com/work/iconic/
	
	
	
	Copyright 2012 Roland Rytz
	___________________________
	
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    See http://www.gnu.org/licenses/gpl-3.0.html for further information.
	
*/

$(document).ready(function(){
	
	// Durations in topicList are multiplied by factor. Used mostly for debug purposes.
	// Set 1000 for seconds.
	var factor = 60*1000;
	
	// Array of all titles to be displayed as well as their durations
	// A list element can have any amount of sub-elements.
	var topicList = [
		{
<<<<<<< HEAD
			displayTitle: 'English Presentation',
			duration: 0 * factor,
			subElements: [
				{
					displayTitle: 'Intro',
					duration: 1 * factor
				},
				{
					displayTitle: 'Agriculture',
					duration: 4 * factor
				},
				{
					displayTitle: 'Raeffu',
					duration: 5 * factor
				},
				{
					displayTitle: 'Moon Landings',
					duration: 0 * factor,
					subElements: [
					{
						displayTitle: 'Intro',
						duration: 0.5 * factor
					},
					{
						displayTitle: 'Instrument Unit',
						duration: 1.5 * factor
					},
					{
						displayTitle: 'Apollo Guidance Computer',
						duration: 0 * factor,
						subElements: [
							{
								displayTitle: 'Intro',
								duration: 0.5 * factor
							},
							{
								displayTitle: 'Descent Problem',
								duration: 1 * factor
							},
							{
								displayTitle: 'Core RAM',
								duration: 0.5 * factor
							},
							{
								displayTitle: 'Rope core ROM',
								duration: 0.5 * factor
							},
							{
								displayTitle: 'Little Old Ladies',
								duration: 0.5 * factor
							}
						]
					}
					]
				}
			]
		}
	];
	
	
	
	var debug = false;
	
	if(debug){
	
	factor = 1000;
	topicList = [
		{
			displayTitle: 'Example Presentation',
			duration: 1 * factor,
			subElements: [
				{
					displayTitle: 'More stuff',
					duration: 1 * factor,
					subElements: [
=======
			displayTitle: 'Sample Presentation',
			duration: 0 * factor, // Duration of all subElements will be added automatically.
			subElements: [
				{
					displayTitle: 'Intro',
					duration: 0.2 * factor
				},
				{
					displayTitle: 'Subtopics!',
					duration: 0 * factor,
					subElements: [
						{
							displayTitle: 'Hello World!',
							duration: 0.2 * factor
						},
						{
							displayTitle: 'More Subtopics!',
							duration: 0.2 * factor
						},
						{
							displayTitle: 'As many as you like',
							duration: 0 * factor,
							subElements: [
								{
									displayTitle: 'Foo',
									duration: 0.1 * factor
								},
								{
									displayTitle: 'Bar',
									duration: 0.2 * factor
								}
							]
						}
					]
				},
				{
					displayTitle: 'Another topic',
					duration: 0 * factor,
					subElements: [
>>>>>>> f5924b38e2d47aae69e9c8c4e287f34bcfc9cc2d
						{
							displayTitle: 'Stuff',
							duration: 0.2 * factor
						},
						{
							displayTitle: 'Things',
							duration: 0.3 * factor
						}
					]
				},
				{
					displayTitle: 'The end',
					duration: 0.5 * factor
				}
			]
		}
	];
	
	
	var timeHelper = null;
	init();
	
	function init(){
		timeHelper = new TimeHelper(
			topicList,
			$('#timeHelper'),
			$('#controls'),
			$('#playButton'),
			$('#toStartButton')
		);
	}
	
	
	/*
	*	Main object, creates a Timer object.
	*/
	function TimeHelper(
		topicList, 						// The list of titles as initialised above
		domParent,						// DOM element to which all progress bars, labels etc are appended
		controlsContainer,					// DOM element which contains all control elements
		playButton,						// DOM element for controls: play button
		toStartButton						// DOM element for controls: back to start button
	){
		
		var running = false;
		var enhanceId = 0;
		
		topicList = enhanceTopicList(topicList, 0, null);
		//console.log(topicList);
		
		// Total duration of the presentation - Sum of all durations in topicList
		var overallTime = 0;
		for(topic in topicList){
			overallTime += topicList[topic].duration;
		}
		
		// controls tracks mouse events for the controls box
		var controls = new Controls(
			controlsContainer,
			playButton,
			toStartButton
		);
		
		// The current topic in topicList
		var currentTopicId = 0
		
		
		/*
		*	Adds various attributes like the element's layer or its parent as well as the total sum of sub-elements to topicList.
		*/
		function enhanceTopicList(toEnhance, layer, parent){
			var currentlyEnhancing;
			for(var topic in toEnhance){
				currentlyEnhancing = toEnhance[topic];
				
				currentlyEnhancing.pauseDuration = 0;
				currentlyEnhancing.id = enhanceId;
				currentlyEnhancing.layer = layer;
				currentlyEnhancing.parent = parent;
				currentlyEnhancing.subElementsDuration = 0;
				
				var colour = generateColour();
				
				currentlyEnhancing.colour = colour;
				
				enhanceId++;
				
				/*
				//console.log('currently enhancing: '+currentlyEnhancing.displayTitle);
				//console.log('enhanceId: '+currentlyEnhancing.id);
				//console.log('layer: '+currentlyEnhancing.layer);
				*/
				
				
				if(currentlyEnhancing.subElements != null && currentlyEnhancing.subElements.length > 0){
					currentlyEnhancing.subElementsDuration = calcTotalDuration(currentlyEnhancing.subElements);
					// Recursion, woooo!
					currentlyEnhancing.subElements = enhanceTopicList(currentlyEnhancing.subElements, layer+1, currentlyEnhancing);
				}
			}
			return toEnhance;
		}
		
		
		/*
		*	Generates a nice colour. returns it in rgb(r, g, b) format as a string.
		*/
		function generateColour(){
			var primaryColour = Math.floor(Math.random()*2.999);
			var secondaryColour = -1;
			if(Math.round(Math.random()) == 1){
				do{
				secondaryColour = Math.floor(Math.random()*2.999);
				}while (secondaryColour == primaryColour)
			}
			
			var r = 0;
			var g = 0;
			var b = 0;
			
			if(primaryColour == 0 || secondaryColour == 0){
				r = Math.floor(Math.random()*100 + 155);
			}
			
			if(primaryColour == 1 || secondaryColour == 1){
				g = Math.floor(Math.random()*100 + 155);
			}
			
			if(primaryColour == 2 || secondaryColour == 2){
				b = Math.floor(Math.random()*100 + 155);
			}
			
			return('rgb('+r+', '+g+', '+b+')');
		}
		
		/*
		*	Returns the total duration of all sub-elements of a listElement including the element's own duration
		*/
		function calcTotalDuration(listTopic){
			var totalDuration = 0
			
			var currentTopic;
			for(var topic in listTopic){
				currentTopic = listTopic[topic];
				totalDuration += currentTopic.duration;
				if(currentTopic.subElements != null && currentTopic.subElements.length > 0){
					totalDuration += calcTotalDuration(currentTopic.subElements);
				}
			}
			
			//console.log(totalDuration);
			return totalDuration;
		}
		
		/*
		*	Returns the element of the desired id including all its sub-elements
		*/
		function getListElementById(list, id){
			var currentTopic;
			for(var topic in list){
				currentTopic = list[topic];
				
				if(currentTopic.id == id){
					return currentTopic;
				}
				
				if(currentTopic.subElements != null && currentTopic.subElements.length > 0){
					var foundTopic = getListElementById(currentTopic.subElements, id);
					if(foundTopic != false){
						return foundTopic;
					}
				}
			}
			
			return false;
		}
		
		/*
		*	step() displays the next element in topicList.
		*	It is called after a timeout of the last topic's duration runs out.
		*/
		function step(){
			var topic = getListElementById(topicList, currentTopicId);
			var nextTopic = getListElementById(topicList, currentTopicId + 1);
			
			if(topic){
				currentTopicId++;
				
	//			displayTitleElement.html(topic.displayTitle);
				
				// Preview for the next topic
				if(nextTopic != null){
	//				nextTitleElement.html('Next: '+nextTopic.displayTitle);
				} else {
	//				nextTitleElement.html('');
				}
				
				timer = new Timer(topic, domParent);
				//setTimeout(step, topic.duration);
			}
		}
		
		// Starts or resumes execution
		function play(){
			timer.play();
		}
		
		// Pauses execution
		function pause(){
			timer.pause();
		}
		
		/*
		*	Controls handles all mouse events for the controls box.
		*/
		function Controls(
			controlsContainer,
			playButton,
			toStartButton
		){
			playButton.click(function(controlsContainer){
				if(typeof timer != 'undefined'){
					if(running){
						playButton.children('img').attr('src', './_media/_icons/play.png');
						pause();
					} else {
						playButton.children('img').attr('src', './_media/_icons/pause.png');
						play();
					}
					running = !running;
				} else {
					running = true;
					//console.log('initialising');
					step();
					playButton.children('img').attr('src', './_media/_icons/pause.png');
				}
				
				//setTimeout('controls.style.display = "none"', 1300);
			});
			toStartButton.click(function(){
				/*timer = null;
				init();*/
			});
		}
		
		return{
			step : step,
			getListElementById: getListElementById
		}
		
	}
	
	function Timer(
		topic,
		domParent
	){

		
		var date = new Date();
		topic.startTime = date.getTime();
		
		var progressBars = [];
		var lastPauseStart = false;
		
		var layerCount = topic.layer + 1;
		var topicHasSubElements = false;
		if(topic.subElements != null && topic.subElements.length > 0){
			topicHasSubElements = true;
		}
		
		if(topicHasSubElements){
			layerCount++;
		}
		
		
		initialiseProgressBars(topic);
		
		//	Appending DOM elements for progress bars
		function initialiseProgressBars(topic){
			if(topic){
				var progressBarHeight = Math.ceil(domParent.height() / layerCount);
				
				var loopingTopic = topic;
				for(var i = 0; i < layerCount; i++){
					
					var toAppend = $('<div></div>');
					toAppend.addClass('progressBarOuter');
					toAppend.height(progressBarHeight);
					toAppend.css('bottom', Math.floor(progressBarHeight*(layerCount - 1 - i)));
					
					var toAppendId = 'progressBarOuter'+i;
					
					toAppend.attr('id', toAppendId);
					
					toAppendInner = $('<div></div>');
					toAppendInner.addClass('progressBar');
					
					
					toAppend.append(toAppendInner);
					
					domParent.append(toAppend);
					progressBars.push($('#'+toAppendId));
					
					var totalDuration = millisecondsToMinutes(loopingTopic.duration + loopingTopic.subElementsDuration);
					totalDuration = totalDuration['m'] + ':' + totalDuration['s'];
					
					if(topicHasSubElements){
						progressBars[i].children().html(
							'<span class="topicLabel">'+loopingTopic.displayTitle +'</span>\
							<br />\
							<span class="topicDuration"><span class="durationLeft"></span> of '+totalDuration+'</span>'
						);
						progressBars[i].children().css('backgroundColor', loopingTopic.colour);
						if(i != 0){
							loopingTopic = loopingTopic.parent;
						}
					} else {
						progressBars[i].children().html(
							'<span class="topicLabel">'+loopingTopic.displayTitle +'</span>\
							<br />\
							<span class="topicDuration"><span class="durationLeft"></span> of '+totalDuration+'</span>'
						);
						progressBars[i].children().css('backgroundColor', loopingTopic.colour);
						loopingTopic = loopingTopic.parent;
					}
					
					$('.topicLabel').css('font-size', progressBarHeight * 0.3 + 'px');
					$('.topicDuration').css('font-size', progressBarHeight * 0.15 + 'px');
					$('.durationLeft').css('font-size', progressBarHeight * 0.25 + 'px');
				}
			}
		}
		
		// tickInterval calls tick()
		var tickInterval = null;
		play();
		
		
		// Start or resume the tick interval
		function play(){
			if(lastPauseStart){
				var date = new Date();
				var currentTime = date.getTime();
				
				var pauseDuration = currentTime - lastPauseStart;
				
				var loopingTopic = topic;
				for(var i = 0; i < layerCount; i++){
					if(!(topicHasSubElements && i == 0)){
						loopingTopic.pauseDuration += pauseDuration;
						loopingTopic = loopingTopic.parent;
					}
				}
			}
			
			tickInterval = setInterval(tick, 1);
		}
		
		// Stop the tick interval
		function pause(){
			clearInterval(tickInterval);
			
			var date = new Date();
			lastPauseStart = date.getTime();
		}
		
		/*
		*	tick() updates all timer and progress bar DOM elements.
		*/
		function tick(){
			if(topic){
				var loopingTopic = topic;
				for(var i = 0; i < layerCount; i++){
					var duration;
					if(topicHasSubElements){
						if(i == 0){
							duration = loopingTopic.duration;
						} else {
							duration = loopingTopic.duration + loopingTopic.subElementsDuration;
						}
						updateProgressBar(loopingTopic, progressBars[i], loopingTopic.startTime, duration);
						if(i != 0){
							loopingTopic = loopingTopic.parent;
						}
					} else {
						duration = loopingTopic.duration + loopingTopic.subElementsDuration;
						updateProgressBar(loopingTopic, progressBars[i], loopingTopic.startTime, duration);
						loopingTopic = loopingTopic.parent;
					}
				}
				
				var date = new Date();
				currentTime = date.getTime();
				
				if(topic.startTime + topic.pauseDuration <= currentTime - topic.duration){
					end();
					timeHelper.step();
				}
			}
		}
		
		
		/*
		*	Calculates the new width of a progressbar based on the given start time and duration and updates it.
		*/
		function updateProgressBar(topic, progressBar, startTime, duration){
			var date = new Date();
			var timePassed = date.getTime() - startTime;
			
			updateTimerElement(topic, progressBar.find('.durationLeft'), startTime, duration);
			
			progressBar.children().width(
				progressBar.width() *  (timePassed - topic.pauseDuration) / duration
			);
		}
		
		/*
		*	Calculates the new value of a timer element based on the given start time and duration and updates it.
		*/
		function updateTimerElement(topic, timerElement, startTime, duration){
			var date = new Date();
			var timePassed = date.getTime() - startTime;
			var time = millisecondsToMinutes(duration - (timePassed - topic.pauseDuration));
			timerElement.html(time['m'] + ':' + time['s']);
		}
		
		/*
		*	Returns an object with minutes and seconds based on the given millisecond value.
		*	No hours.
		*/
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
		
		// Clears the interval, removes all progress bars.
		function end(){
			domParent.empty();
			clearInterval(tickInterval);
		}
		
		return{
			end : end,
			play: play,
			pause: pause
		}
	}
	
});













