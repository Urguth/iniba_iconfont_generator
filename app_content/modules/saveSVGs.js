var fs = require('fs');
var webfontsGenerator = require('webfonts-generator');
var parseSvg = require('./parse.js');

var save = function (_arr, _svgPathArr, folder, _count, mkdirp, _name, app, client, fullUrl) {
  var count = _count;
  var arr = _arr;
  var svgPathArr = _svgPathArr;
  var name = _name;

  function fileSaved() {
    count = 0;
    mkdirp('app_content/output/' + folder, function (err) {
      if (err) return console.log(err);
      webfontsGenerator({
        files: svgPathArr,
        fontName: name,
        html: false,
        dest: 'app_content/output/' + folder
      }, function (error) {
        if (error) console.log('Fail!', error)
        else parseSvg(fs, 'app_content/output/' + folder + '/' + name + ".svg", arr, mkdirp, folder, name, app, client, fullUrl);
      })
    });
  }

  function saveFiles() {
    fs.writeFile('app_content/svg/' + folder + '/' + arr[count][1], arr[count][0], function (err) {
      if (err) return console.log(err);
      fs.exists('app_content/svg/' + folder + '/' + arr[count][1], function (exists) {
        if (exists) {
          svgPathArr.push('app_content/svg/' + folder + '/' + arr[count][1]);
          count === arr.length - 1 ? fileSaved() : [count++, saveFiles()];
        }
      })
    })
  }
  saveFiles();
}

module.exports = save