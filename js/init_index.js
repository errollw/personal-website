var page_padding = 32;

//Runs once page is loaded
$(function () {

	// find unordered-index list
	var $index_list = $('#index_list')

	$('article h1').each(function(index){

		var $target = $(this);
			$item_text = $('<a href="#"></a>').text($target.text());
			$index_item = $('<li>');

		$index_list.append($index_item.append($item_text));

		$index_item.click(function(){
			$.scrollTo($target, {
				'duration': 300,
				'offset': -page_padding
			});
		});
	});

});
