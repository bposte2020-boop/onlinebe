# Online Lening — site (front-end)

Site statique en HTML, CSS et JavaScript, sans framework ni installation.

## Contenu

```
online-lening/
├── index.html      Page d'accueil
├── contact.html    Formulaire « Être contacté » en 3 étapes
├── css/style.css   Tous les styles et les animations
├── js/i18n.js      Changement de langue (FR / NL) et toutes les traductions
├── js/main.js      Animations au défilement (accueil)
├── js/contact.js   Étapes du formulaire, vérifications et envoi
├── img/logo.png    Votre logo
└── worker/         Relais du formulaire à déployer séparément (NE PAS mettre en ligne avec le site)
    ├── worker.js      Le relais Cloudflare (reçoit la demande, l'envoie à Discord)
    └── wrangler.toml   Configuration de déploiement
```

## Changer de langue (français / néerlandais)

Un sélecteur **FR / NL** est présent en haut de chaque page. Le choix du visiteur
est mémorisé dans son navigateur, et la langue d'ouverture s'adapte à celle du
navigateur (néerlandais → NL, sinon français).

Tous les textes sont rassemblés dans `js/i18n.js`, dans deux dictionnaires `fr` et
`nl`. Pour corriger ou compléter une traduction, modifiez simplement la valeur de
la clé correspondante dans ce fichier. Pour ajouter un texte dans une page,
donnez à l'élément un attribut `data-i18n="ma_cle"` (ou `data-i18n-ph`,
`data-i18n-aria`, `data-i18n-content` pour un placeholder, un `aria-label` ou une
balise `<meta>`) puis ajoutez `ma_cle` dans les deux dictionnaires.

> Les **valeurs** envoyées au conseiller (type de crédit, situation, etc.) restent
> en français quelle que soit la langue affichée, pour ne pas perturber le
> traitement des demandes. La langue choisie est jointe à la demande (champ `langue`).

## Tester sur votre ordinateur

Ouvrez `index.html` dans votre navigateur (double-clic). Tout fonctionne.
Tant que l'envoi n'est pas configuré, le formulaire est en **mode test** : il affiche la confirmation, et la demande apparaît dans la console du navigateur (F12 → Console).

## Mettre en ligne

Ces fichiers fonctionnent chez n'importe quel hébergeur : Netlify, Vercel, Cloudflare Pages, OVH, Hostinger…
Avec Netlify ou Cloudflare Pages, il suffit de glisser-déposer le dossier `online-lening`.

## Brancher le formulaire sur Discord

Le relais est déjà écrit dans le dossier `worker/`. Il reçoit la demande et la
transmet à Discord, tout en gardant l'URL du webhook **secrète**.

1. Dans Discord : *Paramètres du salon → Intégrations → Webhooks → Nouveau webhook*, puis **Copier l'URL**.
2. Installez l'outil Cloudflare : `npm install -g wrangler`
3. Dans le dossier `worker/` : `wrangler login` puis `wrangler deploy`
4. Enregistrez le webhook comme secret : `wrangler secret put DISCORD_WEBHOOK_URL` (collez l'URL de l'étape 1).
5. Copiez l'URL du Worker (affichée après `deploy`) dans `js/contact.js` → `CONFIG.endpoint`.

Tant que `CONFIG.endpoint` est vide, le site reste en **mode test** (rien n'est envoyé).

⚠️ Ne mettez **jamais** l'URL du webhook Discord directement dans `contact.js` : elle serait visible par tous les visiteurs. Elle ne vit que dans le secret du Worker.

ℹ️ Vous recevez plutôt les demandes par e-mail ? Le relais peut être adapté pour cela — demandez-le.

## À compléter avant la mise en ligne

- **Numéros réglementaires** : remplacez « inscription FSMA / ORIAS en cours », les n° BCE / SIREN, la dénomination sociale et l'adresse par vos vraies données (dans `js/i18n.js`). ⚠️ Se présenter comme intermédiaire de crédit sans inscription FSMA (Belgique) / ORIAS (France) réelle est interdit.
- **Pages légales** : les liens « Mentions légales / Confidentialité / Plaintes » du pied de page pointent sur `#` (à créer plus tard). Un site de crédit doit légalement disposer de ces mentions avant d'opérer.
- **Coordonnées** : ajoutez un vrai numéro de téléphone si vous en voulez un affiché. L'e-mail `contact@online-lening-be.com` doit être actif (MX Zoho dans le DNS).
- **Chiffres du crédit** : vérifiez le taux (1 %), l'exemple représentatif et les fourchettes de montants dans `js/i18n.js`.
- **Formulaire** : déployez le relais (`worker/`) et renseignez `CONFIG.endpoint`.

Presque tout le texte vit désormais dans `js/i18n.js` (dictionnaires `fr` et `nl`) ; les pages HTML n'en gardent qu'une copie de secours synchronisée.
