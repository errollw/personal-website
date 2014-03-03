// general global variables for drawingr
var w = view.size.width,
    h = view.size.height;

var k = 4;

var Ps = [ new Point(w*0.1, h*0.8),
           new Point(w*0.1, h*0.9),
           new Point(w*0.9, h*0.9),
           new Point(w*0.9, h*0.1),
           new Point(w*0.1, h*0.1),
           new Point(w*0.1, h*0.6),
           new Point(w*0.5, h*0.8),
           new Point(w*0.7, h*0.5),
           new Point(w*0.7, h*0.3) ];

// knot vector
var ts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// colors for sections of the spline
var colors = ['red', 'orange', 'limegreen', 'dodgerblue', 'mediumblue', 'orchid']

draw_spline();
draw_control_points();

function draw_spline(){

  for (var i=k-1; i<Ps.length; i+=1){

    var path = new Path({
      strokeColor: colors[i-k+1],
      strokeWidth: 3
    });

    for (var t=ts[i]; t<=ts[i+1]; t+=0.05){
      path.add(deBoor(t, k-1, i));
    }
  }
}

function deBoor(t, m, i){
  if (m == 0) return Ps[i];
  else return deBoor(t,m-1,i-1) * (1 - get_weight(t,m,i)) +
              deBoor(t,m-1,i) *   get_weight(t,m,i)
}

function get_weight(t, m, i){
  if (ts[i+k-m]-ts[i] == 0) return 0;   // convention 0/0 = 0
  return (t-ts[i]) / (ts[i+k-m]-ts[i])
}

// ----------------------------------------------
// PAPER.JS TOOL CODE FOR DRAGGING CONTROL POINTS
// ----------------------------------------------

var clicked_cp_idx, // index of clicked control point
    dragging;       // true if user has mousedown

// Paper.js options for hittests
var hitOptions = {
  segments: false,
  stroke: false,
  fill: true,
  tolerance: 5
};

function onMouseDown(event) {
  var hitResult = project.hitTest(event.point, hitOptions);
  if (!hitResult)
    return;

  clicked_cp_idx = null;

  // loop over all control points to find nearest to mouse
  for (var i=0; i<Ps.length; i++) {

    var dist_to_mouse = (Ps[i]-event.downPoint).length,
        old_nearest_dist = (Ps[clicked_cp_idx]-event.downPoint).length;

    // a nearer control point has been found
    if (clicked_cp_idx == null || dist_to_mouse < old_nearest_dist){
      nearest_dist = dist_to_mouse;
      clicked_cp_idx = i;
    }
  }

  // set dragging to true and start shifting the point
  dragging = true;
}

function onMouseMove(event) {
  if(dragging) {
    Ps[clicked_cp_idx] += event.delta;

    // redraw entire project after moving the control point
    project.clear();
    draw_spline();
    draw_control_points();
  }
}

function onMouseUp(event) {
  dragging = false;
}

// -----------------------------------------------
// PRETTY DRAW CODE FOR MULTI-COLOR CONTROL POINTS
// -----------------------------------------------

function draw_control_points(){

  for (var i = 0; i < Ps.length; i++) {

    // dashed line between each pair of control points
    if (i < Ps.length-1) {
      var path = new Path.Line({
        from: Ps[i],
        to: Ps[i+1],
        strokeColor: 'red'
      });
      path.dashArray = [2, 2];
    }

    // each point has a white background, and up to 4 segment colors
    var clip_mask = new Shape.Circle(Ps[i].round(), 8);
    var white_circle = clip_mask.clone();
    white_circle.fillColor = 'white';
    white_circle.strokeColor = 'grey';

    // make a clipping group for color squares
    var clipped_circ = new Group([clip_mask])
    clipped_circ.clipped = true;

    // draws 4 squares for representing individual b-splines
    for (var j=0; j<4; j++){

      // do nothing for invalid colors
      if (!colors[i+j-3]) continue;

      // place each square in it's own position, away from other squares
      var rect_offset = [(j % 2)*8, (j < 2 ? 0 : 1)*8];
      var color_rect = new Shape.Rectangle({
        point: Ps[i].round() - [8,8] + rect_offset,
        size: [8, 8],
        fillColor: colors[i+j-3]
      });

      // add the square to the clipping group
      clipped_circ.addChild(color_rect);
    }

  }
}
