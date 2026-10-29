import type { Type } from '@angular/core';
import type { CleIllustration } from '../../interfaces/contenu';
import { DemonstrationBarres } from './demonstration-barres/demonstration-barres';
import { DemonstrationCouches } from './demonstration-couches/demonstration-couches';
import { DemonstrationSchema } from './demonstration-schema/demonstration-schema';
import { DemonstrationValidation } from './demonstration-validation/demonstration-validation';

/** Le dessin de chaque clé que methode.json peut citer : le contenu ne porte que la clé (PF-02). */
export const illustrationsMethode = {
  'demonstration-schema': DemonstrationSchema,
  'demonstration-barres': DemonstrationBarres,
  'demonstration-couches': DemonstrationCouches,
  'demonstration-validation': DemonstrationValidation,
} satisfies Record<CleIllustration, Type<unknown>>;
