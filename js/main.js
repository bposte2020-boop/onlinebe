// Online Lening — animations de la page d'accueil

// Apparition des sections au défilement
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Petit décalage entre les cartes d'une même grille
  items.forEach(function (el) {
    var parent = el.parentElement;
    var siblings = parent ? Array.prototype.filter.call(parent.children, function (c) { return c.classList.contains('reveal'); }) : [];
    var index = siblings.indexOf(el);
    if (index > 0) el.style.transitionDelay = (index * 0.08) + 's';
    observer.observe(el);
  });
})();

// Année dans le pied de page (réappliquée aussi après un changement de langue,
// car le texte traduit est réinjecté)
function setYear() {
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
}
setYear();
document.addEventListener('i18n:change', setYear);
