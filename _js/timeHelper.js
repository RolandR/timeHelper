
/**
*	@author Roland Rytz
*/

$(document).ready(function(){
	
	var factor = 1000;
	
	var itemList = [
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
			duration: 3 * factor
		},
		{
			displayTitle: 'The end',
			duration:  7 * factor
		},
	];
	
	var timeHelper = new TimeHelper(
		itemList,
		$('#remainingTime'),
		$('#overallRemainingTime'),
		$('#displayTitle'),
		$('#nextTitle'),
		$('#itemProgressBar'),
		$('#mainProgressBar')
	);



	function TimeHelper(
		itemList,
		remainingTimeElement,
		overallRemainingTimeElement,
		displayTitleElement,
		nextTitleElement,
		itemProgressBarElement,
		mainProgressBarElement
	){
		
		var overallTime = 0;
		for(item in itemList){
			overallTime += itemList[item].duration;
		}
		
		var timer = new Timer(
			overallTime,
			remainingTimeElement,
			overallRemainingTimeElement,
			itemProgressBarElement,
			mainProgressBarElement
		);
		
		var currentItemId = 0
		
		step();
		
		function step(){
			var item = itemList[currentItemId];
			var nextItem = itemList[currentItemId + 1];
			if(item == null){
				timer.end();
				return;
			} else {
				currentItemId++;
				
				displayTitleElement.html(item.displayTitle);
				
				if(nextItem != null){
					nextTitleElement.html('Next: '+nextItem.displayTitle);
				} else {
					nextTitleElement.html('');
				}
				
				timer.setItemTime(item.duration);
				setTimeout(step, item.duration);
			}
		}
		
	}
	
	function Timer(
		overallTime,
		remainingTimeElement,
		overallRemainingTimeElement,
		itemProgressBarElement,
		mainProgressBarElement
	){
		var itemTime = 0;
		var itemStartTime = 0;
		
		var date = new Date();
		var overallStartTime = date.getTime()
		
		var tickInterval = setInterval(tick, 50);
		
		function tick(){
			if(itemStartTime != 0){
			
				var date = new Date();
				var timePassed = date.getTime() - itemStartTime;
				var time = millisecondsToMinutes(itemTime - timePassed);
				remainingTimeElement.html(time['m'] + ':' + time['s']);
				
				itemProgressBarElement.width(
					itemProgressBarElement.parent().width() *  timePassed / itemTime
				);
				
				var date = new Date();
				var overallTimePassed = date.getTime() - overallStartTime;
				var time = millisecondsToMinutes(overallTime - overallTimePassed);
				overallRemainingTimeElement.html(time['m'] + ':' + time['s']);
				
				mainProgressBarElement.width(
					mainProgressBarElement.parent().width() *  overallTimePassed / overallTime
				);
			}
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
		
		function setItemTime(newItemTime){
			var date = new Date();
			itemStartTime = date.getTime();
			itemTime = newItemTime;
		}
		
		function end(){
			clearInterval(tickInterval);
		}
		
		return{
			setItemTime : setItemTime,
			end : end
		}
	}
	
});













