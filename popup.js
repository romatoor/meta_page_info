
//скрипт запускаеться при нажатии на значек на панели
    chrome.tabs.getSelected(null, function (tab) {

        function doStuffWithDom(domContent) {

            domContent = domContent.toString();

            var out = '<table><tr><th style="min-width: 200px">Имя</th><th>Значение</th></tr>';
            out += '<tr><td>title</td><td>'+tab['title']+'</td></tr>';

            //укажем нужные link - canonical
            var href = '';
            var search = 'rel="canonical"';
            var tmppos = domContent.indexOf(search);

            if(tmppos > 0){
                tmppos = domContent.indexOf( 'href="', tmppos+search.length)+6;
                var tmpposend = domContent.indexOf( '"', tmppos);
                href = domContent.substr(tmppos, tmpposend-tmppos);
            }
            if(href){
                out += '<tr><td>canonical</td><td>' + href + '</td></tr>';
            }

            //соберем мета теги
            var now_pos = 0;
            var flag = true;
            var name_arr = ['name','property', 'http-equiv'];
            while (flag){
                var pos = domContent.indexOf( '<meta', now_pos );

                if(pos < 0 ){
                    flag = false;
                }
                else{
                    var end = domContent.indexOf('>', pos);
                    var substr = domContent.substr(pos, end-pos);

                    var content = '';
                    var tmppos = substr.indexOf('content="');
                    if(tmppos > 0){
                        tmppos = tmppos+9;
                        var tmpposend = substr.indexOf('"', tmppos);
                        content = substr.substr(tmppos, tmpposend-tmppos);
                    }
                    var title = '';
                    name_arr.forEach(function(item, i, arr) {
                        var tmppos = substr.indexOf(name_arr[i] + '="');
                        if(tmppos > 0){
                            tmppos = tmppos+ name_arr[i].length + 2;
                            var tmpposend = substr.indexOf('"', tmppos);
                            title = substr.substr(tmppos, tmpposend-tmppos);
                            return;
                        }
                    });

                    if(title && content) {
                        out += '<tr><td>' + title + '</td><td>' + content + '</td></tr>';
                    }

                    now_pos = end;
                }
            }

            out += '</table>';
            document.getElementById('insert').innerHTML = out;
        }
        setTimeout(function () {

            chrome.tabs.sendMessage(tab['id'], {mesege: 'message'}, doStuffWithDom);

        }, 500);

    });
