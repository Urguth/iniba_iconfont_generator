function dragFile(parent) {
  this.r = parent;
}

dragFile.prototype = {
  saveFile: function (self) {
    var socket = io.connect(window.location.href);
    socket.on('connect', function (data) {
      socket.emit('savefile', {arr: self.fileArr, name: self.r.EL('font-name').value});
    });
    socket.on('news', function (data) { 
        self.r.EL('drop-zone').innerHTML = "Zip soubor ulozen...";
        window.location.assign(data.link);
    });
    self.count = 0;
  },
  fileDragHover: function (self, e) {
    e.stopPropagation();
    e.preventDefault();
  },
  fileSelectHandler: function (self, e) {
    e.stopPropagation();
    e.preventDefault();
    self.fileArr = [];
    self.count = 0;
    var data = e.dataTransfer;
    self.length = data.files.length;
    for (var i = 0; i < self.length; ++i) {
      if (self.checkCorrectFile(data.files[i].name.toString().substr(-3))) {
        self.r.EL("drop-zone").innerHTML = "Loading Files";
        var reader = new FileReader();
        reader.onload = self.fileLoaded.bind(undefined, self, data.files[i].name.toString());
        reader.readAsText(data.files[i], "UTF-8");
      }
    }
  },
  fileLoadChange: function (self, e) {
    var file = self.r.EL("upload-image").files[0];
    var reader = new FileReader();
    if (self.checkCorrectFile(file.name.substr(-3))) {
      reader.onload = this.fileLoaded;
    }
    reader.readAsDataURL(file);
  },
  fileLoaded: function (self, name, e) {
    self.count++;
    self.r.EL("drop-zone").innerHTML = "Loaded " + self.count.toString() + "/" + self.length.toString() + " files...";
    self.fileArr.push([e.target.result, name]);
    if (self.count === self.length) self.saveFile(self);
  },
  checkCorrectFile: function (s) {
    if (s == "svg") {
      this.r.EL("drop-zone").innerHTML = "File is correct...";
      return true;
    } else {
      this.r.EL("drop-zone").innerHTML = "Presun SVG soubory";
      return false;
    }
  }
}