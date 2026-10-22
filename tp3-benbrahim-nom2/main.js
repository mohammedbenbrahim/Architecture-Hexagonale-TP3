import { ReportService } from './application/ReportService.js';
import { JsonFileOrderRepository } from './infrastructure/JsonFileOrderRepository.js';
import { SmtpMailer } from './infrastructure/SmtpMailer.js';
import { ConsoleLogger } from './infrastructure/ConsoleLogger.js';
import { FormatterRegistry } from './formatters/FormatterRegistry.js';
import { CsvFormatter } from './formatters/CsvFormatter.js';
import { HtmlFormatter } from './formatters/HtmlFormatter.js';
import { JsonFormatter } from './formatters/JsonFormatter.js';

export function buildReportService(featurePolicy = null) {
  const dbFile = new URL('./orders.json', import.meta.url);
  const orderRepository = new JsonFileOrderRepository(dbFile);

  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.shoplite.fr',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || 'reports',
    password: process.env.SMTP_PASSWORD || 'ShopLite!'
  };

  const mailer = new SmtpMailer(smtpConfig);
  const logger = new ConsoleLogger();

  const formatterRegistry = new FormatterRegistry();
  formatterRegistry.register('csv', new CsvFormatter());
  formatterRegistry.register('html', new HtmlFormatter());
  formatterRegistry.register('json', new JsonFormatter());

  return new ReportService({
    orderRepository,
    formatterRegistry,
    mailer,
    logger,
    featurePolicy
  });
}