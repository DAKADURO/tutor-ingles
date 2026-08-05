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
  {
    id: 'a1-prepositions',
    level: 'A1',
    title: 'Preposiciones de lugar (in / on / at)',
    explanation:
      '"In" se usa para espacios cerrados o ciudades/países. "On" se usa para superficies. "At" se usa para puntos específicos.',
    example: 'The keys are in the drawer. The book is on the table. I am at the door.',
    exercise: {
      question: 'The cat is ___ the box.',
      options: ['in', 'on', 'at'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "In" se usa para algo dentro de un espacio cerrado.',
      feedbackWrong: 'Para algo dentro de un espacio cerrado usamos "in": "in the box".',
    },
  },
  {
    id: 'a1-possessives',
    level: 'A1',
    title: 'Adjetivos posesivos (my, your, his...)',
    explanation:
      'Se usan antes de un sustantivo para mostrar a quién pertenece algo: my, your, his, her, its, our, their.',
    example: 'This is my book. Is that your car? Her name is Ana.',
    exercise: {
      question: 'This is ___ (she) phone.',
      options: ['her', 'she', 'hers'],
      correct: 0,
      feedbackCorrect: '¡Correcto! Antes de un sustantivo usamos "her": "her phone".',
      feedbackWrong: 'Antes de un sustantivo se usa el adjetivo posesivo "her", no "she" ni "hers".',
    },
  },
  {
    id: 'a1-thereis',
    level: 'A1',
    title: '"There is" y "there are"',
    explanation:
      'Se usan para decir que algo existe. "There is" + singular, "there are" + plural.',
    example: 'There is a cat in the garden. There are three books on the table.',
    exercise: {
      question: '___ two dogs in the park.',
      options: ['There is', 'There are', 'Is there'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Con sustantivos en plural se usa "there are".',
      feedbackWrong: 'Con "two dogs" (plural) se usa "there are", no "there is".',
    },
  },
  {
    id: 'a2-irregularcomparatives',
    level: 'A2',
    title: 'Comparativos irregulares (good / bad)',
    explanation:
      'Algunos adjetivos no siguen la regla de "-er/-est": good → better → best, bad → worse → worst.',
    example: 'This restaurant is better than that one. My grade was worse than last time.',
    exercise: {
      question: 'This coffee is ___ (good) than the other one.',
      options: ['gooder', 'better', 'best'],
      correct: 1,
      feedbackCorrect: '¡Correcto! El comparativo de "good" es irregular: "better".',
      feedbackWrong: 'El comparativo de "good" es irregular: "better", no "gooder".',
    },
  },
  {
    id: 'a2-frequency',
    level: 'A2',
    title: 'Adverbios de frecuencia (always, usually, never...)',
    explanation:
      'Se colocan antes del verbo principal, pero después del verbo "to be".',
    example: 'I always drink coffee in the morning. She is never late.',
    exercise: {
      question: 'He ___ (always/be) on time.',
      options: ['always is', 'is always', 'be always'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Con el verbo "to be", el adverbio va después: "is always".',
      feedbackWrong: 'Con el verbo "to be" el adverbio de frecuencia va después: "is always".',
    },
  },
  {
    id: 'a2-futurewillgoingto',
    level: 'A2',
    title: 'Futuro: "will" vs "going to"',
    explanation:
      '"Will" se usa para decisiones espontáneas o predicciones. "Going to" se usa para planes ya decididos.',
    example: 'I think it will rain. I am going to visit my parents this weekend.',
    exercise: {
      question: 'Look at those clouds! It ___ (rain).',
      options: ['will rain', 'is going to rain', 'rains'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Cuando hay evidencia visible de algo, usamos "going to".',
      feedbackWrong: 'Cuando hay evidencia visible (esas nubes), se usa "going to rain".',
    },
  },
  {
    id: 'b1-presentperfectcontinuous',
    level: 'B1',
    title: 'Presente perfecto continuo',
    explanation:
      'Se forma con "have/has been" + verbo-ing, para acciones que empezaron en el pasado y continúan ahora.',
    example: 'I have been studying English for two years.',
    exercise: {
      question: 'She ___ (work) here since 2020.',
      options: ['has been working', 'is working', 'worked'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "Has been working" muestra una accion que continua desde el pasado.',
      feedbackWrong: 'Para una accion que empezo en el pasado y continua, usamos "has been working".',
    },
  },
  {
    id: 'b1-modalsobligation',
    level: 'B1',
    title: 'Modales de obligación (must / have to)',
    explanation:
      '"Must" expresa una obligación personal o fuerte. "Have to" expresa una obligación externa (una regla, por ejemplo).',
    example: 'I must finish this today. You have to wear a uniform at school.',
    exercise: {
      question: 'Employees ___ (have to) wear a badge.',
      options: ['must to', 'have to', 'has to'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Con "employees" (plural) se usa "have to".',
      feedbackWrong: 'Con sujetos en plural se usa "have to", no "must to" (que no existe) ni "has to".',
    },
  },
  {
    id: 'b1-usedto',
    level: 'B1',
    title: '"Used to"',
    explanation:
      'Se usa para hablar de hábitos o estados pasados que ya no son ciertos.',
    example: "I used to play soccer every weekend. She didn't use to like coffee.",
    exercise: {
      question: 'He ___ (used to/smoke) but he quit.',
      options: ['used to smoke', 'uses to smoke', 'use to smoked'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "Used to smoke" describe un hábito pasado que ya no existe.',
      feedbackWrong: 'La forma correcta es "used to smoke" para un hábito pasado que ya terminó.',
    },
  },
  {
    id: 'b2-zeroconditional',
    level: 'B2',
    title: 'Condicional cero',
    explanation:
      'Se usa "if" + presente simple, presente simple, para hablar de verdades generales o hechos científicos.',
    example: 'If you heat water to 100 degrees, it boils.',
    exercise: {
      question: 'If you mix red and blue, you ___ (get) purple.',
      options: ['get', 'will get', 'got'],
      correct: 0,
      feedbackCorrect: '¡Correcto! Para verdades generales, ambas partes usan presente simple.',
      feedbackWrong: 'En el condicional cero, ambas partes usan presente simple: "you get purple".',
    },
  },
  {
    id: 'b2-wish',
    level: 'B2',
    title: '"Wish" + pasado simple',
    explanation:
      'Se usa "wish" + pasado simple para expresar deseos sobre el presente que no son ciertos.',
    example: 'I wish I had more time. She wishes she lived closer.',
    exercise: {
      question: 'I wish I ___ (speak) French.',
      options: ['speak', 'spoke', 'have spoken'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Después de "wish" se usa el pasado simple: "I wish I spoke French".',
      feedbackWrong: 'Después de "wish" para un deseo presente se usa el pasado simple: "spoke".',
    },
  },
  {
    id: 'b2-passivepresentperfect',
    level: 'B2',
    title: 'Voz pasiva en presente perfecto',
    explanation:
      'Se forma con "has/have been" + participio pasado.',
    example: 'The project has been completed. The documents have been sent.',
    exercise: {
      question: 'The report ___ (already/finish).',
      options: ['has already been finished', 'already finished', 'is already finish'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "Has already been finished" es la voz pasiva en presente perfecto.',
      feedbackWrong: 'La voz pasiva en presente perfecto se forma con "has been finished".',
    },
  },
  {
    id: 'c1-gerundinfinitive',
    level: 'C1',
    title: 'Verbos + gerundio vs infinitivo',
    explanation:
      'Algunos verbos van seguidos de gerundio (enjoy, avoid, suggest) y otros de infinitivo (want, decide, hope).',
    example: 'I enjoy reading. She decided to leave early.',
    exercise: {
      question: 'He avoided ___ (answer) the question.',
      options: ['to answer', 'answering', 'answer'],
      correct: 1,
      feedbackCorrect: '¡Correcto! "Avoid" va seguido de gerundio: "avoided answering".',
      feedbackWrong: '"Avoid" siempre va seguido de gerundio: "avoided answering".',
    },
  },
  {
    id: 'c1-concessive',
    level: 'C1',
    title: 'Cláusulas concesivas (although / despite)',
    explanation:
      '"Although" y "even though" van seguidos de una oración completa. "Despite" e "in spite of" van seguidos de un sustantivo o gerundio.',
    example: 'Although it was raining, we went out. Despite the rain, we went out.',
    exercise: {
      question: '___ the traffic, we arrived on time.',
      options: ['Although', 'Despite', 'Because'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Antes de un sustantivo ("the traffic") se usa "despite".',
      feedbackWrong: 'Antes de un sustantivo se usa "despite", no "although" (que necesita una oración completa).',
    },
  },
  {
    id: 'c1-wouldpast',
    level: 'C1',
    title: '"Would" para hábitos pasados',
    explanation:
      '"Would" + verbo se usa para describir hábitos repetidos en el pasado (similar a "used to", pero no se usa para estados).',
    example: 'When I was a child, I would visit my grandmother every summer.',
    exercise: {
      question: 'Every winter, we ___ (would/go) skiing.',
      options: ['would go', 'went', 'go'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "Would go" describe un hábito repetido en el pasado.',
      feedbackWrong: 'Para un hábito repetido en el pasado se usa "would go".',
    },
  },
  {
    id: 'c2-relativeclauses',
    level: 'C2',
    title: 'Cláusulas de relativo no definitorias',
    explanation:
      'Dan información extra (no esencial), van entre comas, y usan "who/which/whose" — nunca "that".',
    example: 'My brother, who lives in Canada, is visiting next week.',
    exercise: {
      question: 'Elige la oración correcta:',
      options: ['My car, that is red, is fast.', 'My car, which is red, is fast.', 'My car which is red is fast.'],
      correct: 1,
      feedbackCorrect: '¡Correcto! Las cláusulas no definitorias van entre comas y usan "which", no "that".',
      feedbackWrong: 'Las cláusulas no definitorias van entre comas y usan "which": "My car, which is red, is fast."',
    },
  },
  {
    id: 'c2-emphatic',
    level: 'C2',
    title: 'Estructuras enfáticas ("It is... that")',
    explanation:
      'Se usan para dar énfasis a una parte específica de la oración.',
    example: 'It was John who broke the window, not me.',
    exercise: {
      question: '___ Maria who solved the problem.',
      options: ['It was', 'It is were', 'There was'],
      correct: 0,
      feedbackCorrect: '¡Correcto! "It was Maria who..." es la estructura enfática correcta.',
      feedbackWrong: 'La estructura enfática correcta es "It was Maria who solved the problem."',
    },
  },
  {
    id: 'c2-collocations',
    level: 'C2',
    title: 'Colocaciones avanzadas con "make" y "do"',
    explanation:
      'Ciertas expresiones fijas usan "make" (make a decision, make a mistake) y otras usan "do" (do research, do homework); no son intercambiables.',
    example: 'She made a decision. He did his homework.',
    exercise: {
      question: 'I need to ___ some research before the meeting.',
      options: ['make', 'do', 'have'],
      correct: 1,
      feedbackCorrect: '¡Correcto! La colocación fija es "do research", no "make research".',
      feedbackWrong: 'La colocación correcta es "do research", no "make research".',
    },
  },
];
