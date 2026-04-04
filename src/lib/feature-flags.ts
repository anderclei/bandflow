export type SubscriptionPlan = 'ESSENTIAL' | 'PRO' | 'PREMIUM';

export type FeatureKey =
    | 'crm' // Deals & Contratantes
    | 'contracts' // Gerador de contratos dinâmicos
    | 'logistics_advanced' // Produção & Logística (Voos, Rooming, Fornecedores)
    | 'rider' // Palco & Técnica (Mapa de Palco, Input List)
    | 'finance_advanced' // Extrato & Splits (Rateio e divisões)
    | 'inventory' // Inventário de Equipamentos
    | 'epk' // Dossiê Eletrônico de Imprensa
    | 'merch' // Lojinha Front de Caixa
    | 'publishing' // Direitos setoriais e arrecadação
    | 'intelligence'; // IA e red flags comerciais

// Matriz de Liberação por Plano
const planFeatures: Record<SubscriptionPlan, FeatureKey[]> = {
    ESSENTIAL: [],
    PRO: [
        'crm',
        'contracts',
        'logistics_advanced',
        'rider',
        'finance_advanced',
        'inventory'
    ],
    PREMIUM: [
        'crm',
        'contracts',
        'logistics_advanced',
        'rider',
        'finance_advanced',
        'inventory',
        'epk',
        'merch',
        'publishing',
        'intelligence'
    ]
};

/**
 * Valida de forma síncrona se um plano tem acesso a uma funcionalidade.
 * Pode ser usado tanto em Server Components quanto em Client Components (passando o plano associado).
 */
export function hasFeature(plan: SubscriptionPlan | string | undefined | null, feature: FeatureKey): boolean {
    // Graceful fallback pra caso a banda seja "legada" ou não tenha tier asumimos Premium para não quebrar acesso
    if (!plan) return true;

    const normalizedPlan = plan.toUpperCase() as SubscriptionPlan;
    if (!planFeatures[normalizedPlan]) return true;

    return planFeatures[normalizedPlan].includes(feature);
}
