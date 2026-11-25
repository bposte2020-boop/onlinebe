// Relais Online Lening — reçoit les demandes du formulaire et les transmet à Discord.
// Ce petit service tourne côté serveur (Cloudflare Workers) et garde l'URL du
// webhook Discord SECRÈTE : elle n'apparaît jamais dans le code du site public.
//
// --- Mise en place (une seule fois) ---
// 1. Dans Discord : Paramètres du salon > Intégrations > Webhooks > « Nouveau webhook »,
//    puis « Copier l'URL du webhook ».
// 2. Installez l'outil Cloudflare :   npm install -g wrangler
// 3. Depuis ce dossier « worker » :   wrangler login   puis   wrangler deploy
// 4. Enregistrez le webhook comme secret (il ne sera PAS visible) :
//       wrangler secret put DISCORD_WEBHOOK_URL
//    (collez l'URL copiée à l'étape 1)
// 5. Copiez l'URL du Worker affichée après « deploy »
//    (ex. https://online-lening-form.VOTRE-COMPTE.workers.dev)
//    dans js/contact.js -> CONFIG.endpoint
//
// Astuce : définissez ALLOWED_ORIGIN (dans wrangler.toml) sur votre domaine
// pour n'accepter que les demandes venant de votre site.

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);

    let data;
    try { data = await request.json(); }
    catch (e) { return json({ error: 'bad_request' }, 400, cors); }

    // Filet anti-robots : si le champ caché est rempli, on répond OK sans rien envoyer.
    if (data.site_web) return json({ ok: true }, 200, cors);

    const webhook = env.DISCORD_WEBHOOK_URL;
    if (!webhook) return json({ error: 'not_configured' }, 500, cors);

    const v = (k) => (data[k] != null && String(data[k]).trim() !== '' ? String(data[k]).slice(0, 500) : '—');
    const content = [
      '📩 **Nouvelle demande — Online Lening**',
      `**Projet :** ${v('projet')}   **Montant :** ${v('montant')} €   **Pays :** ${v('pays')}`,
      `**Situation :** ${v('situation')}   **Crédits en cours :** ${v('credits_en_cours')}`,
      `**Nom :** ${v('prenom')} ${v('nom')}`,
      `**Téléphone :** ${v('telephone')}   **E-mail :** ${v('email')}`,
      `**Créneau :** ${v('creneau')}   **Langue :** ${v('langue')}`,
      `**Reçu le :** ${v('date')}`
    ].join('\n');

    let upstream;
    try {
      upstream = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, allowed_mentions: { parse: [] } })
      });
    } catch (e) {
      return json({ error: 'upstream_unreachable' }, 502, cors);
    }

    if (!upstream.ok) return json({ error: 'upstream_error' }, 502, cors);
    return json({ ok: true }, 200, cors);
  }
};

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' }
  });
}
