function main() {}

main.prototype = {
  EL: function (s) {
    return document.getElementById(s);
  },
  init: function () {
    this.Events = new events(this);
    this.EL('menu').style.display = 'block';
  }
}