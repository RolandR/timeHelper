
/**
*	@author Roland Rytz
*/

$(document).ready(function(){
	
	// Durations in itemList are multiplied by factor. Used mostly for debug purposes, set 1000 for seconds.
	var factor = 1000;
	
	// Array of all titles to be displayed as well as their durations
	var itemList = [
		{
			displayTitle: 'Example Presentation',
			duration: 4 * factor,
			subElements: [
				{
					displayTitle: 'Intro',
					duration: 5 * factor
				},
				{
					displayTitle: 'Say something',
					duration: 2 * factor
				},
				{
					displayTitle: 'More stuff',
					duration: 4 * factor,
					subElements: [
						{
							displayTitle: 'Things and Stuff',
							duration: 5 * factor
						},
						{
							displayTitle: 'Other Things and Stuff',
							duration: 0 * factor,
							subElements: [
								{
									displayTitle: 'SubThings and SubStuff',
									duration: 5 * factor
								},
								{
									displayTitle: 'Other SubThings and SubStuff',
									duration: 3 * factor
								}
							]
						},
						{
							displayTitle: 'Owoewpwepohwtoeiwerogh',
							duration: 5 * factor
						}
					]
				},
				{
					displayTitle: 'The end',
					duration:  7 * factor
				}
			]
		}
	];
	
	var timeHelper = null;
	init();
	
	function init(){
		timeHelper = new TimeHelper(
			itemList,
			$('#timeHelper'),
			$('#playButton'),
			$('#toStartButton')
		);
	}

	
	/*
	*	Main object, creates a Timer object.
	*/
	function TimeHelper(
		itemList, 						// The list of titles as initialised above
		domParent,						// DOM element to which all progress bars, labels etc are appended
		playButton,						// DOM element for controls: play button
		toStartButton					// DOM element for controls: back to start button
	){
		
		var running = false;
		var enhanceId = 0;
		
		itemList = enhanceItemList(itemList, 0, null);
		console.log(itemList);
		
		// Total duration of the presentation - Sum of all durations in itemList
		var overallTime = 0;
		for(item in itemList){
			overallTime += itemList[item].duration;
		}
		
		// controls tracks mouse events for the controls box
		var controls = new Controls(
			playButton,
			toStartButton
		);
		
		// timer updates the DOM elements remainingTimeElement, overallRemainingTimeElement, itemProgressBarElement and mainProgressBarElement.
		/*var timer = new Timer(
			itemList
			//overallTime,
			//remainingTimeElement,
			//overallRemainingTimeElement,
			//itemProgressBarElement,
			//mainProgressBarElement
		);*/
		
		// The current item in itemList
		var currentItemId = 0
		
		//step();
		
		
		function enhanceItemList(toEnhance, layer, parent){
			var currentlyEnhancing;
			for(var item in toEnhance){
				currentlyEnhancing = toEnhance[item];
				
				currentlyEnhancing.pauseDuration = 0;
				currentlyEnhancing.id = enhanceId;
				currentlyEnhancing.layer = layer;
				currentlyEnhancing.parent = parent;
				currentlyEnhancing.subElementsDuration = 0;
				
				enhanceId++;
				
				console.log('currently enhancing: '+currentlyEnhancing.displayTitle);
				console.log('enhanceId: '+currentlyEnhancing.id);
				console.log('layer: '+currentlyEnhancing.layer);
				
				if(currentlyEnhancing.subElements != null && currentlyEnhancing.subElements.length > 0){
					currentlyEnhancing.subElementsDuration = calcTotalDuration(currentlyEnhancing.subElements);
					currentlyEnhancing.subElements = enhanceItemList(currentlyEnhancing.subElements, layer+1, currentlyEnhancing); // Recursion, woooo!
				}
			}
			return toEnhance;
		}
		
		function calcTotalDuration(listItem){
			var totalDuration = 0
			
			var currentItem;
			for(var item in listItem){
				currentItem = listItem[item];
				totalDuration += currentItem.duration;
				if(currentItem.subElements != null && currentItem.subElements.length > 0){
					totalDuration += calcTotalDuration(currentItem.subElements);
				}
			}
			
			console.log(totalDuration);
			return totalDuration;
		}
		
		function getListElementById(list, id){
			var currentItem;
			for(var item in list){
				currentItem = list[item];
				
				if(currentItem.id == id){
					return currentItem;
				}
				
				if(currentItem.subElements != null && currentItem.subElements.length > 0){
					var foundItem = getListElementById(currentItem.subElements, id);
					if(foundItem != false){
						return foundItem;
					}
				}
			}
			
			return false;
		}
		
		/*
		*	step() displays the next element in itemList.
		*	It is called after a timeout of the last item's duration runs out.
		*/
		function step(){
			var item = getListElementById(itemList, currentItemId);
			var nextItem = getListElementById(itemList, currentItemId + 1);
			
			if(item){
				currentItemId++;
				
	//			displayTitleElement.html(item.displayTitle);
				
				// Preview for the next item
				if(nextItem != null){
	//				nextTitleElement.html('Next: '+nextItem.displayTitle);
				} else {
	//				nextTitleElement.html('');
				}
				
				timer = new Timer(item, domParent);
				//setTimeout(step, item.duration);
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
			playButton,
			toStartButton
		){
			playButton.click(function(){
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
					console.log('initialising');
					step();
					playButton.children('img').attr('src', './_media/_icons/pause.png');
				}
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
		item,
		domParent
		//overallTime,					// Total time of the presentation
		//remainingTimeElement,			// DOM element to display the current title's remaining time
		//overallRemainingTimeElement,	// DOM element to display the total remaining time
		//itemProgressBarElement,			// DOM element for the current title's progress bar 
		//mainProgressBarElement			// DOM element for the overall time progress bar
	){
		
		/*
		
		<div id="mainProgressBarOuter" class="progressBarOuter">
			<div id="mainProgressBar"  class="progressBar">
			</div>
		</div>
		
		*/
		
		var date = new Date();
		item.startTime = date.getTime();
		
		var layerCount = item.layer + 1;
		var itemHasSubElements = false;
		if(item.subElements != null && item.subElements.length > 0){
			itemHasSubElements = true;
		}
		
		if(itemHasSubElements){
			layerCount++;
		}
		
		var progressBars = [];
		var lastPauseStart = false;
		
		
		var progressBarHeight = domParent.height() / layerCount;
		
		for(var i = 0; i < layerCount; i++){
			//console.log('timer: adding stuff for layer '+timeHelper.getListElementById(item, i).layer);
			
			var toAppend = $('<div></div>');
			toAppend.addClass('progressBarOuter');
			toAppend.height(progressBarHeight);
			toAppend.css('bottom', progressBarHeight*(layerCount - 1 - i));
			
			var toAppendId = 'progressBarOuter'+i;
			
			toAppend.attr('id', toAppendId);
			
			toAppendInner = $('<div></div>');
			toAppendInner.addClass('progressBar');
			toAppend.append(toAppendInner);
			
			domParent.append(toAppend);
			progressBars.push($('#'+toAppendId));
			console.log(progressBars);
		}
		
		// Calls tick() every 30 milliseconds
		var tickInterval = null;
		play();
		
		
		// Start or resume the tick interval
		function play(){
			if(lastPauseStart){
				var date = new Date();
				var currentTime = date.getTime();
				
				var pauseDuration = currentTime - lastPauseStart;
				
				var loopingItem = item;
				for(var i = 0; i < layerCount; i++){
					if(!(itemHasSubElements && i == 0)){
						loopingItem.pauseDuration += pauseDuration;
						loopingItem = loopingItem.parent;
					}
				}
			}
			
			tickInterval = setInterval(tick, 30);
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
			if(item){
				var loopingItem = item;
				for(var i = 0; i < layerCount; i++){
					var duration;
					if(itemHasSubElements){
						if(i == 0){
							duration = loopingItem.duration;
						} else {
							duration = loopingItem.duration + loopingItem.subElementsDuration;
						}
						updateProgressBar(loopingItem, progressBars[i], loopingItem.startTime, duration);
						if(i != 0){
							loopingItem = loopingItem.parent;
						}
					} else {
						duration = loopingItem.duration + loopingItem.subElementsDuration;
						updateProgressBar(loopingItem, progressBars[i], loopingItem.startTime, duration);
						loopingItem = loopingItem.parent;
					}
				}
				
				var date = new Date();
				currentTime = date.getTime();
				
				if(item.startTime + item.pauseDuration <= currentTime - item.duration){
					end();
					timeHelper.step();
				}
			}
		}
		
		
		/*
		*	Calculates the new width of a progressbar based on the given start time and duration and updates it.
		*/
		function updateProgressBar(item, progressBar, startTime, duration){
			var date = new Date();
			var timePassed = date.getTime() - startTime;
			
			progressBar.children().width(
				progressBar.width() *  (timePassed - item.pauseDuration) / duration
			);
			progressBar.children().html(
				'<span class="itemLabel">'+item.displayTitle+'</span>'
			);
		}
		
		/*
		*	Calculates the new value of a timer element based on the given start time and duration and updates it.
		*/
		function updateTimerElement(timerElement, startTime, duration){
			var date = new Date();
			var timePassed = date.getTime() - startTime;
			var time = millisecondsToMinutes(duration - timePassed);
			timerElement.html(time['m'] + ':' + time['s']);
		}
		
		/*
		*	Returns an object with minutes and seconds based on the given millisecond value.
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
		
		/*function setItem(item){
			var date = new Date();
			item.startTime = date.getTime();
			displayedItem = item;
		}*/
		
		// Clears the interval.
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













