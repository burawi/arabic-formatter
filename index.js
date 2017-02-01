    var scope = {};

    scope.kolHuruf = 'ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىي'
    scope.abjadia = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي';
    scope.hamza = 'ءأؤإئ';
    scope.alif = 'آأإا';
    scope.harakat = {
        basit: 'َُِْ'
        ,tanween: 'ًٌٍ'
        ,shadda: 'ّ'
    };
    scope.mudud = {
        harf: 'اوي'
        ,alama: 'ٰ'
    };
    scope.noWasl = scope.alif + 'ءؤةدذرزوى';
    var rg = new RegExp('['+scope.noWasl+']','g');
    scope.mawsul = scope.kolHuruf.replace(rg,'');
    scope.mahqur = objJoin(scope.harakat) + scope.mudud.alama;

    scope.putOnPlaceFormat = function(str) {

        var formsByIndex = scope.getFormsByIndex(str);
        var res = '';
        for (var i = 0; i < str.length; i++) {
            var harf = str.charAt(i);
            if(formsByIndex.hasOwnProperty(i)){
                var form = formsByIndex[i];
                res += scope.hurufForms[harf][form];
            }else{
                res += str.charAt(i);
            }
        }
        return res;
    }

    scope.getFormsByIndex = function (str) {
        var formsByIndex = {};

        for (var i = 0; i < scope.kolHuruf.length; i++) {
            var harf = scope.kolHuruf[i];
            var harfForms = scope.hurufForms[harf];
            // initial form
            var rg = new RegExp('(^|\\s|['+scope.noWasl+'])(['+scope.mahqur+']*)'+harf+'(['+scope.mahqur+']*['+scope.kolHuruf+'])','g');
            while ((match = rg.exec(str)) != null) {
                var index = match.index+match[1].length+match[2].length;
                formsByIndex[index] = 'initial';
                rg.lastIndex -= match[0].length - 1;
            }
            // medial form
            var rg = new RegExp('(['+scope.mawsul+']['+scope.mahqur+']*)'+harf+'(['+scope.mahqur+']*['+scope.kolHuruf+'])','g');
            while ((match = rg.exec(str)) != null) {
                var index = match.index+match[1].length;
                formsByIndex[index] = 'medial';
                rg.lastIndex -= match[0].length - 1;
            }
            // final form
            var rg = new RegExp('(['+scope.mawsul+']['+scope.mahqur+']*)'+harf+'['+scope.mahqur+']*($|\\s)','g');
            while ((match = rg.exec(str)) != null) {
                var index = match.index+match[1].length;
                formsByIndex[index] = 'final';
                rg.lastIndex -= match[0].length - 1;
            }
            // isolated form
            var rg = new RegExp('(['+scope.noWasl+']['+scope.mahqur+']*)'+harf+'['+scope.mahqur+']*($|\\s)','g');
            while ((match = rg.exec(str)) != null) {
                var index = match.index+match[1].length;
                formsByIndex[index] = 'isolated';
                rg.lastIndex -= match[0].length - 1;
            }

        }

        return formsByIndex;
    }

    scope.getHarfForms = function (harf) {
        var formsIndex = 65153; // First letter in unicode block of arabic letters (isolated start end)
        var harfIndex = scope.kolHuruf.indexOf(harf);
        for (var i = 0; i < harfIndex; i++) {
            if(scope.kolHuruf[i] != 'ء'){
                if(scope.noWasl.indexOf(scope.kolHuruf[i]) > -1){// this harf is not mawsul so we advance by 2 instead of 3
                    formsIndex += 2;
                }else{
                    formsIndex += 4;
                }
            }
        }
        if(harf == 'ء'){
            var res = {
                isolated: String.fromCharCode(65152),
                final: String.fromCharCode(65152),
                initial: String.fromCharCode(65152),
                medial: String.fromCharCode(65152),
            }
        }else{
            var res = {
                isolated: String.fromCharCode(formsIndex),
                final: String.fromCharCode(formsIndex + 1),
                initial: (scope.noWasl.indexOf(harf) > -1) ? String.fromCharCode(formsIndex) : String.fromCharCode(formsIndex + 2),
                medial: (scope.noWasl.indexOf(harf) > -1) ? String.fromCharCode(formsIndex + 1) : String.fromCharCode(formsIndex + 3),
            }
        }
        return res;
    }

    function replaceAt(str,index, character) {
        return str.substr(0, index) + character + str.substr(index + 1);
    }

    scope.hurufForms = {};
    for (var i = 0; i < scope.kolHuruf.length; i++) {
        var harf = scope.kolHuruf[i];
        scope.hurufForms[harf] = scope.getHarfForms(harf);
    }

    function allForms(str) {
        var res = '';
        for (var i = 0; i < str.length; i++) {
            var harf = str.charAt(i);
            var forms = scope.hurufForms[harf];
            res += objJoin(forms);
        }
        return res;
    }

    function objJoin(obj,sep) {
        return Object.keys(obj).map(function (key) {return obj[key]}).join(sep);
    }

    function mergeArrays(a,b) {
        return a.concat(b.filter(function(item) {
            return a.indexOf(item) < 0;
        }));
    }

module.exports = {
    format: function(text,ltr){
        var res = scope.putOnPlaceFormat(text);
        if(ltr){
            var res = res.split('').reverse().join('');
        }
        return res;
    }
}
