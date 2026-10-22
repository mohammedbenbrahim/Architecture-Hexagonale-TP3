# Tableau des violations SOLID

| # | Principe | Ligne(s) | Problème | Conséquence concrète |
|---|---|---|---|---|
| 1 | S (Single Responsibility) | 20–73 | `ReportService` gère à la fois la lecture du fichier, le calcul financier, le formatage, la journalisation et l'envoi d'e-mails. | Toute modification sur la mise en forme ou le format d'e-mail risque d'introduire des régressions dans les calculs métier. |
| 2 | O (Open/Closed) | 43–55 | Utilisation de blocs `if / else if` pour basculer d'un format à un autre (`csv`, `html`, `json`). | Impossible d'ajouter un nouveau format (ex: PDF ou Markdown) sans modifier directement le code existant de `ReportService.js`. |
| 3 | L (Liskov Substitution) | 77–83 | `FreeReportService` hérite de `ReportService` mais lève des exceptions pour les formats non-CSV ou les envois d'e-mails. | Brise le principe de substitution : une instance de `FreeReportService` ne peut pas remplacer `ReportService` sans faire planter l'application. |
| 4 | D (Dependency Inversion) | 9–10, 16 | Instanciation directe de `fs.readFileSync` et couplage rigide à la configuration SMTP au sein du constructeur. | Impossible d'exécuter des tests unitaires isolés sans dépendre du fichier `orders.json` sur le disque dur. |
| 5 | Autre / Sécurité | 10 | Présence d'identifiants et mots de passe SMTP écrits en clair dans le code source. | Risque majeur d'exposition de secrets en cas de commit sur un dépôt Git distant. |