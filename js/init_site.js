var H1_PADDING_PX = 32,
	H2_PADDING_PX = 42,
	SCROLL_DURATION = 200;


function resize_page(){

	// adjust height so '.square' items are so
	$('.square').each(function(i){
		$(this).height($(this).width());
	});

	// add margin so last article reaches top of page
	var view_h = $(window).height(),
		$last_art = $('section>article:last-child, section>aside:last-child');
		extra_pad = $last_art.is('h1') ? H1_PADDING_PX : H2_PADDING_PX
	$last_art.css('margin-bottom', view_h-$last_art.height() - extra_pad);
}


function init_index(){

	// find unordered-index list
	var $index_list = $('#index_list')

	// loop through each upper level h1 article and add to index
	$('article h1, article h2').each(function(index){

		var $target = $(this);
			$item_text = $('<span>').text($target.text());
			$index_item = $('<li>');

		// add spacers between h1s
		if ($target.is('h1') && index > 0)
			$index_list.append($('<li>', {class: 'spacer'}));

		// make h2s a bit smaller
		if ($target.is('h2'))
			$index_item.addClass('subitem');

		$index_list.append($index_item.append($item_text));

		$index_item.click(function(){
			$.scrollTo($target, {
				'duration': SCROLL_DURATION,
				'offset': $target.is('h1') ? -H1_PADDING_PX : -H2_PADDING_PX
			});
		});
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

	$('nav').load('/nav.html', callback);	
}


//Runs once page is loaded
$(function () {

	init_nav();
	init_index();

	$(window).resize(resize_page);
	resize_page()
});