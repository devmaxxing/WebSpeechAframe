var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?";
var keyAPI = "trnsl.1.1.20180720T145714Z.8dca8fdab5b97385.c5fea43191927e8cec35dd294475dbaa79dc17c1";

var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Türkçe',          ['tr-TR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['Lingua latīna',   ['la']]];

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

    // console.log('test');
    const select_language = document.querySelector("#language-select");
    for (var i = 0; i < langs.length; i++) {
        select_language.appendChild(new Option(langs[i][0], i));
    }
    select_language.value=6;
    select_language.addEventListener('change', (e) => {
        console.log(langs[e.target.value][1][0]);
        document.querySelector('#text').setAttribute('web-speech-display', {lang: langs[e.target.value][1][0]});
    });
};
