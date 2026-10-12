import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const estilos = await readFile(new URL('../css/styles.css', import.meta.url), 'utf8');
const responsive = await readFile(new URL('../css/responsive.css', import.meta.url), 'utf8');

function luminancia(hex) {
  const canales = hex.match(/[a-f\d]{2}/gi).map((canal) => Number.parseInt(canal, 16) / 255);
  const lineales = canales.map((canal) => canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lineales[0] + 0.7152 * lineales[1] + 0.0722 * lineales[2];
}

function contraste(colorA, colorB) {
  const [claro, oscuro] = [luminancia(colorA), luminancia(colorB)].sort((a, b) => b - a);
  return (claro + 0.05) / (oscuro + 0.05);
}

test('define la paleta del proyecto y mantiene contraste legible', () => {
  assert.match(estilos, /--color-fondo:\s*#f5f2ec/i);
  assert.match(estilos, /--color-texto:\s*#171717/i);
  assert.match(estilos, /--color-texto-secundario:\s*#827c74/i);
  assert.match(estilos, /--color-fondo-lightbox:\s*#151515/i);
  assert.ok(contraste('#171717', '#f5f2ec') >= 4.5, 'el texto principal alcanza contraste AA');
  assert.ok(contraste('#827c74', '#f5f2ec') >= 3, 'el color secundario alcanza contraste para texto grande');
});

test('usa fuentes con alternativas locales y reglas responsive mobile first', () => {
  assert.match(estilos, /--fuente-editorial:[^;]*Georgia[^;]*serif/i);
  assert.match(estilos, /--fuente-interfaz:[^;]*Arial[^;]*sans-serif/i);
  assert.doesNotMatch(estilos, /@import\s+url\(['"]?https?:/i);
  assert.match(responsive, /@media\s*\(min-width:\s*48rem\)/i);
  assert.match(responsive, /@media\s*\(min-width:\s*75rem\)/i);
  assert.match(estilos, /prefers-reduced-motion:\s*reduce/i);
});

test('el retrato personal conserva su proporción intrínseca', () => {
  assert.match(estilos, /\.presentacion__retrato\s*\{[^}]*display:\s*block;[^}]*width:\s*min\(100%,\s*32rem\);/s);
  assert.match(estilos, /\.presentacion__retrato img\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto;/s);
  assert.doesNotMatch(estilos.match(/\.presentacion__retrato\s*\{[^}]*\}/s)?.[0] ?? '', /aspect-ratio/);
});
