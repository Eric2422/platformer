// handles drawing
class Graphics {
  // scale is used to resize to account for varying device dimensions
  static scale = screen.availWidth / 1920;

  //initializes canvas
  static canvas = document.getElementById('canvas');

  // gets ctx, which contains drawing tools
  static ctx = this.canvas.getContext('2d');
}

export { Graphics };
