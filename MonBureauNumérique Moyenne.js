// ==UserScript==
// @name           MonBureauNumérique Average
// @description    Met une ligne Moyenne dans MBN
// @include        http*://*.monbureaunumerique.fr/*
// @match          http*://*.monbureaunumerique.fr/*
// @run-at         document-idle
// @author         Mimi740101
// @icon           https://cdn.monbureaunumerique.fr/images/favicon.ico
// @downloadURL    https://github.com/Mimi740101/moyenne-monbureaunumerique.fr-moyenne-pour-mbn/blob/main/MonBureauNum%C3%A9rique%20Moyenne.js
// @updateURL      https://github.com/Mimi740101/moyenne-monbureaunumerique.fr-moyenne-pour-mbn/blob/main/MonBureauNum%C3%A9rique%20Moyenne.js
// @version        1.2
// ==/UserScript==

const average = true;
const consoleClear = true;

(function () {
    'use strict';
    var url = window.location.hostname;

    
    if (!url.includes("moodle") && !url.includes("pronote")) {
        if (average)(function () {
            var elements = document.getElementsByClassName("yui-dt-liner bulletin-note bulletin-note-eleve");

            function moyenne(e) {
                var l = 0, n = 0;
                Object.keys(e).forEach(function (key) {
                    n += e[key];
                    l++;
                });
                return n / l;
            }

            
            function addDecimal(e, t = 0) {
                e = !t ? Math.round(10 * e) / 10 : Math.round(100 * e) / 100;
                var s = new String(e);
                return s.includes(".") ? s : s + ".0";
            }

            if (elements != null && elements.length > 0) {
                var tmp;
                
                var matieres = {};

                for (let e = 0; e < elements.length; e++) {
                    tmp = parseFloat(
                        new String(elements[e].innerText).replace(",", ".")
                    );

                    
                    var matKey = document.getElementsByClassName(
                        "bulletin-matiere-libelle ellipse fw-700"
                    )[e].innerText;

                    if (isNaN(tmp)) continue;

                    if (typeof matieres[matKey] === "undefined") {
                        matieres[matKey] = tmp;
                    } else {
                        matieres[matKey] = moyenne({ a: matieres[matKey], b: tmp });

                        var aaa = document.getElementsByClassName(
                            "bulletin-matiere-libelle ellipse fw-700"
                        )[e].parentElement.parentElement.parentElement.parentElement;

                        var listDevoirs = aaa.getElementsByClassName("list-devoirs-eleve")[0];
                        if (listDevoirs) {
                            Array.prototype.slice.call(listDevoirs.children).forEach(function (element) {
                                element.classList.add("devoir-facultatif");
                                if (element.children[0]) element.children[0].classList.add("devoir-facultatif-note");
                                if (element.children[1]) element.children[1].classList.add("devoir-facultatif-bareme");
                            });
                        }

                        aaa.style.color = "#6e6e6e";
                        if (aaa.firstChild) {
                            aaa.firstChild.style.transform = "translateX(15px)";
                            aaa.firstChild.style.boxShadow = "-6px 0 #6e6e6e4f";
                        }
                    }
                }

                var tr = document.createElement("tr");
                var nameEl = document.getElementsByClassName("user")[0];
                var name = nameEl ? nameEl.children[0].innerText : "Élève";
                tr.className = "yui-dt-last yui-dt-odd";
                tr.innerHTML = `
                <td headers="yui-dt0-th-matiere" class="yui-dt0-col-matiere yui-dt-col-matiere yui-dt-sortable yui-dt-first" style="width:150px;">
                    <div class="yui-dt-liner">
                        <div class="bulletin-matiere-ligne">
                            <div class="bulletin-matiere-libelle ellipse fw-700" title="MOYENNE">MOYENNE</div>
                            <div class="releve-matiere-professeur f-left c-both ellipse" title="${name}">${name}</div>
                        </div>
                    </div>
                </td>
                <td headers="yui-dt0-th-moyenneEleve" class="yui-dt0-col-moyenneEleve yui-dt-col-moyenneEleve yui-dt-sortable" style="width:30px;">
                    <div class="yui-dt-liner bulletin-note bulletin-note-eleve" id="__moyenne__"></div>
                </td>
                <td headers="yui-dt0-th-moyenneClasse" class="yui-dt0-col-moyenneClasse yui-dt-col-moyenneClasse" style="width:30px;">
                    <div class="yui-dt-liner bulletin-note" id="__tagsmoy__"></div>
                </td>
                <td headers="yui-dt0-th-moyenneClasseMin" class="yui-dt0-col-moyenneClasseMin yui-dt-col-moyenneClasseMin" style="width:30px;">
                    <div class="yui-dt-liner bulletin-note" id="__tagsmin__"></div>
                </td>
                <td headers="yui-dt0-th-moyenneClasseMax" class="yui-dt0-col-moyenneClasseMax yui-dt-col-moyenneClasseMax" style="width:30px;">
                    <div class="yui-dt-liner bulletin-note" id="__tagsmax__"></div>
                </td>
                <td headers="yui-dt0-th-nombreDevoirComptabilises" class="yui-dt0-col-nombreDevoirComptabilises yui-dt-col-nombreDevoirComptabilises yui-dt-sortable" style="width:30px;">
                    <div class="yui-dt-liner bulletin-note">
                        <div class="txt-center" id="__notes__"></div>
                    </div>
                </td>
                <td headers="yui-dt0-th-notesEleve" class="yui-dt0-col-notesEleve yui-dt-col-notesEleve yui-dt-last">
                    <div class="yui-dt-liner"><div class="list-devoirs-eleve"></div></div>
                </td>`;

                var tableBody = document.getElementsByClassName("yui-dt-data")[0];
                if (tableBody) tableBody.appendChild(tr);

                
                var notesCells = [];
                var bb = 0;
                var bulletinNotes = document.getElementsByClassName("yui-dt-liner bulletin-note");
                for (let e = 0; e < bulletinNotes.length; e++) {
                    
                    if (String(bulletinNotes[e].innerHTML).includes("txt-center")) {
                        notesCells.push(bulletinNotes[e].children[0]);
                    }
                }

                
                notesCells.forEach(function (e) {
                    if (e.id === "") {
                        var val = parseInt(e.innerHTML);
                        if (!isNaN(val)) bb += val;
                    }
                });

                var moyVal = moyenne(matieres);

                var moyenneEl = document.getElementById("__moyenne__");
                if (moyenneEl) {
                    moyenneEl.innerHTML = addDecimal(moyVal, 1).replace(".", ",");
                }

                var notesEl = document.getElementById("__notes__");
                if (notesEl) {
                    notesEl.appendChild(document.createTextNode(bb));
                }

                var tagsmoyEl = document.getElementById("__tagsmoy__");
                if (tagsmoyEl) {
                    tagsmoyEl.innerHTML = addDecimal(moyVal, 1).replace(".", ",");
                }

                var min = Infinity;
                var max = -Infinity;
                Object.keys(matieres).forEach(function (key) {
                    var mat = matieres[key];
                    if (mat > max) max = mat;
                    if (mat < min) min = mat;
                });

               
                var tagsminEl = document.getElementById("__tagsmin__");
                if (tagsminEl) {
                    tagsminEl.innerHTML = addDecimal(new String(min)).replace(".", ",");
                }

                var tagsmaxEl = document.getElementById("__tagsmax__");
                if (tagsmaxEl) {
                    tagsmaxEl.innerHTML = addDecimal(new String(max)).replace(".", ",");
                }
            }
        })();
    }

    if (consoleClear) {
        console.clear();
        console.log(
            "%cmoyenne-monbureaunumerique.fr ️\n%cMoyenne dans le tableau Evaluations%c\nFrom the/Provient de moyenne-monbureaunumerique.fr\n%cAjoute des fonctions utiles à MonBureauNumérique (ENT Grand-Est)\n© 2026 Mimi740101\nVersion: %c1.2%c\nActivation: %c" +
            (!url.includes("moodle") && !url.includes("pronote")).toString() + "%c\n\nSource: https://github.com/Mimi740101/moyenne-monbureaunumerique.fr-moyenne-pour-mbn/blob/main/MonBureauNum%C3%A9rique%20Moyenne.js",
            "font-size:25px;font-family:Arial;font-weight:bold;",
            "font-size:18px;font-family:Arial;font-weight:bold;padding:10px 0;",
            "color:#aaa;font-style:italic;",
            "color:#aaa",
            "color:#009378",
            "color:#aaa",
            "color:#009378",
            "color:#aaa"
        );
    }
})();
