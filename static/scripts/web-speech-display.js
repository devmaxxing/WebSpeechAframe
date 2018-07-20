AFRAME.registerComponent('web-speech-display', {
    schema: {
      lang: {type: 'string', default: 'en'},
      interimResults: {type: 'boolean', default: true},
    },
  
    init: function () {
      easyrtc.enableMicrophone(false);
      let data = this.data;
      this.recognizer = new webkitSpeechRecognition();
      this.recognizer.continuous = true;
      this.recognizer.interimResults = data.interimResults;
      this.recognizer.lang = data.lang;
      console.log('init');
      this.onresult = this.displayResult;
      this.onend = this.start;
      this.recognizer.onresult = (event) => {
        this.onresult(event);
      };
      this.recognizer.onend = ()=>{this.onend();};
      this.recognizer.start();
    },
  
    update: function(previousData) {
      if(!previousData) return;
      if (previousData.lang !== this.data.lang) {
        console.log(previousData.lang);
        this.recognizer.lang = this.data.lang;
        this.recognizer.stop();
      }
      if (previousData.interimResults !== this.data.interimResults) {
        console.log(previousData.interimResults);
        this.recognizer.interimResults = this.data.interimResults;
        this.recognizer.stop();
      }
    },

    remove: function() {
      this.recognizer.stop()
    },

    start: function() {
      console.log('test');
      this.recognizer.start();
    },

    displayResult: function(event) {
      if (event.results.length > 0) {
          var result = event.results[event.results.length-1];
          if(result.isFinal) {
              this.el.setAttribute('text', {value: result[0].transcript});
              console.log(result[0].transcript);
          }
      }
    }
  });