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
});
