import { CoinEngine } from "../_engines/engine-coin-flip";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "coin-flip",
  category: "utility",
  icon: "coin",
  engine: { component: CoinEngine },
  related: ["dice-probability", "lottery-odds", "birthday-paradox"],
  copy: {
    en: {
      name: "Coin Flip Probability Calculator",
      tagline:
        "Binomial odds for n fair coin flips: P(exactly k heads), P(at least k) and P(at most k) — each one shown as the exact fraction C(n,k)/2ⁿ next to its decimal, for up to 52 flips.",
      intro: [
        "Three flips, two heads: the answer is 3/8, and the fraction is not a rounding artifact — it is the actual count. There are 2³ = 8 head/tail sequences in total, and C(3,2) = 3 of them (HHT, HTH, THH) have exactly two heads. That is the entire binomial formula C(n,k)/2ⁿ, and this calculator shows it as a fraction and a decimal side by side for every question you might ask: exactly k heads, at least k, at most k.",
        "The “at least” and “at most” columns are where intuition fails. Flip a fair coin 10 times and P(at least one head) is 1023/1024 — tails ten times in a row is a 1-in-1024 event, far rarer than people expect when they say “it has to come up eventually”. Every row of the table spells out its sequence count, so the shape of the binomial triangle — peak at n/2, thin tails — is visible instead of asserted.",
      ],
      steps: [
        "Enter the number of flips n (1–52).",
        "Enter the number of heads k you want to ask about.",
        "Read P(exactly k), P(at least k) and P(at most k) as exact fractions and decimals.",
        "Scan the table to see C(n,i) for every head count from 0 to n.",
      ],
      faqs: [
        {
          q: "What formula does the calculator use?",
          a: "The binomial distribution. A fair coin makes every one of the 2ⁿ head/tail sequences equally likely, and C(n,k) of them contain exactly k heads, so P(exactly k) = C(n,k)/2ⁿ. The cumulative answers sum rows of Pascal's triangle: P(at least k) = Σ_{i=k..n} C(n,i)/2ⁿ and P(at most k) = Σ_{i=0..k} C(n,i)/2ⁿ.",
        },
        {
          q: "Why is the answer for 3 flips and 2 heads exactly 3/8?",
          a: "Because it is a count, not an estimate. The 8 equally likely sequences are HHH, HHT, HTH, HTT, THH, THT, TTH, TTT, and exactly 3 of them (HHT, HTH, THH) show two heads. 3/8 = 0.375 — the decimal stops, because the fraction already is the whole truth.",
        },
        {
          q: "How unlikely is a long run of tails?",
          a: "P(no heads in n flips) = 1/2ⁿ. Ten tails in a row: 1/1024 ≈ 0.098%. Twenty: about one in a million. The gambler's fallacy reads these small numbers as “a head is due” — but coins have no memory, and every individual flip stays 1/2 no matter what came before.",
        },
        {
          q: "Why does the calculator stop at 52 flips?",
          a: "The exact fraction C(n,k)/2ⁿ needs the denominator 2ⁿ to be a precisely-representable integer, which JavaScript guarantees only up to 2⁵³. At 52 flips the denominator 2⁵² ≈ 4.5 quadrillion still qualifies; beyond it the site would have to round the very numbers it promises to show exactly, so it declines.",
        },
      ],
    },
    zh: {
      name: "抛硬币概率计算器",
      tagline:
        "n 次公平抛硬币的二项分布:P(恰好 k 次正面)、P(至少 k 次)、P(至多 k 次)——每个都以精确分数 C(n,k)/2ⁿ 与小数并排展示,最多支持 52 次。",
      intro: [
        "抛三次、两次正面:答案是 3/8,这个分数不是舍入的产物——它就是真实的计数。总共 2³ = 8 种正反序列,其中 C(3,2) = 3 种(正正反、正反正、反正正)恰好两个正面。这就是二项分布公式 C(n,k)/2ⁿ 的全部,本计算器把每个问题——恰好 k 次、至少 k 次、至多 k 次——的答案都以分数和小数并排呈现。",
        "“至少”和“至多”这两列才是直觉失灵的地方。公平硬币抛 10 次,P(至少一次正面) 是 1023/1024——连续十次反面是 1024 分之 1 的事件,远比人们说“总该出正面了吧”时想象的罕见。表格的每一行都写出自己的序列数,二项三角形的形状——峰值在 n/2、两端稀薄——是看得见的,不是口头断言。",
      ],
      steps: [
        "输入抛掷次数 n(1–52)。",
        "输入想问的正面次数 k。",
        "以精确分数和小数读取 P(恰好 k)、P(至少 k)、P(至多 k)。",
        "在表格中查看从 0 到 n 每种正面数的 C(n,i)。",
      ],
      faqs: [
        {
          q: "计算器用的什么公式?",
          a: "二项分布。公平硬币让 2ⁿ 种正反序列等可能,其中 C(n,k) 种恰有 k 个正面,所以 P(恰好 k) = C(n,k)/2ⁿ。累积答案就是帕斯卡三角的行和:P(至少 k) = Σ_{i=k..n} C(n,i)/2ⁿ,P(至多 k) = Σ_{i=0..k} C(n,i)/2ⁿ。",
        },
        {
          q: "为什么抛 3 次恰好 2 次正面的答案是精确的 3/8?",
          a: "因为它是计数,不是估计。8 种等可能序列是:正正正、正正反、正反正、正反反、反正正、反反正、反正反、反反反,其中恰有两个正面的正好 3 种。3/8 = 0.375——小数到头了,因为分数本身就是全部真相。",
        },
        {
          q: "连续很多次反面有多罕见?",
          a: "P(n 次全反面) = 1/2ⁿ。连续 10 次反面:1/1024 ≈ 0.098%。连续 20 次约百万分之一。赌徒谬误把这些小数字读成“该出正面了”——但硬币没有记忆,无论之前出过什么,每一次抛掷仍然是 1/2。",
        },
        {
          q: "为什么计算器止步于 52 次?",
          a: "精确分数 C(n,k)/2ⁿ 要求分母 2ⁿ 是可精确表示的整数,而 JavaScript 只保证到 2⁵³。52 次时分母 2⁵² ≈ 4.5 千万亿仍然合格;再往上,本站就得对它承诺精确展示的数字动手舍入,所以它拒绝了。",
        },
      ],
    },
    ja: {
      name: "コイン投げ確率計算",
      tagline:
        "n 回の公正なコイン投げの二項分布:P(ちょうど k 回表)、P(少なくとも k 回)、P(たかだか k 回) — どれも正確な分数 C(n,k)/2ⁿ を小数と並べて表示。最大 52 回まで。",
      intro: [
        "3 回投げて 2 回表:答えは 3/8 で、この分数は丸めの産物ではなく実際の数え上げそのものです。全 2³ = 8 通りの表裏の列のうち、C(3,2) = 3 通り(表表裏・表裏表・裏表表)がちょうど 2 回表。それが二項分布の公式 C(n,k)/2ⁿ のすべてで、この計算機は「ちょうど k 回」「少なくとも k 回」「たかだか k 回」の各問いに、分数と小数を並べて答えます。",
        "直感が破綻するのは「以上」「以下」の列です。公正なコインを 10 回投げるとき、P(1 回以上表) は 1023/1024——10 連続裏は 1024 分の 1 の出来事で、「そろそろ表が出るはず」と思う人の感覚よりずっと稀です。表の各行は自分の列の数を書き出すので、二項三角形の形(頂点は n/2、裾は細い)は口で言われるのではなく目で見えます。",
      ],
      steps: [
        "投げる回数 n を入力します(1〜52)。",
        "問いたい表の回数 k を入力します。",
        "P(ちょうど k)・P(少なくとも k)・P(たかだか k) を正確な分数と小数で読みます。",
        "表で 0 から n までの各表の回数の C(n,i) を確認します。",
      ],
      faqs: [
        {
          q: "どんな公式を使っていますか?",
          a: "二項分布です。公正なコインでは 2ⁿ 通りの表裏の列がすべて等しく起こり、そのうち C(n,k) 通りがちょうど k 回表なので、P(ちょうど k) = C(n,k)/2ⁿ。累積の答えはパスカルの三角形の行和です。P(少なくとも k) = Σ_{i=k..n} C(n,i)/2ⁿ、P(たかだか k) = Σ_{i=0..k} C(n,i)/2ⁿ。",
        },
        {
          q: "3 回投げて 2 回表がきっかり 3/8 なのはなぜ?",
          a: "推定ではなく数えだからです。8 通りの等確率の列(表表表・表表裏・表裏表・表裏裏・裏表表・裏表裏・裏裏表・裏裏裏)のうち、ちょうど 2 回表なのは 3 通り。3/8 = 0.375 で小数はそこで終わります。分数がすでに真実のすべてだからです。",
        },
        {
          q: "裏が長く続くのはどれほど稀?",
          a: "P(n 回すべて裏) = 1/2ⁿ。10 連続裏は 1/1024 ≈ 0.098%。20 連続はおよそ 100 万分の 1。ギャンブラーの誤謬はこの小さな数を「もう表が出る番」と読みますが、コインに記憶はなく、何が出ようと 1 回ごとの確率は 1/2 のままです。",
        },
        {
          q: "52 回で止めるのはなぜ?",
          a: "正確な分数 C(n,k)/2ⁿ には分母 2ⁿ が正確に表せる整数であることが要り、JavaScript がそれを保証するのは 2⁵³ までです。52 回なら分母 2⁵² ≈ 4.5 兆はまだ合格。それを超えると、正確な表示を誓っている数字を丸めることになるので、ことわります。",
        },
      ],
    },
    es: {
      name: "Calculadora de probabilidad de lanzar monedas",
      tagline:
        "Probabilidades binomiales para n lanzamientos de una moneda justa: P(exactamente k caras), P(al menos k) y P(como mucho k) — cada una como la fracción exacta C(n,k)/2ⁿ junto a su decimal, hasta 52 lanzamientos.",
      intro: [
        "Tres lanzamientos, dos caras: la respuesta es 3/8, y la fracción no es un artefacto de redondeo — es el recuento real. Hay 2³ = 8 secuencias cara/cruz en total, y C(3,2) = 3 de ellas (CCT, CTC, TCC) tienen exactamente dos caras. Esa es toda la fórmula binomial C(n,k)/2ⁿ, y esta calculadora la muestra como fracción y decimal, lado a lado, para cada pregunta posible: exactamente k caras, al menos k, como mucho k.",
        "Las columnas «al menos» y «como mucho» son donde falla la intuición. Lanzar una moneda justa 10 veces da P(al menos una cara) = 1023/1024 — diez cruces seguidas es un suceso de 1 entre 1024, mucho más raro de lo que la gente espera cuando dice «alguna tiene que salir ya». Cada fila de la tabla escribe su recuento de secuencias, así que la forma del triángulo binomial — pico en n/2, colas finas — se ve en vez de afirmarse.",
      ],
      steps: [
        "Introduzca el número de lanzamientos n (1–52).",
        "Introduzca el número de caras k sobre el que pregunta.",
        "Lea P(exactamente k), P(al menos k) y P(como mucho k) como fracciones exactas y decimales.",
        "Consulte en la tabla el C(n,i) de cada número de caras de 0 a n.",
      ],
      faqs: [
        {
          q: "¿Qué fórmula usa la calculadora?",
          a: "La distribución binomial. Una moneda justa vuelve igualmente probables las 2ⁿ secuencias cara/cruz, y C(n,k) de ellas contienen exactamente k caras, así que P(exactamente k) = C(n,k)/2ⁿ. Las respuestas acumuladas suman filas del triángulo de Pascal: P(al menos k) = Σ_{i=k..n} C(n,i)/2ⁿ y P(como mucho k) = Σ_{i=0..k} C(n,i)/2ⁿ.",
        },
        {
          q: "¿Por qué la respuesta a 3 lanzamientos y 2 caras es exactamente 3/8?",
          a: "Porque es un recuento, no una estimación. Las 8 secuencias igualmente probables son CCC, CCT, CTC, CTT, TCC, TCT, TTC, TTT, y exactamente 3 (CCT, CTC, TCC) muestran dos caras. 3/8 = 0,375 — el decimal se acaba, porque la fracción ya es toda la verdad.",
        },
        {
          q: "¿Qué tan improbable es una racha larga de cruces?",
          a: "P(ninguna cara en n lanzamientos) = 1/2ⁿ. Diez cruces seguidas: 1/1024 ≈ 0,098%. Veinte: alrededor de una entre un millón. La falacia del jugador lee estos números pequeños como «toca una cara» — pero las monedas no tienen memoria y cada lanzamiento individual sigue siendo 1/2 pase lo que pase.",
        },
        {
          q: "¿Por qué la calculadora se detiene en 52 lanzamientos?",
          a: "La fracción exacta C(n,k)/2ⁿ necesita que el denominador 2ⁿ sea un entero representable con precisión, cosa que JavaScript solo garantiza hasta 2⁵³. Con 52 lanzamientos el denominador 2⁵² ≈ 4,5 billones aún sirve; más allá, el sitio tendría que redondear justo los números que promete mostrar exactos, así que se niega.",
        },
      ],
    },
    pt: {
      name: "Calculadora de probabilidade de cara ou coroa",
      tagline:
        "Probabilidades binomiais para n lançamentos de uma moeda honesta: P(exatamente k caras), P(no mínimo k) e P(no máximo k) — cada uma como a fração exata C(n,k)/2ⁿ ao lado do decimal, até 52 lançamentos.",
      intro: [
        "Três lançamentos, duas caras: a resposta é 3/8, e a fração não é um artefato de arredondamento — é a contagem real. Existem 2³ = 8 sequências cara/coroa no total, e C(3,2) = 3 delas (CCCo, CCoC, CoCC) têm exatamente duas caras. Essa é toda a fórmula binomial C(n,k)/2ⁿ, e esta calculadora a mostra como fração e decimal, lado a lado, para cada pergunta possível: exatamente k caras, no mínimo k, no máximo k.",
        "As colunas «no mínimo» e «no máximo» são onde a intuição falha. Lançar uma moeda honesta 10 vezes dá P(no mínimo uma cara) = 1023/1024 — dez coroas seguidas é um evento de 1 em 1024, muito mais raro do que as pessoas esperam quando dizem «uma tem que sair já». Cada linha da tabela escreve sua contagem de sequências, então a forma do triângulo binomial — pico em n/2, caudas finas — aparece em vez de ser apenas afirmada.",
      ],
      steps: [
        "Informe o número de lançamentos n (1–52).",
        "Informe o número de caras k sobre o qual quer perguntar.",
        "Leia P(exatamente k), P(no mínimo k) e P(no máximo k) como frações exatas e decimais.",
        "Consulte na tabela o C(n,i) de cada número de caras de 0 a n.",
      ],
      faqs: [
        {
          q: "Que fórmula a calculadora usa?",
          a: "A distribuição binomial. Uma moeda honesta torna igualmente prováveis as 2ⁿ sequências cara/coroa, e C(n,k) delas contêm exatamente k caras, então P(exatamente k) = C(n,k)/2ⁿ. As respostas acumuladas somam linhas do triângulo de Pascal: P(no mínimo k) = Σ_{i=k..n} C(n,i)/2ⁿ e P(no máximo k) = Σ_{i=0..k} C(n,i)/2ⁿ.",
        },
        {
          q: "Por que a resposta para 3 lançamentos e 2 caras é exatamente 3/8?",
          a: "Porque é uma contagem, não uma estimativa. As 8 sequências igualmente prováveis são CCC, CCT, CTC, CTT, TCC, TCT, TTC, TTT, e exatamente 3 delas (CCT, CTC, TCC) mostram duas caras. 3/8 = 0,375 — o decimal acaba aí, porque a fração já é toda a verdade.",
        },
        {
          q: "Quão improvável é uma sequência longa de coroas?",
          a: "P(nenhuma cara em n lançamentos) = 1/2ⁿ. Dez coroas seguidas: 1/1024 ≈ 0,098%. Vinte: cerca de uma em um milhão. A falácia do jogador lê esses números pequenos como «uma cara está a caminho» — mas moedas não têm memória, e cada lançamento individual continua 1/2 não importa o que veio antes.",
        },
        {
          q: "Por que a calculadora para em 52 lançamentos?",
          a: "A fração exata C(n,k)/2ⁿ precisa que o denominador 2ⁿ seja um inteiro representável com precisão, o que o JavaScript garante só até 2⁵³. Com 52 lançamentos o denominador 2⁵² ≈ 4,5 quatrilhões ainda serve; além disso o site teria que arredondar justamente os números que promete mostrar exatos, então recusa.",
        },
      ],
    },
  },
});
