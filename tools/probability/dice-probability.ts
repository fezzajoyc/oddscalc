import { DiceEngine } from "../_engines/engine-dice-probability";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "dice-probability",
  category: "utility",
  icon: "dice",
  featured: true,
  engine: { component: DiceEngine },
  related: ["coin-flip", "lottery-odds", "birthday-paradox"],
  copy: {
    en: {
      name: "Dice Probability Calculator",
      tagline:
        "Exact dice probabilities for N dice with S sides: the full sum distribution, P(sum = k), P(sum ≥ k) — every count derived with combinatorics and shown as a fraction, never simulated.",
      intro: [
        "Ask a dice forum “what are the odds of rolling 7 on two dice?” and you get the answer — 6 in 36 — without the counting that produces it. This calculator derives the whole distribution the way a probability textbook does: dynamic programming over dice faces, where each sum's count is built from the counts one die fewer. Two dice, six sides, thirty-six outcomes, and every one of them is accounted for — that is why the fractions are exact instead of a Monte-Carlo estimate that wobbles around the truth.",
        "Pick any target sum k and the calculator shows P(sum = k) and P(sum ≥ k) side by side — the second is what a board game actually asks (“can I reach the castle this turn?”). The table lists every reachable sum with its exact number of ways and the reduced fraction, so 2d6 reads 6/36 = 1/6 for the seven and 1/36 for the snake eyes. It works for any dice you own: d6s, two d10s, the 3d4 of a tabletop crit, 20 six-sided dice at once.",
      ],
      steps: [
        "Enter how many dice you roll.",
        "Enter how many sides each die has (2–120).",
        "Enter a target sum k to read P(sum = k) and P(sum ≥ k).",
        "Scan the table for the exact ways and fraction of any other sum.",
      ],
      faqs: [
        {
          q: "How is the probability of a dice sum computed exactly?",
          a: "By counting. The number of ways to roll a sum with N dice satisfies a recursion: ways(N, s) = Σ over faces f of ways(N−1, s−f). Starting from one die — one way per face — the recursion fills every sum with an exact integer. Dividing that integer by Sᴺ (all equally likely outcomes) gives the probability. For 2d6 the seven is rolled as 1+6, 2+5, 3+4, 4+3, 5+2 or 6+1 — six of the 36 ordered pairs — so P = 6/36 = 1/6.",
        },
        {
          q: "Why is 7 the most common roll with two dice?",
          a: "Because it has the most combinations behind it. A sum near the middle can be reached in many orders — 7 is hit by six of the 36 ordered pairs, while 2 and 12 are each hit by only one (double ones or double sixes). The distribution is a triangle: it rises from 2 to 7 and falls symmetrically to 12.",
        },
        {
          q: "What does P(sum ≥ k) mean in a game?",
          a: "It is the chance of rolling k or more — the question “do I make it this turn?”. With 2d6, P(sum ≥ 10) counts the 3 + 2 + 1 = 6 ways of rolling 10, 11 or 12, so it is 6/36 = 1/6, the same as rolling a single seven. Threshold questions almost always matter more than exact-sum questions.",
        },
        {
          q: "Why does the tool refuse very large dice pools?",
          a: "This site shows exact fractions, and exact counting needs the outcome count Sᴺ to stay below 2⁵³ — the largest integer JavaScript counts precisely. Past that (say 30 six-sided dice) the counts would silently round, so the tool refuses and asks for fewer dice instead of showing numbers it cannot vouch for.",
        },
      ],
    },
    zh: {
      name: "骰子概率计算器",
      tagline:
        "N 个 S 面骰的精确概率:完整的和分布、P(和 = k)、P(和 ≥ k)——每个数字都由组合数学推出并以分数展示,不是模拟估计。",
      intro: [
        "在骰子论坛问“两个骰子掷出 7 的概率是多少?”你会得到答案——36 分之 6——却看不到得出它的计数过程。本计算器按概率教科书的路子推导整个分布:对面数做动态规划,每个和的方式数由“少一个骰子”的方式数累加而成。两个六面骰、36 种结果,每一种都记录在案——这就是分数精确的原因,而不是围绕真值抖动的蒙特卡洛估计。",
        "任选目标点数 k,计算器并排给出 P(和 = k) 和 P(和 ≥ k)——后者才是桌游真正要问的(“这回合能不能走到城堡?”)。表格列出每个可达和的精确方式数与约分后的分数:2d6 掷出 7 是 6/36 = 1/6,掷出蛇眼是 1/36。你手上有什么骰子它都能算:d6、两个 d10、桌游的 3d4,甚至 20 个六面骰一起掷。",
      ],
      steps: [
        "输入骰子的数量。",
        "输入每个骰子的面数(2–120)。",
        "输入目标点数 k,读取 P(和 = k) 与 P(和 ≥ k)。",
        "在表格中查任意其他和的精确方式数与分数。",
      ],
      faqs: [
        {
          q: "骰子和的概率是怎么精确算出来的?",
          a: "靠计数。N 个骰子掷出某点数的方式数满足递推:ways(N, s) = 各面 f 的 ways(N−1, s−f) 之和。从单个骰子(每个面 1 种方式)出发,递推把每个和都填成精确整数。这个整数除以 Sᴺ(全部等可能结果)就是概率。2d6 的 7 点:1+6、2+5、3+4、4+3、5+2、6+1 共 6 种,所以 P = 6/36 = 1/6。",
        },
        {
          q: "为什么两个骰子掷出 7 最常见?",
          a: "因为它背后的组合最多。靠近中间的和有很多种到达顺序——36 个有序对里有 6 对凑成 7,而 2 和 12 各只有 1 对(双一或双六)。分布是个三角形:从 2 升到 7,再对称地落到 12。",
        },
        {
          q: "P(和 ≥ k) 在游戏里是什么意思?",
          a: "它是掷出 k 或更多的机会——“这回合够不够?”。2d6 的 P(和 ≥ 10) 数的是掷出 10、11、12 的 3 + 2 + 1 = 6 种方式,所以是 6/36 = 1/6,和掷出单个 7 一样。阈值问题几乎总比精确点数问题更重要。",
        },
        {
          q: "为什么工具会拒绝很大的骰子组合?",
          a: "本站展示精确分数,而精确计数要求结果总数 Sᴺ 不超过 2⁵³——这是 JavaScript 能精确计数的最大整数。超过之后(比如 30 个六面骰)计数会被悄悄舍入,所以工具直接拒绝并要求减少骰子,而不是给出它自己都无法担保的数字。",
        },
      ],
    },
    ja: {
      name: "サイコロ確率計算",
      tagline:
        "N 個の S 面サイコロの正確な確率:合計の全分布、P(合計 = k)、P(合計 ≥ k) — すべて組合せ論から導き分数で表示。シミュレーションではありません。",
      intro: [
        "サイコロの掲示板で「2個で合計 7 が出る確率は?」と聞くと、答え——36 分の 6——は返ってきますが、それを生み出す数え方は見えていません。この計算機は確率論の教科書と同じ道をたどります。面ごとに動的計画法を回し、各合計の通り数を「1 個少ない場合の通り数」から積み上げます。2 個の 6 面サイコロ、36 通りの出目、その一つひとつが記帳済み——だから分数は正確で、真値の周りを揺れるモンテカルロ推定ではありません。",
        "目標の合計 k を選ぶと、P(合計 = k) と P(合計 ≥ k) を並べて表示します。後者のほうがボードゲームの実際の問いです(「このターンで城に届く?」)。表には届くすべての合計が、正確な通り数と約分した分数付きで並びます。2d6 の 7 は 6/36 = 1/6、蛇の目(ゾロ目の 1)は 1/36。d6 でも d10 2 個でも、TRPG の 3d4 でも、6 面サイコロ 20 個でも計算できます。",
      ],
      steps: [
        "サイコロの個数を入力します。",
        "1 個あたりの面数を入力します(2〜120)。",
        "目標の合計 k を入力し、P(合計 = k) と P(合計 ≥ k) を読みます。",
        "表で他の合計の通り数と分数を確認します。",
      ],
      faqs: [
        {
          q: "サイコロの合計確率はどう正確に計算していますか?",
          a: "数え上げです。N 個で合計 s になる通り数は漸化式 ways(N, s) = Σ(各面 f について) ways(N−1, s−f) に従います。1 個のとき(各面 1 通り)から始めると、すべての合計が正確な整数で埋まります。それを Sᴺ(全出目)で割れば確率です。2d6 の 7 は 1+6、2+5、3+4、4+3、5+2、6+1 の 6 通りなので P = 6/36 = 1/6 です。",
        },
        {
          q: "2 個で 7 が最も出やすいのはなぜ?",
          a: "背後にある組合せが最も多いからです。中間に近い合計は到達順序が多く、36 個の順序対のうち 6 対が 7 になります。2 と 12 はそれぞれ 1 対だけ(1 ゾロ目か 6 ゾロ目)。分布は三角形で、2 から 7 まで上がり、12 へ対称に下がります。",
        },
        {
          q: "P(合計 ≥ k) はゲームで何を意味しますか?",
          a: "k 以上が出る確率、「このターンで間に合うか?」という問いです。2d6 の P(合計 ≥ 10) は 10・11・12 の 3 + 2 + 1 = 6 通りを数えて 6/36 = 1/6。ちょうど 7 を出すのと同じ確率です。閾値の問いのほうが、ちょうどの合計よりほぼ常に重要です。",
        },
        {
          q: "大きな組合せを拒否するのはなぜ?",
          a: "本サイトは正確な分数を表示します。正確な数え上げには出目の総数 Sᴺ が 2⁵³(JavaScript が正確に数えられる最大の整数)以下である必要があります。それを超えると(例:6 面サイコロ 30 個)整数が黙って丸められるため、保証できない数字を見せる代わりにお断りして個数を減らしてもらいます。",
        },
      ],
    },
    es: {
      name: "Calculadora de probabilidad de dados",
      tagline:
        "Probabilidades exactas para N dados de S caras: la distribución completa de la suma, P(suma = k), P(suma ≥ k) — cada recuento derivado con combinatoria y mostrado como fracción, nunca simulado.",
      intro: [
        "Pregunta en un foro de dados «¿qué probabilidad hay de sacar 7 con dos dados?» y obtendrás la respuesta — 6 de 36 — sin el recuento que la produce. Esta calculadora deriva toda la distribución como lo hace un libro de probabilidad: programación dinámica sobre las caras, donde el recuento de cada suma se construye a partir del de un dado menos. Dos dados, seis caras, treinta y seis resultados, y cada uno queda registrado — por eso las fracciones son exactas y no una estimación de Monte Carlo que oscila alrededor de la verdad.",
        "Elige cualquier suma objetivo k y la calculadora muestra P(suma = k) y P(suma ≥ k) una junto a la otra — la segunda es lo que un juego de mesa pregunta de verdad («¿llego al castillo este turno?»). La tabla enumera cada suma alcanzable con su número exacto de combinaciones y la fracción reducida: con 2d6 el siete se lee 6/36 = 1/6 y los ojos de serpiente 1/36. Vale para cualquier dado que tengas: d6, dos d10, el 3d4 de un crítico de rol, o 20 dados de seis caras a la vez.",
      ],
      steps: [
        "Introduzca cuántos dados lanza.",
        "Introduzca cuántas caras tiene cada dado (2–120).",
        "Introduzca una suma objetivo k para leer P(suma = k) y P(suma ≥ k).",
        "Consulte en la tabla las combinaciones y la fracción exacta de cualquier otra suma.",
      ],
      faqs: [
        {
          q: "¿Cómo se calcula exactamente la probabilidad de una suma?",
          a: "Contando. El número de maneras de obtener una suma con N dados cumple la recursión ways(N, s) = Σ sobre caras f de ways(N−1, s−f). Empezando con un dado — una manera por cara — la recursión llena cada suma con un entero exacto. Dividir ese entero por Sᴺ (todos los resultados igualmente probables) da la probabilidad. Con 2d6 el siete reúne 1+6, 2+5, 3+4, 4+3, 5+2, 6+1: seis maneras, P = 6/36 = 1/6.",
        },
        {
          q: "¿Por qué el 7 es el resultado más frecuente con dos dados?",
          a: "Porque tiene más combinaciones detrás. Una suma cercana al centro se alcanza en muchos órdenes: 6 de los 36 pares ordenados producen 7, mientras que el 2 y el 12 solo uno cada uno (dobles unos o dobles seises). La distribución es un triángulo: sube de 2 a 7 y baja simétricamente hasta 12.",
        },
        {
          q: "¿Qué significa P(suma ≥ k) en un juego?",
          a: "Es la probabilidad de sacar k o más — la pregunta «¿llego este turno?». Con 2d6, P(suma ≥ 10) cuenta las 3 + 2 + 1 = 6 maneras de sacar 10, 11 o 12, así que es 6/36 = 1/6, lo mismo que sacar un siete. Las preguntas de umbral casi siempre importan más que las de suma exacta.",
        },
        {
          q: "¿Por qué la herramienta rechaza combinaciones muy grandes?",
          a: "Este sitio muestra fracciones exactas, y contar con exactitud exige que el total de resultados Sᴺ no supere 2⁵³ — el mayor entero que JavaScript cuenta con precisión. Más allá (por ejemplo 30 dados de seis caras) los recuentos se redondearían en silencio, así que la herramienta se niega y pide menos dados en lugar de mostrar números que no puede garantizar.",
        },
      ],
    },
    pt: {
      name: "Calculadora de probabilidade de dados",
      tagline:
        "Probabilidades exatas para N dados de S faces: a distribuição completa da soma, P(soma = k), P(soma ≥ k) — cada contagem derivada por combinatória e mostrada como fração, nunca simulada.",
      intro: [
        "Pergunte num fórum de dados «qual a chance de tirar 7 com dois dados?» e você recebe a resposta — 6 em 36 — sem a contagem que a produz. Esta calculadora deriva toda a distribuição do jeito que um livro de probabilidade faz: programação dinâmica sobre as faces, em que a contagem de cada soma é construída a partir da de um dado a menos. Dois dados, seis faces, trinta e seis resultados, e cada um deles registrado — por isso as frações são exatas, e não uma estimativa de Monte Carlo que oscila em torno da verdade.",
        "Escolha qualquer soma alvo k e a calculadora mostra P(soma = k) e P(soma ≥ k) lado a lado — a segunda é o que um jogo de tabuleiro realmente pergunta («chego ao castelo neste turno?»). A tabela lista cada soma alcançável com seu número exato de combinações e a fração reduzida: com 2d6 o sete lê-se 6/36 = 1/6 e os olhos de cobra 1/36. Vale para qualquer dado que você tenha: d6, dois d10, o 3d4 de um crítico de RPG, ou 20 dados de seis faces de uma vez.",
      ],
      steps: [
        "Informe quantos dados você lança.",
        "Informe quantas faces tem cada dado (2–120).",
        "Informe uma soma alvo k para ler P(soma = k) e P(soma ≥ k).",
        "Consulte na tabela as combinações e a fração exata de qualquer outra soma.",
      ],
      faqs: [
        {
          q: "Como a probabilidade de uma soma é calculada com exatidão?",
          a: "Contando. O número de maneiras de obter uma soma com N dados obedece à recursão ways(N, s) = Σ sobre faces f de ways(N−1, s−f). Começando com um dado — uma maneira por face — a recursão preenche cada soma com um inteiro exato. Dividir esse inteiro por Sᴺ (todos os resultados igualmente prováveis) dá a probabilidade. Com 2d6 o sete reúne 1+6, 2+5, 3+4, 4+3, 5+2, 6+1: seis maneiras, P = 6/36 = 1/6.",
        },
        {
          q: "Por que o 7 é o resultado mais comum com dois dados?",
          a: "Porque tem mais combinações por trás. Uma soma perto do centro é alcançada em muitas ordens — 6 dos 36 pares ordenados produzem 7, enquanto 2 e 12 têm um cada (dois uns ou dois seis). A distribuição é um triângulo: sobe de 2 a 7 e desce simetricamente até 12.",
        },
        {
          q: "O que significa P(soma ≥ k) num jogo?",
          a: "É a chance de tirar k ou mais — a pergunta «eu consigo neste turno?». Com 2d6, P(soma ≥ 10) conta as 3 + 2 + 1 = 6 maneiras de tirar 10, 11 ou 12, então é 6/36 = 1/6, o mesmo que tirar um sete. Perguntas de limite quase sempre importam mais do que perguntas de soma exata.",
        },
        {
          q: "Por que a ferramenta recusa conjuntos muito grandes?",
          a: "Este site mostra frações exatas, e contar com exatidão exige que o total de resultados Sᴺ fique abaixo de 2⁵³ — o maior inteiro que o JavaScript conta com precisão. Além disso (digamos, 30 dados de seis faces) as contagens seriam arredondadas em silêncio, então a ferramenta recusa e pede menos dados em vez de mostrar números em que não pode confiar.",
        },
      ],
    },
  },
});
