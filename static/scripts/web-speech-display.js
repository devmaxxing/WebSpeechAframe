AFRAME.registerComponent('web-speech-display', {
    schema: {
    },
  
    init: function () {
      var recognizer = new webkitSpeechRecognition();
      recognizer.lang = "en";
      console.log('init');
      recognizer.onresult = function(event) {
        if (event.results.length > 0) {
            var result = event.results[event.results.length-1];
            if(result.isFinal) {
                this.el.setAttribute('text', {value: result[0].transcript});
                console.log(result[0].transcript);
            }
        }
        recognizer.start();
      }
    },
  
    tick: function (time, timeDelta) {
    }
  });