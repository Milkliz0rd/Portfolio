import type { Page } from '@playwright/test';

// « Tout le contenu visible » (TK-23) : aucun état caché du mouvement ne reste posé. Sont relevés
// les titres, paragraphes, liens, boutons, images et éléments de liste, plus tout élément qui porte
// lui-même du texte (un mot d'un titre révélé, par exemple). Chacun doit avoir une opacité calculée
// de 1, sur lui et sur chacun de ses ancêtres ; n'être ni en visibility: hidden, ni en
// display: none (lui ou un ancêtre) ; avoir une boîte non vide, qu'aucun ancêtre qui rogne
// (overflow: hidden ou clip) n'efface ; n'être sorti de sa boîte par aucune translation, la sienne
// ou celle d'un ancêtre. Hors du compte, cachés à dessein : ce qui n'est masqué qu'à l'écran pour
// les lecteurs d'écran (.masque-visuellement) et le décor masqué aux lecteurs d'écran
// (aria-hidden="true"). Les écrans emploient cette aide dans leurs propres scénarios.

const CONTENU = 'h1, h2, h3, h4, h5, h6, p, a, button, img, li, dt, dd';
const HORS_DU_COMPTE = '.masque-visuellement, [aria-hidden="true"]';

/** Les éléments de contenu de la page qui ne sont pas visibles, avec leur raison ; vide sinon. */
export function contenuCache(page: Page): Promise<string[]> {
  return page.evaluate(
    ({ contenu, horsDuCompte }) => {
      const nom = (e: Element) =>
        [e.tagName.toLowerCase(), ...[...e.classList].map((c) => `.${c}`)].join('');
      const texte = (e: Element) =>
        [...e.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
      // La translation d'un élément, en px : celle de transform, puis celle de translate.
      const translation = (e: HTMLElement, style: CSSStyleDeclaration) => {
        const matrice = new DOMMatrixReadOnly(
          style.transform === 'none' ? undefined : style.transform,
        );
        const [x = '0px', y = '0px'] = style.translate === 'none' ? [] : style.translate.split(' ');
        const px = (v: string, taille: number) =>
          v.endsWith('%') ? (parseFloat(v) * taille) / 100 : parseFloat(v);
        return [matrice.m41 + px(x, e.offsetWidth), matrice.m42 + px(y, e.offsetHeight)];
      };
      const raison = (element: Element): string | undefined => {
        const boite = element.getBoundingClientRect();
        for (let e: Element | null = element; e; e = e.parentElement) {
          const style = getComputedStyle(e);
          if (style.display === 'none') return `display: none sur ${nom(e)}`;
          if (style.opacity !== '1') return `opacité ${style.opacity} sur ${nom(e)}`;
          if (e instanceof HTMLElement) {
            const [dx = 0, dy = 0] = translation(e, style);
            // offsetWidth et offsetHeight sont arrondis au pixel : un pixel de tolérance.
            const sortie = (d: number, taille: number) => d !== 0 && Math.abs(d) >= taille - 1;
            if (sortie(dx, e.offsetWidth) || sortie(dy, e.offsetHeight)) {
              return `translaté hors de sa boîte (${Math.round(dx)} px, ${Math.round(dy)} px) : ${nom(e)}`;
            }
          }
          const rogne = [style.overflowX, style.overflowY].some(
            (o) => o === 'hidden' || o === 'clip',
          );
          if (e !== element && rogne) {
            const cadre = e.getBoundingClientRect();
            const largeur = Math.min(boite.right, cadre.right) - Math.max(boite.left, cadre.left);
            const hauteur = Math.min(boite.bottom, cadre.bottom) - Math.max(boite.top, cadre.top);
            if (largeur <= 0 || hauteur <= 0) return `rogné à zéro par ${nom(e)}`;
          }
        }
        const visibilite = getComputedStyle(element).visibility;
        if (visibilite !== 'visible') return `visibility: ${visibilite}`;
        if (boite.width === 0 || boite.height === 0) return 'boîte vide';
        return undefined;
      };
      const elements = [...document.body.querySelectorAll('*')].filter(
        (e) =>
          (e.matches(contenu) || (texte(e) && !e.matches('script, style, template, noscript'))) &&
          !e.closest(horsDuCompte),
      );
      return elements.flatMap((element) => {
        const pourquoi = raison(element);
        const extrait = (element.textContent ?? '').trim().slice(0, 40);
        return pourquoi ? [`${nom(element)} « ${extrait} » : ${pourquoi}`] : [];
      });
    },
    { contenu: CONTENU, horsDuCompte: HORS_DU_COMPTE },
  );
}
