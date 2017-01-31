var zipFolder = require('zip-folder');
var rmdir = require('rmdir');
var http = require('http')

var parseSvg = function (fs, path, array, mkdirp, folder, fontName, app, client, fullUrl) {
  var previewArr = [];
  var html = '';
  var css = '';

  function zipFolderAndSave() {
    zipFolder('app_content/output/' + folder, 'app_content/output/' + folder + '_iconfont' + '.zip', function (err) {
      if (err) console.log(err);
      rmdir('app_content/output/' + folder, function (errDir) {
        if (errDir) return console.log(errDir);
        var file = fullUrl + '/output/' + folder + '_iconfont' + '.zip';
        client.emit('news', {
          link: file
        });
      });
    });
  }

  function stringifyArray(sHtml) {
    var str = '[';
    for (var i = 0; i < previewArr.length; ++i) {
      str += '["';
      str += previewArr[i].toString().split(',').join('","');
      str += '"]';
      if (i !== previewArr.length - 1) str += ',';
    }
    str += '];';
    return sHtml.replace('iconFontArr', 'iconFontArr = ' + str);
  }

  function saveHtmlPreview() {
    fs.readFile('./app_content/modules/templete/index.html', 'utf8', function (htmlErr, htmlData) {
      if (htmlErr) return console.log(htmlErr);
      html = htmlData.split('font_style').join('../' + fontName + '.css');
      fs.readFile('./app_content/modules/templete/fg_style.css', 'utf8', function (cssErr, cssData) {
        if (cssErr) return console.log(cssErr);
        css = cssData;
        mkdirp('app_content/output/' + folder + '/' + '_preview', function (err) {
          if (err) return console.log(err);
          fs.writeFile('app_content/output/' + folder + '/' + '_preview/fg_style.css', css, function (writeCssErr) {
            if (writeCssErr) return console.log(writeCssErr);
            fs.writeFile('app_content/output/' + folder + '/' + '_preview/index.html', stringifyArray(html), function (writeHtmlErr) {
              if (writeHtmlErr) return console.log(writeHtmlErr);
              zipFolderAndSave();
            })
          })
        })
      })
    })
  }

  function loadSvg() {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) return console.log(err);
      for (var i = 0; i < array.length; ++i) {
        var name = array[i][1].substr(0, array[i][1].length - 4);
        previewArr.push([name, '.icon-' + name, String(data.substring(data.indexOf(name) + name.length + 20, data.indexOf(name) + name.length + 24)).toLowerCase(), 'Najaky popis pro vyuziti icony', 'http://www.google.com']);
      }
      saveHtmlPreview();
    });
  }

  rmdir('app_content/svg/' + folder, function (err, dirs, files) {
    if (err) return console.log(err);
    loadSvg();
  });

}

module.exports = parseSvg