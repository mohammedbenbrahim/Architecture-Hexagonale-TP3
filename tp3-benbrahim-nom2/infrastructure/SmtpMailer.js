export class SmtpMailer {
  constructor(smtpConfig) {
    this.smtpConfig = smtpConfig;
    this.outbox = [];
  }

  send({ to, subject, body }) {
    this.outbox.push({
      via: `${this.smtpConfig.host}:${this.smtpConfig.port}`,
      to,
      subject,
      body
    });
  }
}