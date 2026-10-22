import { computeStats } from '../domain/salesStats.js';
import { EmailAddress } from '../domain/EmailAddress.js';

export class ReportService {
  constructor({ orderRepository, formatterRegistry, mailer, logger, featurePolicy = null }) {
    this.orderRepository = orderRepository;
    this.formatterRegistry = formatterRegistry;
    this.mailer = mailer;
    this.logger = logger;
    this.featurePolicy = featurePolicy;
  }

  get outbox() {
    return this.mailer ? this.mailer.outbox : [];
  }

  get history() {
    return this.logger ? this.logger.history : [];
  }

  generate(month, format, recipient) {
    if (this.featurePolicy) {
      this.featurePolicy.validate(format, recipient);
    }

    const orders = this.orderRepository.all();
    const stats = computeStats(orders, month);

    const formatter = this.formatterRegistry.get(format);
    const output = formatter.format(stats);

    const line = `[${new Date().toISOString()}] rapport ${month} (${format}): ${stats.count} commande(s)`;
    this.logger.info(line);

    if (recipient) {
      EmailAddress.validate(recipient);
      this.mailer.send({
        to: recipient,
        subject: `Rapport des ventes ${month}`,
        body: output
      });
    }

    return output;
  }
}

export class FreePlanPolicy {
  validate(format, recipient) {
    if (format !== 'csv') throw new Error('Format réservé aux comptes Pro');
    if (recipient) throw new Error('Envoi par e-mail réservé aux comptes Pro');
  }
}