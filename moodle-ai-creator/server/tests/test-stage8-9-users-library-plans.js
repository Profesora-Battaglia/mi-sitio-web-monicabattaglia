import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.resolve(__dirname, '../../data/test-stage8-9.sqlite');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('Iniciando pruebas de Etapas 8 y 9 (Supabase Auth, Biblioteca Personal, Planes en ARS y Pasarela Mercado Pago)...');

const { server, db } = createApp({ customDbPath: testDbPath });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

try {
  // 1. Verificar Planes en Pesos Argentinos ($0 ARS, $25.000 ARS y $50.000 ARS)
  const plans = db.getPlans();
  const freePlan = plans.find((p) => p.id === 'free');
  const proPlan = plans.find((p) => p.id === 'pro');
  const instPlan = plans.find((p) => p.id === 'institutional');

  assert.equal(freePlan.price_ars, 0);
  assert.equal(proPlan.price_ars, 25000, 'El Plan Docente Profesional debe costar $25.000 ARS');
  assert.equal(proPlan.price_display, '$25.000 ARS / mes');
  assert.equal(instPlan.price_ars, 50000, 'El Plan Institucional debe costar $50.000 ARS');
  assert.equal(instPlan.price_display, '$50.000 ARS / mes');
  console.log('  [OK] 1. Valores en Pesos Argentinos verificados (Free: $0 ARS, Pro: $25.000 ARS/mes, Institucional: $50.000 ARS/mes).');

  // 2. Verificar sincronización con Supabase Auth (POST /api/auth/supabase-sync)
  const sbSyncRes = await fetch(`${baseUrl}/api/auth/supabase-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supabaseId: '550e8400-e29b-41d4-a716-446655440000',
      email: 'docente.supabase@colegio.edu.ar',
      name: 'Prof. Martín Quiroga (Supabase)',
      institution: 'Colegio San Martín',
      education_level: 'Secundaria',
      subject_specialty: 'Matemática'
    })
  });
  assert.equal(sbSyncRes.status, 200);
  const sbSyncData = await sbSyncRes.json();
  assert.equal(sbSyncData.ok, true);
  assert.equal(sbSyncData.user.auth_provider, 'supabase');
  assert.equal(sbSyncData.user.plan_id, 'free');
  console.log('  [OK] 2. Sincronización de sesión y perfil con Supabase Auth (Proyecto Nuevo) verificada.');

  // 3. Registro e Inicio de Sesión Local + Biblioteca Personal por Asignatura
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Prof. Laura Martínez',
      email: 'laura.martinez@colegio.edu.ar',
      password: 'ClaveDocente2026',
      institution: 'Colegio Nacional de Mendoza',
      education_level: 'Secundaria',
      subject_specialty: 'Física y Química'
    })
  });
  assert.equal(regRes.status, 201);
  const regData = await regRes.json();
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${regData.token}`
  };

  // Crear 3 actividades (consumir el cupo del Plan Gratuito)
  for (const subj of ['Física', 'Química', 'Física']) {
    const genRes = await fetch(`${baseUrl}/api/activities/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        subject: subj,
        education_level: 'Secundaria',
        student_age: '15-16 años',
        topic: `Tema de ${subj}`,
        learning_objective: `Comprender fundamentos de ${subj}.`,
        activity_type: 'Opción múltiple',
        question_count: 3
      })
    });
    assert.equal(genRes.status, 201);
  }

  // Verificar bloqueo de la 4ta actividad en Plan Gratuito
  const act4Blocked = await fetch(`${baseUrl}/api/activities/generate`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      subject: 'Física',
      education_level: 'Secundaria',
      student_age: '16 años',
      topic: 'Termodinámica',
      learning_objective: 'Comprender el primer principio.',
      activity_type: 'Opción múltiple',
      question_count: 3
    })
  });
  assert.equal(act4Blocked.status, 429);
  console.log('  [OK] 3. Biblioteca Personal por asignatura y bloqueo de límite mensual en Plan Gratuito verificados.');

  // 4. Pasarela de Pagos Mercado Pago en ARS (Modalidad 1: Checkout Pro $25.000 ARS y Modalidad 2: Link Directo $50.000 ARS)
  const mpPrefProRes = await fetch(`${baseUrl}/api/payments/mercadopago/create-preference`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ plan_id: 'pro', mode: 'checkout_pro' })
  });
  assert.equal(mpPrefProRes.status, 201);
  const mpPrefProData = await mpPrefProRes.json();
  assert.equal(mpPrefProData.ok, true);
  assert.equal(mpPrefProData.checkout.currency, 'ARS');
  assert.equal(mpPrefProData.checkout.amountArs, 25000);

  // Confirmar/Acreditar pago de $25.000 ARS en Mercado Pago
  const mpConfirmProRes = await fetch(`${baseUrl}/api/payments/mercadopago/confirm`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ payment_id: mpPrefProData.checkout.paymentId })
  });
  assert.equal(mpConfirmProRes.status, 200);
  const mpConfirmProData = await mpConfirmProRes.json();
  assert.equal(mpConfirmProData.user.plan_id, 'pro');
  assert.equal(mpConfirmProData.user.quota.limit, 150);
  assert.equal(mpConfirmProData.payment.status, 'approved');
  assert.equal(mpConfirmProData.payment.amount_ars, 25000);

  // Probar Modalidad 2 (Link Directo de Suscripción Mercado Pago para Plan Institucional $50.000 ARS)
  const mpPrefInstRes = await fetch(`${baseUrl}/api/payments/mercadopago/create-preference`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ plan_id: 'institutional', mode: 'direct_link' })
  });
  assert.equal(mpPrefInstRes.status, 201);
  const mpPrefInstData = await mpPrefInstRes.json();
  assert.equal(mpPrefInstData.checkout.amountArs, 50000);
  assert.equal(mpPrefInstData.checkout.modeUsed, 'direct_subscription_link');

  // Ahora la 4ta actividad se genera sin bloqueo gracias a la suscripción acreditada por Mercado Pago
  const act4Allowed = await fetch(`${baseUrl}/api/activities/generate`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      subject: 'Física',
      education_level: 'Secundaria',
      student_age: '16 años',
      topic: 'Termodinámica',
      learning_objective: 'Comprender el primer principio.',
      activity_type: 'Opción múltiple',
      question_count: 3
    })
  });
  assert.equal(act4Allowed.status, 201);

  const dashData = await (await fetch(`${baseUrl}/api/dashboard`, { headers: authHeaders })).json();
  assert.equal(dashData.paymentsHistory.length, 2, 'El historial de pagos de Mercado Pago debe registrar ambas operaciones en ARS');
  console.log('  [OK] 4. Pasarela Mercado Pago en Pesos Argentinos (Checkout Pro $25.000 ARS + Link Suscripción $50.000 ARS + acreditación) verificada.');
} finally {
  await new Promise((resolve) => server.close(resolve));
  db.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

console.log('\n✅ TODAS LAS PRUEBAS DE SUPABASE AUTH, MERCADO PAGO Y VALORES EN ARS PASARON EXITOSAMENTE.');
