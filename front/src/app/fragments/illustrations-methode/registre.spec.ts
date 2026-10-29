import { TestBed } from '@angular/core/testing';
import { CLES_ILLUSTRATION } from '../../interfaces/contenu';
import { illustrationsMethode } from './registre';

describe('illustrationsMethode', () => {
  it.each(CLES_ILLUSTRATION)('dessine « %s » en SVG décoratif, sans couleur en dur', (cle) => {
    const fixture = TestBed.createComponent(illustrationsMethode[cle]);
    fixture.detectChanges();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.outerHTML).not.toMatch(/fill=|stroke=|color|#[0-9a-f]{3}|rgb|hsl/i);
    // Ce que le récit au défilement anime (TK-55) : le rang de chaque pièce, le tracé normalisé.
    const pieces = [...(svg?.querySelectorAll('.recit__piece') ?? [])];
    expect(pieces.length).toBeGreaterThan(2);
    expect(pieces.every((piece) => /^--i: \d+;?$/.test(piece.getAttribute('style') ?? ''))).toBe(
      true,
    );
    const traces = [...(svg?.querySelectorAll('.recit__piece--trace') ?? [])];
    expect(traces.every((trace) => trace.getAttribute('pathLength') === '1')).toBe(true);
  });
});
