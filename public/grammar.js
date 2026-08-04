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
  {
    id: 'b2-pastperfect',
    level: 'B2',
    title: 'Pasado perfecto',
    explanation:
      'Se usa "had" + participio pasado para hablar de una acción que ocurrió ANTES de otro momento en el pasado.',
    example: 'I had already eaten when she arrived. By the time we got there, the movie had started.',
    exercise: {
      question: 'By the time we arrived, the movie ___ (already/start).',
      options: ['already started', 'had already started', 'has already started'],
      correct: 1,
      feedbackCorrect: '¡Correcto! "Had already started" muestra que esa acción pasó antes que otra acción pasada.',
      feedbackWrong: 'Para una acción anterior a otro momento en el pasado usamos "had already started".',
    },
  },
  {
    id: 'b2-secondconditional',
    level: 'B2',
    title: 'Segundo condicional',
    explanation:
      'Se usa para situaciones hipotéticas o poco probables en el presente/futuro: "If" + pasado simple, ... + "would" + verbo.',
    example: 'If I had more money, I would travel more. If I were you, I would apologize.',
    exercise: {
      question: 'If I ___ (be) you, I would apologize.',
      options: ['am', 'was', 'were'],
      correct: 2,
      feedbackCorrect: '¡Correcto! En el segundo condicional, con "if I" se prefiere la forma "were".',
      feedbackWrong: 'En el segundo condicional se usa "if I were" (no "am" ni "was") en un registro cuidado.',
    },
  },
  {
    id: 'b2-passivemodals',
    level: 'B2',
    title: 'Voz pasiva con verbos modales',
    explanation:
      'Los modales (must, should, can, etc.) también se combinan con la voz pasiva: modal + "be" + participio pasado.',
    example: 'The report must be finished by Friday. This mistake should be corrected soon.',
    exercise: {
      question: 'The work ___ (must/finish) today.',
      options: ['must finish', 'must be finished', 'must been finished'],
      correct: 1,
      feedbackCorrect: '¡Correcto! "Must be finished" es la voz pasiva con el modal "must".',
      feedbackWrong: 'La voz pasiva con modales se forma con "modal + be + participio": "must be finished".',
    },
  },
  {
    id: 'c1-thirdconditional',
    level: 'C1',
    title: 'Tercer condicional',
    explanation:
      'Se usa para hablar de situaciones hipotéticas en el pasado que no ocurrieron: "If" + pasado perfecto, ... + "would have" + participio.',
    example: 'If I had known, I would have called you. She would have passed if she had studied harder.',
    exercise: {
      question: 'If she ___ (study) harder, she would have passed the exam.',
      options: ['studied', 'had studied', 'would study'],
      correct: 1,
      feedbackCorrect: '¡Correcto! El tercer condicional usa "had studied" en la parte del "if".',
      feedbackWrong: 'El tercer condicional requiere "if + pasado perfecto": "had studied".',
    },
  },
  {
    id: 'c1-reportedspeech',
    level: 'C1',
    title: 'Discurso indirecto (reported speech)',
    explanation:
      'Al reportar lo que alguien dijo, los tiempos verbales retroceden un paso ("backshift"): presente → pasado, presente perfecto → pasado perfecto, etc.',
    example: '"I am tired," she said. → She said that she was tired.',
    exercise: {
      question: '"I am tired," she said. → She said that she ___ tired.',
      options: ['is', 'was', 'has been'],
      correct: 1,
      feedbackCorrect: '¡Correcto! En discurso indirecto, "am" retrocede a "was".',
      feedbackWrong: 'En discurso indirecto el presente retrocede al pasado: "she was tired".',
    },
  },
  {
    id: 'c1-modalsdeduction',
    level: 'C1',
    title: 'Modales de deducción',
    explanation:
      'Usamos "must" (deducción positiva fuerte), "might/could" (posibilidad) y "can\'t" (deducción negativa fuerte) para hacer suposiciones sobre el presente.',
    example: 'She must be at home; her car is outside. He can\'t be serious.',
    exercise: {
      question: "He is not answering. He ___ (must/be) busy.",
      options: ['must be', 'can be', 'has to be'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "Must be" expresa una deducción lógica fuerte.',
      feedbackWrong: 'Para una deducción fuerte a partir de evidencia usamos "must be".',
    },
  },
  {
    id: 'c2-inversion',
    level: 'C2',
    title: 'Inversión enfática',
    explanation:
      'En inglés formal, ciertos adverbios negativos o limitantes al inicio de la oración ("Never", "Not only", "Rarely") invierten el orden sujeto-verbo, como en las preguntas.',
    example: 'Never have I seen such dedication. Not only did he arrive late, but he also forgot the documents.',
    exercise: {
      question: 'Elige la oración con inversión correcta:',
      options: [
        'Never I have seen such a beautiful sunset.',
        'Never have I seen such a beautiful sunset.',
        'I never have seen such a beautiful sunset.',
      ],
      correct: 1,
      feedbackCorrect: '¡Correcto! Después de "Never" al inicio, el verbo auxiliar va antes del sujeto: "have I seen".',
      feedbackWrong: 'Con "Never" al inicio de la oración, el orden se invierte: "Never have I seen...".',
    },
  },
  {
    id: 'c2-subjunctive',
    level: 'C2',
    title: 'Subjuntivo en inglés formal',
    explanation:
      'En contextos formales, después de verbos como "recommend", "suggest" o expresiones como "it is important/essential that", se usa la forma base del verbo (subjuntivo), sin importar la persona.',
    example: 'It is essential that he arrive on time. They recommended that she see a specialist.',
    exercise: {
      question: 'It is important that she ___ (be) present.',
      options: ['is', 'be', 'was'],
      correct: 1,
      feedbackCorrect: '¡Correcto! El subjuntivo usa la forma base del verbo: "that she be present".',
      feedbackWrong: 'En el subjuntivo formal se usa la forma base del verbo: "that she be present".',
    },
  },
  {
    id: 'c2-participleclauses',
    level: 'C2',
    title: 'Cláusulas de participio',
    explanation:
      'Se pueden reducir cláusulas relativas usando participios: participio presente (-ing) para voz activa, participio pasado (-ed/irregular) para voz pasiva.',
    example: 'The man walking down the street is my uncle. The letter written by John arrived yesterday.',
    exercise: {
      question: 'The letter ___ (write) by John arrived yesterday.',
      options: ['written', 'writing', 'wrote'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "Written by John" es una cláusula de participio pasado (voz pasiva reducida).',
      feedbackWrong: 'Para reducir una cláusula pasiva se usa el participio pasado: "written by John".',
    },
  },
];
