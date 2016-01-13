
// ###############################
// ### START STAR SYMBOL SETUP ###
// ###############################

// setup gradient stops for each type of star
var stops_p = [ ['white', 0], ['white', 0.3], ['#af6483', 0.4], ['black', 1] ], // basic purple star
	stops_b = [ ['white', 0], ['white', 0.3], ['#8397cc', 0.4], ['black', 1] ], // basic blue star
	stops_o = [ ['white', 0], ['white', 0.3], ['#c88966', 0.4], ['black', 1] ], // basic orange star
	stops_cr_o = [ ['white', 0], ['white', 0.1], ['#b8b251', 0.2], ['black', 1] ]; // cross star outer

// create actual gradients and Colors for star
var grad_p = new Gradient(stops_p, true), 
	grad_b = new Gradient(stops_b, true), 
	grad_o = new Gradient(stops_o, true), 
	grad_cr_o = new Gradient(stops_cr_o, true);

var grad_p_col = new Color(grad_p, [0, 0], [1, 0]),
	grad_b_col = new Color(grad_b, [0, 0], [1, 0]),
	grad_o_col = new Color(grad_o, [0, 0], [1, 0]),
	grad_cr_o_col = new Color(grad_cr_o, [0, 0], [6, 0]);

// create star paths for turning into symbols
var star_p = new Path.Circle({ center: [0, 0], radius: 1,
	                           fillColor: grad_p_col }),
	star_b = new Path.Circle({ center: [0, 0], radius: 1,
	                           fillColor: grad_b_col }),
	star_o = new Path.Circle({ center: [0, 0], radius: 1,
	                           fillColor: grad_o_col }),
	star_cr_o = new Path.Star({ center: [0, 0],
	                         points: 4,
	                         radius1: 0.3,
	                         radius2: 6,
	                         fillColor: grad_cr_o_col});

//make symbols out of star paths
var star_sym_p = new Symbol(star_p);
var star_sym_b = new Symbol(star_b);
var star_sym_o = new Symbol(star_o);
var star_sym_cr_o = new Symbol(star_cr_o);

// #############################
// ### END STAR SYMBOL SETUP ###
// #############################

var stars, num_stars, vortexCenter;

function clear_stars(){
	for (var i = 0; i < num_stars; i++) {
		stars[i].remove();
	}
	stars = [];
	num_stars = 0;
}

function init_stars(){

	clear_stars();

	// don't make stars on mobile, it's too intense
	if (view.size.width < 480) return;

	// The amount of stars we want to make:
	num_stars = Math.min(400,view.size.width/3);

	var offset_x = document.getElementById("clock").offsetWidth/2 + document.getElementById("pageTitle").offsetLeft;
	var offset_y = document.getElementById("pageTitle").offsetTop + document.getElementById("pageTitle").offsetHeight/2;

	var w = Math.min(1088, view.size.width);

	vortexCenter = new Path.Circle({
		center: [view.size.width-offset_x, offset_y],
		radius: 120
	});

	// Place the stars
	stars = [];
	for (var i = 0; i < num_stars; i++) {

		// The start position is a random point in the view
		var c = Point.random() * view.size;

		var star;

		if (Math.random() > 0.96) {			// cross stars are particularly rare
			star = star_sym_cr_o.place(c);
			star.rotate(45);
			star.cross = true;
		} else {
			var choice = Math.floor(Math.random()*3);
			if (choice == 0) star = star_sym_p.place(c);
			if (choice == 1) star = star_sym_b.place(c);
			if (choice == 2) star = star_sym_o.place(c);
		}

		var star_scale = Math.random()*2.5+1;
		star.star_scale = star_scale;
		star.scale(star_scale);
		stars.push(star);
	}
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {

	// don't animate on mobile, it's too intense
	if (view.size.width < 480) return;

	var star, d, spd_suck, spd_rotate;

	// Run through the active layer's children list and change
	// the position of the placed symbols:
	for (var i = 0; i < num_stars; i++) {

		star = stars[i];

		if (star.opacity < 1) star.opacity += 0.05;

		d = vortexCenter.position - star.position;

		spd_suck = 500 * 1/(d.length+200) * star.star_scale;

		star.position += d.normalize(spd_suck);

		// if the star has been sucked up, replace it randomly
		if (d.length < 20) {
			star.position = Point.random() * view.size;
			star.opacity = 0;
		}

		// if the start is OOB, translate its position
		if (star.position.y < -10)
			star.position.y = view.size.height;
		if (star.position.y > view.size.height + 10)
			star.position.y = 0;

		spd_rotate = 200 * 1/(d.length) * (star.star_scale/3);

		star.rotate(spd_rotate, vortexCenter.position)

		// un-rotate the cross shaped stars
		if (star.cross) star.rotate(-spd_rotate, star.position);
	}
}

function onResize(event) {
	init_stars();
}