var width = view.size.width,
	height = view.size.height;

var vector = new Point({ angle: 0, length: width / 3 });
var pad = width / 30;
var handleTexts = [];

var path = new Path();
path.segments = [ [[pad*2, height-pad*2], null, vector.rotate(-70)*1.5],
	              [[width - pad*2, height / 2], vector.rotate(180+45), null]
];
path.fullySelected = true;
var curve = path.firstCurve;

var dragged_cp;
var dragging;

var cps,
	labels = {'P0': new PointText({ content: 'P0', justification: 'center' }),
		      'P1': new PointText({ content: 'P1', justification: 'center' }),
		      'P2': new PointText({ content: 'P2', justification: 'center' }),
		      'P3': new PointText({ content: 'P3', justification: 'center' })}

function update_cps(){

	cps = { 'P0': curve.point1,
	        'P1': curve.point1 + curve.handle1,
	        'P2': curve.point2 + curve.handle2,
	        'P3': curve.point2 };

	for (cp in cps){
		labels[cp].point = cps[cp] - new Point(0,8);
	}
}

function onMouseDown(event) {

	var hit_options = { handles: true, tolerance: 10 };
	var hit_result = project.hitTest(event.point, hit_options);
	if (!hit_result) return;

	for (cp in cps){
		console.log((cps[cp]-event.point).length)
		if ( (cps[cp]-event.point).length < hit_options.tolerance){
			dragged_cp = cp;
			dragging = true;
		}
	}
}

function onMouseUp() {
	dragging = false;
	update_cps();
}


function onMouseMove(event) {

	if (!dragging) return false;

	// Constrain the point to drag to
	var point = event.point.clone();
	if (point.y < pad) point.y = pad;
	if (point.x < pad) point.x = pad;
	if (point.y > view.size.height - pad) point.y = view.size.height - pad;
	if (point.x > view.size.width - pad) point.x = view.size.width - pad;

	// moved currently dragged point
	switch (dragged_cp){
		case 'P0' : curve.handle1 += (curve.point1-point);
					curve.point1  = point;                break;
		case 'P1' : curve.handle1 = point - curve.point1; break;
		case 'P2' : curve.handle2 = point - curve.point2; break;
		case 'P3' : curve.handle2 += (curve.point2-point);
					curve.point2  = point;                break;
	}

	update_cps();
}

project.currentStyle.fillColor = 'black';

var segment = path.firstSegment;
var text = new PointText({
	point: segment.point - [0, 10],
	content: i,
	justification: 'center'
});

for (var i = 0; i < 2; i++) {
	handleTexts.push(
		new PointText({
			content: 'handleIn',
			justification: 'center'
		}),
		new PointText({
			content: 'handleOut',
			justification: 'center'
		})
	);
}

update_cps();
onMouseMove({ point: view.center - vector.rotate(-90) });

