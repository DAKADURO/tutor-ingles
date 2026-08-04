const GRAMMAR_LESSONS = [
  {
    id: 'a1-tobe',
    level: 'A1',
    title: 'El verbo "to be" (ser/estar)',
    explanation:
      'El verbo "to be" cambia según la persona:\nI am — you are — he/she/it is — we are — they are.\n\nSe usa para describir quién eres, cómo estás o dónde estás.',
    example: 'I am a student. She is happy. They are at home.',
    exercise: {
      question: 'She ___ a teacher.',
      options: ['is', 'are', 'am'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "She" usa "is".',
      feedbackWrong: 'La forma correcta es "is" porque "she" es tercera persona singular.',
    },
  },
  {
    id: 'a1-articles',
    level: 'A1',
    title: 'Artículos "a" y "an"',
    explanation:
      'Usa "a" antes de una palabra que empieza con sonido de consonante, y "an" antes de un sonido de vocal (a, e, i, o, u).',
    example: 'I have a dog. She has an apple. He is an engineer.',
    exercise: {
      question: 'I have ___ apple.',
      options: ['a', 'an'],
      correct: 1,
      feedbackCorrect: '¡Correcto! "Apple" empieza con sonido de vocal, así que usamos "an".',
      feedbackWrong: 'Se usa "an" porque "apple" empieza con un sonido de vocal.',
    },
  },
  {
    id: 'a1-plurals',
    level: 'A1',
    title: 'Plural de sustantivos',
    explanation:
      'La mayoría de sustantivos suman "-s" (book → books). Los que terminan en s, x, ch, sh suman "-es" (box → boxes). Algunos son irregulares (child → children, man → men).',
    example: 'I have two books. There are three boxes. I have two children.',
    exercise: {
      question: 'Two ___ (child)',
      options: ['childs', 'children', 'childes'],
      correct: 1,
      feedbackCorrect: '¡Correcto! "Child" es irregular: su plural es "children".',
      feedbackWrong: 'El plural correcto de "child" es "children" (irregular).',
    },
  },
  {
    id: 'a2-pastsimple',
    level: 'A2',
    title: 'Pasado simple',
    explanation:
      'Para verbos regulares, agrega "-ed" (work → worked). Muchos verbos comunes son irregulares y hay que memorizarlos (go → went, eat → ate, see → saw).',
    example: 'I worked yesterday. Yesterday I went to the park. She ate breakfast at 8.',
    exercise: {
      question: 'Yesterday I ___ (go) to the park.',
      options: ['goed', 'went', 'going'],
      correct: 1,
      feedbackCorrect: '¡Correcto! "Go" es irregular: su pasado es "went".',
      feedbackWrong: 'El pasado de "go" es irregular: "went", no "goed".',
    },
  },
  {
    id: 'a2-presentcontinuous',
    level: 'A2',
    title: 'Presente continuo',
    explanation:
      'Se usa para acciones que están pasando ahora mismo: "am/is/are" + verbo-ing.',
    example: 'I am studying English. She is reading a book. They are working.',
    exercise: {
      question: 'Right now, she ___ (read) a book.',
      options: ['reads', 'is reading', 'read'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Para algo que pasa ahora mismo usamos "is reading".',
      feedbackWrong: 'Para una acción que está pasando ahora usamos el presente continuo: "is reading".',
    },
  },
  {
    id: 'a2-comparatives',
    level: 'A2',
    title: 'Comparativos y superlativos',
    explanation:
      'Adjetivos cortos: +er / +est (fast → faster → fastest). Adjetivos largos: more / most (interesting → more interesting → most interesting).',
    example: 'This book is more interesting than that one. She is the fastest runner.',
    exercise: {
      question: 'This book is ___ than that one.',
      options: ['interesting', 'more interesting', 'most interesting'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Para comparar dos cosas con un adjetivo largo usamos "more + adjetivo".',
      feedbackWrong: 'Para comparar dos cosas usamos "more interesting", no la forma simple ni el superlativo.',
    },
  },
  {
    id: 'b1-presentperfect',
    level: 'B1',
    title: 'Presente perfecto',
    explanation:
      'Se usa "have/has" + participio pasado para hablar de experiencias o acciones sin un momento específico en el tiempo.',
    example: 'I have never been to Japan. She has already finished her homework.',
    exercise: {
      question: 'I ___ (never/be) to Japan.',
      options: ['never been', 'have never been', 'never was'],
      correct: 1,
      feedbackCorrect: '¡Correcto! "Have never been" es la forma correcta del presente perfecto.',
      feedbackWrong: 'La forma correcta es "have never been" (have + participio pasado).',
    },
  },
  {
    id: 'b1-firstconditional',
    level: 'B1',
    title: 'Primer condicional',
    explanation:
      'Se usa para hablar de situaciones futuras posibles: "If" + presente simple, ... + "will" + verbo.',
    example: 'If it rains, I will stay home. If you study, you will pass the exam.',
    exercise: {
      question: 'If it rains, I ___ (stay) home.',
      options: ['stay', 'will stay', 'stayed'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Después de "if + presente", usamos "will + verbo".',
      feedbackWrong: 'En el primer condicional, la segunda parte usa "will stay".',
    },
  },
  {
    id: 'b1-passivevoice',
    level: 'B1',
    title: 'Voz pasiva (introducción)',
    explanation:
      'Se usa cuando la acción es más importante que quién la hizo: "be" (am/is/are/was/were) + participio pasado.',
    example: 'The letter was written yesterday. English is spoken in many countries.',
    exercise: {
      question: 'The letter ___ (write) yesterday.',
      options: ['was written', 'wrote', 'is write'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "Was written" es la voz pasiva en pasado.',
      feedbackWrong: 'La voz pasiva en pasado se forma con "was/were + participio": "was written".',
    },
  },
];
