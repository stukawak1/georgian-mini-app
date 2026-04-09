// Georgian Language Learning Data

const ALPHABET = [
  { letter: 'ა', roman: 'a', ru: 'а', hint: 'как «а» в «арбуз»', example: 'ანი (ani) — имя' },
  { letter: 'ბ', roman: 'b', ru: 'б', hint: 'как «б» в «банан»', example: 'ბათუმი (batumi) — Батуми' },
  { letter: 'გ', roman: 'g', ru: 'г', hint: 'как «г» в «город»', example: 'გული (guli) — сердце' },
  { letter: 'დ', roman: 'd', ru: 'д', hint: 'как «д» в «дом»', example: 'დედა (deda) — мама' },
  { letter: 'ე', roman: 'e', ru: 'е', hint: 'как «э» в «это»', example: 'ერთი (erti) — один' },
  { letter: 'ვ', roman: 'v', ru: 'в', hint: 'как «в» в «вода»', example: 'ვარდი (vardi) — роза' },
  { letter: 'ზ', roman: 'z', ru: 'з', hint: 'как «з» в «зима»', example: 'ზღვა (zghva) — море' },
  { letter: 'თ', roman: 'th', ru: 'т (придых.)', hint: 'мягкое «т» с выдохом воздуха', example: 'თბილისი (tbilisi) — Тбилиси' },
  { letter: 'ი', roman: 'i', ru: 'и', hint: 'как «и» в «игра»', example: 'ივანე (ivane) — Иване' },
  { letter: 'კ', roman: "k'", ru: 'к (смычн.)', hint: 'резкое «к», без выдоха', example: 'კაცი (k\'atsi) — мужчина' },
  { letter: 'ლ', roman: 'l', ru: 'л', hint: 'как «л» в «лес»', example: 'ლომი (lomi) — лев' },
  { letter: 'მ', roman: 'm', ru: 'м', hint: 'как «м» в «мама»', example: 'მზე (mze) — солнце' },
  { letter: 'ნ', roman: 'n', ru: 'н', hint: 'как «н» в «нос»', example: 'ნინო (nino) — Нино' },
  { letter: 'ო', roman: 'o', ru: 'о', hint: 'как «о» в «окно»', example: 'ოჯახი (ojakhi) — семья' },
  { letter: 'პ', roman: "p'", ru: 'п (смычн.)', hint: 'резкое «п», без выдоха', example: 'პური (p\'uri) — хлеб' },
  { letter: 'ჟ', roman: 'zh', ru: 'ж', hint: 'как «ж» в «жара»', example: 'ჟინი (zhini) — желание' },
  { letter: 'რ', roman: 'r', ru: 'р', hint: 'вибрирующее «р»', example: 'რქა (rqa) — рог' },
  { letter: 'ს', roman: 's', ru: 'с', hint: 'как «с» в «сад»', example: 'სახლი (sakhli) — дом' },
  { letter: 'ტ', roman: "t'", ru: 'т (смычн.)', hint: 'резкое «т», без выдоха', example: 'ტყე (t\'qe) — лес' },
  { letter: 'უ', roman: 'u', ru: 'у', hint: 'как «у» в «утро»', example: 'უბანი (ubani) — район' },
  { letter: 'ფ', roman: 'p', ru: 'п (придых.)', hint: 'мягкое «п» с выдохом, почти «ф»', example: 'ფული (puli) — деньги' },
  { letter: 'ქ', roman: 'q', ru: 'к (придых.)', hint: 'мягкое «к» с выдохом', example: 'ქალაქი (kalaki) — город' },
  { letter: 'ღ', roman: 'gh', ru: 'г (фрикат.)', hint: 'глубокое «г», почти как «р» во французском', example: 'ღვინო (ghvino) — вино' },
  { letter: 'ყ', roman: "q'", ru: 'гортанн. к', hint: 'гортанное «к» из глубины горла', example: 'ყავა (q\'ava) — кофе' },
  { letter: 'შ', roman: 'sh', ru: 'ш', hint: 'как «ш» в «шум»', example: 'შვილი (shvili) — дитя' },
  { letter: 'ჩ', roman: 'ch', ru: 'ч (придых.)', hint: 'мягкое «ч» с выдохом', example: 'ჩაი (chai) — чай' },
  { letter: 'ც', roman: 'ts', ru: 'ц (придых.)', hint: 'мягкое «ц» с выдохом', example: 'ცხოვრება (tskhovreba) — жизнь' },
  { letter: 'ძ', roman: 'dz', ru: 'дз', hint: 'как «дз» в «дзюдо»', example: 'ძმა (dzma) — брат' },
  { letter: 'წ', roman: "ts'", ru: 'ц (смычн.)', hint: 'резкое «ц», без выдоха', example: 'წყალი (ts\'q\'ali) — вода' },
  { letter: 'ჭ', roman: "ch'", ru: 'ч (смычн.)', hint: 'резкое «ч», без выдоха', example: 'ჭამა (ch\'ama) — еда' },
  { letter: 'ხ', roman: 'kh', ru: 'х', hint: 'как «х» в «хорошо»', example: 'ხინკალი (khinkali) — хинкали' },
  { letter: 'ჯ', roman: 'j', ru: 'дж', hint: 'как «дж» в «джаз»', example: 'ჯამი (jami) — чашка' },
  { letter: 'ჰ', roman: 'h', ru: 'х (мягк.)', hint: 'очень мягкое «х», почти «г»', example: 'ჰაერი (haeri) — воздух' },
];

const PHRASES = {
  greeting: {
    title: 'Приветствия',
    icon: '👋',
    items: [
      { ka: 'გამარჯობა', rom: 'gamarjoba', ru: 'Здравствуйте / Привет', note: 'Самое универсальное приветствие' },
      { ka: 'გამარჯობათ', rom: 'gamarjobat', ru: 'Здравствуйте (вежливо)', note: 'Для старших и незнакомых' },
      { ka: 'სალამი', rom: 'salami', ru: 'Привет (неформально)', note: 'Среди друзей' },
      { ka: 'ნახვამდის', rom: 'nakhvamdis', ru: 'До свидания', note: '' },
      { ka: 'კარგად იყავი', rom: 'kargad iq\'avi', ru: 'Будь здоров/а', note: 'Прощание' },
      { ka: 'როგორ ხარ?', rom: 'rogor khar?', ru: 'Как дела?', note: '' },
      { ka: 'კარგად, გმადლობ', rom: 'kargad, gmadlob', ru: 'Хорошо, спасибо', note: 'Ответ на «как дела»' },
      { ka: 'სახელი მქვია...', rom: 'sakheli mqvia...', ru: 'Меня зовут...', note: 'Вставьте своё имя' },
    ]
  },
  polite: {
    title: 'Вежливость',
    icon: '🙏',
    items: [
      { ka: 'გმადლობ', rom: 'gmadlob', ru: 'Спасибо', note: 'Неформально' },
      { ka: 'გმადლობთ', rom: 'gmadlobt', ru: 'Спасибо (вежливо)', note: 'Формальная форма' },
      { ka: 'დიდი მადლობა', rom: 'didi madloba', ru: 'Большое спасибо', note: '' },
      { ka: 'ბოდიში', rom: 'bodishi', ru: 'Извините / Простите', note: 'Для привлечения внимания и извинений' },
      { ka: 'კი', rom: 'ki', ru: 'Да', note: '' },
      { ka: 'არა', rom: 'ara', ru: 'Нет', note: '' },
      { ka: 'გთხოვთ', rom: 'gtkhovt', ru: 'Пожалуйста (просьба)', note: 'При обращении с просьбой' },
      { ka: 'არაფერს', rom: 'arapars', ru: 'Пожалуйста (ответ)', note: 'Ответ на «спасибо»' },
    ]
  },
  food: {
    title: 'Еда и рестораны',
    icon: '🍽️',
    items: [
      { ka: 'ხინკალი', rom: 'khinkali', ru: 'Хинкали', note: 'Грузинские пельмени — must try!' },
      { ka: 'ხაჭაპური', rom: 'khachapuri', ru: 'Хачапури', note: 'Сырная лепёшка' },
      { ka: 'ღვინო', rom: 'ghvino', ru: 'Вино', note: 'Грузия — родина вина' },
      { ka: 'წყალი', rom: 'ts\'q\'ali', ru: 'Вода', note: '' },
      { ka: 'ყავა', rom: 'q\'ava', ru: 'Кофе', note: '' },
      { ka: 'ჩაი', rom: 'chai', ru: 'Чай', note: '' },
      { ka: 'პური', rom: 'p\'uri', ru: 'Хлеб', note: '' },
      { ka: 'ანგარიში, გთხოვთ', rom: 'angarishi, gtkhovt', ru: 'Счёт, пожалуйста', note: 'В ресторане' },
      { ka: 'გემრიელია!', rom: 'gemrielial', ru: 'Вкусно!', note: 'Хозяин будет рад!' },
      { ka: 'მშიოდა!', rom: 'mshioda!', ru: 'Я проголодался/ась!', note: '' },
      { ka: 'გაუმარჯოს!', rom: 'gaumarjos!', ru: 'За здоровье! / Ваше здоровье!', note: 'Грузинский тост' },
    ]
  },
  navigation: {
    title: 'Ориентирование',
    icon: '🗺️',
    items: [
      { ka: 'სად არის...?', rom: 'sad aris...?', ru: 'Где находится...?', note: '' },
      { ka: 'მარცხნივ', rom: 'martskhniv', ru: 'Налево', note: '' },
      { ka: 'მარჯვნივ', rom: 'marjvniv', ru: 'Направо', note: '' },
      { ka: 'პირდაპირ', rom: 'pirdapir', ru: 'Прямо', note: '' },
      { ka: 'ახლოს', rom: 'akhlos', ru: 'Близко', note: '' },
      { ka: 'შორს', rom: 'shors', ru: 'Далеко', note: '' },
      { ka: 'მეტრო', rom: 'metro', ru: 'Метро', note: '' },
      { ka: 'ავტობუსი', rom: 'avtobusi', ru: 'Автобус', note: '' },
      { ka: 'ტაქსი', rom: 'taksi', ru: 'Такси', note: '' },
      { ka: 'აეროპორტი', rom: 'aerop\'orti', ru: 'Аэропорт', note: '' },
      { ka: 'სასტუმრო', rom: 'sastumro', ru: 'Гостиница / Отель', note: '' },
    ]
  },
  shopping: {
    title: 'Покупки',
    icon: '🛍️',
    items: [
      { ka: 'რამდენი ღირს?', rom: 'ramdeni ghirs?', ru: 'Сколько стоит?', note: '' },
      { ka: 'ძვირია', rom: 'dzvir\'ia', ru: 'Дорого', note: '' },
      { ka: 'იაფია', rom: 'iapia', ru: 'Дёшево', note: '' },
      { ka: 'მინდა...', rom: 'minda...', ru: 'Я хочу...', note: '' },
      { ka: 'ბაზარი', rom: 'bazari', ru: 'Базар / Рынок', note: '' },
      { ka: 'ფული', rom: 'p\'uli', ru: 'Деньги', note: '' },
      { ka: 'ლარი', rom: 'lari', ru: 'Лари (валюта)', note: 'Грузинская валюта' },
    ]
  },
  emergency: {
    title: 'Экстренные фразы',
    icon: '🆘',
    items: [
      { ka: 'დამეხმარეთ!', rom: 'damekhmaret!', ru: 'Помогите!', note: '' },
      { ka: 'ექიმი', rom: 'ekimi', ru: 'Врач', note: '' },
      { ka: 'საავადმყოფო', rom: 'saavadmq\'opo', ru: 'Больница', note: '' },
      { ka: 'პოლიცია', rom: 'p\'olitsia', ru: 'Полиция', note: '' },
      { ka: 'ცეცხლი!', rom: 'tsetskhli!', ru: 'Пожар!', note: '' },
      { ka: 'სასწრაფო დახმარება', rom: 'sasts\'rapo dakhmmareba', ru: 'Скорая помощь', note: 'Телефон: 112' },
      { ka: 'მე ვარ დაკარგული', rom: 'me var dak\'arguli', ru: 'Я потерялся/ась', note: '' },
    ]
  },
};

const FLASHCARDS = [
  { ka: 'სახლი', rom: 'sakhli', ru: 'дом', category: 'Место' },
  { ka: 'ქუჩა', rom: 'kucha', ru: 'улица', category: 'Место' },
  { ka: 'ქალაქი', rom: 'kalaki', ru: 'город', category: 'Место' },
  { ka: 'მთა', rom: 'mtha', ru: 'гора', category: 'Природа' },
  { ka: 'ზღვა', rom: 'zghva', ru: 'море', category: 'Природа' },
  { ka: 'მდინარე', rom: 'mdinare', ru: 'река', category: 'Природа' },
  { ka: 'ტყე', rom: "t'qe", ru: 'лес', category: 'Природа' },
  { ka: 'ცა', rom: 'tsa', ru: 'небо', category: 'Природа' },
  { ka: 'მზე', rom: 'mze', ru: 'солнце', category: 'Природа' },
  { ka: 'წყალი', rom: "ts'q'ali", ru: 'вода', category: 'Еда' },
  { ka: 'პური', rom: "p'uri", ru: 'хлеб', category: 'Еда' },
  { ka: 'ყავა', rom: "q'ava", ru: 'кофе', category: 'Еда' },
  { ka: 'ღვინო', rom: 'ghvino', ru: 'вино', category: 'Еда' },
  { ka: 'ხინკალი', rom: 'khinkali', ru: 'хинкали', category: 'Еда' },
  { ka: 'ხაჭაპური', rom: "khach'ap'uri", ru: 'хачапури', category: 'Еда' },
  { ka: 'ხილი', rom: 'khili', ru: 'фрукты', category: 'Еда' },
  { ka: 'ბოსტნეული', rom: 'bostneuli', ru: 'овощи', category: 'Еда' },
  { ka: 'დედა', rom: 'deda', ru: 'мама', category: 'Семья' },
  { ka: 'მამა', rom: 'mama', ru: 'папа', category: 'Семья' },
  { ka: 'და', rom: 'da', ru: 'сестра', category: 'Семья' },
  { ka: 'ძმა', rom: 'dzma', ru: 'брат', category: 'Семья' },
  { ka: 'მეგობარი', rom: 'megobari', ru: 'друг', category: 'Люди' },
  { ka: 'კაცი', rom: "k'atsi", ru: 'мужчина', category: 'Люди' },
  { ka: 'ქალი', rom: 'kali', ru: 'женщина', category: 'Люди' },
  { ka: 'ბავშვი', rom: 'bavshvi', ru: 'ребёнок', category: 'Люди' },
  { ka: 'ერთი', rom: 'erti', ru: 'один (1)', category: 'Числа' },
  { ka: 'ორი', rom: 'ori', ru: 'два (2)', category: 'Числа' },
  { ka: 'სამი', rom: 'sami', ru: 'три (3)', category: 'Числа' },
  { ka: 'ოთხი', rom: 'otkhi', ru: 'четыре (4)', category: 'Числа' },
  { ka: 'ხუთი', rom: 'khuti', ru: 'пять (5)', category: 'Числа' },
  { ka: 'ექვსი', rom: 'ekvsi', ru: 'шесть (6)', category: 'Числа' },
  { ka: 'შვიდი', rom: 'shvidi', ru: 'семь (7)', category: 'Числа' },
  { ka: 'რვა', rom: 'rva', ru: 'восемь (8)', category: 'Числа' },
  { ka: 'ცხრა', rom: 'tskhra', ru: 'девять (9)', category: 'Числа' },
  { ka: 'ათი', rom: 'ati', ru: 'десять (10)', category: 'Числа' },
  { ka: 'კარგი', rom: "k'argi", ru: 'хороший / хорошо', category: 'Прилагат.' },
  { ka: 'ცუდი', rom: 'tsudi', ru: 'плохой / плохо', category: 'Прилагат.' },
  { ka: 'დიდი', rom: 'didi', ru: 'большой', category: 'Прилагат.' },
  { ka: 'პატარა', rom: "p'at'ara", ru: 'маленький', category: 'Прилагат.' },
  { ka: 'ლამაზი', rom: 'lamazi', ru: 'красивый', category: 'Прилагат.' },
  { ka: 'ახალი', rom: 'akhali', ru: 'новый', category: 'Прилагат.' },
  { ka: 'ძველი', rom: 'dzveli', ru: 'старый', category: 'Прилагат.' },
  { ka: 'ცხელი', rom: 'tskheli', ru: 'горячий', category: 'Прилагат.' },
  { ka: 'ცივი', rom: 'tsivi', ru: 'холодный', category: 'Прилагат.' },
];

const TIPS = [
  {
    icon: '🍷',
    title: 'Грузинское вино и тост',
    text: 'Грузия — родина виноделия (8000 лет!). Когда поднимают тост «გაუმარჯოს!» (gaumarjos!), ответьте тем же. Отказываться от угощения — невежливо, поэтому лучше скажите «ოდნავ» (odnav) — «чуть-чуть».',
    color: '#8B1A1A'
  },
  {
    icon: '🏠',
    title: 'Гостеприимство — святое',
    text: 'Грузины невероятно гостеприимны. Если вас пригласили домой — соглашайтесь! Принесите что-нибудь сладкое или вино. Слово «სტუმარი» (stumari, гость) — почётное звание.',
    color: '#1A5C1A'
  },
  {
    icon: '⛪',
    title: 'Церкви и храмы',
    text: 'Перед входом в церковь женщинам нужно покрыть голову и плечи. У входов обычно лежат платки. Фотографировать можно, но тихо и уважительно.',
    color: '#5C4A1A'
  },
  {
    icon: '🤝',
    title: 'Язык жестов',
    text: 'Кивок головой вниз — «да», влево-вправо — «нет». Это отличается от привычного! Также грузины очень тактильны: объятия и поцелуи в щёку при встрече — норма.',
    color: '#1A3A5C'
  },
  {
    icon: '🍽️',
    title: 'Хинкали едят руками',
    text: 'Хинкали держат за «хвостик» — он не едётся (считается неправильным это делать). Надкусите снизу, выпейте бульон, затем съешьте остальное. Хвостики на тарелке считают!',
    color: '#5C1A3A'
  },
  {
    icon: '💰',
    title: 'Деньги и чаевые',
    text: 'Валюта — Лари (GEL). Чаевые в ресторанах обычно 10%, можно оставить наличными. Во многих местах принимают карты, но наличные в маленьких заведениях обязательны.',
    color: '#2A5C3A'
  },
  {
    icon: '🚗',
    title: 'Транспорт',
    text: 'Маршрутки (маршрутки!) — основной вид транспорта. Оплата наличными или картой Metromoney. В Тбилиси есть метро (2 линии). Такси через Bolt или Yandex Go — дёшево и удобно.',
    color: '#3A2A5C'
  },
  {
    icon: '🗣️',
    title: 'Язык и реакция',
    text: 'Любая попытка говорить по-грузински вызывает бурную радость у местных! Даже простое «გამარჯობა» (gamarjoba) и «გმადლობ» (gmadlob) растопит любое сердце. Не бойтесь ошибаться!',
    color: '#1A4A5C'
  },
  {
    icon: '📅',
    title: 'Праздники и традиции',
    text: 'Гиоргоба (Св. Георгий) — 23 ноября, главный праздник. Новый год грузины встречают дважды: 1 января и 14 января. Рождество — 7 января. В эти дни всё может быть закрыто.',
    color: '#5C3A1A'
  },
  {
    icon: '🌿',
    title: 'Специи и зелень',
    text: 'Грузинская кухня использует много зелени: кинза, петрушка, эстрагон. Если не переносите кинзу — скажите «კინძი არ მინდა» (kindzi ar minda) — «кинзу не хочу».',
    color: '#2A5C2A'
  },
];
