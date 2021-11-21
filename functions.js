/**
* @author Andrew Ray
* This is the generic functions file. You will see many similarities in functioning
* naming to MooTools. I am a big fan of MooTools and prefer its syntax, which is why
* I have copied the naming conventions. However, I have not utilized the source of 
* MooTools in any way, and all of these functions and objects are hand written by me.
* This file serves to provide cross browser functionality for the rest of the script.
*/

var animations = new Array();  				// Track all the animations going on at once. Global for setTimeout animation
var isIE = document.all;					// Unlike JQuery, we have to do browser detection. One day, Resig! *shakes fist*
var MOTION = {'Normal':1, 'Smooth':2};		// AS3 like motion types. Used for tweening
var INTERVAL = {'Tween':10, 'Animation':20};// Intervals in milliseconds for setTimeout calls. Defaults are Tween:10, Animation:1
var chosenByUser = [];						// Array of all the chosen dropdown elements as they exist in the DOM, aka not wrapped in new Element()
var sp = '/assets/games/hippopotamatron/';

// Check for incompatible browsers
if(	(navigator.userAgent.indexOf('Mac') != -1 && isIE)			//IE on Mac
	|| !document.getElementById || !document.createTextNode) {	// We need to use these, make sure we can!
	alert('barf');
	window.location.href='http://andrewray.me/assets/playground/cs_project1/bad_browser.htm';
}

// Nested object of user choices
var choices = {
	'question':'What kinda hippo we talkin here?',	// The initial question
	'options':{
		'Happy Hippo':{
			'question':'How hairy is your happy hippo?',
			'options':{
				'Oh, quite hairy!':{
					'question':'We talking like ... a hippo afro?',
					'options':{
						'The most hippotastic afro!':{
							'question':'Groovy! Any special features?',
							'options':{
								'Shaved armpits':'You\'re one strange hippo enthusiast, and I\'ve seen a lot of hippo enthusiasts!',
								'Mustache':'Ah, I see you have gone for the "unreasonably hairy" model. A fine choice.'
							}
						},
						'No, just Snuffleupagusy':'Trademark infringement detected. Aborting hippo!'// An example of a final branch
					}
				},
				'Hippo pattern baldness':{
					'question':'Is that even a real condition?',
					'options':{
						'You callin me a liar?':'Well, I guess we are calling you a liar.',
						'Yup, H.P.B.!':{
							'question':'Does this make him a good swimmer?',
							'options':{
								'Nope, hippohydrophobia':'One optomistically happy hippo is now being custom built in our water-free manufacturing plant.',
								'He loves the water':'Above options and additional inflatible pool are being ordered'
							}
						}
					}
				},
				'Rump stubble':{
					'question':'Rump stubble for good, or evil?',
					'options':{
						'Angelic rump stubble':'Please allow 6 to 8 business years for Rumppleupagus to be constructed',
						'Demonic rump stubble':'The evil Captain von Rumperstub will soon be nemesising a neighborhood near you.'
					}
				}
			}
		},
		'Midlife Crisis Hippo':{
			'question':'What kind of car should he buy?',
			'options':{
				'Hippopotamobile':{
					'question':'Can he fit in it?',
					'options':{
						'It is hippo sized':'One hippo driving a state of the art hippopotamobile will soon crash through your living room window. Ten...nine...',
						'He sits AROUND the car':'Hippo and extra car body work kit are being shipped.'
					}
				},
				'Hippopotobus':{
					'question':'Does he share your bad taste in puns?',
					'options':{
						'He loves puns!':'One hippo with an extra large punny bone coming right up!',
						'He Tolerates puns':{
							'question':'Ok ... is he a hippocrite?',
							'options':{
								'I take it back. No puns':'',
								'Yes and also a hippochondriac':''
							}
						},
						'Puns give him flatulance':'We advise vacating the area immedieately.'
					}
				},
				'HippoCopter':{
					'question':'What color is the hippo copter?',
					'options':{
						'Hippo gray':'We will save time and attach the helicopter blades directly to the hippo. Hope he can land, cause he\'s heading straight for you!',
						'Hippo poo brown':'You\'re a really weird person.',
						'Jungle green':'We will save time and attach the helicopter blades directly to the hippo, then paint it green'
					}
				}
			}
		},
		'Ambidextrous Hippo':{
			'question':'How large is dual-foot?',
			'options':{
				'Portable':{
					'question':'Adorable! Does it snore?',
					'options':{
						'I guess it snores?':'Adorable portable hippo and snore breath strips',
						'Aw snoozy hippo!':'A narcoleptic hippo is just as hilarious as it sounds on paper. Try playing hot hippo: whoever catches it when it falls asleep loses, due in part to how much urine a sleeping hippo expells.'
					}
				},
				'Averagely sized':{
					'question':'With above average ambitions?',
					'options':{
						'CEhippO one day!':'A hippo with a briefcase. Cause if it had a trunk it would be an elephant. EL OH EL',
						'No, he is content':{
							'question':'Fair enough. What occupation?',
							'options':{
								'Hippotherapist':'A rather large master of hipposis',
								'Colonoscopist':'Frankly, we\'re a little unsettled by your order'
							}
						}
					}
				},
				'Sits AROUND house':{
					'question':'Boxers or breifs?',
					'options':{
						'Boxers':'The price of fabric and labor for hippo boxers with exchange rate is $43,500 USD. Order has been processed.',
						'Briefs':'We suggest that you later upgrade to boxer-briefs for the best of both worlds.',
						'Tuskless chaps':'Charge on your card will read "laundry matt bill."'
					}
				},
				'Sits wherever it wants':{
					'question':'Inflatible, steriods, or all hippo?',
					'options':{
						'Inflatible?':'Don\'t worry, it\'s a humane process. Think of it like a hippo hot air balloon, excpet it poops a lot more.',
						'Steroids':{
							'question':'You are cruel. Any deformities?',
							'options':{
								'Forked tail':'Satanapotomus',
								'Eight legs':'Arachnapotamus, easily our most terrifying product',
								'Glowing red eyes':'Dude, that\'s kind of cool. Cool and really, really unsettling. Worst nightlight ever.'
							}
						},
						'All hippo baby!':'Our largest and beefiest pole dancing hippo. Pole not included.'
					}
				}
			}
		}
	}
}

//
// HELPER AND COMMON FUNCTIONS
//

// Takes in a JSON object of choices.
function buildMenu(tree) {
	// If the tree has no options, we are on a final branch
	if(!tree.options) {
		showCompleteForm(tree);
		return;
	}
	// Remove the complete form if it's on the page
	if($('complete_form')) {
		var form = new Element($('complete_form'));
		form.tween('opacity', 1, 0, 500, function() {
			form.remove();
		})
	}
	// Create the holder div and the dropdown, and fade it in
	var holder = new Element('div')
		.setStyles({'top':((chosenByUser.length*255)+80)+'px', 'left':'20px', 'height':'190px', 'width':'400px'})
		.set({'class':'option'})
		.inject(document.body)
		.tween('opacity', 0, 1, 1000)
	
	var dropDown = new Element('select')
		.inject(holder)
		// Handle creating a new node, removing next ones, or showing the complete form
		.addEvent('change', function(event) {
			var drop = event.target;
			var value = drop.options[drop.selectedIndex].value;
			if(!value) {return}; // Do nothing if we're on "choose one"
			var nextChoice = searchChoices(value);	// Find out the next tree to send to buildMenu
			
			// If we're on the very bottom dropdown...
			if(drop.pathIndex == chosenByUser.length - 1) {
				// If we can make more dropdowns from the current selection, do so
				if(nextChoice.options) {
					disableSelectMenus();
					buildMenu(nextChoice);
				// Otherwise we're at a final branch, show the complete form (remove it first if it exists)
				} else {
					showCompleteForm(nextChoice);
				}
			// Otherwise, we need to kill some children
			} else {
				disableSelectMenus();
				var test = chosenByUser.pop();
				var i = 0;
				// Loop through all the divs...
				while(test.pathIndex > drop.pathIndex) {
					// Set a timeout to destroy them in one after another. Too many explosions at once lags
					var element = new Element(test.parentNode);
					if(test.pathIndex - 1 == drop.pathIndex) {
						// If we're on the last one to destroy, make its callback function the one that instantiates the next tree
						setTimeout(function(elem){ return function(){
							element.killWithFire(function() {
								enableSelectMenus();
								chosenByUser.push(drop);
								buildMenu(nextChoice);
							});
						}}(element), i*4000)
					} else {
						setTimeout(function(elem){ return function(){
							elem.killWithFire();
						}}(element), i*4000)
					}
					test = chosenByUser.pop();
					i++;
				}
			}
		});
	// Build the dropdown menu and store it in the array
	var question = new Element('text', tree.question).inject(holder);
	dropDown.element.pathIndex = chosenByUser.length;
	chosenByUser.push(dropDown.element);
	dropDown.element.options[0] = new Option('Choose an Option', '');

	var i=1;
	for(var branch in tree.options) {
		dropDown.element.options[i] = new Option(branch, branch);
		i++;
	}
	// Bubble in the div while its fading in
	holder.makeWithBubbles(function() {enableSelectMenus();  holder.setStyle('background-color', '#29332E');})
}

// Recursive function to search the choices for the current value. Returns the value for the found dictionary key
function searchChoices(needle, haystack) {
	if(!haystack) {haystack = choices;}
	// If it has options, compare each one to the needle
	if(haystack.options) {
		for(var field in haystack.options) {
			// We have found the needle. Return everything inside it (the next question)
			if(field == needle) {
				return haystack.options[field];
			} else if(haystack.options[field].options) {
				var found = searchChoices(needle, haystack.options[field]);
				if(found) {return found;}
			}
		}
	}
	return false;
}

// The user has reached a final branch, so compile everything in the form
function showCompleteForm(text) {
	enableSelectMenus();
	// Remove the form from the page if it exists
	if($('complete_form')) {
		var form = new Element($('complete_form'));
		form.tween('opacity', 1, 0, 500, function() {
			showCompleteForm(text);
			form.remove();
		})
		return;
	}
	var height = ((chosenByUser.length-1)*255)+80;
	var form = new Element('div')
		.set({'id':'complete_form'})
		.setStyles({'top':height+'px', 'left':'500px', 'width':'400px'})
		.tween('opacity', 0, 1, 500)
		.inject(document.body);
	
	// Build the form
	var heading = new Element('div').set({'class':'heading'}).inject(form);
		new Element('text', 'Thank you!').inject(heading);
	
	var div = new Element('div').set({'class':'final'}).inject(form);
		new Element('text', 'You have indicated the following choices:').inject(div);
		new Element('div').set({'class':'final_hippo'}).inject(div);

	var strs = [];
	div = new Element('div').set({'class':'final'}).inject(form);
		for(var x=0; x<chosenByUser.length; x++) {
			strs.push(chosenByUser[x].value);
			new Element('text', chosenByUser[x].value).inject(div);
			new Element('br').inject(div);
		}
	// Our suggestion is...
	var div = new Element('div').set({'class':'final'}).inject(form);
		new Element('text', 'We suggest:').inject(div);
		var p = new Element('p').set({'class':'suggestion'}).inject(div);
			new Element('text', text).inject(p);
	
	// Send me info form
	new Element('text', 'Send me this information!').inject(form);
	
	// All of these have keypress events to remove the red error background when typed in
	var form_holder = new Element('div').set({'class':'form'}).inject(form);
		form = new Element('form').set({'id':'form'}).inject(form_holder);
		
		var div = new Element('div').set({'class':'final'}).inject(form);
		new Element('text', 'All fields required. Will be saved to cookie.').inject(div);
		
		var label = new Element('label').set({'for':'form_name'}).inject(form);
			new Element('text', 'Name').inject(label);
		var name = new Element('input')
			.set({'type':'text', 'id':'form_name', 'value':getCookie('form_name')})
			.inject(form)
			.addEvent('keypress', function() {name.setStyle('background-color', '#29332E')});
		
		label = new Element('label').set({'for':'form_email'}).inject(form);
			new Element('text', 'Email').inject(label);
		var email = new Element('input')
			.set({'type':'text', 'id':'form_email', 'value':getCookie('form_email')})
			.inject(form)
			.addEvent('keypress', function() {email.setStyle('background-color', '#29332E')});
		
		label = new Element('label').set({'for':'form_message'}).inject(form);
			new Element('text', 'Message')
				.inject(label);
		var message = new Element('input')
			.set({'type':'text', 'id':'form_message', 'value':'I like '+strs.join(', ')})
			.inject(form)
			.addEvent('keypress', function() {message.setStyle('background-color', '#29332E')});
		
		// Submit button
		var button = new Element('input')
			.set({'type':'button', 'class':'button', 'value':'submit'})
			.addEvent('click', submitForm)
			.inject(form);
}

// Form validation
function submitForm() {
	var name = $('form_name');
	var email = $('form_email');
	var message = $('form_message');
	var error = false;
	
	if(!name.value || name.value.trim().length == 0) {
		new Element(name).setStyle('background-color', '#D4312C');
		error = true;
	}
	if(!email.value || email.value.trim().length == 0 || !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email.value)) {
		new Element(email).setStyle('background-color', '#D4312C');
		error = true;
	}
	if(!message.value || message.value.trim().length == 0) {
		new Element(message).setStyle('background-color', '#D4312C');
		error = true;
	}
	
	// We did it!
	if(!error) {
		alert('Thank you for filling out this form! A small, feral dog named "Bort" will now be dispatched to your place of residence. '
			+'He is excellent at hiding and travels by air duct.');
		setCookie('form_name', name.value);
		setCookie('form_email', email.value);
	// We didn't do it! Make some red backgrounds and fade in error text
	} else if(!$('form_error')) {
		deleteCookie('form_name');
		deleteCookie('form_email');
		var err = new Element('div').inject($('form'))
			.set({'class':'error_message', 'id':'form_error'})
			.tween('opacity', 0, 1, 500);
			new Element('text', 'Please correct the highlighted errors.').inject(err);
		setTimeout(function() {
			err.tween('opacity', 1, 0, 500, function() {err.remove()});
		}, 5000);
	}
}

// 2 AM fix for IE image preloading. This should go inside preloader
var preload_images = [];

// Loads the passed in images. Controls width of loading bar.
function Preloader(object) {
	// Set up the preloader and bar
	this.images = object.images;
	this.bar = new Element($('preload_bar'));
	this.bar.setStyle('width', '30px');
	this.bar.element.parentNode.style.width = '350px';
	this.totalLoaded = {'length':0};
	
	this.callback;
	this.bar_load = 0;
	
	// Start the preloading, and do a callback() on complete
	this.start = function(callback) {
		var me = this;
		this.callback = callback;
		// Basically loop through every image passed in and give it a loading event
		for(x=0; x<this.images.length; x++) {
			preload_images.push(new Image());
			preload_images[x].src = this.images[x];
			
			preload_images[x].onload = function() {
				if(!me.totalLoaded[this.src]) { // Who caught the event first? Load or complete? With a dictionary, doesn't matter!
					me.totalLoaded[this.src] = true;
					me.totalLoaded.length++;
				}
			}
			
			if(preload_images[x].complete) {
				if(!me.totalLoaded[preload_images[x].src]) {
					me.totalLoaded[preload_images[x].src] = true;
					me.totalLoaded.length++;
				}
			}
			
			// Looks like has some nasty issues with the image.complete not getting called in a race condition
			setTimeout(
				(function(image){ return function(){	// Fun with closure! Gotta pass in yon image
					if(image.complete) {
						if(!me.totalLoaded[image.src]) {
							me.totalLoaded[image.src] = true;
							me.totalLoaded.length++;
						}
					}
				}}(preload_images[x]))
			, 1000);
		}
		// Tell the preloader animation loop to start
		preloadAnimationLoop(this);
		return this;
	}
	return this;
}

// Control the width of the preloader bar
function preloadAnimationLoop(preloader) {
	var holder_width = parseInt(preloader.bar.element.parentNode.style.width);
	var target_width = Math.round(holder_width / preloader.images.length) * preloader.totalLoaded.length;
	var cur_width = parseInt(preloader.bar.getStyle('width'));

	// Figure out where we need to tween to. If no new images have been loaded, just call this function again in a timeout
	if(preloader.totalLoaded.length > preloader.bar_load && !(preloader.images.length == preloader.totalLoaded.length)) {
		preloader.bar_load = preloader.totalLoaded.length;
		preloader.bar.tween('width', cur_width+'px', target_width, 200, null, MOTION.Smooth);
		setTimeout(function() {preloadAnimationLoop(preloader)}, 200);
	} else if(preloader.images.length == preloader.totalLoaded.length) {
		// We're done loading, so tween to the full width and do the callback
		preloader.bar.tween('width', cur_width+'px', target_width, 200, preloader.callback, MOTION.Smooth);
	} else {
		setTimeout(function() {preloadAnimationLoop(preloader)}, 200);
	}
}

// Cross browser add event function. No remvoe event yet. Who do you think I am?!
function addEvent(element, event, triggerFunction) {
	if(document.attachEvent && isIE) { // Opera has attachEvent, but it needs the next fork, not this one, hence isIE
		//IE has "on"!
		element.attachEvent('on'+event, function(e) {
			var evt = this.event;
			evt.target = evt.srcElement;
			triggerFunction(evt);
		});
	} else {
		//Gecko does not
		element.addEventListener(event, function(event){
			triggerFunction(event)
		}, false);
	}
}

// Convert a string to camel case, "font-color" to "fontColor"
String.prototype.toCamelCase = function() {
	var str = this.replace(/([a-z])\-([a-z])/ig, '$1|$2');
	var chr = str.charAt(str.indexOf('|')+1).toUpperCase();
	return str.replace(/\|[a-z]/ig, chr);
}

// Remove trailing and leading spaces from a string
String.prototype.trim = function() {
	return this.replace(/^\s+/, '').replace(/\s+$/, '');
}

// Remove a specific element from an array
Array.prototype.remove = function(item) {
	for(var x=0; x<this.length; x++) {
		if(this[x] == item) {
			this.splice(x, 1);
			return item;
		}
	}
	return false;
}

// Round to dec decimal places, the usual way
Number.prototype.round = function(dec) {
	var result = Math.round(this*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

// Generate a random integer with bounds
function randInt(min, max) {
	if (!arguments.length) {
		min = 0; max = 100;
	}
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


//
// CLASSES AND SPECIALIZED METHODS
//

// Element 'class' for custom methods on DOM elements. Makes writing element code much easier for me
function Element(tag, nodeValue) {
	this.element;		// The actual DOM element this is wrapping around
	this.tweens = {};	// Keep track of all the styles we are tweening
	var me = this;

	// We can pass in the tag to create, or wrap a DOM node into an Element
	if(typeof tag == 'string') {
		if(tag == 'text') {
			this.element = document.createTextNode(nodeValue);
		} else {
			this.element = document.createElement(tag);
		}
	} else {
		this.element = tag;
	}
	
	// Methods to mimmick / extend default DOM element functionality. All return "this" for chaining
	this.setStyle = function() {
		if(arguments[0]=='opacity') {
			this.setOpacity(arguments[1]);
		} else {
			this.element.style[arguments[0].toCamelCase()] = arguments[1];
		}
		return this;
	};
	this.setStyles = function() {
		var str = '';
		var obj = arguments[0];
		for(var pair in obj) {
			if(pair=='opacity') {
				this.setOpacity(obj[pair]);
			} else {
				this.element.style[pair.toCamelCase()] = obj[pair];
			}
		}
		return this;
	};
	this.getStyle = function(style) {
		if(style == 'opacity') {
			return this.getOpacity();
		} else {
			return this.element.style[style.toCamelCase()];
		}
	}
	// Does what it sounds like
	this.addEvent = function(event, callback) {
		addEvent(this.element, event, callback);
		return this;
	}
	// Return the parent element, wrapped in Element class
	this.getParent = function() {
		return new Element(this.element.parentNode);
	}
	
	// Wrapper for insertBefore and elusive insertAfter functions
	this.inject = function(item, where) {
		if(item.element) {item = item.element;}
		if(where == 'after') {
			if(item.nextSibling) {
				item.insertBefore(this.element, item.nextSibling);
			} else {
				item.appendChild(this.element);
			}
		} else if(where == 'before') {
			item.parentNode.insertBefore(this.element, item);
		} else if(where == 'inside' || !where) {
			item.appendChild(this.element);
		}
		return this;
	};
	// Generic method to set anything on the element. This way I don't have to write functions for setting every possible thing.
	// e.set('property', 'value') OR e.set({'prop1':'val1', 'prop2':'val2'}). For example e.set('class', 'myClass');
	this.set = function() {
		if(arguments.length == 2) {
			val = arguments[0];
			if(arguments[0] =='innerHTML') {
				this.element.innerHTML = arguments[1];
			} else {
				if(val == 'class' && isIE) {val = 'className';} // I guess IE is 'className' and others are 'class' for setAttribute
				this.element.setAtrtribute(val, arguments[1]);
			}
		} else {
			var obj = arguments[0];
			for(var val in obj) {
				if(val =='innerHTML') {
					this.element[val] = obj[val];
				} else {
					this.element.setAttribute((val == 'class' && isIE ? 'className' : val), obj[val]);
				}
			}
		}
		return this;
	}
	// Remove the element from the DOM
	this.remove = function() {
		if(this.element.parentNode != null) {
			this.element.parentNode.removeChild(this.element);
		}
	}
	/*
	// Make this div clickable again
	this.enable = function() {
		if(this.disabled != false) {
			this.disabled.remove();
		}
		this.disabled = false;
		return this;
	}
	
	// Make this div not clickable by adding a transparent div over everything
	this.disable = function() {
		if(this.disabled == false) {
			this.disabled = new Element('div')
				.setStyles({'position':'absolute', 'top':'0', 'left':'0', 'z-index':20, 'background':'#fff', 'opacity':'.1', 'width':'2000px', 'height':'2000px'})
				.inject(this);
		}
		return this;
	}
	*/
	// Tween a style value from a start to end point over x millseconds. WILL work for opacity (which was a pain to get working),
	// will NOT work for color values.
	this.tween = function(style, start, end, time, callback, motion) {
		// Calculate everything here first
		if(!motion) {motion = MOTION.Smooth;}
		this.setStyle(style, start);
		var steps = (time / INTERVAL.Tween).round(0);
		var up_down = (parseFloat(start) > end) ? -1 : 1;
		var units = start.toString().replace(/[0-9\.]*/, '');
		
		// We can have ONE tween per style. If we re-tween the same property, make sure to remove the timeout
		if(this.tweens[style] != null) {
			clearTimeout(this.tweens[style]);
		}
		// Call the tween loop with the calculated values
		this.tweenLoop(style, start, end, parseFloat(start), time, steps, units, up_down, callback, motion);
		return this;
	}

	// Step the style value in a timeout
	this.tweenLoop = function(style, start, end, current, time, steps, units, up_down, callback, motion) {
		// Linear or exponential motion, basically. Motion.smooth has some issues over longer tween times,
		// cause I don't want to figure out how many steps it takes to go from 0 to x, dividing the increment by 2 each time
		current += up_down * (motion == MOTION.Normal ? 
			(Math.abs(end-start) / steps)  + (units ? 1 : .01 ):
			(Math.abs(current - end)/steps) + (units ? 1 : .01 )
		).round(units.length > 0 ? 0 : 2);
		this.setStyle(style, current+''+units);
		
		if(((current >= end) && up_down > 0) || ((current <= end) && up_down < 0)) {
			if(callback) {callback();}
		} else {
			me.tweens[style] = setTimeout(function() {me.tweenLoop(style, start, end, current, time, steps, units, up_down, callback, motion)}, INTERVAL.Tween);
		}
	}
	
	// One of my favoritely named functions. Makes the apperance of the div bubbling in by scaling circle PNGs with the background color
	this.makeWithBubbles = function(callback) {
		var increment = Math.round(parseInt(this.element.clientWidth) / 5);
		var bubbles = [];
		// We want 5 bubbles for good backgroun coverage, and cause it looks nicer than 4 or less
		for(var x=0; x<5; x++) {
			setTimeout(
				(function(x){ return function() {
					var left = (increment*x) + (increment / 2);
					var top = randInt(50, 150);
					var func = (x == 4) ? function() {
						for(var y=0; y<bubbles.length; y++) {
							bubbles[y].remove();
						}
						callback();
					} : null;

					// Place the bubbles along every 5th of the div at a random height
					bubbles.push(new Element('img')
						.setStyles({'position':'absolute', 'top':top+'px', 'left':left+'px', 'z-index':'-1'})
						.set({'src':sp+'circle_grow.png'})
						.tween('left', left+'px', (left-153),300)
						.tween('top', top+'px', (top-153), 300)
						.tween('width', '1px', 350, 300)
						.tween('height', '1px', 350, 300, func)
						.inject(me)
					);
				}}(x)), 45 * x);
		}
		
		return this;
	}

	// My other favoritely named function. Destory a div with explosions
	this.killWithFire = function(callback) {
		// Get info about element to destroy. Use clientWidth because style.width doesn't work if not set beforehand
		this.setStyle('overflow', 'hidden'); // Gotta hide the outlying images
		var offset = {y:parseInt(this.element.offsetTop), x:parseInt(this.element.offsetLeft)};
		var height = parseInt(this.element.clientHeight);
		var steps = Math.round(parseInt(this.element.clientWidth) / 50);

		// Steps are how many explosion "lines" there are. Creates new line from right to left every 500 ms.
		for(var x=steps; x > 0; x--) {
			setTimeout(
				(function(i){ return function(){
					explosion(((i*50)+offset.x)-128, offset.y+(height/2)-20, me.element);
				}}(x))
			, 450*(Math.abs(x-steps)));
		}
		// At the same time the last explosions are going off, fade out the div and run the callback function if we have one
		setTimeout(function() {
			me.tween('opacity', 1, 0, 50, function() {
				me.remove();
				if(callback) {callback();}
			});
		}, 450*(steps+1));
		return this;
	}
	
	// This seems to be the common way to do opacity. I've used it before, not sure who originally wrote it,
	// but I slightly modified the snippet from: http://lists.evolt.org/archive/Week-of-Mon-20070115/187466.html
	this.setOpacity = function(opacity) {
		// IE/Win
		this.element.style.filter='progid:DXImageTransform.Microsoft.Alpha(opacity='+ (opacity*100) + ');';
		
		// Safari<1.2, Konqueror
		this.element.style.KHTMLOpacity = opacity;

		// Older Mozilla and Firefox
		this.element.style.MozOpacity = opacity;

		// Safari 1.2, newer Firefox and Mozilla, CSS3
		this.element.style.opacity = opacity;
	}
	// And a custom get opacity
	this.getOpacity = function() {
		if(isIE) {
			var opacity = this.element.style.filter.replace(/^[\s\S]*\(opacity=([0-9\.]+)\)[\s\S]*$/i, '$1')
			if(opacity) {
				return  opacity / 100;
			}
		} else if(this.element.style.KHTMLOpacity) {
			// Safari<1.2, Konqueror
			return this.element.style.KHTMLOpacity;
		} else if(this.element.style.MozOpacity) {
			// Older Mozilla and Firefox
			return this.element.style.MozOpacity;
		} else {
			// Safari 1.2, newer Firefox and Mozilla, CSS3
			return this.element.style.opacity;
		}
	}
	
	return this;
}

// Create an explosion at point x,y. Generations are how many "tails" the explosion creates before dying out completely. Each explosion has 2 tails in 
// the next generation, so it's exponential. Default generations is 3 ... 5 lags pretty badly ... 10 almost crashed my computer, but it was nice to look at.
function explosion(x, y, parent, generations) {
	var offset = {'x':parseInt(parent.offsetLeft), 'y':parseInt(parent.offsetTop)};
	var circle = new Element('div')
		.inject(parent)
		.setStyles({'background':'transparent url('+sp+'circle_eat.png) top left no-repeat', 'position':'absolute',
		'top':(y - offset.y - 36)+'px', 'left':(x - offset.x - 36)+'px', 'width':'200px', 'height':'200px'});
	var ap = false;
	if(generations == undefined) {generations = 2;} // THE FASTER YOUR COMPUTER, THE HIGHER THIS CAN BE
	if(generations == 1) {
		// Make the second to last explosion the smaller one. Looks nice that way for some reason
		animations.push(new SpriteAnimation(ap ? sp+'checkers.png' : sp+'explosion_sprite_4.png', 64, 64, 256, 256, x, y, document.body));
	} else {
		animations.push(new SpriteAnimation(ap ? sp+'checkers.png' : sp+'explosion_sprite_'+randInt(1,3)+'.png', 128, 128, 512, 512, x, y, document.body));
	}
	if(animations.length == 1) { animationLoop(); }
	if(generations > 0) {
		setTimeout(function () {
			explosion(x, (y+20)-randInt(0,80), parent, generations-1); // top
		}, randInt(100, 220));
		setTimeout(function () {
			explosion((x-45)+randInt(0,90), (y+50)-randInt(0,100), parent, generations-1); // bottom right
		}, randInt(30, 90));
	}
}

// This implementation of sprite based animation uses the time tested method of a spritesheet that is cut
// into each frame in a grid image. See the containing folder for example images. This creates a div that will
// show one frame, sticks it in a parent, and launches "callback" on animation finish
function SpriteAnimation(sourceImage, width, height, sprite_width, sprite_height, x, y, parent, callback) {
	this.bg_x = 0; this.bg_y = 0;
	this.sprite_width = sprite_width;
	this.sprite_height = sprite_height;
	this.width = width;
	this.height = height;
	this.animation = new Element('div')
		.inject(parent)
		.setStyles({'position':'absolute', 'background':'transparent url('+sourceImage+') top left no-repeat scroll',
		'height':height+'px', 'width':width+'px', 'top':y+'px', 'left':x+'px', 'z-index':'9999'})
	// Remove the animation from the stack
	this.destroy = function() {
		animations.remove(this);
		this.animation.remove();
		if(callback) {
			callback();
		}
	}
	return this;
}

// Where the animation magic happens. Basically shifts the background position of a SpriteAnimation every 20 ms
function animationLoop() {
	for(var i=0; i<animations.length; i++) {
		animations[i].bg_x++;
		if(animations[i].bg_x * animations[i].width == animations[i].sprite_width) {
			animations[i].bg_x = 0;
			animations[i].bg_y++;
		}
		if(animations[i].bg_y * animations[i].height > animations[i].sprite_height) {
			animations[i].destroy();
			break;
		} else {
			animations[i].animation.setStyle('background-position', (-(animations[i].bg_x * animations[i].width))+'px '+(-(animations[i].bg_y * animations[i].height))+'px');
		}
	}
	if(animations.length > 0) {
		setTimeout(animationLoop,INTERVAL.Animation);
	}
}

// Set the disabled state of all select menus on the page
function disableSelectMenus() {
	for(var x=0; x<chosenByUser.length; x++) {
		chosenByUser[x].disabled = true;
	}
}

// Scrub the disabled state of all select menus on the page
function enableSelectMenus() {
	for(var x=0; x<chosenByUser.length; x++) {
		chosenByUser[x].disabled = null;
	}
}

// Quick and dirty selector tags
function $(id) {
	return document.getElementById(id);
}
function $$(tag) {
	return document.getElementsByTagName(tag);
}
