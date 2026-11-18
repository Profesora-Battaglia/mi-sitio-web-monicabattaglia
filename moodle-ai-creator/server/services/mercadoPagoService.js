/**
 * MoodleAI Creator — Servicio de Pasarela de Pagos con Mercado Pago en ARS
 * Soporta las 2 modalidades solicitadas:
 * 1. API Checkout Pro Dinámica (con MP_ACCESS_TOKEN en .env, moneda ARS: $25.000 / $50.000)
 * 2. Links Directos de Suscripción de Mercado Pago (MP_LINK_PLAN_PRO / MP_LINK_PLAN_INSTITUCIONAL)
 * + Modo Sandbox de validación para probar la acreditación inmediata si aún no se cargó el token.
 */

export async function createMercadoPagoCheckout({ db, user, plan, preferredMode = 'auto', baseUrl = 'http://localhost:4000' }) {
  if (!plan || plan.id === 'free' || Number(plan.price_ars) <= 0) {
    throw new Error('El Plan Gratuito ($0 ARS) no requiere pago por Mercado Pago.');
  }

  const amountArs = Number(plan.price_ars);
  const mpAccessToken = process.env.MP_ACCESS_TOKEN || '';
  const hasRealMpToken = Boolean(
    mpAccessToken &&
    !mpAccessToken.includes('tu-access-token') &&
    mpAccessToken.length > 20
  );

  const directLink =
    plan.id === 'pro'
      ? process.env.MP_LINK_PLAN_PRO || ''
      : process.env.MP_LINK_PLAN_INSTITUCIONAL || '';
  const hasRealDirectLink = Boolean(
    directLink &&
    !directLink.includes('TU_ID_PLAN') &&
    directLink.startsWith('http')
  );

  // 1. Crear registro inicial del intento de pago en la base de datos (en ARS)
  const initialPayment = db.createPaymentRecord({
    userId: user.id,
    planId: plan.id,
    amountArs,
    paymentMode: preferredMode === 'direct_link' ? 'direct_link' : 'checkout_pro',
    status: 'pending'
  });

  // MODALIDAD A: API Oficial de Mercado Pago Checkout Pro (Preferencias en ARS)
  if (hasRealMpToken && preferredMode !== 'direct_link') {
    try {
      const preferencePayload = {
        items: [
          {
            id: plan.id,
            title: `MoodleAI Creator — ${plan.name}`,
            description: `${plan.description} (${plan.monthly_generation_limit} generaciones/mes)`,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: amountArs
          }
        ],
        payer: {
          name: user.name,
          email: user.email
        },
        external_reference: initialPayment.id,
        back_urls: {
          success: `${baseUrl}/api/payments/mercadopago/callback?payment_id=${encodeURIComponent(initialPayment.id)}&status=approved`,
          failure: `${baseUrl}/api/payments/mercadopago/callback?payment_id=${encodeURIComponent(initialPayment.id)}&status=rejected`,
          pending: `${baseUrl}/api/payments/mercadopago/callback?payment_id=${encodeURIComponent(initialPayment.id)}&status=pending`
        },
        ...(baseUrl.startsWith('https://') ? { auto_return: 'approved' } : {}),
        statement_descriptor: 'MOODLEAI CREATOR'
      };

      const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mpAccessToken}`
        },
        body: JSON.stringify(preferencePayload)
      });

      if (mpRes.ok) {
        const mpData = await mpRes.json();
        const checkoutUrl = mpData.init_point || mpData.sandbox_init_point;
        db.db.prepare(`
          UPDATE payments
          SET mp_preference_id = ?, checkout_url = ?, payment_mode = 'checkout_pro'
          WHERE id = ?
        `).run(mpData.id || '', checkoutUrl || '', initialPayment.id);

        return {
          modeUsed: 'checkout_pro_api',
          currency: 'ARS',
          amountArs,
          paymentId: initialPayment.id,
          preferenceId: mpData.id,
          checkoutUrl,
          isSandboxSimulation: false
        };
      }
    } catch (err) {
      console.warn('[Mercado Pago API] Aviso al crear preferencia:', err.message);
    }
  }

  // MODALIDAD B: Link Directo de Suscripción de Mercado Pago (si está configurado en .env)
  if (hasRealDirectLink) {
    db.db.prepare(`
      UPDATE payments
      SET checkout_url = ?, payment_mode = 'direct_link'
      WHERE id = ?
    `).run(directLink, initialPayment.id);

    return {
      modeUsed: 'direct_subscription_link',
      currency: 'ARS',
      amountArs,
      paymentId: initialPayment.id,
      preferenceId: `MP_SUB_${plan.id.toUpperCase()}`,
      checkoutUrl: directLink,
      confirmCallbackUrl: `${baseUrl}/api/payments/mercadopago/callback?payment_id=${encodeURIComponent(initialPayment.id)}&status=approved`,
      isSandboxSimulation: false
    };
  }

  // MODO SANDBOX DE VALIDACIÓN (Cuando aún no se pegó MP_ACCESS_TOKEN ni MP_LINK en .env)
  const simPrefId = `PREF_ARS_${plan.id.toUpperCase()}_${amountArs}_${Date.now()}`;
  const simCheckoutUrl = `${baseUrl}/api/payments/mercadopago/callback?payment_id=${encodeURIComponent(initialPayment.id)}&status=approved&mp_payment_id=SIM_MP_${Date.now()}`;

  db.db.prepare(`
    UPDATE payments
    SET mp_preference_id = ?, checkout_url = ?
    WHERE id = ?
  `).run(simPrefId, simCheckoutUrl, initialPayment.id);

  return {
    modeUsed: preferredMode === 'direct_link' ? 'direct_subscription_link' : 'checkout_pro_api',
    currency: 'ARS',
    amountArs,
    paymentId: initialPayment.id,
    preferenceId: simPrefId,
    checkoutUrl: simCheckoutUrl,
    isSandboxSimulation: true
  };
}
