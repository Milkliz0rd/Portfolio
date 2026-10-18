/* Mouvement des maquettes, selon le cahier du mouvement (choix d'Alexandre Morozoff) :
   MV-01 apparitions en cascade, MV-02 frise tracée au défilement, MV-03 fenêtre de code qui s'écrit,
   MV-05 tracés qui se dessinent, MV-06 lueur des survols, MV-07 transitions entre pages (simulées : fichiers locaux),
   MV-08 récit au défilement, MV-10 titre révélé mot par mot, et la pause des animations (MV-04 est en CSS).
   Un seul fichier, sans bibliothèque. Il ne fait rien si le visiteur a demandé à réduire les animations,
   et ne lève aucune erreur sur un écran où un composant manque. Les durées viennent des jetons de styles.css. */
(function () {
  "use strict";

  var racine = document.documentElement;
  var media = window.matchMedia ? function (requete) { return window.matchMedia(requete).matches; } : function () { return false; };
  if (!racine.classList.contains("mv-actif") || !media("(prefers-reduced-motion: no-preference)")) { return; }

  var styleRacine = window.getComputedStyle(racine);
  function jeton(nom) {
    var valeur = styleRacine.getPropertyValue("--" + nom).trim();
    var nombre = parseFloat(valeur);
    if (/ms$/.test(valeur)) { return nombre; }
    if (/s$/.test(valeur)) { return nombre * 1000; }
    return nombre;
  }
  var T = {
    depart: jeton("delai-depart"),
    cascade: jeton("delai-cascade"),
    motTitre: jeton("delai-mot-titre"),
    mot: jeton("delai-mot"),
    caractere: jeton("delai-caractere"),
    apparition: jeton("duree-apparition"),
    longue: jeton("duree-longue"),
    trace: jeton("duree-trace"),
    sortie: jeton("duree-sortie-page")
  };
  var PREMIER = 120;      /* MV-01 : le premier élément d'une cascade part à 120 ms */
  var MAX_CASCADE = 6;    /* six éléments au plus ; les suivants partent avec le sixième */
  var SEUIL_RECIT = 0.4;  /* MV-08 : étape active quand son haut a passé 40 % de la hauteur de la fenêtre */

  function tous(selecteur, contexte) { return Array.prototype.slice.call((contexte || document).querySelectorAll(selecteur)); }
  function rendu(element) { return element.getClientRects().length > 0; }
  function borne(valeur, min, max) { return Math.min(max, Math.max(min, valeur)); }
  function lireStockage(nom, cle) { try { return window[nom].getItem(cle); } catch (e) { return null; } }
  function ecrireStockage(nom, cle, valeur) { try { if (valeur === null) { window[nom].removeItem(cle); } else { window[nom].setItem(cle, valeur); } } catch (e) { /* stockage indisponible : sans effet */ } }

  var navigation = window.performance && performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
  var retourArriere = !!(navigation && navigation.type === "back_forward");

  /* Une mise à jour au plus par image, pour les écouteurs de défilement et de redimensionnement. */
  var abonnes = [];
  var prevu = false;
  function planifierImage() {
    if (prevu) { return; }
    prevu = true;
    window.requestAnimationFrame(function () {
      prevu = false;
      for (var i = 0; i < abonnes.length; i++) { abonnes[i](); }
    });
  }
  function surDefilement(fonction) {
    if (!abonnes.length) {
      window.addEventListener("scroll", planifierImage, { passive: true });
      window.addEventListener("resize", planifierImage, { passive: true });
    }
    abonnes.push(fonction);
  }

  /* ---------- MV-01, MV-05, MV-10 : apparitions à l'entrée d'un bloc dans la fenêtre ---------- */
  var SEL_APPARITION = '[data-mv="MV-01"], [data-mv="MV-05"], [data-mv="MV-10"]';

  function longueurTrace(svg) {
    var use = svg.querySelector("use");
    var cible = use ? document.querySelector(use.getAttribute("href")) : svg;
    var total = 0;
    tous("path, line, polyline, circle", cible).forEach(function (forme) {
      if (typeof forme.getTotalLength === "function") { total += forme.getTotalLength(); }
    });
    return total > 0 ? Math.ceil(total) + 1 : 40;
  }

  function reveler(element, delai, duree) {
    element.style.setProperty("--mv-delai", Math.round(delai) + "ms");
    if (duree) { element.style.setProperty("--mv-duree", Math.round(duree) + "ms"); }
    element.classList.add("mv-vu");
  }

  /* Calcule les délais d'un bloc : cascade MV-01 dans l'ordre de lecture, mots du titre (MV-10), tracés (MV-05). */
  function delaisDuBloc(elements) {
    var delais = [];
    var rang = 0;
    var plancher = 0;
    var departNom = -1;
    var dernierNom = -1;
    var dernierMot = -1;
    var indexMots = { titre: 0, intitule: 0 };
    var tracesParParent = [];
    elements.forEach(function (element) {
      var motif = element.getAttribute("data-mv");
      var delai = PREMIER;
      var duree = 0;
      if (motif === "MV-10") {
        var groupe = element.closest("[data-mv-mots]");
        var nomGroupe = groupe ? groupe.getAttribute("data-mv-mots") : "titre";
        if (nomGroupe === "intitule") {
          var departIntitule = dernierNom >= 0 ? dernierNom : T.depart;
          delai = departIntitule + indexMots.intitule * T.mot;
          duree = T.longue;
          indexMots.intitule++;
        } else {
          if (departNom < 0) { departNom = T.depart; }
          delai = departNom + indexMots.titre * T.motTitre;
          duree = T.apparition;
          dernierNom = delai;
          indexMots.titre++;
        }
        dernierMot = Math.max(dernierMot, delai);
        plancher = dernierMot + T.cascade;
      } else if (motif === "MV-01") {
        delai = Math.max(PREMIER + Math.min(rang, MAX_CASCADE - 1) * T.cascade, plancher);
        if (plancher) { plancher = delai + T.cascade; }
        rang++;
      } else {
        var parent = element.parentElement ? element.parentElement.closest('[data-mv="MV-01"]') : null;
        var base = PREMIER;
        if (parent) {
          for (var i = 0; i < delais.length; i++) { if (delais[i].element === parent) { base = delais[i].delai; } }
        }
        var compte = 0;
        for (var j = 0; j < tracesParParent.length; j++) { if (tracesParParent[j] === parent) { compte++; } }
        tracesParParent.push(parent);
        delai = base + T.cascade * (compte + 1);
        if (element.tagName.toLowerCase() === "svg") { element.style.setProperty("--mv-longueur", String(longueurTrace(element))); }
      }
      delais.push({ element: element, delai: delai, duree: duree });
    });
    return delais;
  }

  function initApparitions() {
    var blocs = tous("[data-mv-bloc]");
    /* Un élément hors de tout bloc forme son propre bloc. */
    tous(SEL_APPARITION).forEach(function (element) {
      if (!element.closest("[data-mv-bloc]")) { element.setAttribute("data-mv-bloc", ""); blocs.push(element); }
    });
    function elementsDe(bloc) {
      var liste = tous(SEL_APPARITION, bloc);
      if (bloc.matches(SEL_APPARITION)) { liste.unshift(bloc); }
      return liste.filter(function (element) { return element === bloc || element.parentElement.closest("[data-mv-bloc]") === bloc; });
    }
    if (retourArriere || !("IntersectionObserver" in window)) {
      racine.classList.add("mv-immediat");
      blocs.forEach(function (bloc) { elementsDe(bloc).forEach(function (element) {
        if (element.tagName.toLowerCase() === "svg") { element.style.setProperty("--mv-longueur", String(longueurTrace(element))); }
        element.classList.add("mv-vu");
      }); });
      return;
    }
    /* Un élément du bloc encore sous la fenêtre attend d'y entrer lui-même ; il part alors à 120 ms. */
    var tardifs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) { return; }
        tardifs.unobserve(entree.target);
        var element = entree.target;
        delaisDuBloc([element]).forEach(function (d) { reveler(d.element, d.delai, d.duree); });
        tous(SEL_APPARITION, element).forEach(function (enfant, k) {
          if (enfant.getAttribute("data-mv") === "MV-05") {
            if (enfant.tagName.toLowerCase() === "svg") { enfant.style.setProperty("--mv-longueur", String(longueurTrace(enfant))); }
            reveler(enfant, PREMIER + T.cascade * (k + 1));
          }
        });
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) { return; }
        observateur.unobserve(entree.target);
        var bas = window.innerHeight;
        var elements = elementsDe(entree.target);
        var visibles = [];
        elements.forEach(function (element) {
          var motif = element.getAttribute("data-mv");
          var haut = element.getBoundingClientRect().top;
          var parentTardif = false;
          if (motif === "MV-01" && haut > bas && element !== entree.target) { element.setAttribute("data-mv-tardif", ""); tardifs.observe(element); return; }
          if (motif === "MV-05" && element.parentElement && element.parentElement.closest("[data-mv-tardif]")) { parentTardif = true; }
          if (!parentTardif) { visibles.push(element); }
        });
        delaisDuBloc(visibles).forEach(function (d) { reveler(d.element, d.delai, d.duree); });
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    blocs.forEach(function (bloc) { observateur.observe(bloc); });
  }

  /* ---------- MV-02 : la frise suit le défilement ; entière dans la fenêtre, elle se trace d'un coup (choix D2),
     puis reste tracée pendant toute la visite de la page, retour arrière compris (choix R2) ---------- */

  /* Les quatre valeurs d'une courbe cubic-bezier lue dans les jetons (repli : courbe linéaire). */
  function lireCourbe(nom) {
    var trouve = /cubic-bezier\(([^)]+)\)/.exec(styleRacine.getPropertyValue("--" + nom));
    var valeurs = trouve ? trouve[1].split(",").map(function (v) { return parseFloat(v); }) : [];
    return valeurs.length === 4 && valeurs.every(isFinite) ? valeurs : [0, 0, 1, 1];
  }
  /* Instant (part de la durée, de 0 à 1) où la courbe atteint la progression « cible » : la courbe est inversée par
     dichotomie sur son paramètre s (y(s) = cible), puis on rend x(s). */
  function instantDeCourbe(courbe, cible) {
    function bezier(p1, p2, s) { var u = 1 - s; return 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s; }
    var bas = 0;
    var haut = 1;
    for (var k = 0; k < 30; k++) {
      var milieu = (bas + haut) / 2;
      if (bezier(courbe[1], courbe[3], milieu) < cible) { bas = milieu; } else { haut = milieu; }
    }
    return bezier(courbe[0], courbe[2], (bas + haut) / 2);
  }

  function initFrises() {
    var courbe = lireCourbe("courbe-entree-sortie");
    tous('.frise[data-mv="MV-02"]').forEach(function (frise) {
      var points = tous('.frise__point[data-mv="MV-02"]', frise);
      var avant = frise.querySelector(".frise__etape--avant .frise__point") || points[points.length - 1];
      var fractions = [];
      var horizontale = false;
      var minuterie = 0;
      var tracee = false; /* drapeau de la frise : une fois le trait tracé en entier, il reste à 1 jusqu'à la fin de la visite */
      function position(i) { return borne(fractions[i] === undefined ? 1 : fractions[i], 0, 1); }
      function mesurer() {
        horizontale = window.getComputedStyle(frise).gridAutoFlow.indexOf("column") === 0;
        if (!points.length || !avant) { fractions = []; return; }
        var centre = function (p) { var r = p.getBoundingClientRect(); return horizontale ? r.left + r.width / 2 : r.top + r.height / 2; };
        var debut = centre(points[0]);
        var fin = centre(avant);
        var etendue = fin - debut;
        fractions = points.map(function (p) { return etendue > 0 ? (centre(p) - debut) / etendue : 0; });
      }
      /* Toute la frise est visible : le trait se trace d'un coup jusqu'à l'étape mise en avant, en duree-trace et selon
         courbe-entree-sortie (transition portée par « mv-frise-entiere ») ; chaque point s'allume quand le trait l'atteint
         réellement : son délai est l'instant où la courbe, partie de la progression courante, passe la position du point. */
      function tracer() {
        var depart = borne(parseFloat(frise.style.getPropertyValue("--mv-progression")) || 0, 0, 1);
        tracee = true;
        frise.classList.add("mv-frise-entiere");
        points.forEach(function (point, i) {
          var part = depart < 1 ? (position(i) - depart) / (1 - depart) : 0;
          point.style.transitionDelay = part > 0 ? Math.round(instantDeCourbe(courbe, part) * T.trace) + "ms" : "";
          point.classList.add("mv-vu");
        });
        frise.style.setProperty("--mv-progression", "1.0000");
        window.clearTimeout(minuterie);
        minuterie = window.setTimeout(function () { points.forEach(function (point) { point.style.transitionDelay = ""; }); }, T.trace + 400);
      }
      /* Retour arrière (page rechargée ou restaurée depuis le cache) : le trait est posé à 1 d'emblée, sans transition
         (« mv-frise-entiere », qui la porte, n'est pas posée) ni délais, comme les cascades qui ne rejouent jamais. */
      function poser() {
        tracee = true;
        window.clearTimeout(minuterie);
        frise.classList.remove("mv-frise-entiere");
        frise.style.setProperty("--mv-progression", "1.0000");
        points.forEach(function (point) { point.style.transitionDelay = ""; point.classList.add("mv-vu"); });
      }
      /* Avant le premier tracé complet, le trait suit le défilement, image par image, et recule quand on remonte. */
      function maj() {
        if (tracee) { return; }
        var r = frise.getBoundingClientRect();
        var vh = window.innerHeight;
        if (r.top >= 0 && r.bottom <= vh) { tracer(); return; }
        var progression = borne((vh * 0.9 - r.top) / (vh * 0.5 + (horizontale ? 0 : r.height)), 0, 1);
        var basDePage = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
        if (basDePage && r.bottom < vh) { progression = 1; }
        frise.style.setProperty("--mv-progression", progression.toFixed(4));
        points.forEach(function (point, i) { point.classList.toggle("mv-vu", progression >= position(i) - 0.001); });
      }
      mesurer();
      window.addEventListener("pageshow", function (evenement) { if (evenement.persisted) { poser(); } });
      if (retourArriere) {
        poser();
      } else {
        /* Le tracé joue aussi à l'ouverture : la progression part de 0 et la première mise à jour attend deux images. */
        frise.style.setProperty("--mv-progression", "0");
        window.requestAnimationFrame(function () { window.requestAnimationFrame(maj); });
      }
      var largeur = window.innerWidth;
      surDefilement(function () {
        if (window.innerWidth !== largeur) { largeur = window.innerWidth; mesurer(); }
        maj();
      });
    });
  }

  /* ---------- MV-03 : la fenêtre « profil.ts » s'écrit (à partir de 600 px seulement) ---------- */
  function initCode() {
    var code = document.querySelector('[data-mv="MV-03"]');
    if (!code) { return; }
    if (!rendu(code) || retourArriere || !("IntersectionObserver" in window)) { code.classList.add("mv-vu"); return; }
    var caracteres = [];
    var temps = 0;
    var debutDeLigne = true;
    function decouper(noeud) {
      Array.prototype.slice.call(noeud.childNodes).forEach(function (enfant) {
        if (enfant.nodeType === 1) { decouper(enfant); return; }
        if (enfant.nodeType !== 3) { return; }
        var texte = enfant.nodeValue;
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < texte.length; i++) {
          var c = texte.charAt(i);
          if (c === "\n") {
            fragment.appendChild(document.createTextNode(c));
            temps += 10 * T.caractere;
            debutDeLigne = true;
            continue;
          }
          var span = document.createElement("span");
          span.setAttribute("data-mv-car", "");
          span.textContent = c;
          fragment.appendChild(span);
          if (debutDeLigne && c === " ") { caracteres.push({ el: span, t: temps }); continue; }
          debutDeLigne = false;
          caracteres.push({ el: span, t: temps });
          temps += T.caractere;
          if (c === ",") { temps += 3 * T.caractere; }
        }
        noeud.replaceChild(fragment, enfant);
      });
    }
    decouper(code);
    code.classList.add("mv-vu");
    var observateur = new IntersectionObserver(function (entrees) {
      if (!entrees.some(function (e) { return e.isIntersecting; })) { return; }
      observateur.disconnect();
      window.setTimeout(ecrire, T.depart);
    }, { threshold: 0.2 });
    observateur.observe(code);

    function ecrire() {
      var curseur = document.createElement("span");
      curseur.className = "mv-curseur";
      curseur.setAttribute("aria-hidden", "true");
      code.appendChild(curseur);
      var suivant = 0;
      var depart = null;
      /* Si la fenêtre quitte l'écran pendant l'écriture, le code s'affiche en entier : il est complet au retour. */
      var sortie = new IntersectionObserver(function (entrees) {
        if (entrees.some(function (e) { return e.isIntersecting; })) { return; }
        while (suivant < caracteres.length) { caracteres[suivant].el.classList.add("mv-vu"); suivant++; }
      }, { threshold: 0 });
      sortie.observe(code);
      function placer() {
        var cadre = code.getBoundingClientRect();
        var dernier = suivant > 0 ? caracteres[suivant - 1].el : null;
        var r = (dernier || caracteres[0].el).getBoundingClientRect();
        var x = (dernier ? r.right : r.left) - cadre.left;
        var y = r.top - cadre.top + (r.height - curseur.offsetHeight) / 2;
        curseur.style.transform = "translate(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px)";
      }
      function image(maintenant) {
        if (depart === null) { depart = maintenant; }
        var ecoule = maintenant - depart;
        while (suivant < caracteres.length && caracteres[suivant].t <= ecoule) { caracteres[suivant].el.classList.add("mv-vu"); suivant++; }
        placer();
        if (suivant < caracteres.length) { window.requestAnimationFrame(image); }
        else { sortie.disconnect(); if (curseur.parentNode) { curseur.parentNode.removeChild(curseur); } }
      }
      placer();
      window.requestAnimationFrame(image);
    }
  }

  /* ---------- MV-06 : la lueur suit le pointeur, à l'intérieur de la carte, sous son contenu (cahier, section J) ---------- */
  function initLueurs() {
    if (!media("(hover: hover) and (pointer: fine)")) { return; }
    var rayon = jeton("taille-lueur-survol") / 2;
    tous(".carte[data-mv-survol]").forEach(function (carte) {
      var calque = document.createElement("span");
      calque.className = "mv-lueur";
      calque.setAttribute("aria-hidden", "true");
      var disque = document.createElement("span");
      disque.className = "mv-lueur__disque";
      calque.appendChild(disque);
      carte.appendChild(calque);
      var x = 0;
      var y = 0;
      var attente = false;
      function deplacer() { attente = false; disque.style.transform = "translate(" + (x - rayon).toFixed(1) + "px, " + (y - rayon).toFixed(1) + "px)"; }
      function suivre(evenement) {
        /* Position rapportée au calque lui-même (il bouge avec la carte qui se soulève, et commence sous son filet). */
        var r = calque.getBoundingClientRect();
        x = evenement.clientX - r.left;
        y = evenement.clientY - r.top;
        if (!attente) { attente = true; window.requestAnimationFrame(deplacer); }
      }
      carte.addEventListener("pointerenter", function (e) { suivre(e); deplacer(); }, { passive: true });
      carte.addEventListener("pointermove", suivre, { passive: true });
    });
  }

  /* ---------- MV-07 : transitions entre pages, simulées (fichiers ouverts en local) ---------- */
  var CLE_REPERE = "mv-repere";
  function repereCourant() {
    var candidats = tous('header[data-commun="entete"] .entete__navigation [aria-current="page"], header[data-commun="entete"] .entete__actions [aria-current="page"]');
    for (var i = 0; i < candidats.length; i++) { if (rendu(candidats[i])) { return candidats[i]; } }
    return null;
  }
  function boiteRepere(lien) {
    var r = lien.getBoundingClientRect();
    var retrait = parseFloat(window.getComputedStyle(lien, "::after").left) || 0;
    return { gauche: r.left + retrait, largeur: Math.max(1, r.width - 2 * retrait), largeurFenetre: window.innerWidth };
  }
  function initTransitions() {
    function sortir(adresse) {
      var repere = repereCourant();
      ecrireStockage("sessionStorage", CLE_REPERE, repere ? JSON.stringify(boiteRepere(repere)) : null);
      racine.classList.add("mv-sortie");
      window.setTimeout(function () { window.location.href = adresse; }, T.sortie);
    }
    document.addEventListener("click", function (evenement) {
      if (evenement.defaultPrevented || evenement.button !== 0 || evenement.metaKey || evenement.ctrlKey || evenement.shiftKey || evenement.altKey) { return; }
      var lien = evenement.target && evenement.target.closest ? evenement.target.closest("a[href]") : null;
      if (!lien || lien.hasAttribute("target") || lien.hasAttribute("download")) { return; }
      var cible;
      try { cible = new URL(lien.getAttribute("href"), window.location.href); } catch (e) { return; }
      if (cible.protocol !== window.location.protocol || cible.host !== window.location.host) { return; }
      if (!/\.html?$/i.test(cible.pathname)) { return; }
      if (cible.pathname === window.location.pathname && cible.search === window.location.search && cible.hash) { return; }
      evenement.preventDefault();
      sortir(cible.href);
    });
    window.addEventListener("pageshow", function (evenement) {
      if (evenement.persisted) { racine.classList.remove("mv-sortie"); }
    });
    /* Le repère de page courante glisse depuis la place qu'il occupait sur la page quittée. */
    var memoire = lireStockage("sessionStorage", CLE_REPERE);
    ecrireStockage("sessionStorage", CLE_REPERE, null);
    var nouveau = repereCourant();
    if (!memoire || !nouveau || retourArriere) { return; }
    var ancien;
    try { ancien = JSON.parse(memoire); } catch (e) { return; }
    if (!ancien || ancien.largeurFenetre !== window.innerWidth) { return; }
    var ici = boiteRepere(nouveau);
    if (Math.abs(ancien.gauche - ici.gauche) < 1) { return; }
    nouveau.style.setProperty("--mv-repere-x", (ancien.gauche - ici.gauche).toFixed(1) + "px");
    nouveau.style.setProperty("--mv-repere-echelle", (ancien.largeur / ici.largeur).toFixed(4));
    nouveau.classList.add("mv-repere-depart");
    window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { nouveau.classList.remove("mv-repere-depart"); }); });
  }

  /* ---------- MV-08 : récit au défilement de la page Méthode ---------- */
  function initRecit() {
    var recit = document.querySelector("[data-mv-recit]");
    if (!recit) { return; }
    var scene = recit.querySelector(".recit__scene");
    var barre = recit.querySelector(".recit__barre");
    var etapes = tous(".recit__etape", recit);
    if (!scene || !etapes.length) { return; }
    var illustrations = etapes.map(function (etape) {
      var illustration = etape.querySelector("[data-mv-etape]");
      if (illustration) { scene.appendChild(illustration); }
      return illustration;
    });
    var active = -1;
    function maj() {
      var limite = window.innerHeight * SEUIL_RECIT;
      var n = 0;
      for (var i = 0; i < etapes.length; i++) { if (etapes[i].getBoundingClientRect().top <= limite) { n = i; } }
      if (n === active) { return; }
      active = n;
      etapes.forEach(function (etape, i) { etape.classList.toggle("est-active", i === active); });
      illustrations.forEach(function (illustration, i) { if (illustration) { illustration.classList.toggle("est-active", i === active); } });
      if (barre) { barre.style.setProperty("--mv-progression-recit", ((active + 1) / etapes.length).toFixed(4)); }
    }
    maj();
    surDefilement(maj);
  }

  /* ---------- Pause des animations : fige ce qui tourne en boucle (MV-04), mémorisée d'une page à l'autre ---------- */
  var CLE_PAUSE = "mv-pause";
  function initPause() {
    var boutons = tous("[data-mv-pause]");
    function appliquer(enPause) {
      racine.classList.toggle("mv-pause", enPause);
      /* Seul le libellé change, sans état pressé annoncé (choix Q1) ; l'icône suit la classe « mv-pause ». */
      boutons.forEach(function (bouton) {
        var libelle = bouton.querySelector(".pause-animations__libelle");
        if (libelle) { libelle.textContent = enPause ? "Relancer les animations" : "Mettre les animations en pause"; }
      });
    }
    appliquer(racine.classList.contains("mv-pause") || lireStockage("localStorage", CLE_PAUSE) === "1");
    boutons.forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        var enPause = !racine.classList.contains("mv-pause");
        appliquer(enPause);
        ecrireStockage("localStorage", CLE_PAUSE, enPause ? "1" : "0");
      });
    });
  }

  /* ---------- Démarrage ---------- */
  initPause();
  initTransitions();
  initRecit();
  initFrises();
  initCode();
  initLueurs();
  initApparitions();
  racine.classList.add("mv-pret");
  if (retourArriere) {
    racine.classList.add("mv-entree");
    window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { racine.classList.remove("mv-immediat"); }); });
  } else {
    window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { racine.classList.add("mv-entree"); }); });
  }
})();
