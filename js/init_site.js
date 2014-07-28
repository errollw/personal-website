
// add margin so last article reaches top of page
function pad_last_item(){

	var view_h = $(window).height();
	// var $last_h1 = $('section>h1:last-of-type');
	// var $last_h2 = $('section>h2:last-of-type');
 
	// var bottom_of_lowest_header = Math.max($last_h1.offset().y, $last_h2.offset().y);

	$('section:last-child').css('margin-bottom', view_h);
}

function init_index(){

	$('body').prepend($('<nav/>').attr('id','index-list'));

	$('#index-list').append($('<h1/>').text('This page'));
	$('#index-list').append($('<div/>').attr('id','list-this-page'));

	// add each h1 and h2 in sections to 'this page'
	$('section>h1, section>h2').each(function(index){

		var target_id = $(this).text().replace(/ +/g,'_').toLowerCase()
		$(this).attr('id',target_id);

		var $target = $(this),
			$index_item = $('<a>').text($target.text());

		$index_item.attr('href','#'+target_id)
		$index_item.addClass(this.localName)

		$('#list-this-page').append($index_item);
	});

	$('#index-list').append($('<h2/>').text('Links'));
	$('#index-list').append($('<div/>').attr('id','list-links'));

	// add extra index-pullout links
	$('section a.p-out').each(function(index){

		var href = $(this).attr('href');
		var $pullout_link = $('<a href='+href+'>').text($(this).text());
		$pullout_link.addClass('p-out');

		console.log($(this).data())
		if ($(this).data('pOutName')){
			$pullout_link.text($(this).data('pOutName'))
		}

		$('#list-links').append($pullout_link);
	});

	
}


function init_nav(){

	$('body').prepend($('<nav/>').attr('id','nav-list'));

	// // callback function to highlight visited page
	// function callback(){

	// 	// loop though all nav links, add '.toggled' if url includes href
	// 	$('nav a').each(function(){
	// 		var href = $(this).attr('href');
	// 		href = href.replace(/[\\]/g,"");	// strip punctuation
	// 		console.log(href)
	// 		if (document.URL.indexOf(href) !== -1)
	// 			$(this).addClass('toggled')
	// 	});
	// }

	$('#nav-list').load('/nav.html')
	
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

	// if (window.location.hash) {
	//     window.scrollTo(20, 0);
	// }

	$(window).resize(_.debounce(resize_page, 50));
	resize_page();
});