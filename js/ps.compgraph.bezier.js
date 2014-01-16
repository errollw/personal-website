var width = view.size.width,
	height = view.size.height;

var red = '#e4141b';

// initialize starting Bezier cubic
var vector = new Point({ angle: 0, length: width / 3 });
var pad = width / 30;
var bezier = new Path({
	segments    : [ [[pad*2, height-pad*2], null, vector.rotate(-70)*1.5],
	                [[width - pad*2, height / 2], vector.rotate(180+45), null] ],
	strokeColor : red
});

var curve = bezier.firstCurve;

// dashed lines between P0-P1 and P2-P3
var cp_line_1 = new Path.Line({ strokeColor: red });
var cp_line_2 = new Path.Line({ strokeColor: red });
cp_line_1.dashArray = cp_line_2.dashArray = [2,4];

// solid circles at each CP
var cp_circ_0 = new Path.Circle({ radius: 2, fillColor: red }),
	cp_circ_1 = new Path.Circle({ radius: 2, fillColor: red }),
	cp_circ_2 = new Path.Circle({ radius: 2, fillColor: red }),
	cp_circ_3 = new Path.Circle({ radius: 2, fillColor: red });

var dragged_cp;	// which CP is currently being dragged
var dragging;	// whether dragging is currently happening

var cps 		// a dict of all CPs (updated on move)

function update_cps(point){

	cps = { 'P0': curve.point1,
	        'P1': curve.point1 + curve.handle1,
	        'P2': curve.point2 + curve.handle2,
	        'P3': curve.point2 };

	// moved currently dragged point
	switch (dragged_cp){
		case 'P0' : curve.handle1 += (curve.point1-point);
					curve.point1  = point;                break;
		case 'P1' : curve.handle1 = point - curve.point1; break;
		case 'P2' : curve.handle2 = point - curve.point2; break;
		case 'P3' : curve.handle2 += (curve.point2-point);
					curve.point2  = point;                break;
	}

	// update curve and line positions
	cp_circ_0.position = cp_line_1.firstCurve.point1 = curve.point1;
	cp_circ_1.position = cp_line_1.firstCurve.point2 = curve.point1 + curve.handle1;
	cp_circ_2.position = cp_line_2.firstCurve.point1 = curve.point2 + curve.handle2;
	cp_circ_3.position = cp_line_2.firstCurve.point2 = curve.point2;
}

function onMouseDown(event) {

	var hit_options = { handles: true, tolerance: 10 };
	var hit_result = project.hitTest(event.point, hit_options);
	if (!hit_result) return;

	for (cp in cps){
		if ( (cps[cp]-event.point).length < hit_options.tolerance){
			dragged_cp = cp;
			dragging = true;
		}
	}
}

function onMouseUp() {
	dragging = false;
}

function onMouseMove(event) {

	if (!dragging) return false;

	// Constrain the point to drag to
	var point = event.point.clone();
	if (point.y < pad) point.y = pad;
	if (point.x < pad) point.x = pad;
	if (point.y > view.size.height - pad) point.y = view.size.height - pad;
	if (point.x > view.size.width - pad) point.x = view.size.width - pad;

	update_cps(point);
}

update_cps();

