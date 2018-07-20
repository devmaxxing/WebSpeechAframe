AFRAME.registerComponent('web-speech-display', {
    schema: {
      lang: {type: 'string', default: 'en'},
      interimResults: {type: 'boolean', default: true},
      timeout: {type: 'number', default: 5}
    },
  
    init: function () {
      easyrtc.enableMicrophone(false);
      let data = this.data;
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if (isChrome) {
        this.recognizer = new webkitSpeechRecognition();
      } else {
        this.recognizer = new SpeechRecognition();
      }
      
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
      console.log('Begin Speaking');
      this.recognizer.start();
    },

    displayResult: function(event) {
      console.log('displayresults');
      var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?";
      var keyAPI = "trnsl.1.1.20180720T145714Z.8dca8fdab5b97385.c5fea43191927e8cec35dd294475dbaa79dc17c1";

      if (event.results.length > 0) {
          var result = event.results[event.results.length-1];
          if(result.isFinal) {
            //translation starts
            var textApi = result[0].transcript
            var langApi = 'en'
            var data = "key=" + keyAPI + "&text=" + textApi + "&lang=" + langApi;
            var xhr = new XMLHttpRequest()
            xhr.open("POST",url,true);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(data);
            xhr.onreadystatechange = () => {
              console.log('flag1')
              if (xhr.readyState==4 && xhr.status==200) {
                  var res = xhr.responseText;
                  var json = JSON.parse(res);
                  console.log('flag3')
                  if(json.code == 200) {
                    console.log('flag4')
                    console.log("Translation Results: " + json.text[0]);
                    this.el.setAttribute('text', {value: json.text[0]});
                    if (this.timeout) {
                      clearTimeout(this.timeout);
                    }
                    this.timeout = setTimeout(()=>{
                      this.el.setAttribute('text', {value: ''});
                    }, this.data.timeout * 1000);
                  }
                  else {
                    console.log("Error Code: " + json.code);
                  }
              }
            }
              this.el.setAttribute('text', {value: result[0].transcript});
              if (this.timeout) {
                clearTimeout(this.timeout);
              }
              this.timeout = setTimeout(()=>{
                this.el.setAttribute('text', {value: ''});
              }, this.data.timeout * 1000);
              console.log("Pre-Translate: " + result[0].transcript);
          }
      }
    }
  });