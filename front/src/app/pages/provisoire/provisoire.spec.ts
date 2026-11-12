import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Provisoire } from './provisoire';

describe('Provisoire', () => {
  it('should show the screen label of its route', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'contact', component: Provisoire, data: { ecran: 'EC-09 Contact' } },
        ]),
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/contact', Provisoire);
    const titre = harness.routeNativeElement?.querySelector('h1');
    expect(titre?.textContent?.trim()).toBe('EC-09 Contact');
    expect(titre?.querySelector('.provisoire__ecran')?.textContent).toBe('EC-09');
  });

  describe('variante de la page introuvable', () => {
    /** Les mentions de la page provisoire de l'adresse, sous son titre. */
    async function mentions(adresse: string): Promise<string[]> {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            {
              path: 'projets/404',
              component: Provisoire,
              data: { variante: 'projet-inexistant', ecran: 'EC-11 Page introuvable' },
            },
            { path: 'contact', component: Provisoire, data: { ecran: 'EC-09 Contact' } },
          ]),
        ],
      });
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl(adresse, Provisoire);
      const elements = harness.routeNativeElement?.querySelectorAll('.provisoire__mention') ?? [];
      return [...elements].map((mention) => mention.textContent?.trim() ?? '');
    }

    it('l’affiche quand sa route en a une', async () => {
      expect(await mentions('/projets/404')).toEqual([
        'Page provisoire',
        'Variante projet-inexistant',
      ]);
    });

    it('n’en affiche aucune quand sa route n’en a pas', async () => {
      expect(await mentions('/contact')).toEqual(['Page provisoire']);
    });
  });
});
