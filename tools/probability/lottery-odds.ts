import { LotteryEngine } from "../_engines/engine-lottery-odds";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "lottery-odds",
  category: "utility",
  icon: "hash",
  engine: { component: LotteryEngine },
  related: ["dice-probability", "coin-flip", "birthday-paradox"],
  copy: {
    en: {
      name: "Lottery Odds Calculator",
      tagline:
        "Exact lottery odds for picking k numbers from a pool of n: the jackpot's 1 in C(n,k) — 13,983,816 for 6/49 — plus every match tier below it, computed with the hypergeometric formula and shown as exact counts.",
      intro: [
        "Pick 6 numbers from 49 and there are C(49,6) = 13,983,816 distinct tickets — the most famous number in gambling mathematics. This calculator computes it the honest way: binomial coefficients with exact integer arithmetic, never a float approximation. The jackpot probability 1/13,983,816 ≈ 0.0000072% is the headline, but the tier table below it is the part lottery players actually use: matching 3 of 6 in a 6/49 draw is 1 in 56.66, matching 4 is 1 in 1,032, and those are the wins people actually hit.",
        "The formula behind every row is hypergeometric: P(match m) = C(k,m)·C(n−k,k−m) / C(n,k). Read it as a story — choose which m of your k numbers the draw hits, choose which k−m of the n−k losing numbers it draws instead, and divide by all C(n,k) tickets. Because every count is exact, the tier probabilities sum to exactly 1, and the tool says so — no 99.9987% hand-waving that hides where the missing probability went.",
      ],
      steps: [
        "Enter how many numbers the pool holds n (2–120).",
        "Enter how many numbers a ticket picks k.",
        "Read the jackpot odds as 1 in C(n,k) with the exact ticket count.",
        "Scan the tier table for the odds of matching k−1, k−2, … down to 0.",
      ],
      faqs: [
        {
          q: "How are the odds of matching exactly 3 numbers calculated?",
          a: "With the hypergeometric distribution. For 6 from 49: choose 3 of your 6 numbers to be drawn, C(6,3) = 20 ways; choose 3 of the 43 non-winning numbers to fill the rest of the draw, C(43,3) = 12,341 ways; multiply for 246,820 favorable tickets; divide by C(49,6) = 13,983,816. That is 1 in 56.66 — the tier most lottery prizes actually come from.",
        },
        {
          q: "Why is the jackpot odds number C(n,k) and not something else?",
          a: "Every distinct ticket is equally likely, and there are exactly C(n,k) of them, so each — including the one holding the drawn numbers — wins once in C(n,k) draws. For 6 from 49 that is 13,983,816. If a game adds a bonus ball or a second pool, the count changes, but this tool models the classic single-pool draw and says so instead of pretending to cover every rulebook.",
        },
        {
          q: "Is it better to play unusual numbers?",
          a: "The odds of winning are identical for every ticket — C(n,k) does not care whether you play 1-2-3-4-5-6 or seven random numbers. What unusual numbers change is the expected payout: popular picks (birthdays, sequences) share the jackpot with more people if they win. That is a strategy about splitting prizes, not about probability, and the two are worth keeping separate.",
        },
        {
          q: "Why does the calculator refuse some pool and pick sizes?",
          a: "Exact counting needs the ticket total C(n,k) to stay under 2⁵³, the largest integer JavaScript handles precisely. A 120-number pool picking 20 crosses that line; the tool would have to round the very number it is famous for showing exactly, so it refuses and asks for smaller values instead.",
        },
      ],
    },
    zh: {
      name: "彩票中奖概率计算器",
      tagline:
        "从 n 个号里选 k 个的精确彩票赔率:头奖 1 / C(n,k)——6/49 就是 13,983,816——加上下方每个奖档,全部用超几何公式精确计算并展示精确计数。",
      intro: [
        "从 49 个号里选 6 个,共有 C(49,6) = 13,983,816 种不同组合——博彩数学里最著名的数字。本计算器用诚实的方式算它:精确整数运算的二项式系数,绝不用浮点近似。头奖概率 1/13,983,816 ≈ 0.0000072% 是头条,但下面那张奖档表才是彩民真正用的部分:6/49 里中 3 个号是 56.66 分之一,中 4 个是 1032 分之一——人们真正中的就是这些档。",
        "每一行背后的公式都是超几何分布:P(中 m 个) = C(k,m)·C(n−k,k−m) / C(n,k)。把它当故事读:开奖命中你 k 个号里的哪 m 个,再从 n−k 个未中奖号里取 k−m 个凑满开奖,最后除以全部 C(n,k) 种组合。因为每个计数都精确,各档概率恰好加和为 1——工具会明说,而不是用 99.9987% 这种含糊话掩盖丢失的概率去了哪里。",
      ],
      steps: [
        "输入号码池大小 n(2–120)。",
        "输入每注选择的号码数 k。",
        "以 1 / C(n,k) 读取头奖赔率和精确组合数。",
        "在奖档表中查看中 k−1、k−2、……直到 0 个号的赔率。",
      ],
      faqs: [
        {
          q: "恰好中 3 个号的概率是怎么算的?",
          a: "用超几何分布。以 6/49 为例:开奖命中你 6 个号里的 3 个,有 C(6,3) = 20 种;剩下 3 个开奖位从 43 个未中奖号里取,有 C(43,3) = 12,341 种;相乘得 246,820 注有利组合;再除以 C(49,6) = 13,983,816。结果是 56.66 分之一——大多数彩票奖其实来自这个档。",
        },
        {
          q: "为什么头奖赔率就是 C(n,k) 这个数?",
          a: "每种组合等可能,组合总数恰是 C(n,k),所以每一注——包括那注拿着开奖号的——每 C(n,k) 次开奖才中一次。6/49 就是 13,983,816。如果玩法加了特别号或第二个号码池,数字会变,但本工具建模的是经典单池开奖,并如实说明,而不是假装覆盖所有规则手册。",
        },
        {
          q: "买冷门号码更划算吗?",
          a: "每一注的中奖概率完全相同——C(n,k) 不管你选 1-2-3-4-5-6 还是七个随机号。冷门号码改变的是期望派彩:热门选法(生日、等差数列)一旦中奖,要和更多人分头奖。那是关于“分奖金”的策略,与概率无关,两者值得分开看。",
        },
        {
          q: "为什么计算器会拒绝某些池子和选号规模?",
          a: "精确计数要求组合总数 C(n,k) 保持在 2⁵³ 以内——这是 JavaScript 能精确处理的最大整数。120 个号选 20 个就越线了;工具总不能对它最引以为傲的精确数字动手舍入,所以直接拒绝并要求更小的值。",
        },
      ],
    },
    ja: {
      name: "宝くじ当選確率計算",
      tagline:
        "n 個の数字から k 個選ぶ宝くじの正確なオッズ:ジャックポットは 1 / C(n,k) —— 6/49 なら 13,983,816 —— さらに下の各等級も超幾何分布の公式で正確に計算し、正確な数で表示します。",
      intro: [
        "49 個から 6 個選ぶと、C(49,6) = 13,983,816 通りの異なるくじがあります——ギャンブル数学で最も有名な数字です。この計算機は誠実に計算します。浮動小数点の近似ではなく、BigInt による正確な整数演算の二項係数です。ジャックポット確率 1/13,983,816 ≈ 0.0000072% が見出しですが、実際にプレイヤーが使うのは下の等級表です。6/49 で 3 個的中は 56.66 分の 1、4 個的中は 1,032 分の 1——人が実際に当てるのはこの辺りです。",
        "どの行にも超幾何分布の式が隠れています。P(m 的中) = C(k,m)·C(n−k,k−m) / C(n,k)。物語として読めば——抽選があなたの k 個のうちどの m 個を当てるかを選び、外れ数字 n−k 個のうち k−m 個を残りに充て、全 C(n,k) 口で割る。数がすべて正確なので、等級の確率はきっかり 1 に足し上がります。99.9987% といった曖昧な言い方で、消えた確率の行き先をごまかしません。",
      ],
      steps: [
        "数字の総数 n を入力します(2〜120)。",
        "1 口が選ぶ数字の数 k を入力します。",
        "ジャックポットのオッズを 1 / C(n,k) と正確な口数で読みます。",
        "等級表で k−1、k−2、…… 0 的中までのオッズを確認します。",
      ],
      faqs: [
        {
          q: "ちょうど 3 個的中の確率はどう計算するのですか?",
          a: "超幾何分布を使います。6/49 なら:当選するあなたの数字 6 個から 3 個を選ぶ方法が C(6,3) = 20 通り。残りの 3 個の抽選数字を外れの 43 個から選ぶ方法が C(43,3) = 12,341 通り。掛けて 246,820 口の好都合なくじ。C(49,6) = 13,983,816 で割ると 56.66 分の 1——ほとんどの宝くじの当選はこの等級から来ています。",
        },
        {
          q: "ジャックポットのオッズが C(n,k) そのものであるのはなぜ?",
          a: "すべての異なる口が等しく当選し、その総数がちょうど C(n,k) 口だからです。つまりどの 1 口も(当選番号を持つその口を含め)C(n,k) 回に 1 回当たります。6/49 なら 13,983,816 です。ボーナス数字や第 2 の番号枠が加わると数は変わりますが、このツールは古典的な単一枠方式を対象とし、そのように明記します。すべてのルールブックをカバーするふりはしません。",
        },
        {
          q: "珍しい数字を選ぶほうが得ですか?",
          a: "どの口も当選確率はまったく同じです。C(n,k) は 1-2-3-4-5-6 でもランダムな 7 桁でも気にしません。珍しい数字が変えるのは期待配当です。人気の選び方(誕生日や連番)は、当たったときに頭賞をより多くの人と分け合います。それは賞金の分配に関する戦略であって確率の話ではない——この二つは分けて考える価値があります。",
        },
        {
          q: "一部の総数と選択数を拒否するのはなぜ?",
          a: "正確な数え上げには、口の総数 C(n,k) が 2⁵³(JavaScript が正確に扱える最大の整数)未満であることが必要です。120 個から 20 個選ぶとその線を越えます。正確さを看板にしている数字を丸めるわけにはいかないので、ことわって小さい値を求めます。",
        },
      ],
    },
    es: {
      name: "Calculadora de probabilidades de lotería",
      tagline:
        "Probabilidades exactas de lotería al elegir k números de un bombo de n: el bote, 1 entre C(n,k) — 13.983.816 para 6/49 — más cada nivel inferior, calculado con la fórmula hipergeométrica y mostrado con recuentos exactos.",
      intro: [
        "Elegir 6 números de 49 da C(49,6) = 13.983.816 boletos distintos — el número más famoso de las matemáticas del azar. Esta calculadora lo obtiene a la manera honesta: coeficientes binomiales con aritmética entera exacta, nunca una aproximación flotante. La probabilidad del bote, 1/13.983.816 ≈ 0,0000072%, es el titular, pero la tabla de niveles de abajo es lo que los jugadores usan de verdad: acertar 3 de 6 en un 6/49 es 1 entre 56,66 y acertar 4 es 1 entre 1.032 — esos son los premios que la gente realmente gana.",
        "La fórmula detrás de cada fila es hipergeométrica: P(acertar m) = C(k,m)·C(n−k,k−m) / C(n,k). Léala como un relato — elija cuáles m de sus k números extrae el sorteo, elija cuáles k−m de los n−k números perdedores completan la extracción, y divida entre los C(n,k) boletos. Como cada recuento es exacto, las probabilidades de los niveles suman exactamente 1, y la herramienta lo dice — sin ese «99,9987%» que esconde dónde fue a parar la probabilidad que falta.",
      ],
      steps: [
        "Introduzca cuántos números tiene el bombo n (2–120).",
        "Introduzca cuántos números elige cada boleto k.",
        "Lea las probabilidades del bote como 1 entre C(n,k) con el recuento exacto de boletos.",
        "Consulte en la tabla de niveles las probabilidades de acertar k−1, k−2, … hasta 0.",
      ],
      faqs: [
        {
          q: "¿Cómo se calcula la probabilidad de acertar exactamente 3 números?",
          a: "Con la distribución hipergeométrica. Para 6 de 49: elija 3 de sus 6 números para que salgan, C(6,3) = 20 maneras; elija 3 de los 43 números no premiados para completar la extracción, C(43,3) = 12.341 maneras; multiplique para obtener 246.820 boletos favorables; divida entre C(49,6) = 13.983.816. Eso da 1 entre 56,66 — el nivel del que proceden la mayoría de los premios de lotería.",
        },
        {
          q: "¿Por qué la probabilidad del bote es C(n,k) y no otra cosa?",
          a: "Todos los boletos distintos son igualmente probables y hay exactamente C(n,k), así que cada uno — incluido el que tiene los números sorteados — gana una vez cada C(n,k) sorteos. Para 6 de 49 son 13.983.816. Si el juego añade una bola extra o un segundo bombo, el recuento cambia, pero esta herramienta modela el sorteo clásico de un solo bombo y lo declara, en vez de fingir que cubre todos los reglamentos.",
        },
        {
          q: "¿Jugar números poco habituales es mejor?",
          a: "La probabilidad de ganar es idéntica para cada boleto — a C(n,k) le da igual jugar 1-2-3-4-5-6 que siete números al azar. Lo que cambian los números raros es el pago esperado: las jugadas populares (cumpleaños, secuencias) reparten el bote entre más personas si ganan. Eso es estrategia sobre repartir premios, no sobre probabilidad, y conviene no mezclarlas.",
        },
        {
          q: "¿Por qué la calculadora rechaza algunos tamaños de bombo y de elección?",
          a: "El recuento exacto exige que el total de boletos C(n,k) quede bajo 2⁵³, el mayor entero que JavaScript maneja con precisión. Un bombo de 120 números eligiendo 20 cruza esa línea; la herramienta tendría que redondear justo el número que presume de mostrar exacto, así que se niega y pide valores menores.",
        },
      ],
    },
    pt: {
      name: "Calculadora de probabilidades de loteria",
      tagline:
        "Probabilidades exatas de loteria ao escolher k números de um universo de n: o prêmio máximo, 1 em C(n,k) — 13.983.816 para 6/49 — mais cada faixa abaixo, calculada com a fórmula hipergeométrica e mostrada com contagens exatas.",
      intro: [
        "Escolher 6 números de 49 dá C(49,6) = 13.983.816 bilhetes distintos — o número mais famoso da matemática do azar. Esta calculadora o computa do jeito honesto: coeficientes binomiais com aritmética inteira exata, nunca uma aproximação de ponto flutuante. A probabilidade do prêmio máximo, 1/13.983.816 ≈ 0,0000072%, é a manchete, mas a tabela de faixas abaixo é o que os jogadores realmente usam: acertar 3 de 6 num 6/49 é 1 em 56,66 e acertar 4 é 1 em 1.032 — são essas as faixas que as pessoas realmente ganham.",
        "A fórmula por trás de cada linha é hipergeométrica: P(acertar m) = C(k,m)·C(n−k,k−m) / C(n,k). Leia como uma história — escolha quais m dos seus k números o sorteio acerta, escolha quais k−m dos n−k números perdedores completam o sorteio, e divida pelos C(n,k) bilhetes. Como cada contagem é exata, as probabilidades das faixas somam exatamente 1, e a ferramenta diz isso — sem aquele «99,9987%» que esconde para onde foi a probabilidade que sumiu.",
      ],
      steps: [
        "Informe quantos números tem o universo n (2–120).",
        "Informe quantos números um bilhete escolhe k.",
        "Leia as chances do prêmio máximo como 1 em C(n,k) com a contagem exata de bilhetes.",
        "Consulte na tabela de faixas as chances de acertar k−1, k−2, … até 0.",
      ],
      faqs: [
        {
          q: "Como se calcula a probabilidade de acertar exatamente 3 números?",
          a: "Com a distribuição hipergeométrica. Para 6 de 49: escolha 3 dos seus 6 números para serem sorteados, C(6,3) = 20 maneiras; escolha 3 dos 43 números não premiados para completar o sorteio, C(43,3) = 12.341 maneiras; multiplique para obter 246.820 bilhetes favoráveis; divida por C(49,6) = 13.983.816. Isso dá 1 em 56,66 — a faixa de onde vêm a maioria dos prêmios de loteria.",
        },
        {
          q: "Por que a chance do prêmio máximo é C(n,k) e não outra coisa?",
          a: "Todos os bilhetes distintos são igualmente prováveis e existem exatamente C(n,k), então cada um — inclusive o que contém os números sorteados — ganha uma vez a cada C(n,k) sorteios. Para 6 de 49 são 13.983.816. Se o jogo acrescenta uma bola extra ou um segundo universo, a contagem muda, mas esta ferramenta modela o sorteio clássico de universo único e o declara, em vez de fingir cobrir todos os regulamentos.",
        },
        {
          q: "Jogar números incomuns é melhor?",
          a: "A probabilidade de ganhar é idêntica para cada bilhete — C(n,k) não se importa se você joga 1-2-3-4-5-6 ou sete números aleatórios. O que números incomuns mudam é o prêmio esperado: escolhas populares (aniversários, sequências) dividem o prêmio máximo com mais pessoas se ganharem. Isso é estratégia sobre dividir prêmios, não sobre probabilidade — e vale manter os dois separados.",
        },
        {
          q: "Por que a calculadora recusa alguns tamanhos de universo e de escolha?",
          a: "A contagem exata exige que o total de bilhetes C(n,k) fique abaixo de 2⁵³, o maior inteiro que o JavaScript manuseia com precisão. Um universo de 120 números escolhendo 20 cruza essa linha; a ferramenta teria que arredondar justamente o número de que se orgulha de mostrar exato, então recusa e pede valores menores.",
        },
      ],
    },
  },
});
