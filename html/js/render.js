// -*- coding: utf-8-with-signature-dos -*-
//======================================================================================================================
//! @author hshibuya <goe@fuzz.co.jp>
//! @license public domain

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

function hideshow_setup() {
    // 参考 http://webdrawer.net/javascript/manyslidedown

    // コンテンツ分のフラグ
    // 初期値がundefinedだったら閉じるので初期化不要
    var navFlag = new Array();

    $('div#content h1').dblclick(function(event){
        if(event.target != this){
            return;
        }
        var allclosed = true;
        $('div#content h2').each(function(){
            var num = $(this).index();
            if(!navFlag[num]){
                allclosed = false;
            }
        });
        // console.log(allclosed);
        $('div#content h2').each(function(){
            var num = $(this).index();
            if(allclosed){
                navFlag[num] = false;
                $(this).next('.inner').show();
                $(this).removeClass('closed');
            } else {
                navFlag[num] = true;
                $(this).next('.inner').hide();
                $(this).addClass('closed');
            }
        });
        event.stopPropagation();
    });

    //クリックした時の処理
    $('div#content h2').dblclick(function(event){
        if(event.target != this){
            return;
        }
        //何個目のものがクリックされたかを確認
        var clickNum = $(this).index();
        // console.log('num: ' + clickNum);
        //フラグがtrueだったら
        if(navFlag[clickNum]){
            navFlag[clickNum] = false;
            $(this).next('.inner').show();
            $(this).removeClass('closed');
        } else {
            navFlag[clickNum] = true;
            $(this).next('.inner').hide();
            $(this).addClass('closed');
        }
        event.stopPropagation();
    });
}

function render(content, url, origin, argv, source, data) {
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
            s = s.replace(/(^|[^`])\[((20\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d))\]/g, '$1<a href="#$3$4$5-$6$7" name="$3$4$5-$6$7" style="font-size:xx-small; vertical-align:top;"><code>$2</code></a>')
            s = s.replace(/(^|[^`])\[\[([^\]]+)\]\[([^\]]+)\]\]/g,'$1[$3]($2)'); // ハイパーリンク
            if(s.match(/^(>\s*)*\s*\|/)){
                s = s.replace(/^\s*/, '');
                s = s.replace(/-\+-/g, '-|-');
            }
            return s;
        });
    };

    // ページの最後の平文リンクを追加
    if(source != null){
        lines.push('<div style="float:right;">[`plain`](' + source + ')</div>');
    }

    // markdownレンダリング
    lines = marked(lines.join('\n'), options).split('\n')

    // 見出しを閉じられるようにする
    lines = lines.map(function(s){
        s = s.replace("<h2", '</div><h2');
        s = s.replace('</h2>', '</h2><div class="inner">');
        return s;
    });

    // 表示
    // content.text('<div>' + lines.join('\n') + '</div>');
    content.html('<div>' + lines.join('\n') + '</div>');

    hideshow_setup();

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
}

function onload() {
    var content = $('#content');
    var url = document.URL.replace(/\\/g, '/').replace(/^file:\/\/([^/])/, 'file:///$1');
    var origin = url.replace(/^([^/]+\/\/+[^/]+\/).+$/, '$1');
    var argv = url.replace(/[^?]+(#[^?]+)?(\?[^#]+)?([#?].+)*$/, '$2');
    document.title = decodeURI(url.replace(/.+\/([^\/]+).html?([#?].+)*$/, '$1'));

    if(content.text() != ""){
        var data = content.text().replace(/^\s+/, '');
        render(content, url, origin, argv, null, data);
        return;
    }

    var source = url.replace(/\/html\/([^\/]+).html?([#?].+)*$/, '/$1.txt') + argv;

    // console.log('url=' + url);
    // console.log('origin=' + origin);
    // console.log('argv=' + argv);
    // console.log('source=' + source);
    // console.log('title=' + document.title);

    $.get(source, function(data){
        render(content, url, origin, argv, source, data);
    });
}

$(document).ready(function(){
    onload();
});
