# Calculadora de Emissão de Carbono para Empresas de Logística

O projeto é uma atividade da disciplina de Engenharia de Software ofertada no CIn-UFPE. O projeto trata-se sobre desenvolver uma plataforma web responsiva que permita empresas de logística calcularem, monitorarem e reduzirem suas emissões de carbono. A solução visa promover práticas sustentáveis no setor logístico, fornecendo dados precisos, relatórios detalhados e insights para redução de impacto ambiental.

Na indústria de logística, as emissões de carbono representam uma preocupação significativa, especialmente em contextos de alta operação como grandes centros urbanos. Assim como a instabilidade climática pode prejudicar determinadas áreas, a falta de controle sobre as pegadas de carbono compromete a sustentabilidade do setor e a conformidade com regulamentos ambientais. Um modelo de Inteligência Artificial pode se mostrar uma ferramenta poderosa para calcular, analisar e sugerir formas de reduzir essas emissões. Este projeto tem como objetivo avaliar a eficácia de uma plataforma web responsiva, alimentada por IA, na predição e análise das pegadas de carbono, promovendo práticas sustentáveis e otimizando operações logísticas.

# Objetivos
Promover a Conscientização Ambiental: Ajudar as empresas a entender e gerenciar sua pegada de carbono.

Simplificar o Rastreamento de Emissões: Oferecer uma interface intuitiva para entrada de dados e cálculo.

Fomentar a Sustentabilidade: Oferecer recomendações acionáveis para a redução de emissões.


# Funcionalidades
Autenticação de Usuários: Login e registro seguros para usuários.

Perfis de Empresas: Permite que empresas criem e gerenciem perfis.

Cálculo de Emissões: Calcula emissões de carbono com base em atividades logísticas, incluindo consumo de combustível, distância percorrida e tipo de veículo.

Suporta múltiplos meios de transporte.

# Relatórios

Gera relatórios detalhados com visualizações.

Fornece recomendações para redução de emissões.

Integração com APIs: Conecta-se a APIs de terceiros para dados precisos de fatores de emissão.

# Diagrama C4
Nível 1: Contexto do Sistema

[ Usuário ] --> [ Aplicação Calculadora de Emissão de Carbono ]
Nível 2: Contêiner

[ Navegador ] --API--> [ Servidor Backend ] --> [ MongoDB ]


