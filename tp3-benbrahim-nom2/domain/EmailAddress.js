export class EmailAddress {
  static validate(email) {
    if (!email || !email.includes('@')) {
      throw new Error(`Adresse invalide: ${email}`);
    }
    return email;
  }
}