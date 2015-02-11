
// add margin so last article reaches top of page
function pad_last_item(){

	var view_h = $(window).height();
	// var $last_h1 = $('section>h1:last-of-type');
	// var $last_h2 = $('section>h2:last-of-type');
 
	// var bottom_of_lowest_header = Math.max($last_h1.offset().y, $last_h2.offset().y);

	$('section:last-child').css('margin-bottom', view_h);
}

function init_index(){

	$('#nav-div').append($('<nav/>').attr('id','index-list'));

	$('#index-list').append($('<h1/>').text('This page'));
	$('#index-list').append($('<div/>').attr('id','list-this-page'));

	// add each h1 and h2 in sections to 'this page'
	$('section>h1, section>h2').each(function(index){

		var target_id = $(this).text().replace(/ +/g,'_').toLowerCase()
		target_id = encodeURIComponent(target_id.trim())
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

	$('#nav-div').prepend($('<nav/>').attr('id','nav-list'));

	$('#nav-list').load('/nav.html', function(){

		$('#mobile-menu').click(function(){
			console.log("test")
			$('nav a, nav span').css({display: "block"});
		})

	})
}

function resize_page(){
	pad_last_item();

	// $('#index-list').css('left', $('section').offset().left + $('section').outerWidth());
	// $('#nav-list').css('left', $('section').offset().left - $('#nav-list').width());
}

// we want the underlines for headers to line up at the top of the screen
// so we don't want to scroll all the way to the top of the h2
function header_offset(target_id) {
	return ($(target_id).is('h2')) ? -32 : 0;
}

//Runs once page is loaded
$(function () {

	$('body').prepend($('<div/>').attr('id','nav-div'));
	init_nav();
	$('#nav-div').append($('<div/>').attr('id','nav-spacer'));
	init_index();

	if (window.location.hash) {
		var id = window.location.hash;
		$('html, body').stop().animate({
	        'scrollTop': $(id).offset().top - ($(id).is('h2') ? 15 : 0)
	    }, 500, 'swing');
	}

	$('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();

	    var id = this.hash;
	    $('html, body').stop().animate({
	        'scrollTop': $(id).offset().top - ($(id).is('h2') ? 15 : 0)
	    }, 200, 'swing', function () {
	        window.location.hash = id;
	    });
	});

	// $(window).resize(_.debounce(resize_page, 50));
	// resize_page();

	pad_last_item();
});