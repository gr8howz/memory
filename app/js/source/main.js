(function(){
	'use strict';

	$(document).ready(initialize);

	var gameTimeAtStart = 60;

	var clockTime;
	var timer;
	var pictures;
	var matchesLeft;
	var playerMayTurnCard;
	var chosenCards = [];
	var $startButton;
	var $clock;
	var $gameGrid;
	var isGameInSession;
	var audio = new Audio('media/1.mp3');

	function initialize()
	{
		initializePictures();
		$startButton = $('#start');
		$clock = $('#clock');
		$gameGrid = $('#gameGrid tbody');
		$startButton.click(start);
		//$('#animate').click(animate);
	}

	function start()
	{
		audio.play();

		isGameInSession = true;
		// Stop listening for start
		$startButton.off('click');
		// Reset clock
		setClock(gameTimeAtStart);
		// Shuffle for a new game
		shuffle();

		/* The player must find every match to win.
		Number of matches = 1/2 number of pictures
		*/
		matchesLeft = pictures.length/2;
		playerMayTurnCard = true;

		// Begin the countdown
		timer = setInterval(updateClock, 1000);
		// Listen for clicks on the cards
		$gameGrid.on('click', '.flipper', makeMove);
	}

	function makeMove()
	{

			$(this).addClass('faceUp');
			flipUp($(this));
			var matchedCardCount = pictures.length - 2*matchesLeft;
			var cardsUpAll = $('.flipper.faceUp');
			var cardsUp = cardsUpAll.length - matchedCardCount;
			switch(cardsUp)
			{
				case 0:
					break;
				case 1:
					chosenCards[0] = $(this).attr('id');
					break;
				case 2:
					playerMayTurnCard = false;
					chosenCards[1] = $(this).attr('id');
					debugger;
					var src1 = $('#'+chosenCards[0]+' .front').attr('src');
					var src2 = $('#'+chosenCards[1]+' .front').attr('src');
					debugger;
					if(src1 === src2)
					{
						setTimeout(matchFound, 500);
					}
					else
					{
						setTimeout(badMoveRecover, 1000);
					}
					break;
				default:
					/* Two cards should never be up at once if a
					move is being made. End the game.
					*/
			}
		}
	}

	function matchFound()
	{
		if(--matchesLeft <= 0)
		{
			gameOver(true);
		}
		else
		{
			prepForNextMove();
		}
	}

	function badMoveRecover()
	{
		chosenCards.forEach(function(id)
		{
			debugger;
			$('#'+id).removeClass('faceUp');
		});
		prepForNextMove();
	}

	function prepForNextMove()
	{
		chosenCards = [];
		playerMayTurnCard = true;
	}

	function flipUp($card)
	{
		if(playerMayTurnCard)
		{
			$card.addClass('faceUp');
		}
	}

	function initializePictures()
	{
		var pictureDir = 'media/images/panels/';
		var pictureNames = ['gus.jpg',
												'hank.jpg',
												'pete.jpg',
												'jesse.jpg',
												'unclejack.png',
												'mike.jpg',
												'saul.jpg',
												'skylar.jpg',
												'walt.jpg',
												'waltjr.jpg'
		];
		pictures = [];
		for(var i = 0; i < pictureNames.length; ++i)
		{
			pictures.push(pictureDir + pictureNames[i]);
		}
		pictures = pictures.concat(pictures);
	}

	function shuffle()
	{
		// Make sure every card is face down
		$('.flipper').removeClass('faceUp');

		var orderedPics = [].concat(pictures);

		for(var i = orderedPics.length; i > 0; --i)
		{
			var index = Math.floor((Math.random() * i));
			$('#panel'+(i-1)+' .front').attr('src', orderedPics[index]);
			orderedPics.splice(index, 1);
		}
	}

	function setClock(newTime)
	{
		clockTime = (newTime > 0) ? newTime : 0;
		$clock.text(clockTime);
	}

	function updateClock()
	{
		setClock(--clockTime);
		if(clockTime <= 0)
		{
			gameOver(false);
		}
	}

	function gameOver(isWon)
	{
		if(isGameInSession)
		{
			if(isWon)
			{
				alert('You win!');
			}
			else
			{
				alert('Game Over');
			}
		}
		isGameInSession = false;
		$gameGrid.off('click');
		$('.flipper').removeClass('faceUp');
		clearInterval(timer);
	}

	// function animate()
	// {
	// 	$('.flipper').toggleClass('faceUp');
	// }

})();
