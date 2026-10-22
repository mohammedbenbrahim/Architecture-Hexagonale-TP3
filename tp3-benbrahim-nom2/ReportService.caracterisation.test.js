import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReportService } from './main.js';
import { FreePlanPolicy } from './application/ReportService.js';

test('CSV de septembre 2026 (commande annulée exclue)', () => {
  const service = buildReportService();
  const res = service.generate('2026-09', 'csv');
  assert.equal(
    res,
    'categorie; montant_ht\ninformatique;416\nlivres;135\nTOTAL HT;551\nTVA;110.2\nTOTAL TTC;661.2\n'
  );
});

test('HTML de septembre 2026', () => {
  const service = buildReportService();
  const res = service.generate('2026-09', 'html');
  assert.equal(
    res,
    '<h1>Ventes 2026-09</h1><p>3 commande(s), panier moyen 183.67 €</p><ul><li>informatique: 416 €</li><li>livres: 135 €</li></ul><p><b>Total TTC: 661.2 €</b></p>'
  );
});

test('JSON de septembre 2026', () => {
  const service = buildReportService();
  const res = service.generate('2026-09', 'json');
  const parsed = JSON.parse(res);
  assert.equal(parsed.month, '2026-09');
  assert.equal(parsed.count, 3);
  assert.equal(parsed.revenueHT, 551);
  assert.equal(parsed.vat, 110.2);
  assert.equal(parsed.revenueTTC, 661.2);
  assert.equal(parsed.average, 183.67);
});

test('mois sans commande totaux à zéro', () => {
  const service = buildReportService();
  const res = service.generate('2025-01', 'json');
  const parsed = JSON.parse(res);
  assert.equal(parsed.count, 0);
  assert.equal(parsed.revenueHT, 0);
  assert.equal(parsed.revenueTTC, 0);
});

test('format inconnu refusé', () => {
  const service = buildReportService();
  assert.throws(() => service.generate('2026-09', 'xml'), /Format non supporté/);
});

test('envoi par e-mail: un message dans la boîte d envoi', () => {
  const service = buildReportService();
  service.generate('2026-09', 'csv', 'chef@shoplite.fr');
  assert.equal(service.outbox.length, 1);
  assert.equal(service.outbox[0].to, 'chef@shoplite.fr');
});

test('adresse e-mail invalide refusée', () => {
  const service = buildReportService();
  assert.throws(() => service.generate('2026-09', 'csv', 'pasunmail'), /Adresse invalide/);
});

// 8ème test de caractérisation : CSV Octobre 2026
test('CSV d octobre 2026', () => {
  const service = buildReportService();
  const res = service.generate('2026-10', 'csv');
  assert.equal(
    res,
    'categorie; montant_ht\ninformatique;57\nTOTAL HT;57\nTVA;11.4\nTOTAL TTC;68.4\n'
  );
});

// Preuve OCP : Ajout du format Markdown sans modifier ReportService
test('un format Markdown s ajoute sans modifier ReportService', () => {
  const service = buildReportService();
  class MarkdownFormatter {
    format(stats) {
      return `# Ventes ${stats.month}\nTotal TTC: **${stats.revenueTTC} €**`;
    }
  }

  service.formatterRegistry.register('md', new MarkdownFormatter());
  const res = service.generate('2026-09', 'md');
  assert.equal(res, '# Ventes 2026-09\nTotal TTC: **661.2 €**');
});

// Test Offre Gratuite (Politique injectée)
test('Offre gratuite refuse les formats non CSV et les mails', () => {
  const freeService = buildReportService(new FreePlanPolicy());
  assert.doesNotThrow(() => freeService.generate('2026-09', 'csv'));
  assert.throws(() => freeService.generate('2026-09', 'html'), /réservé aux comptes Pro/);
  assert.throws(() => freeService.generate('2026-09', 'csv', 'test@shoplite.fr'), /réservé aux comptes Pro/);
});