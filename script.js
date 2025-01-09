const letterToNoteTemplate = {
  ا: {},
  ب: {},
  پ: {},
  ت: {},
  ث: {},
  ج: {},
  چ: {},
  ح: {},
  خ: {},
  د: {},
  ذ: {},
  ر: {},
  ز: {},
  ژ: {},
  س: {},
  ش: {},
  ص: {},
  ض: {},
  ط: {},
  ظ: {},
  ع: {},
  غ: {},
  ف: {},
  ق: {},
  ک: {},
  گ: {},
  ل: {},
  م: {},
  ن: {},
  و: {},
  ه: {},
  ی: {},
};

function generateInitialPopulation(populationSize) {
  const notes = [
    'C4',
    'D4',
    'E4',
    'F4',
    'G4',
    'A4',
    'B4',
    'C5',
    'D5',
    'E5',
    'F5',
    'G5',
    'A5',
    'B5',
    'C6',
    'D6',
    'E6',
  ];
  const durations = ['8n', '4n', '2n', '1n'];
  const velocityRange = { min: 0.5, max: 1.0 };

  // Helper function to generate a random velocity
  function randomVelocity() {
    return (
      Math.random() * (velocityRange.max - velocityRange.min) +
      velocityRange.min
    );
  }

  function createRandomMapping() {
    const mapping = {};
    for (const letter in letterToNoteTemplate) {
      mapping[letter] = {
        note: notes[Math.floor(Math.random() * notes.length)],
        duration: durations[Math.floor(Math.random() * durations.length)],
        velocity: randomVelocity(),
      };
    }
    return mapping;
  }

  // Generate the initial population
  const population = [];
  for (let i = 0; i < populationSize; i++) {
    population.push({
      genome: createRandomMapping(),
      fitness: 0,
    });
  }
  return population;
}

function poemToNotes(poem, mapping) {
  const notes = [];
  let time = 0;
  const timeStep = 0.5;

  for (const letter of poem) {
    if (mapping[letter]) {
      const noteObj = {
        ...mapping[letter],
        time: time,
      };
      notes.push(noteObj);
      time += timeStep;
    }
  }

  return notes;
}

function evaluateFitness(notes) {
  let score = 0;

  // Example: Reward smooth transitions
  for (let i = 1; i < notes.length; i++) {
    const prevNote = notes[i - 1].note;
    const currentNote = notes[i].note;
    const interval = Math.abs(
      Tone.Frequency(currentNote).toMidi() - Tone.Frequency(prevNote).toMidi()
    );
    score -= interval > 5 ? 1 : 0; // Penalize large intervals

    // Add more fitness evaluation criteria as needed
    return score;
  }

  function evolvePopulation(population) {
    const nextGeneration = [];

    // Selection: Top 50% of the population
    const sortedPopulation = population.sort((a, b) => b.fitness - a.fitness);
    const survivors = sortedPopulation.slice(
      0,
      Math.floor(population.length / 2)
    );

    // Crossover: Combine genomes of survivors
    while (nextGeneration.length < population.length) {
      const parent1 = survivors[Math.floor(Math.random() * survivors.length)];
      const parent2 = survivors[Math.floor(Math.random() * survivors.length)];

      const childGenome = {};
      for (const letter in parent1.genome) {
        childGenome[letter] =
          Math.random() < 0.5 ? parent1.genome[letter] : parent2.genome[letter];
      }

      nextGeneration.push({ genome: childGenome, fitness: 0 });
    }

    nextGeneration.forEach((individual) => {
      for (const letter in individual.genome) {
        if (Math.random() < 0.1) {
          // 10% chance to mutate each property
          const randomProperty = ['note', 'duration', 'velocity'][
            Math.floor(Math.random() * 3)
          ];
          if (randomProperty === 'note') {
            individual.genome[letter].note = [
              'C4',
              'D4',
              'E4',
              'F4',
              'G4',
              'A4',
              'B4',
            ][Math.floor(Math.random() * 7)];
          } else if (randomProperty === 'duration') {
            individual.genome[letter].duration = ['8n', '4n', '2n'][
              Math.floor(Math.random() * 3)
            ];
          } else {
            individual.genome[letter].velocity = Math.random() * 0.5 + 0.5; // New velocity
          }
        }
      }
    });

    return nextGeneration;
  }

  function playNotes(notes) {
    const synth = new Tone.Synth().toDestination();

    const part = new Tone.Part((time, value) => {
      synth.triggerAttackRelease(
        value.note,
        value.duration,
        time,
        value.velocity
      );
    }, notes).start(0, 0);

    Tone.Transport.start();
  }

  // Evolutionary Algorithm Main Flow
  const populationSize = 100;
  let population = generateInitialPopulation(populationSize);
  const generations = 50;

  const poem =
    'منم که گوشه میخانه خانقاه من است دعای پیر مغان ورد صبحگاه من است گرم ترانه چنگ صبوح نیست چه باک نوای من به سحر آه عذرخواه من است';

  for (let generation = 0; generation < generations; generation++) {
    population.forEach((individual) => {
      const notes = poemToNotes(poem, individual.genome);
      individual.fitness = evaluateFitness(notes);
    });

    console.log(
      `Generation ${generation}, Best Fitness: ${Math.max(
        ...population.map((p) => p.fitness)
      )}`
    );
    population = evolvePopulation(population);
  }

  // Play the best individual
  const bestIndividual = population[0];
  const bestNotes = poemToNotes(poem, bestIndividual.genome);

  document.getElementById('playButton').addEventListener('click', async () => {
    await Tone.start();
    playNotes(bestNotes);
  });

  document.getElementById('stopButton').addEventListener('click', () => {
    Tone.Transport.stop();
  });
}
