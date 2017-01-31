function events(parent) {
  this.DragFile = new dragFile(parent);
  if (window.File && window.FileList && window.FileReader) {
    parent.EL("drop-zone").addEventListener("dragover", this.DragFile.fileDragHover.bind(undefined, this.DragFile), false);
    parent.EL("drop-zone").addEventListener("dragleave", this.DragFile.fileDragHover.bind(undefined, this.DragFile), false);
    parent.EL("drop-zone").addEventListener("drop", this.DragFile.fileSelectHandler.bind(undefined, this.DragFile), false);
  }
  parent.EL("upload-image").addEventListener("change", this.DragFile.fileLoadChange.bind(undefined, this.DragFile), false);
  /*parent.EL("drop-zone").addEventListener("click", function (e) {
    parent.EL("upload-image").click();
  }, false);*/
}

events.prototype = {};