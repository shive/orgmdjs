# -*- mode: org; coding: utf-8-with-signature-unix -*-
= orgmdjs {#top}

- repos https://github.com/shive/orgmdjs/tree/gh-pages
- see http://shive.github.io/orgmdjs/html/README.html

* 何をやっているのか
  - .htmlと同じ名前の.txtを拾ってきてorg形式をmd形式にざっくり変換してmarked.jsでHTMLにするjavascriptです
  - .htmlはファイル名しか見てないのでファイルコピぺで増やせばok
  - javascript動作なのでローカルコピーしても動きます（chromeは起動オプションに *--allow-file-access-from-files* が必要）
    - httpで閲覧できるリポジトリであれば、ローカルにあるワーキングコピーで編集＆確認してリポジトリにコミットでwikiライクな利用が可能
  - [[./example.html][サンプル１]] [[./embbed.html][サンプル２]]


* LICENSE
  - public domain


* COPYRIGHTS
  - `github.css` https://gist.github.com/andyferra/2554919
  - `jQuery` http://jquery.org/license
  - `marked.js` https://github.com/chjj/marked
  - `highlight.js` http://highlightjs.org/

