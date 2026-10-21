export type Category = "hot" | "mild" | "umami";

export type Flavor = {
  id: string;
  index: string;
  name: string;
  latin: string;
  tagline: string;
  description: string;
  heat: number;
  scoville: string;
  notes: string[];
  pairing: string[];
  category: Category;
  /** Цвет соуса внутри 3D-банки */
  sauce: string;
  /** Акцент на этикетке и в UI */
  accent: string;
  /** Цвет свечения за банкой */
  glow: string;
  price: number;
  priceLarge: number;
};

export const flavors: Flavor[] = [
  {
    id: "chipotle",
    index: "01",
    name: "Копчёный Чипотле",
    latin: "SMOKED CHIPOTLE",
    tagline: "Дым яблоневых углей и тёмная сладость",
    description:
      "Перцы морита коптятся 48 часов на яблоневых дровах, затем томятся с мусковадо и чёрным чесноком. Глубокий, бархатный, с долгим тлеющим финишем.",
    heat: 3,
    scoville: "8 000 SHU",
    notes: ["Яблоневый дым", "Мусковадо", "Какао", "Морита"],
    pairing: ["Брискет", "Тако", "Бургер"],
    category: "hot",
    sauce: "#8a2205",
    accent: "#ff5a00",
    glow: "#ff4d00",
    price: 790,
    priceLarge: 1190,
  },
  {
    id: "black-garlic",
    index: "02",
    name: "Чёрный Чеснок",
    latin: "BLACK GARLIC UMAMI",
    tagline: "40 дней ферментации. Чистый умами",
    description:
      "Чеснок медленно карамелизуется 40 дней до цвета обсидиана, встречается с выдержанным соевым соусом и мисо. Мягкий, плотный, бесконечно глубокий.",
    heat: 1,
    scoville: "500 SHU",
    notes: ["Бальзамик", "Мисо", "Тамаринд", "Жжёный сахар"],
    pairing: ["Рамен", "Стейк", "Грибы"],
    category: "umami",
    sauce: "#2a1006",
    accent: "#ff8a1f",
    glow: "#ff7a1a",
    price: 890,
    priceLarge: 1350,
  },
  {
    id: "habanero",
    index: "03",
    name: "Хабанеро & Манго",
    latin: "HABANERO MANGO",
    tagline: "Тропический удар без предупреждения",
    description:
      "Оранжевый хабанеро с Юкатана, спелое манго альфонсо и цедра лайма. Сначала — солнце, затем — пожар. Для тех, кто не боится.",
    heat: 5,
    scoville: "120 000 SHU",
    notes: ["Манго", "Лайм", "Куркума", "Хабанеро"],
    pairing: ["Креветки", "Курица", "Севиче"],
    category: "hot",
    sauce: "#e8620a",
    accent: "#ffb000",
    glow: "#ff9500",
    price: 840,
    priceLarge: 1260,
  },
  {
    id: "soy-noir",
    index: "04",
    name: "Соевая Карамель",
    latin: "SOY CARAMEL NOIR",
    tagline: "Двухлетний сёю и обожжённый сахар",
    description:
      "Соевый соус бочковой выдержки из Кюсю, карамель на грани горечи, имбирь и копчёная соль. Глянцевая глазурь, которая делает из ужина событие.",
    heat: 2,
    scoville: "2 500 SHU",
    notes: ["Сёю", "Ирис", "Имбирь", "Копчёная соль"],
    pairing: ["Утка", "Лосось", "Рёбра"],
    category: "umami",
    sauce: "#5c1c02",
    accent: "#ff6a2b",
    glow: "#e8461b",
    price: 950,
    priceLarge: 1420,
  },
];

export const bundle = {
  id: "tasting-set",
  name: "Дегустационный сет",
  latin: "THE FULL FIRE",
  description: "Все четыре вкуса по 150 мл в деревянном коробе с ручной печатью.",
  price: 2890,
  oldPrice: 3470,
};

export type Ingredient = {
  id: string;
  name: string;
  origin: string;
  fact: string;
  stat: string;
  statLabel: string;
  icon: "chili" | "garlic" | "habanero" | "soy" | "sugar" | "salt";
};

export const ingredients: Ingredient[] = [
  {
    id: "morita",
    name: "Чипотле морита",
    origin: "Оахака, Мексика",
    fact: "Спелые красные халапеньо, копчёные до состояния изюма. Даёт глубину, которой нет у свежего перца.",
    stat: "48 ч",
    statLabel: "копчения",
    icon: "chili",
  },
  {
    id: "garlic",
    name: "Чёрный чеснок",
    origin: "Аомори, Япония",
    fact: "Реакция Майяра при 60 °C превращает острые зубчики в мягкий бальзамический конфитюр.",
    stat: "40 дн",
    statLabel: "ферментации",
    icon: "garlic",
  },
  {
    id: "habanero",
    name: "Хабанеро",
    origin: "Юкатан, Мексика",
    fact: "Собираем только оранжевые плоды полной зрелости — у них самый яркий фруктовый аромат.",
    stat: "350K",
    statLabel: "SHU максимум",
    icon: "habanero",
  },
  {
    id: "shoyu",
    name: "Сёю бочковой выдержки",
    origin: "Кюсю, Япония",
    fact: "Соя и пшеница бродят два года в кедровых бочках — по технологии, которой 300 лет.",
    stat: "2 года",
    statLabel: "выдержки",
    icon: "soy",
  },
  {
    id: "muscovado",
    name: "Мусковадо",
    origin: "Маврикий",
    fact: "Нерафинированный тростниковый сахар с нотами лакрицы и патоки. Никакого белого сахара.",
    stat: "0 г",
    statLabel: "рафинада",
    icon: "sugar",
  },
  {
    id: "salt",
    name: "Копчёная соль",
    origin: "Анголсей, Уэльс",
    fact: "Морские хлопья, копчённые на дубовой щепе от старых виски-бочек. Финальный штрих каждой банки.",
    stat: "16 ч",
    statLabel: "на дубе",
    icon: "salt",
  },
];

export const story = [
  {
    index: "01",
    kicker: "Глава первая",
    title: ["Всё", "началось", "с костра"],
    body: "2019 год, задний двор, мангал и ящик перцев, который никто не хотел. Мы закоптили их от отчаяния — и попробовали то, что изменило всё.",
    stat: "1",
    statLabel: "ящик перцев",
  },
  {
    index: "02",
    kicker: "Глава вторая",
    title: ["Время —", "главный", "ингредиент"],
    body: "Мы не ускоряем. 90 дней ферментации в дубовых бочках, пока вкус не станет глубже, темнее и честнее, чем мы сами.",
    stat: "90",
    statLabel: "дней в бочке",
  },
  {
    index: "03",
    kicker: "Глава третья",
    title: ["Каждая", "банка —", "ритуал"],
    body: "Разливаем вручную малыми партиями, запечатываем и нумеруем. Открывая крышку, вы выпускаете дым того самого костра.",
    stat: "12",
    statLabel: "партий в год",
  },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(n) + " ₽";
