import { TestBed } from '@angular/core/testing';
import { Icone, NOMS_ICONE } from './icone';

const SVG = 'http://www.w3.org/2000/svg';

function dessiner(nom: string): SVGSVGElement | null {
  const fixture = TestBed.createComponent(Icone);
  fixture.componentRef.setInput('nom', nom);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector('svg');
}

describe('Icone', () => {
  it('connaît les treize icônes de la charte', () => {
    expect([...NOMS_ICONE].sort()).toEqual(
      [
        ...['fleche', 'fleche-gauche', 'externe', 'telecharger', 'menu', 'fermer', 'valide'],
        ...['erreur', 'attention', 'info', 'reessayer', 'pause', 'lecture'],
      ].sort(),
    );
  });

  it.each(NOMS_ICONE)('dessine « %s » en SVG décoratif, hors de l’ordre du clavier', (nom) => {
    const svg = dessiner(nom);
    expect(svg?.namespaceURI).toBe(SVG);
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
  });

  it.each(NOMS_ICONE)('donne à chaque tracé de « %s » une longueur normalisée', (nom) => {
    const traces = [...(dessiner(nom)?.children ?? [])];
    expect(traces.length).toBeGreaterThan(0);
    for (const trace of traces) {
      expect(trace.namespaceURI).toBe(SVG);
      expect(['path', 'circle']).toContain(trace.localName);
      expect(trace.getAttribute(trace.localName === 'path' ? 'd' : 'r')).toMatch(/\d/);
      expect(trace.getAttribute('pathLength')).toBe('1');
    }
  });

  it('ne porte aucune couleur en dur : le trait prend la couleur du texte', () => {
    expect(dessiner('fleche')?.outerHTML).not.toMatch(/fill=|stroke=|#[0-9a-f]{3}|rgb|hsl/i);
  });
});
