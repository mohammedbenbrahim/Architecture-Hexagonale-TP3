# Grille de Revue Croisée

- [x] Les tests de caractérisation passent, avec les mêmes valeurs attendues qu'au départ.
- [x] Aucun `new` d'infrastructure (fichier, SMTP, console) dans `application/` ni `domain/`.
- [x] Aucun `if / switch` sur le format dans `ReportService`.
- [x] L'offre gratuite n'est plus une sous-classe qui lève des exceptions.
- [x] Plus aucun mot de passe dans le code (injection via l'environnement dans la composition root).

### Remarques du binôme relecteur
* **Qualité :** L'utilisation du registre de formatteurs (`FormatterRegistry`) combinée à la Composition Root (`main.js`) offre une séparation exemplaire entre la logique métier et l'infrastructure.
* **Amélioration :** On pourrait abstraire le validateur d'e-mail dans une fonction utilitaire réutilisable ou un Value Object dédié plus strict pour éviter la duplication de logique de validation.