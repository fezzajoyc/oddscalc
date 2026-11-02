import { BirthdayEngine } from "../_engines/engine-birthday-paradox";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "birthday-paradox",
  category: "utility",
  icon: "sparkle",
  engine: { component: BirthdayEngine },
  related: ["dice-probability", "coin-flip", "lottery-odds"],
  copy: {
    en: {
      name: "Birthday Paradox Calculator",
      tagline:
        "How many people make a shared birthday likely? Exact P(at least two share) for N people in a room — 23 already pass 50% — computed by the safe iterative product, with the classic curve shown person by person.",
      intro: [
        "In a room of 23 people, the chance that two share a birthday is 50.73% — better than even. Most people guess you would need 183, half of 365, and the gap between 23 and 183 is why this is called a paradox. It is not a logic trick, just counting done correctly: the probability that nobody collides is 365/365 × 364/365 × 363/365 × …, one shrinking factor per person, and 1 minus that product is the answer. With 23 factors the no-collision product is already down to 0.4927.",
        "This calculator computes the product directly instead of touching 365! (a number with 779 digits that overflows every float). Each factor stays at most 1, so nothing ever overflows and the result is trustworthy for hundreds of people. Type any room size to see its probability, where the 50% line first gets crossed, and a person-by-person curve that makes the steepness visual: 10 people give 11.7%, 20 give 41.1%, 23 give 50.7%, 30 give 70.6%, 50 give 97.0%.",
      ],
      steps: [
        "Enter how many people are in the room (0–366).",
        "Read P(at least two share a birthday) as a percentage and a decimal.",
        "Check at which headcount the 50% line is first crossed.",
        "Scan the curve table to see how fast the probability climbs person by person.",
      ],
      faqs: [
        {
          q: "Why is 23 the magic number?",
          a: "Because pairwise comparisons multiply fast. With 23 people there are 23×22/2 = 253 distinct pairs, and each pair has a 1/365 chance of matching. Those chances overlap, so it is not simply 253/365 — but the exact product 365/365 × 364/365 × … × 343/365 drops below 1/2 at 23 people, giving 50.73%.",
        },
        {
          q: "What is the exact formula?",
          a: "P(shared) = 1 − 365!/(365ᴺ × (365−N)!). Written that way it overflows: 365! has 779 digits. Rewritten as a product of N ratios — ∏_{i=0..N−1} (365−i)/365 — every factor lies in [0,1] and the multiplication never exceeds 1. That is the form this calculator evaluates, and it is numerically safe for any room size.",
        },
        {
          q: "Does the model handle leap days?",
          a: "No, and it says so: the standard classroom model assumes 365 equally likely birthdays and ignores February 29. Adding a 366th day changes the numbers slightly (23 people give about 50.69% instead of 50.73%) but not the shape of the result — the paradox survives.",
        },
        {
          q: "How big does the room get before a shared birthday is certain?",
          a: "At 366 people it is literally certain — with only 365 possible birthdays, the pigeonhole principle forces a collision. The calculator caps at 366 and returns exactly 1 for anything above 365, instead of pretending there is still a sliver of doubt.",
        },
      ],
    },
    zh: {
      name: "生日悖论计算器",
      tagline:
        "多少人在一起时生日重合就变得大概率?房间里有 N 个人的精确 P(至少两人生日相同)——23 人就已过 50%——用稳妥的迭代乘积计算,经典曲线逐人展示。",
      intro: [
        "23 个人的房间里,两人生日相同的概率是 50.73%——过半了。大多数人猜需要 183 人(365 的一半),23 与 183 之间的落差正是“悖论”得名的原因。它不是逻辑戏法,只是把数算对:没有人撞生日的概率是 365/365 × 364/365 × 363/365 × …,每人一个缩小因子,1 减去这个乘积就是答案。乘到第 23 个因子时,“无人重合”的乘积已经跌到 0.4927。",
        "本计算器直接算这个乘积,而不去碰 365!(一个 779 位、撑爆所有浮点数的数字)。每个因子都不超过 1,所以永远不会溢出,几百人的结果也可信。输入任意房间人数,看它的概率、50% 线首次被跨过的人数,以及那条让陡峭程度可见的逐人曲线:10 人 11.7%,20 人 41.1%,23 人 50.7%,30 人 70.6%,50 人 97.0%。",
      ],
      steps: [
        "输入房间里的人数(0–366)。",
        "以百分比和小数读取 P(至少两人生日相同)。",
        "查看 50% 线首次被跨过的人数。",
        "在曲线表中逐人观察概率爬升的速度。",
      ],
      faqs: [
        {
          q: "为什么魔法数字是 23?",
          a: "因为两两比较增长极快。23 个人有 23×22/2 = 253 个不同配对,每对的生日重合概率是 1/365。这些机会相互重叠,所以不是简单的 253/365——但精确乘积 365/365 × 364/365 × … × 343/365 在 23 人时跌破 1/2,给出 50.73%。",
        },
        {
          q: "精确公式是什么?",
          a: "P(重合) = 1 − 365!/(365ᴺ × (365−N)!)。这样写会溢出:365! 有 779 位。改写成 N 个比例的乘积——∏_{i=0..N−1} (365−i)/365——每个因子都落在 [0,1] 内,乘积永远不会超过 1。这就是本计算器求值的形式,对任意人数都数值安全。",
        },
        {
          q: "这个模型处理闰日吗?",
          a: "不处理,而且如实说明:课堂标准模型假设 365 个等可能生日,忽略 2 月 29 日。加上第 366 天会让数字略有变化(23 人约 50.69% 而非 50.73%),但不改变结论的形状——悖论依然成立。",
        },
        {
          q: "房间里多少人时生日重合变成必然?",
          a: "366 人时是字面意义的必然——只有 365 个可能的生日,鸽笼原理强制重合。计算器把上限设在 366,超过 365 一律精确返回 1,而不是假装还有一丝悬念。",
        },
      ],
    },
    ja: {
      name: "誕生日のパラドックス計算",
      tagline:
        "何人集まれば同じ誕生日がありそうになる? 部屋に N 人いるときの正確な P(少なくとも2人が一致)——23 人で早くも 50% 超え——安全な反復乗積で計算し、古典曲線を一人ずつ表示します。",
      intro: [
        "23 人の部屋で、誰か 2 人が同じ誕生日である確率は 50.73%——半分を超えています。多くの人は 365 の半分の 183 人と答えますが、23 と 183 の差こそ「パラドックス」と呼ばれる理由です。論理のトリックではなく、ただ正しく数えただけです。誰も一致しない確率は 365/365 × 364/365 × 363/365 × … と 1 人ごとに縮む因子が掛かり、1 からその積を引いたものが答え。23 個目の因子まで掛けると、一致なしの積はすでに 0.4927 まで落ちています。",
        "この計算機は 365!(779 桁の、あらゆる浮動小数点をオーバーフローさせる数字)に触れず、積を直接計算します。各因子は最大でも 1 なので何も溢れず、数百人でも結果は信頼できます。任意の人数を入力すれば、その確率、50% の線を最初に越える人数、そして急上昇ぶりが目に見える一人ずつの曲線が得られます。10 人で 11.7%、20 人で 41.1%、23 人で 50.7%、30 人で 70.6%、50 人で 97.0%。",
      ],
      steps: [
        "部屋にいる人数を入力します(0〜366)。",
        "P(少なくとも 2 人が同じ誕生日) を百分率と小数で読みます。",
        "50% の線を最初に越える人数を確認します。",
        "曲線表で、確率が一人ごとにどう駆け上がるかを見ます。",
      ],
      faqs: [
        {
          q: "なぜ 23 人が魔法の数字なのですか?",
          a: "ペアの比較が急速に増えるからです。23 人には 23×22/2 = 253 通りの異なるペアがあり、各ペアが一致する確率は 1/365。これらは重なり合うので単純に 253/365 ではありませんが、正確な積 365/365 × 364/365 × … × 343/365 は 23 人で 1/2 を割り、50.73% になります。",
        },
        {
          q: "正確な公式は何ですか?",
          a: "P(一致) = 1 − 365!/(365ᴺ × (365−N)!)。このままでは 365! が 779 桁でオーバーフローします。N 個の比の積 ∏_{i=0..N−1} (365−i)/365 と書き直せば、各因子は [0,1] に収まり、積が 1 を超えることはありません。これがこの計算機が評価する形で、任意の人数で数値的に安全です。",
        },
        {
          q: "うるう日は扱いますか?",
          a: "扱いませんし、その旨を明記しています。教室の標準モデルは 365 の等確率の誕生日を仮定し、2 月 29 日を無視します。366 日目を加えると数字はわずかに変わりますが(23 人で約 50.69%)、結論の形は変わりません——パラドックスは生き残ります。",
        },
        {
          q: "何人いれば一致が確実になりますか?",
          a: "366 人で文字どおり確実です。誕生日の候補は 365 通りしかないので、鳩の巣原理が一致を強制します。計算機は 366 で頭打ちにし、365 を超えるものにはきっかり 1 を返します。まだわずかに可能性が残っているふりはしません。",
        },
      ],
    },
    es: {
      name: "Calculadora de la paradoja del cumpleaños",
      tagline:
        "¿Cuántas personas hacen probable un cumpleaños compartido? P(exacta de que al menos dos coincidan) para N personas en una sala — 23 ya superan el 50% — calculada con el producto iterativo seguro, con la curva clásica persona a persona.",
      intro: [
        "En una sala de 23 personas, la probabilidad de que dos cumplan años el mismo día es del 50,73% — mejor que una moneda. La mayoría estima que harían falta 183, la mitad de 365, y la distancia entre 23 y 183 es la razón del nombre «paradoja». No es un truco de lógica, es contar bien: la probabilidad de que nadie coincida es 365/365 × 364/365 × 363/365 × …, un factor que encoge por persona, y 1 menos ese producto es la respuesta. A los 23 factores, el producto sin colisión ya bajó a 0,4927.",
        "Esta calculadora evalúa el producto directamente, sin tocar 365! (un número de 779 dígitos que desborda cualquier flotante). Cada factor vale como mucho 1, así que nada desborda jamás y el resultado es fiable para cientos de personas. Escriba cualquier tamaño de sala para ver su probabilidad, dónde se cruza por primera vez la línea del 50% y una curva persona a persona que hace visible la pendiente: 10 personas dan 11,7%, 20 dan 41,1%, 23 dan 50,7%, 30 dan 70,6%, 50 dan 97,0%.",
      ],
      steps: [
        "Introduzca cuántas personas hay en la sala (0–366).",
        "Lea P(al menos dos cumplen el mismo día) como porcentaje y decimal.",
        "Compruebe con cuántas personas se cruza por primera vez la línea del 50%.",
        "Recorra la tabla de la curva para ver lo rápido que sube la probabilidad persona a persona.",
      ],
      faqs: [
        {
          q: "¿Por qué 23 es el número mágico?",
          a: "Porque las comparaciones por parejas se multiplican rápido. Con 23 personas hay 23×22/2 = 253 parejas distintas, y cada una tiene 1/365 de coincidir. Esas chances se solapan, así que no es simplemente 253/365 — pero el producto exacto 365/365 × 364/365 × … × 343/365 cae por debajo de 1/2 con 23 personas y da 50,73%.",
        },
        {
          q: "¿Cuál es la fórmula exacta?",
          a: "P(coincidencia) = 1 − 365!/(365ᴺ × (365−N)!). Escrita así desborda: 365! tiene 779 dígitos. Reescrita como producto de N razones — ∏_{i=0..N−1} (365−i)/365 — cada factor queda en [0,1] y la multiplicación nunca supera 1. Esa es la forma que evalúa esta calculadora, numéricamente segura para cualquier tamaño de sala.",
        },
        {
          q: "¿El modelo contempla los años bisiestos?",
          a: "No, y lo dice: el modelo estándar de aula supone 365 cumpleaños equiprobables e ignora el 29 de febrero. Añadir el día 366 mueve los números apenas (23 personas dan unos 50,69% en vez de 50,73%) pero no la forma del resultado — la paradoja sobrevive.",
        },
        {
          q: "¿Con cuánta gente es seguro un cumpleaños compartido?",
          a: "Con 366 es literalmente seguro: con solo 365 cumpleaños posibles, el principio del palomar fuerza una coincidencia. La calculadora topa en 366 y devuelve exactamente 1 para cualquier cosa por encima de 365, en lugar de fingir que queda alguna duda.",
        },
      ],
    },
    pt: {
      name: "Calculadora do paradoxo do aniversário",
      tagline:
        "Quantas pessoas tornam provável um aniversário compartilhado? P(exata de que pelo menos dois coincidam) para N pessoas numa sala — 23 já passam de 50% — calculada pelo produto iterativo seguro, com a curva clássica pessoa a pessoa.",
      intro: [
        "Numa sala com 23 pessoas, a chance de duas fazerem aniversário no mesmo dia é de 50,73% — melhor que uma moeda. A maioria estima que seriam precisas 183, metade de 365, e a distância entre 23 e 183 é a razão do nome «paradoxo». Não é truque de lógica, é contar direito: a probabilidade de ninguém coincidir é 365/365 × 364/365 × 363/365 × …, um fator que encolhe por pessoa, e 1 menos esse produto é a resposta. No fator 23, o produto sem colisão já caiu para 0,4927.",
        "Esta calculadora avalia o produto diretamente, sem tocar em 365! (um número de 779 dígitos que estoura qualquer ponto flutuante). Cada fator vale no máximo 1, então nada transborda jamais e o resultado é confiável para centenas de pessoas. Digite qualquer tamanho de sala para ver a probabilidade, onde a linha dos 50% é cruzada pela primeira vez e uma curva pessoa a pessoa que torna a inclinação visível: 10 pessoas dão 11,7%, 20 dão 41,1%, 23 dão 50,7%, 30 dão 70,6%, 50 dão 97,0%.",
      ],
      steps: [
        "Informe quantas pessoas há na sala (0–366).",
        "Leia P(pelo menos dois fazem anos no mesmo dia) como porcentagem e decimal.",
        "Verifique com quantas pessoas a linha dos 50% é cruzada pela primeira vez.",
        "Percorra a tabela da curva para ver quão rápido a probabilidade sobe, pessoa a pessoa.",
      ],
      faqs: [
        {
          q: "Por que 23 é o número mágico?",
          a: "Porque as comparações em pares se multiplicam rápido. Com 23 pessoas há 23×22/2 = 253 pares distintos, e cada par tem 1/365 de coincidir. Essas chances se sobrepõem, então não é simplesmente 253/365 — mas o produto exato 365/365 × 364/365 × … × 343/365 cai abaixo de 1/2 com 23 pessoas e dá 50,73%.",
        },
        {
          q: "Qual é a fórmula exata?",
          a: "P(coincidência) = 1 − 365!/(365ᴺ × (365−N)!). Escrita assim transborda: 365! tem 779 dígitos. Reescrita como produto de N razões — ∏_{i=0..N−1} (365−i)/365 — cada fator fica em [0,1] e a multiplicação nunca passa de 1. Essa é a forma que esta calculadora avalia, numericamente segura para qualquer tamanho de sala.",
        },
        {
          q: "O modelo considera anos bissextos?",
          a: "Não, e diz isso: o modelo padrão de sala de aula assume 365 aniversários equiprováveis e ignora o 29 de fevereiro. Acrescentar o 366º dia muda os números pouco (23 pessoas dão cerca de 50,69% em vez de 50,73%) mas não a forma do resultado — o paradoxo sobrevive.",
        },
        {
          q: "Com quantas pessoas um aniversário compartilhado é certo?",
          a: "Com 366 é literalmente certo: com apenas 365 aniversários possíveis, o princípio da casa dos pombos força uma coincidência. A calculadora limita em 366 e devolve exatamente 1 para qualquer valor acima de 365, em vez de fingir que resta alguma dúvida.",
        },
      ],
    },
  },
});
