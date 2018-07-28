var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?";
var keyAPI = "trnsl.1.1.20180720T145714Z.8dca8fdab5b97385.c5fea43191927e8cec35dd294475dbaa79dc17c1";

function translateSpeech(event) {
    const webSpeechDisplay = document.querySelector("#text").components['web-speech-display'];
    if (event.results.length > 0) {
        var result = event.results[event.results.length-1];
        console.log("Pre-Translate: " + result[0].transcript);
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
                    if(json.code == 200) {
                        console.log("Translation Results: " + json.text[0]);
                        webSpeechDisplay.el.setAttribute('text', {value: json.text[0]});
                    if (webSpeechDisplay.timeout) {
                        clearTimeout(webSpeechDisplay.timeout);
                    }
                    webSpeechDisplay.timeout = setTimeout(()=>{
                        webSpeechDisplay.el.setAttribute('text', {value: ''});
                    }, webSpeechDisplay.data.timeout * 1000);
                    }
                    else {
                    console.log("Error Code: " + json.code);
                    }
                }
            }
        }
    }
}

window.onload = function(e) {
    // console.log('test');
    const webSpeechDisplay = document.querySelector("#text").components['web-speech-display'];
    webSpeechDisplay.onresult = (event) => {
        console.log('test');
        if (event.results.length > 0) {
            var result = event.results[event.results.length-1];
            document.querySelector('#text').setAttribute('text', {value: result[0].transcript});
            if (webSpeechDisplay.timeout) {
              clearTimeout(webSpeechDisplay.timeout);
            }
            webSpeechDisplay.timeout = setTimeout(()=>{
              webSpeechDisplay.el.setAttribute('text', {value: ''});
            }, webSpeechDisplay.data.timeout * 1000);
        }
        console.log('Translating results...');
        translateSpeech(event);
    };
};
