import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Provisoire } from './provisoire';

describe('Provisoire', () => {
  it('should show the screen label of its route', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'parcours', component: Provisoire, data: { ecran: 'EC-02 Parcours' } },
        ]),
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/parcours', Provisoire);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('EC-02 Parcours');
  });
});
