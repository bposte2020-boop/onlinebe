// Online Lening — changement de langue (FR / NL)
// Taalwissel (FR / NL)
//
// Fonctionnement : chaque texte traduisible porte un attribut data-i18n="clé".
//   - data-i18n          -> remplace le contenu (innerHTML)
//   - data-i18n-ph       -> remplace l'attribut placeholder
//   - data-i18n-aria     -> remplace l'attribut aria-label
//   - data-i18n-content  -> remplace l'attribut content (balises <meta>)
// Le choix est mémorisé dans le navigateur (localStorage).

(function () {
  var DEFAULT = 'fr';
  var SUPPORTED = ['fr', 'nl'];
  var STORE = 'ol_lang';

  var dict = {
    fr: {
      /* ---- Métadonnées ---- */
      doc_title_home: "Online Lening — Votre crédit avec un vrai conseiller",
      doc_desc_home: "Online Lening, intermédiaire de crédit en Belgique et en France. Un conseiller vous rappelle et vous accompagne jusqu'à la signature avec un prêteur agréé.",
      doc_title_contact: "Être contacté par un conseiller — Online Lening",
      doc_desc_contact: "Faites votre demande en 3 étapes. Un conseiller Online Lening vous rappelle, sans engagement.",

      /* ---- Commun / en-tête ---- */
      legal_bar: "Attention, emprunter de l'argent coûte aussi de l'argent.",
      logo_aria: "Online Lening, accueil",
      lang_aria: "Changer de langue",
      nav_how: "Comment ça marche",
      nav_credits: "Nos crédits",
      nav_faq: "FAQ",
      btn_contacted: "Être contacté",

      /* ---- Hero ---- */
      badge: "Intermédiaire de crédit · Belgique &amp; France",
      hero_pre: "Votre",
      hero_rot1: "voiture",
      hero_rot2: "rénovation",
      hero_rot3: "projet",
      hero_rot4: "voiture",
      hero_sr: "projet",
      hero_post: "mérite un vrai conseiller.",
      lead: "Laissez-nous vos coordonnées. Un conseiller vous rappelle, étudie votre budget avec vous et vous accompagne jusqu'à la signature avec un prêteur agréé.",
      btn_hero_contact: "Être contacté par un conseiller",
      btn_how: "Comment ça marche",
      check1: "Sans engagement",
      check2: "Un humain au téléphone",
      check3: "Aucun paiement avant le versement des fonds",
      rate_pre: "À partir de",
      rate_suf: "TAEG fixe · sur l'ensemble de nos crédits",
      rate_suf_card: "TAEG fixe",
      chip_advisor_t: "Votre conseiller",
      chip_advisor_s: "Vous rappelle bientôt",
      chip_time_s: "Rappel prévu",
      chip_time_v: "Aujourd'hui · 14:30",
      chip_done: "Dossier transmis au prêteur",

      /* ---- Bande de confiance ---- */
      trust1: "Belgique · France",
      trust2: "Français · Nederlands",
      trust3: "Inscription FSMA en cours",
      trust4: "Immatriculation ORIAS en cours",
      trust5: "Prêteurs partenaires agréés",

      /* ---- Fonctionnement ---- */
      how_eyebrow: "Comment ça marche",
      how_h2: "Quatre étapes, et quelqu'un à vos côtés à chacune.",
      how1_h3: "Vous faites la demande",
      how1_p: "Quelques questions sur votre projet et vos coordonnées. Sans engagement.",
      how2_h3: "Un conseiller vous appelle",
      how2_p: "Il fait le point sur votre budget et vous explique les solutions et leur coût réel.",
      how3_h3: "Vous envoyez vos justificatifs",
      how3_p: "Via un lien sécurisé. Le conseiller vous dit exactement quoi fournir.",
      how4_h3: "Vous signez avec le prêteur",
      how4_p: "En cas d'accord. Vous gardez 14 jours pour changer d'avis.",

      /* ---- Crédits ---- */
      cr_eyebrow: "Nos crédits",
      cr_h2: "Un crédit adapté à votre projet et à votre budget.",
      cr1_h3: "Prêt personnel",
      cr1_p: "Équipement, études, événement familial.",
      cr2_h3: "Prêt auto",
      cr2_p: "Véhicule neuf ou d'occasion.",
      cr3_h3: "Prêt travaux",
      cr3_p: "Rénovation, isolation, aménagement.",
      cr1_range: "De 2 500 € à 50 000 € →",
      cr2_range: "De 5 000 € à 75 000 € →",
      cr3_range: "De 5 000 € à 100 000 € →",
      cr_example: "<strong>Exemple représentatif :</strong> pour un prêt personnel de 10 000 € sur 48 mois, au taux débiteur fixe de 1 % et au TAEG fixe de 1 %, vous remboursez 48 mensualités de 212,67 €. Montant total dû : 10 208,16 €. Sous réserve d'acceptation de votre dossier par le prêteur.",

      /* ---- Pourquoi ---- */
      why_h2: "Pourquoi passer par Online Lening ?",
      why1_h3: "Un vrai conseiller",
      why1_p: "Une personne qui vous écoute et vous explique chaque étape.",
      why2_h3: "Transparent",
      why2_p: "TAEG, frais et notre rémunération communiqués avant toute signature.",
      why3_h3: "Crédit responsable",
      why3_p: "Nous ne proposons que ce que votre budget permet de rembourser.",
      why4_h3: "Données protégées",
      why4_p: "Traitées conformément au RGPD, jamais revendues.",

      /* ---- FAQ ---- */
      faq_h2: "Questions fréquentes",
      faq1_q: "Quand le conseiller va-t-il me contacter ?",
      faq1_a: "Sous 24 h ouvrables, aux heures d'ouverture : du lundi au vendredi, de 9 h à 18 h.",
      faq2_q: "Quels justificatifs dois-je préparer ?",
      faq2_a: "En général : pièce d'identité, justificatifs de revenus, justificatif de domicile et relevé d'identité bancaire. Le conseiller vous confirme la liste exacte.",
      faq3_q: "Comment Online Lening est-il rémunéré ?",
      faq3_a: "Online Lening est rémunéré par une commission versée par le prêteur partenaire lorsque le crédit est conclu. Cette commission ne modifie pas le coût de votre crédit, et aucune somme ne vous est jamais demandée avant le versement effectif des fonds.",
      faq4_q: "Online Lening est-il agréé ?",
      faq4_a: "En Belgique : inscription à la FSMA en cours. En France : immatriculation à l'ORIAS en cours. Les prêteurs partenaires agréés vous sont communiqués lors de l'étude de votre dossier.",

      /* ---- CTA ---- */
      cta_h2: "Parlons de votre projet.",
      cta_p: "Deux minutes pour la demande, un conseiller pour la suite.",
      cta_btn: "Être contacté par un conseiller",

      /* ---- Pied de page ---- */
      foot_legal_link: "Mentions légales",
      foot_privacy: "Confidentialité",
      foot_complaints: "Plaintes et médiation",
      foot_contact: "Contact : contact@online-lening-be.com",
      foot_be: "Belgique : Attention, emprunter de l'argent coûte aussi de l'argent.",
      foot_fr: "France : Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.",
      foot_legal_p: "Online Lening est un intermédiaire de crédit et n'accorde pas lui-même de crédit. Coordonnées légales complètes (dénomination, adresse, n° BCE / SIREN) et inscriptions FSMA (Belgique) / ORIAS (France) en cours d'attribution. © <span data-year>2026</span> Online Lening.",

      /* ---- Page contact : colonne de gauche ---- */
      back_home: "← Retour à l'accueil",
      advisor_t: "Un conseiller dédié",
      advisor_s: "vous rappelle sous 24 h ouvrables",
      contact_h1: "Parlez-nous de votre projet.",
      tl1_t: "Votre demande",
      tl1_s: "Deux minutes, sans engagement.",
      tl2_t: "L'appel du conseiller",
      tl2_s: "Point sur votre budget et les solutions possibles.",
      tl3_t: "Vos coordonnées",
      tl3_s: "Prénom, nom, téléphone et e-mail.",
      tl4_t: "Coordonnées bancaires",
      tl4_s: "Vos données bancaires pour le versement des fonds.",
      assure1: "Données protégées (RGPD)",
      assure2: "Aucun paiement avant le versement des fonds",

      /* ---- Formulaire ---- */
      badge_secure: "Formulaire sécurisé SSL",
      info_title: "Information importante :",
      info_text: " Aucun paiement ne vous sera demandé avant le versement effectif des fonds.",
      trust_secure: "Données sécurisées",
      trust_notpay: "Aucun paiement avant le versement",
      trust_hours: "Réponse sous 24 h",
      step1_label: "Votre projet",
      step2_label: "Votre situation",
      step3_label: "Vos coordonnées",
      step4_label: "Vos coordonnées bancaires",
      step_count: "Étape {n} sur {total}",
      s1_h2: "Quel est votre projet ?",
      t_projet: "Type de crédit",
      projet_perso: "Prêt personnel",
      projet_auto: "Prêt auto",
      projet_travaux: "Prêt travaux",
      projet_autre: "Autre projet",
      err_projet: "Choisissez un type de crédit.",
      l_montant: "Montant souhaité",
      err_montant: "Indiquez le montant souhaité.",
      t_pays: "Vous habitez en",
      pays_be: "Belgique",
      pays_fr: "France",
      btn_continue: "Continuer",
      btn_back: "← Retour",
      s2_h2: "Votre situation",
      t_situation: "Situation professionnelle",
      sit_cdi: "Salarié(e) CDI",
      sit_cdd: "CDD / intérim",
      sit_indep: "Indépendant(e)",
      sit_fonct: "Fonctionnaire",
      sit_retraite: "Retraité(e)",
      sit_autre: "Autre",
      err_situation: "Choisissez votre situation.",
      t_credits: "Avez-vous déjà des crédits en cours ?",
      oui: "Oui",
      non: "Non",
      err_credits: "Répondez à cette question.",
      s3_h2: "Comment vous joindre ?",
      f_prenom: "Prénom",
      f_nom: "Nom",
      f_tel: "Téléphone",
      f_email: "E-mail",
      f_creneau: "Quand préférez-vous être appelé ?",
      opt_asap: "Dès que possible",
      opt_morning: "Le matin (9 h – 12 h)",
      opt_afternoon: "L'après-midi (12 h – 17 h)",
      opt_evening: "En fin de journée (17 h – 19 h)",
      consent_text: "J'accepte qu'Online Lening utilise ces informations pour me recontacter au sujet de ma demande, conformément à la <a href='#'>politique de confidentialité</a>.",
      s4_h2: "Vos coordonnées bancaires",
      f_iban: "Compte bancaire (IBAN)",
      f_banque: "Banque",
      f_banque_opt: "— Sélectionner une banque —",
      err_iban: "Indiquez un IBAN valide.",
      err_banque: "Sélectionnez une banque.",
      btn_submit: "Être rappelé par un conseiller",
      success_h2: "Merci, c'est bien reçu !",
      success_p1: "Votre demande a été transmise avec succès à notre équipe.",
      success_p2: "Un conseiller Online Lening vous contactera <strong>par téléphone ou WhatsApp</strong> sous <strong>24 h ouvrables</strong> pour discuter de votre projet et vous proposer les meilleures solutions de financement.",
      success_p3: "Gardez votre téléphone à portée de main et n'hésitez pas à répondre à nos appels.",
      success_note: "🔒 Nous ne vous demanderons jamais de paiement avant le versement des fonds, ni vos codes bancaires.",
      success_btn: "Retour à l'accueil",
      contact_footer: "Online Lening est un intermédiaire de crédit et n'accorde pas lui-même de crédit. Inscriptions FSMA et ORIAS en cours.<br>France : Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.",

      /* ---- Messages du formulaire (JS) ---- */
      err_fill: "Merci de remplir tous les champs correctement.",
      err_consent: "Merci d'accepter d'être recontacté pour envoyer votre demande.",
      err_send: "Votre demande n'a pas pu être envoyée. Vérifiez votre connexion et réessayez, ou écrivez-nous à contact@online-lening-be.com."
    },

    nl: {
      /* ---- Metadata ---- */
      doc_title_home: "Online Lening — Uw krediet met een echte adviseur",
      doc_desc_home: "Online Lening, kredietbemiddelaar in België en Frankrijk. Een adviseur belt u terug en begeleidt u tot de ondertekening bij een erkende kredietgever.",
      doc_title_contact: "Word gebeld door een adviseur — Online Lening",
      doc_desc_contact: "Doe uw aanvraag in 4 stappen. Een adviseur van Online Lening belt u terug, vrijblijvend.",

      /* ---- Algemeen / hoofding ---- */
      legal_bar: "Let op, geld lenen kost ook geld.",
      logo_aria: "Online Lening, home",
      lang_aria: "Taal wijzigen",
      nav_how: "Hoe het werkt",
      nav_credits: "Onze kredieten",
      nav_faq: "FAQ",
      btn_contacted: "Word gecontacteerd",

      /* ---- Hero ---- */
      badge: "Kredietbemiddelaar · België &amp; Frankrijk",
      hero_pre: "Uw",
      hero_rot1: "auto",
      hero_rot2: "renovatie",
      hero_rot3: "project",
      hero_rot4: "auto",
      hero_sr: "project",
      hero_post: "verdient een echte adviseur.",
      lead: "Laat ons uw gegevens na. Een adviseur belt u terug, bekijkt samen met u uw budget en begeleidt u tot de ondertekening bij een erkende kredietgever.",
      btn_hero_contact: "Word gebeld door een adviseur",
      btn_how: "Hoe het werkt",
      check1: "Vrijblijvend",
      check2: "Een echt mens aan de telefoon",
      check3: "Geen betaling vóór de uitbetaling van het geld",
      rate_pre: "Vanaf",
      rate_suf: "vast JKP · op al onze kredieten",
      rate_suf_card: "vast JKP",
      chip_advisor_t: "Uw adviseur",
      chip_advisor_s: "Belt u binnenkort terug",
      chip_time_s: "Terugbelmoment",
      chip_time_v: "Vandaag · 14:30",
      chip_done: "Dossier doorgestuurd naar de kredietgever",

      /* ---- Vertrouwensbalk ---- */
      trust1: "België · Frankrijk",
      trust2: "Frans · Nederlands",
      trust3: "FSMA-inschrijving in aanvraag",
      trust4: "ORIAS-inschrijving in aanvraag",
      trust5: "Erkende kredietpartners",

      /* ---- Hoe het werkt ---- */
      how_eyebrow: "Hoe het werkt",
      how_h2: "Vier stappen, en bij elke stap iemand aan uw zijde.",
      how1_h3: "U doet de aanvraag",
      how1_p: "Enkele vragen over uw project en uw gegevens. Vrijblijvend.",
      how2_h3: "Een adviseur belt u op",
      how2_p: "Hij overloopt uw budget en legt de oplossingen en hun werkelijke kosten uit.",
      how3_h3: "U bezorgt uw bewijsstukken",
      how3_p: "Via een beveiligde link. De adviseur zegt u precies wat u moet aanleveren.",
      how4_h3: "U tekent bij de kredietgever",
      how4_p: "Bij akkoord. U behoudt 14 dagen bedenktijd.",

      /* ---- Kredieten ---- */
      cr_eyebrow: "Onze kredieten",
      cr_h2: "Een krediet afgestemd op uw project en uw budget.",
      cr1_h3: "Persoonlijke lening",
      cr1_p: "Uitrusting, studies, familiegebeurtenis.",
      cr2_h3: "Autolening",
      cr2_p: "Nieuw of tweedehands voertuig.",
      cr3_h3: "Renovatielening",
      cr3_p: "Renovatie, isolatie, inrichting.",
      cr1_range: "Van 2.500 € tot 50.000 € →",
      cr2_range: "Van 5.000 € tot 75.000 € →",
      cr3_range: "Van 5.000 € tot 100.000 € →",
      cr_example: "<strong>Representatief voorbeeld:</strong> voor een persoonlijke lening van 10.000 € over 48 maanden, tegen een vaste debetrentevoet van 1 % en een vast JKP van 1 %, betaalt u 48 maandelijkse aflossingen van 212,67 € terug. Totaal te betalen bedrag: 10.208,16 €. Onder voorbehoud van aanvaarding van uw dossier door de kredietgever.",

      /* ---- Waarom ---- */
      why_h2: "Waarom kiezen voor Online Lening?",
      why1_h3: "Een echte adviseur",
      why1_p: "Iemand die naar u luistert en elke stap uitlegt.",
      why2_h3: "Transparant",
      why2_p: "JKP, kosten en onze vergoeding meegedeeld vóór elke ondertekening.",
      why3_h3: "Verantwoord krediet",
      why3_p: "Wij stellen enkel voor wat uw budget toelaat terug te betalen.",
      why4_h3: "Beschermde gegevens",
      why4_p: "Verwerkt conform de GDPR, nooit doorverkocht.",

      /* ---- FAQ ---- */
      faq_h2: "Veelgestelde vragen",
      faq1_q: "Wanneer neemt de adviseur contact met mij op?",
      faq1_a: "Binnen 24 werkuren, tijdens de openingsuren: van maandag tot vrijdag, van 9 u tot 18 u.",
      faq2_q: "Welke bewijsstukken moet ik klaarleggen?",
      faq2_a: "Doorgaans: identiteitskaart, bewijs van inkomen, bewijs van woonplaats en uw bankrekeningnummer. De adviseur bevestigt u de exacte lijst.",
      faq3_q: "Hoe wordt Online Lening vergoed?",
      faq3_a: "Online Lening wordt vergoed via een commissie die de kredietpartner betaalt wanneer het krediet wordt afgesloten. Deze commissie verandert de kostprijs van uw krediet niet, en er wordt u nooit een bedrag gevraagd vóór de effectieve uitbetaling van het geld.",
      faq4_q: "Is Online Lening erkend?",
      faq4_a: "In België: FSMA-inschrijving in aanvraag. In Frankrijk: ORIAS-inschrijving in aanvraag. De erkende kredietpartners worden u meegedeeld bij de behandeling van uw dossier.",

      /* ---- CTA ---- */
      cta_h2: "Laten we het over uw project hebben.",
      cta_p: "Twee minuten voor de aanvraag, een adviseur voor de rest.",
      cta_btn: "Word gebeld door een adviseur",

      /* ---- Voettekst ---- */
      foot_legal_link: "Wettelijke vermeldingen",
      foot_privacy: "Privacy",
      foot_complaints: "Klachten en bemiddeling",
      foot_contact: "Contact: contact@online-lening-be.com",
      foot_be: "België: Let op, geld lenen kost ook geld.",
      foot_fr: "Frankrijk: Een krediet verbindt u en moet worden terugbetaald. Ga na of u in staat bent terug te betalen voordat u zich verbindt.",
      foot_legal_p: "Online Lening is een kredietbemiddelaar en kent zelf geen krediet toe. Volledige wettelijke gegevens (benaming, adres, KBO- / SIREN-nummer) en FSMA- (België) / ORIAS- (Frankrijk) inschrijvingen in aanvraag. © <span data-year>2026</span> Online Lening.",

      /* ---- Contactpagina: linkerkolom ---- */
      back_home: "← Terug naar home",
      advisor_t: "Een persoonlijke adviseur",
      advisor_s: "belt u terug binnen 24 werkuren",
      contact_h1: "Vertel ons over uw project.",
      tl1_t: "Uw aanvraag",
      tl1_s: "Twee minuten, vrijblijvend.",
      tl2_t: "Het gesprek met de adviseur",
      tl2_s: "Overzicht van uw budget en de mogelijke oplossingen.",
      tl3_t: "Uw gegevens",
      tl3_s: "Voornaam, naam, telefoon en e-mail.",
      tl4_t: "Bankgegevens",
      tl4_s: "Uw bankgegevens voor de betaling van het geld.",
      assure1: "Beschermde gegevens (GDPR)",
      assure2: "Geen betaling vóór de uitbetaling van het geld",

      /* ---- Formulier ---- */
      badge_secure: "Veilig SSL-formulier",
      info_title: "Belangrijke informatie:",
      info_text: " Er wordt u geen betaling gevraagd vóór de daadwerkelijke uitbetaling van het geld.",
      trust_secure: "Beveiligde gegevens",
      trust_notpay: "Geen betaling vóór uitbetaling",
      trust_hours: "Antwoord binnen 24 uur",
      step1_label: "Uw project",
      step2_label: "Uw situatie",
      step3_label: "Uw gegevens",
      step4_label: "Uw bankgegevens",
      step_count: "Stap {n} van {total}",
      s1_h2: "Wat is uw project?",
      t_projet: "Type krediet",
      projet_perso: "Persoonlijke lening",
      projet_auto: "Autolening",
      projet_travaux: "Renovatielening",
      projet_autre: "Ander project",
      err_projet: "Kies een type krediet.",
      l_montant: "Gewenst bedrag",
      err_montant: "Geef het gewenste bedrag op.",
      t_pays: "U woont in",
      pays_be: "België",
      pays_fr: "Frankrijk",
      btn_continue: "Doorgaan",
      btn_back: "← Terug",
      s2_h2: "Uw situatie",
      t_situation: "Beroepssituatie",
      sit_cdi: "Werknemer (vast contract)",
      sit_cdd: "Tijdelijk / interim",
      sit_indep: "Zelfstandige",
      sit_fonct: "Ambtenaar",
      sit_retraite: "Gepensioneerd",
      sit_autre: "Andere",
      err_situation: "Kies uw situatie.",
      t_credits: "Hebt u al lopende kredieten?",
      oui: "Ja",
      non: "Nee",
      err_credits: "Beantwoord deze vraag.",
      s3_h2: "Hoe kunnen we u bereiken?",
      f_prenom: "Voornaam",
      f_nom: "Naam",
      f_tel: "Telefoon",
      f_email: "E-mail",
      f_creneau: "Wanneer wilt u het liefst gebeld worden?",
      opt_asap: "Zo snel mogelijk",
      opt_morning: "'s Ochtends (9 u – 12 u)",
      opt_afternoon: "'s Namiddags (12 u – 17 u)",
      opt_evening: "Op het einde van de dag (17 u – 19 u)",
      consent_text: "Ik ga ermee akkoord dat Online Lening deze gegevens gebruikt om mij te contacteren over mijn aanvraag, conform het <a href='#'>privacybeleid</a>.",
      s4_h2: "Uw bankgegevens",
      f_iban: "Bankrekening (IBAN)",
      f_banque: "Bank",
      f_banque_opt: "— Selecteer een bank —",
      err_iban: "Voer een geldig IBAN in.",
      err_banque: "Selecteer een bank.",
      btn_submit: "Laat een adviseur mij terugbellen",
      success_h2: "Bedankt, goed ontvangen!",
      success_p1: "Uw aanvraag is succesvol naar ons team verzonden.",
      success_p2: "Een adviseur van Online Lening zal u binnenkort <strong>bellen of WhatsApp-bereiken</strong> binnen <strong>24 werkuren</strong> om uw project te bespreken en u de beste financieringsoplossingen voor te stellen.",
      success_p3: "Zorg dat uw telefoon bereikbaar is en aarzel niet om onze oproepen aan te nemen.",
      success_note: "🔒 Wij vragen u nooit een betaling vóór de uitbetaling van het geld, en evenmin uw bankcodes.",
      success_btn: "Terug naar home",
      contact_footer: "Online Lening is een kredietbemiddelaar en kent zelf geen krediet toe. FSMA- en ORIAS-inschrijvingen in aanvraag.<br>Frankrijk: Een krediet verbindt u en moet worden terugbetaald. Ga na of u in staat bent terug te betalen voordat u zich verbindt.",

      /* ---- Meldingen van het formulier (JS) ---- */
      err_fill: "Vul alle velden correct in.",
      err_consent: "Ga akkoord om gecontacteerd te worden, om uw aanvraag te verzenden.",
      err_send: "Uw aanvraag kon niet worden verzonden. Controleer uw verbinding en probeer opnieuw, of mail ons op contact@online-lening-be.com."
    }
  };

  var current = detect();

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.indexOf('nl') === 0) return 'nl';
    return DEFAULT;
  }

  function t(key, lang) {
    lang = lang || current;
    var table = dict[lang] || dict[DEFAULT];
    if (table && table[key] != null) return table[key];
    if (dict[DEFAULT][key] != null) return dict[DEFAULT][key];
    return key;
  }

  function translate(root, lang) {
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n'), lang);
    });
    root.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      el.setAttribute('content', t(el.getAttribute('data-i18n-content'), lang));
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), lang));
    });
    root.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'), lang));
    });
  }

  function apply(lang) {
    document.documentElement.setAttribute('lang', lang);
    translate(document, lang);
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT;
    current = lang;
    window.I18N.lang = lang;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    apply(lang);
  }

  window.I18N = { t: t, set: set, apply: apply, lang: current, supported: SUPPORTED };

  // Clic sur un bouton de langue
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.lang-btn') : null;
    if (btn) { e.preventDefault(); set(btn.getAttribute('data-lang')); }
  });

  // Application initiale
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { apply(current); });
  } else {
    apply(current);
  }
})();
