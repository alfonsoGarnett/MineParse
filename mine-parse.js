(function () {

    var _id = 0,
        obfuscators = {},
        alreadyParsed = [];

    var styleMap = {
        '§0': 'color:#000000',
        '§1': 'color:#0000AA',
        '§2': 'color:#00AA00',
        '§3': 'color:#00AAAA',
        '§4': 'color:#AA0000',
        '§5': 'color:#AA00AA',
        '§6': 'color:#FFAA00',
        '§7': 'color:#AAAAAA',
        '§8': 'color:#555555',
        '§9': 'color:#5555FF',
        '§a': 'color:#55FF55',
        '§b': 'color:#55FFFF',
        '§c': 'color:#FF5555',
        '§d': 'color:#FF55FF',
        '§e': 'color:#FFFF55',
        '§f': 'color:#FFFFFF',
        '§l': 'font-weight:bold',
        '§m': 'text-decoration:line-through',
        '§n': 'text-decoration:underline',
        '§o': 'font-style:italic'
    };

    function obfuscate(string, elem) {
        var magicSpan,
            currNode;
        if (string.indexOf('<br>') > -1) {
            elem.innerHTML = string;
            for (var j = 0, len = elem.childNodes.length; j < len; j++) {
                currNode = elem.childNodes[j];
                if (currNode.nodeType === 3) {
                    magicSpan = document.createElement('span');
                    magicSpan.innerHTML = currNode.nodeValue;
                    elem.replaceChild(magicSpan, currNode);
                    init(magicSpan);
                }
            }
        } else {
            init(elem, string);
        }

        function init(el, str) {
            var i = 0,
                obsStr = str || el.innerHTML,
                len = obsStr.length,
                currId = _id;

            if (!obfuscators[_id]) obfuscators[_id] = [];

            obfuscators[_id].push(
                window.setInterval(function () {
                    // console.log(currId);
                    if (i >= len) i = 0;
                    obsStr = replaceRand(obsStr, i);
                    el.innerHTML = obsStr;
                    i++;
                }, 0)
            );
        }

        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function replaceRand(string, i) {
            var randChar = String.fromCharCode(randInt(64, 95));
            return string.substr(0, i) + randChar + string.substr(i + 1, string.length);
        }
    }

    function applyCode(string, codes) {
        var elem = document.createElement('span'),
            obfuscated = false;
        string = string.replace(/\x00*/g, '');
        for (var i = 0, len = codes.length; i < len; i++) {
            elem.style.cssText += styleMap[codes[i]] + ';';
            if (codes[i] === '§k') {
                obfuscate(string, elem);
                obfuscated = true;
            }
        }
        if (!obfuscated) elem.innerHTML = string;
        return elem;
    }

    function parseStyle(string) {
        var codes = string.match(/§.{1}/g) || [],
            indexes = [],
            apply = [],
            tmpStr,
            deltaIndex,
            finalPre = document.createElement('pre'),
            i;
        string = string.replace(/\n|\\n/g, '<br>');
        for (i = 0, len = codes.length; i < len; i++) {
            indexes.push(string.indexOf(codes[i]));
            string = string.replace(codes[i], '\x00\x00');
        }
        if (indexes[0] !== 0) {
            finalPre.appendChild(applyCode(string.substring(0, indexes[0]), []));
        }
        for (i = 0; i < len; i++) {
            indexDelta = indexes[i + 1] - indexes[i];
            if (indexDelta === 2) {
                while (indexDelta === 2) {
                    apply.push(codes[i]);
                    i++;
                    indexDelta = indexes[i + 1] - indexes[i];
                }
                apply.push(codes[i]);
            } else {
                apply.push(codes[i]);
            }
            if (apply.lastIndexOf('§r') > -1) {
                apply = apply.slice(apply.lastIndexOf('§r') + 1);
            }
            tmpStr = string.substring(indexes[i], indexes[i + 1]);
            finalPre.appendChild(applyCode(tmpStr, apply));
        }
        return finalPre;
    }

    function clearObfuscators(id) {
        var i = obfuscators[id].length;
        for (; i--;) {
            clearInterval(obfuscators[id][i]);
        }
        alreadyParsed[id] = [];
        obfuscators[id] = [];
    }

    window.mineParse = function initParser(input) {
        var parsed,
            i = _id;
        if(i > 0) {
            for (; i--;) {
                if(alreadyParsed[i].nodeType) {
                    if (!document.contains(alreadyParsed[i])) {
                        clearObfuscators(i);
                    }
                }
            }
        }
        parsed = parseStyle(input);
        alreadyParsed.push(parsed);
        _id++;
        return {
            parsed: parsed,
            raw: parsed.innerHTML
        };
    };

}());
