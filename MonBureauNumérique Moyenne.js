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
// ===================================================================
    // Graphique : évolution de la moyenne générale (ajout v1.3 - bloc v2)
    // À coller juste avant la dernière ligne du script : })();
    // (supprime l'ancien bloc avant de coller celui-ci)
    // ===================================================================
    (function () {
        if (url.includes("moodle") || url.includes("pronote")) return;
        const host = document.getElementById("releve-eleve");
        if (!host) return;

        // Cadre + titre créés tout de suite, pour pouvoir afficher les erreurs sur la page
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "max-width:800px;margin:24px 0;padding:12px 16px;border:1px solid #ddd;border-radius:6px;background:#fff;font-family:Arial,sans-serif;";
        const h = document.createElement("div");
        h.textContent = "Évolution de la moyenne générale";
        h.style.cssText = "font-weight:700;font-size:15px;margin-bottom:2px;";
        wrapper.appendChild(h);
        host.insertAdjacentElement("afterend", wrapper);

        const note = function (txt) {
            const p = document.createElement("div");
            p.textContent = txt;
            p.style.cssText = "font-size:12px;color:#777;margin-top:4px;";
            wrapper.appendChild(p);
        };

        try {
            // ---------- 1) Lecture des données dans le script inline de la page ----------
            function extractBalanced(txt, start) {
                let depth = 0, inStr = false, esc = false;
                for (let k = start; k < txt.length; k++) {
                    const c = txt[k];
                    if (inStr) {
                        if (esc) esc = false;
                        else if (c === "\\") esc = true;
                        else if (c === '"') inStr = false;
                    } else if (c === '"') inStr = true;
                    else if (c === "{") depth++;
                    else if (c === "}" && --depth === 0) return txt.slice(start, k + 1);
                }
                throw new Error("JSON incomplet");
            }

            // Le motif exige {"results" juste après le signe =, pour ne jamais se reconnaître lui-même
            const re = /var jsonArrayreleveEleve\s*=\s*\{"results"/;
            let data = null;
            for (const s of document.scripts) {
                const txt = s.textContent;
                const m = re.exec(txt);
                if (!m) continue;
                data = JSON.parse(extractBalanced(txt, m.index + m[0].indexOf("{")));
                break;
            }
            if (!data || !data.results) {
                throw new Error("données introuvables dans la page (" + document.scripts.length + " scripts examinés)");
            }

            const decode = function (s) {
                const t = document.createElement("textarea");
                t.innerHTML = s || "";
                return t.value;
            };

            // Date du devoir -> minuit local (accepte jj/mm/aaaa, aaaa-mm-jj ou le timestamp)
            const dayOf = function (n) {
                let dt = null;
                const m1 = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(n.dateDevoir));
                const m2 = /(\d{4})-(\d{2})-(\d{2})/.exec(String(n.dateDevoir));
                if (m1) dt = new Date(+m1[3], +m1[2] - 1, +m1[1]);
                else if (m2) dt = new Date(+m2[1], +m2[2] - 1, +m2[3]);
                else if (n.dateDevoirTimestamp) dt = new Date(Number(n.dateDevoirTimestamp));
                if (!dt || isNaN(dt.getTime())) return NaN;
                return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
            };

            let raw = 0, comptab = 0, withVal = 0, sample = "";
            data.results.forEach(function (r) {
                (r.notesEleve || []).forEach(function (n) {
                    raw++;
                    if (n.devoirComptabilisable) comptab++;
                    if (n.valeur !== null && n.valeur !== undefined) {
                        withVal++;
                        if (!sample) sample = JSON.stringify({ dateDevoir: n.dateDevoir, ts: n.dateDevoirTimestamp });
                    }
                });
            });

            const subjects = data.results
                .filter(function (r) { return !r.ligneMoyennesGenerales; })
                .map(function (r) {
                    return {
                        name: decode(r.matiere),
                        official: parseFloat(String(r.moyenneEleve || "").replace(",", ".")),
                        notes: (r.notesEleve || [])
                            .filter(function (n) {
                                return n.devoirComptabilisable && n.valeur !== null && n.valeur !== undefined && n.bareme > 0;
                            })
                            .map(function (n) {
                                return {
                                    t: dayOf(n),
                                    title: decode(n.titreDevoir),
                                    v: n.valeur,
                                    b: n.bareme,
                                    c: Number(n.coefficient) || 1
                                };
                            })
                    };
                });

            // ---------- 2) Reconstruction de la moyenne générale à chaque date ----------
            // (pas de Array.from : la page utilise Prototype.js qui le remplace et ne gère pas les Set)
            const allT = [].concat.apply([], subjects.map(function (s) {
                return s.notes.map(function (n) { return n.t; });
            }));
            const days = allT.filter(function (t, i) { return !isNaN(t) && allT.indexOf(t) === i; })
                .sort(function (a, b) { return a - b; });

            const diag = "matières=" + subjects.length + ", notes=" + raw + ", comptabilisées=" + comptab +
                ", avec valeur=" + withVal + ", jours distincts=" + days.length + ", exemple=" + sample;

            if (days.length < 2) {
                note("Pas assez de notes datées pour tracer une courbe. Diagnostic : " + diag);
                console.log("[MBN graphique]", diag);
                return;
            }

            const points = days.map(function (t, idx) {
                const isLast = idx === days.length - 1;
                const avgs = [];
                subjects.forEach(function (s) {
                    const ns = s.notes.filter(function (n) { return n.t <= t; });
                    if (!ns.length) return;
                    let a;
                    if (isLast && !isNaN(s.official)) {
                        a = s.official; // dernier point = moyennes officielles affichées par MBN
                    } else {
                        const num = ns.reduce(function (x, n) { return x + n.c * n.v; }, 0);
                        const den = ns.reduce(function (x, n) { return x + n.c * n.b; }, 0);
                        a = num / den * 20;
                    }
                    avgs.push(a);
                });
                const added = [];
                subjects.forEach(function (s) {
                    s.notes.filter(function (n) { return n.t === t; }).forEach(function (n) {
                        added.push({ subject: s.name, title: n.title, v: n.v, b: n.b, c: n.c });
                    });
                });
                return {
                    t: t,
                    avg: avgs.reduce(function (x, y) { return x + y; }, 0) / avgs.length,
                    nSubjects: avgs.length,
                    added: added
                };
            });

            // ---------- 3) Dessin du graphique (SVG) ----------
            note("Moyenne /20 calculée à partir des notes datées. Passe la souris sur la courbe pour le détail.");

            const box = document.createElement("div");
            box.style.cssText = "position:relative;margin-top:8px;";
            wrapper.appendChild(box);

            const NS = "http://www.w3.org/2000/svg";
            const svgEl = function (name, attrs, parent) {
                const e = document.createElementNS(NS, name);
                for (const k in attrs) e.setAttribute(k, attrs[k]);
                if (parent) parent.appendChild(e);
                return e;
            };

            const W = 800, H = 300, ml = 46, mr = 24, mt = 20, mb = 38;
            const iw = W - ml - mr, ih = H - mt - mb;
            const t0 = points[0].t, t1 = points[points.length - 1].t;
            const X = function (t) { return ml + (t - t0) / (t1 - t0) * iw; };

            const vals = points.map(function (p) { return p.avg; });
            let yMin = Math.max(0, Math.floor(Math.min.apply(null, vals) - 0.5));
            let yMax = Math.min(20, Math.ceil(Math.max.apply(null, vals) + 0.5));
            if (yMax - yMin < 2) { yMin = Math.max(0, yMin - 1); yMax = Math.min(20, yMax + 1); }
            if (yMax - yMin < 2) yMin = Math.max(0, yMax - 2);
            const Y = function (v) { return mt + (yMax - v) / (yMax - yMin) * ih; };

            const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, width: "100%" }, box);
            svg.style.cssText = "display:block;max-width:" + W + "px;height:auto;";

            // grille horizontale + graduations
            const step = (yMax - yMin) > 8 ? 2 : 1;
            for (let v = yMin; v <= yMax; v += step) {
                svgEl("line", { x1: ml, x2: W - mr, y1: Y(v), y2: Y(v), stroke: "#e6e6e6" }, svg);
                const lbl = svgEl("text", { x: ml - 8, y: Y(v) + 4, "text-anchor": "end", "font-size": "11", fill: "#777" }, svg);
                lbl.textContent = v;
            }

            // graduations de dates
            const DAY = 86400000;
            const spanDays = Math.round((t1 - t0) / DAY);
            const tickEvery = Math.max(1, Math.ceil(spanDays / 8));
            const d0 = new Date(t0);
            for (let d = 0; d <= spanDays; d += tickEvery) {
                const tt = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + d).getTime();
                const lbl = svgEl("text", { x: X(tt), y: H - mb + 18, "text-anchor": "middle", "font-size": "11", fill: "#777" }, svg);
                lbl.textContent = new Date(tt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
            }

            // aire + courbe
            const yBase = mt + ih;
            let area = "M" + X(points[0].t) + "," + yBase;
            points.forEach(function (p) { area += " L" + X(p.t) + "," + Y(p.avg); });
            area += " L" + X(points[points.length - 1].t) + "," + yBase + " Z";
            svgEl("path", { d: area, fill: "#009378", "fill-opacity": "0.08" }, svg);
            svgEl("polyline", {
                points: points.map(function (p) { return X(p.t) + "," + Y(p.avg); }).join(" "),
                fill: "none", stroke: "#009378", "stroke-width": "2.5", "stroke-linejoin": "round"
            }, svg);
            points.forEach(function (p) {
                svgEl("circle", { cx: X(p.t), cy: Y(p.avg), r: 3.5, fill: "#009378", stroke: "#fff", "stroke-width": "1.5" }, svg);
            });

            // éléments de survol
            const guide = svgEl("line", { y1: mt, y2: yBase, stroke: "#999", "stroke-dasharray": "4 3", visibility: "hidden" }, svg);
            const dot = svgEl("circle", { r: 6.5, fill: "#009378", stroke: "#fff", "stroke-width": "2", visibility: "hidden" }, svg);

            const tip = document.createElement("div");
            tip.style.cssText = "position:absolute;display:none;pointer-events:none;z-index:1000;max-width:340px;padding:8px 10px;border-radius:5px;background:#222;color:#fff;font-size:12px;line-height:1.4;box-shadow:0 2px 8px rgba(0,0,0,.3);";
            box.appendChild(tip);

            const fmt = function (v) { return v.toFixed(2).replace(".", ","); };
            const fmtNote = function (v) { return String(v).replace(".", ","); };
            const longDate = function (t) {
                return new Date(t).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
            };
            const shortDate = function (t) {
                return new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
            };

            function showTip(i) {
                const p = points[i];
                tip.replaceChildren();
                const add = function (txt, style) {
                    const d = document.createElement("div");
                    d.textContent = txt;
                    if (style) d.style.cssText = style;
                    tip.appendChild(d);
                };
                add(longDate(p.t), "font-weight:700;margin-bottom:2px;");
                add("Moyenne générale : " + fmt(p.avg), "font-size:14px;font-weight:700;");
                if (i > 0) {
                    const dl = p.avg - points[i - 1].avg;
                    const flat = Math.abs(dl) < 0.005;
                    add((flat ? "= " : dl > 0 ? "▲ +" : "▼ −") + fmt(Math.abs(dl)) + " depuis le " + shortDate(points[i - 1].t),
                        "color:" + (flat ? "#ccc" : dl > 0 ? "#7be0c6" : "#ff9a9a") + ";");
                }
                add(p.nSubjects + " matière" + (p.nSubjects > 1 ? "s" : "") + " notée" + (p.nSubjects > 1 ? "s" : ""), "opacity:.7;");
                add("Notes de ce jour :", "margin-top:6px;font-weight:700;");
                p.added.slice(0, 6).forEach(function (n) {
                    add(n.subject + " · " + n.title + " : " + fmtNote(n.v) + "/" + fmtNote(n.b) + " (coef " + fmtNote(n.c) + ")", "margin-top:1px;");
                });
                if (p.added.length > 6) add("+ " + (p.added.length - 6) + " autre(s)", "opacity:.7;");

                const r = svg.getBoundingClientRect();
                const px = X(p.t) / W * r.width;
                const py = Y(p.avg) / H * r.height;
                tip.style.display = "block";
                let left = px + 14;
                if (left + tip.offsetWidth > r.width) left = px - tip.offsetWidth - 14;
                tip.style.left = Math.max(0, left) + "px";
                tip.style.top = Math.max(0, Math.min(py + 14, r.height - tip.offsetHeight)) + "px";

                guide.setAttribute("x1", X(p.t));
                guide.setAttribute("x2", X(p.t));
                guide.setAttribute("visibility", "visible");
                dot.setAttribute("cx", X(p.t));
                dot.setAttribute("cy", Y(p.avg));
                dot.setAttribute("visibility", "visible");
            }

            function hideTip() {
                tip.style.display = "none";
                guide.setAttribute("visibility", "hidden");
                dot.setAttribute("visibility", "hidden");
            }

            svg.addEventListener("pointermove", function (e) {
                const r = svg.getBoundingClientRect();
                const vx = (e.clientX - r.left) / r.width * W;
                let best = 0, bestD = Infinity;
                points.forEach(function (p, i) {
                    const dd = Math.abs(X(p.t) - vx);
                    if (dd < bestD) { bestD = dd; best = i; }
                });
                showTip(best);
            });
            svg.addEventListener("pointerleave", hideTip);
        } catch (err) {
            note("Erreur du graphique : " + err.message);
            console.warn("[MBN graphique]", err);
        }
    })();})();
