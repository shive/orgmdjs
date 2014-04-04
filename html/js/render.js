// -*- coding: utf-8-with-signature-dos -*-
//======================================================================================================================
//! @author hshibuya <goe@fuzz.co.jp>
//! @license public domain

function onload() {
    var options = {
        // renderer: new marked.Renderer(),
        // gfm: true,
        // tables: true,
        // breaks: true,
        // pedantic: true,
        // sanitize: true,
        // smartLists: true,
        // smartypants: true
    };

    var content = $('#content');
    var url = document.URL.replace(/\\/g, '/').replace(/^file:\/\/([^/])/, 'file:///$1');
    var origin = url.replace(/^([^/]+\/\/+[^/]+\/).+$/, '$1');
    var argv = url.replace(/[^?]+(#[^?]+)?(\?[^#]+)?([#?].+)*$/, '$2');
    var source = url.replace(/\/html\/([^\/]+).html?([#?].+)*$/, '/$1.txt') + argv;
    document.title = decodeURI(url.replace(/.+\/([^\/]+).html?([#?].+)*$/, '$1'));

    // console.log('url=' + url);
    // console.log('origin=' + origin);
    // console.log('argv=' + argv);
    // console.log('source=' + source);
    // console.log('title=' + document.title);

    $.get(source, function(data){
        var lines = data.split('\n');

        // org-modeの場合
        if(lines[0].match(/.+\s+mode:\s*org[\s;]/)){
            lines = lines.filter(function(s){
                return (s[0] != '#');
            });
            lines = lines.map(function(s){
                s = s.replace(/^= /, '# ');
                s = s.replace(/^\* /, '## ');
                s = s.replace(/^\*\* /, '### ');
                s = s.replace(/^\*\*\* /, '#### ');
                s = s.replace(/^\*\*\*\* /, '##### ');
                s = s.replace(/(^|[^`])\{#([\w\d_\-@$]+)\}/g, '$1<a href="#$2" name="$2" style="font-size:xx-small; vertical-align:top;">†</a>');
                s = s.replace(/(^|[^`])(\[(20\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d)\])/g, '$1<a href="#$3$4$5-$6$7" name="$3$4$5-$6$7" style="font-size:xx-small; vertical-align:top;"><code>$2</code></a>')
                s = s.replace(/(^|[^`])\[\[([^\]]+)\]\[([^\]]+)\]\]/g,'$1[$3]($2)'); // ハイパーリンク
                if(s.match(/^(>\s*)*\s*\|/)){
                    s = s.replace(/^\s*/, '');
                    s = s.replace(/-\+-/g, '-|-');
                }
                return s;
            });
        };

        // ページの最後の平文リンクを追加
        lines.push('<div style="float:right;">[`plain`](' + source + ')</div>');

        // content.html('<pre>' + lines.join('\n') + '</pre>');
        content.html(marked(lines.join('\n'), options));

        // リンクにブランチ名を含める
        if(argv != ''){
            $("a").each(function() {
                var self = $(this);
                var link = self.attr('href');
                if(link[0] != '#' && link.indexOf('file://') < 0){      // anchorとfileプロトコルには付与しない
                    if(link[0] == '.' || link.indexOf(origin) >= 0){    // 相対パスもしくは同じオリジンのURLのみ
                        // console.log('modified=' + link);
                        self.attr('href', link + argv);
                    }
                }
            });
        }

        // アンカーがあればそこへジャンプするために再ジャンプ
        if(url.indexOf('#') >= 0){
            location.href = url;
        }
    });
}

$(document).ready(function(){
    onload();
});
