
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
					duration: 1 * factor,
					subElements: [
						{
							displayTitle: 'Things and Stuff',
							duration: 2 * factor
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
	
	var timeHelper = new TimeHelper(
		itemList,
		$('#remainingTime'),
		$('#overallRemainingTime'),
		$('#displayTitle'),
		$('#nextTitle'),
		$('#itemProgressBar'),
		$('#mainProgressBar'),
		$('#playButton'),
		$('#toStartButton')
	);

	
	/*
	*	Main object, creates a Timer object.
	*/
	function TimeHelper(
		itemList, 						// The list of titles as initialised above
		remainingTimeElement,			// DOM element to display the current title's remaining time
		overallRemainingTimeElement,	// DOM element to display the total remaining time
		displayTitleElement,			// DOM element for the current title
		nextTitleElement,				// DOM element for the next title
		itemProgressBarElement,			// DOM element for the current title's progress bar 
		mainProgressBarElement,			// DOM element for the overall time progress bar
		playButton,						// DOM element for controls: play button
		toStartButton					// DOM element for controls: back to start button
	){
		
		var running = false;
		
		itemList = enhanceItemList(itemList);
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
		var timer = new Timer(
			overallTime,
			remainingTimeElement,
			overallRemainingTimeElement,
			itemProgressBarElement,
			mainProgressBarElement
		);
		
		// The current item in itemList
		var currentItemId = 0
		
		step();
		
		
		function enhanceItemList(toEnhance){
			var currentlyEnhancing;
			for(var item in toEnhance){
				currentlyEnhancing = toEnhance[item];
				
				currentlyEnhancing.timePaused = 0;
				console.log('currently enhancing: '+currentlyEnhancing.displayTitle);
				if(currentlyEnhancing.subElements != null && currentlyEnhancing.subElements.length > 0){
					currentlyEnhancing.subElementsDuration = calcTotalDuration(currentlyEnhancing.subElements);
					currentlyEnhancing.subElements = enhanceItemList(currentlyEnhancing.subElements); // Recursion, woooo!
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
		
		/*
		*	step() displays the next element in itemList.
		*	It is called after a timeout of the last item's duration runs out.
		*/
		function step(){
			var item = itemList[currentItemId];
			var nextItem = itemList[currentItemId + 1];
			
			// All elements in the list have been displayed. The presentation is over.
			if(item == null){
				timer.end();
				return;
			} else {
				currentItemId++;
				
				displayTitleElement.html(item.displayTitle);
				
				// Preview for the next item
				if(nextItem != null){
					nextTitleElement.html('Next: '+nextItem.displayTitle);
				} else {
					nextTitleElement.html('');
				}
				
				timer.setItemTime(item.duration);
				setTimeout(step, item.duration);
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
				if(running){
					pause();
					playButton.children('img').attr('src', './_media/_icons/play.png');
				} else {
					play();
					playButton.children('img').attr('src', './_media/_icons/pause.png');
				}
				running = !running;
			});
		}
		
	}
	
	function Timer(
		overallTime,					// Total time of the presentation
		remainingTimeElement,			// DOM element to display the current title's remaining time
		overallRemainingTimeElement,	// DOM element to display the total remaining time
		itemProgressBarElement,			// DOM element for the current title's progress bar 
		mainProgressBarElement			// DOM element for the overall time progress bar
	){
		// The current item's duration in milliseconds
		var itemTime = 0;
		// Timestamp of the current item's start
		var itemStartTime = 0;
		
		var date = new Date();
		// Timestamp of the presentation's start
		var overallStartTime = date.getTime()
		
		// Calls tick() every 30 milliseconds
		var tickInterval = null;
		
		
		// Start or resume the tick interval
		function play(){
			tickInterval = setInterval(tick, 30);
		}
		
		// Stop the tick interval
		function pause(){
			clearInterval(tickInterval);
		}
		
		/*
		*	tick() updates all timer and progress bar DOM elements.
		*/
		function tick(){
			if(itemStartTime != 0){
				updateProgressBar(itemProgressBarElement, itemStartTime, itemTime);
				updateTimerElement(remainingTimeElement, itemStartTime, itemTime);
				updateProgressBar(mainProgressBarElement, overallStartTime, overallTime);
				updateTimerElement(overallRemainingTimeElement, overallStartTime, overallTime);
			}
		}
		
		
		/*
		*	Calculates the new width of a progressbar based on the given start time and duration and updates it.
		*/
		function updateProgressBar(progressBar, startTime, duration){
			var date = new Date();
			var timePassed = date.getTime() - startTime;
			
			progressBar.width(
				progressBar.parent().width() *  timePassed / duration
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
		
		function setItemTime(newItemTime){
			var date = new Date();
			itemStartTime = date.getTime();
			itemTime = newItemTime;
		}
		
		// Clears the interval.
		function end(){
			clearInterval(tickInterval);
		}
		
		return{
			setItemTime : setItemTime,
			end : end,
			play: play,
			pause: pause
		}
	}
	
});













