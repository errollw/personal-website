
// add margin so last article reaches top of page
function pad_last_item(){

	var view_h = $(window).height();
	// var $last_h1 = $('section>h1:last-of-type');
	// var $last_h2 = $('section>h2:last-of-type');
 
	// var bottom_of_lowest_header = Math.max($last_h1.offset().y, $last_h2.offset().y);

	$('section:last-child').css('margin-bottom', view_h);
}

function init_index(){

	// loop through each h1 and h2 article and add to index
	$('section>h1, section>h2').each(function(index){

		console.log($(this))

		var $target = $(this),
			$item_text = $('<span>').text($target.text()),
			$index_item = $('<a>').text($target.text());

		$index_item.attr('href','#testid')

		// 	// add spacers between h1s
		// 	if ($target.is('h1') && index > 0)
		// 		$index_list.append($('<li>', {class: 'spacer'}));

		// 	// make h2s a bit smaller
		// 	if ($target.is('h2'))
		// 		$index_item.addClass('subitem');

		$('#index-list').append($index_item);

		// 	$index_item.click(function(){
		// 		$.scrollTo($target, {
		// 			'duration': SCROLL_DURATION,
		// 			'offset': $target.is('h1') ? -H1_PADDING_PX : -H2_PADDING_PX
		// 		});
		// 	});
		// });

		// // add spacer between normal index and index-pullout links
		// $index_list.append($('<li>', {class: 'spacer'}));

	});

	// add extra index-pullout links
	$('a.index-pullout').each(function(index){

		var href = $(this).attr('href');
			$item_text = $('<a href='+href+'>').text($(this).text());
			$index_item = $('<li>', {class : "index-pullout"});

		$index_list.append($index_item.append($item_text));
	});

	
}


function init_nav(){

	// callback function to highlight visited page
	function callback(){

		// loop though all nav links, add '.toggled' if url includes href
		$('nav a').each(function(){
			var href = $(this).attr('href');
			href = href.replace(/[\\]/g,"");	// strip punctuation
			console.log(href)
			if (document.URL.indexOf(href) !== -1)
				$(this).addClass('toggled')
		});
	}

	$('#nav-list').load('nav.html')

	
}

function resize_page(){
	pad_last_item();

	$('#index-list').css('left', $('section').offset().left + $('section').outerWidth());
	$('#nav-list').css('left', $('section').offset().left - $('#nav-list').width());
}

//Runs once page is loaded
$(function () {

	init_nav();
	init_index();

	$(window).resize(_.debounce(resize_page, 50));
	resize_page();
});