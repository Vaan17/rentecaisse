## A l'intention de l'ENI

### Pour tout test des fonctionnalités comportant l'envoi de mail

1. Créer à la racine du projet un fichier `.env.local`

2. Ajouter dans ce fichier :
```
URL_SITE=http://localhost:5173/
API_KEY_BREVO=xkeysib-1be07ad9b41293b46fbf77bddd45888c22c26b70c54d51fa5b4ff8d02>
EMAIL_SENDER=rentecaisse@gmail.com
```

Enregistrer et tester.

(Par principe de confidentialité, ce fichier ne doit pas être contenu dans un répertoire github, mais nous faisons exception dans le cas d'éventuels tests.)