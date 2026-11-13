// Largeur et hauteur d'une image WebP, lues dans son en-tête sans bibliothèque (RFC 9649) : le
// conteneur RIFF, puis le premier morceau, VP8 (avec perte), VP8L (sans perte) ou VP8X (étendu :
// transparence, animation, métadonnées). Rend null pour tout autre fichier.
export function dimensionsWebp(octets) {
  const riff = octets.length >= 25 && octets.toString('latin1', 0, 4) === 'RIFF';
  if (!riff || octets.toString('latin1', 8, 12) !== 'WEBP') return null;
  const morceau = octets.toString('latin1', 12, 16);
  // VP8L : la signature 2f, puis largeur − 1 et hauteur − 1 sur 14 bits chacune.
  if (morceau === 'VP8L' && octets[20] === 0x2f) {
    const bits = octets.readUInt32LE(21);
    return { largeur: (bits & 0x3fff) + 1, hauteur: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (octets.length < 30) return null;
  // VP8 : une image clé, code de départ 9d 01 2a, puis largeur et hauteur sur 14 bits chacune.
  if (morceau === 'VP8 ' && octets.readUIntBE(23, 3) === 0x9d012a) {
    return { largeur: octets.readUInt16LE(26) & 0x3fff, hauteur: octets.readUInt16LE(28) & 0x3fff };
  }
  // VP8X : largeur − 1 et hauteur − 1 du canevas, sur 24 bits chacune.
  if (morceau === 'VP8X') {
    return { largeur: octets.readUIntLE(24, 3) + 1, hauteur: octets.readUIntLE(27, 3) + 1 };
  }
  return null;
}
