// const letterToNote = {
//   ا: { note: 'C4', duration: '2n', velocity: 9.5 },
//   ب: { note: 'D4', duration: '4n', velocity: 0.8 },
//   پ: { note: 'E4', duration: '8n', velocity: 7.5 },
//   ت: { note: 'F4', duration: '2n', velocity: 9.5 },
//   ث: { note: 'G4', duration: '4n', velocity: 0.8 },
//   ج: { note: 'A4', duration: '8n', velocity: 7.5 },
//   چ: { note: 'B4', duration: '2n', velocity: 9.5 },
//   ح: { note: 'C5', duration: '4n', velocity: 0.8 },
//   خ: { note: 'D5', duration: '8n', velocity: 7.5 },
//   د: { note: 'E5', duration: '2n', velocity: 9.5 },
//   ذ: { note: 'F5', duration: '4n', velocity: 0.8 },
//   ر: { note: 'G5', duration: '8n', velocity: 7.5 },
//   ز: { note: 'A5', duration: '2n', velocity: 9.5 },
//   ژ: { note: 'B5', duration: '4n', velocity: 0.8 },
//   س: { note: 'C6', duration: '8n', velocity: 7.5 },
//   ش: { note: 'D6', duration: '2n', velocity: 9.5 },
//   ص: { note: 'E6', duration: '4n', velocity: 0.8 },
//   ض: { note: 'F6', duration: '8n', velocity: 7.5 },
//   ط: { note: 'G6', duration: '2n', velocity: 9.5 },
//   ظ: { note: 'A6', duration: '4n', velocity: 0.8 },
//   ع: { note: 'B6', duration: '8n', velocity: 7.5 },
//   غ: { note: 'C7', duration: '2n', velocity: 9.5 },
//   ف: { note: 'D7', duration: '4n', velocity: 0.8 },
//   ق: { note: 'E7', duration: '8n', velocity: 7.5 },
//   ک: { note: 'F7', duration: '2n', velocity: 9.5 },
//   گ: { note: 'G7', duration: '4n', velocity: 0.8 },
//   ل: { note: 'A7', duration: '8n', velocity: 7.5 },
//   م: { note: 'B7', duration: '2n', velocity: 9.5 },
//   ن: { note: 'C8', duration: '4n', velocity: 0.8 },
//   و: { note: 'D8', duration: '8n', velocity: 7.5 },
//   ه: { note: 'E8', duration: '2n', velocity: 9.5 },
//   ی: { note: 'F8', duration: '4n', velocity: 0.8 },
//   '\t': {
//     note: 'C4',
//     duration: '1',
//     velocity: 0,
//   },
// };

let part;

function poemToNotes(poem) {
  const notes = [];
  let time = 0;
  const timeStep = 0.5;

  for (const letter of poem) {
    if (letterToNote[letter]) {
      const noteObj = {
        ...letterToNote[letter],
        time: letter == '\t' ? 2 : time,
      };
      notes.push(noteObj);
      time += timeStep;
    }
  }

  console.log(notes);
  return notes;
}

function playNotes(notes) {
  const synth = new Tone.Synth().toDestination();

  part = new Tone.Part((time, value) => {
    synth.triggerAttackRelease(
      value.note,
      value.duration,
      time,
      value.velocity
    );
  }, notes).start(0, 0);

  Tone.Transport.start();
}

const poem = 'الا یا ایهاالساقی ادرکاسا و ناولها';

const notes = poemToNotes(poem);

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
  }

  // Add more fitness evaluation criteria
  return score;
}

// GA Integration
const population = generateInitialPopulation(100);
let generation = 0;

while (generation < 50) {
  population.forEach((individual) => {
    individual.fitness = evaluateFitness(
      poemToNotes(mapGenomeToMapping(individual.genome))
    );
  });

  population.sort((a, b) => b.fitness - a.fitness); // Sort by fitness
  const شnextGeneration = evolvePopulation(population);
  population = nextGeneration;
  generation++;
}

// Playback Best Individual
const bestGenome = population[0].genome;
const bestMapping = mapGenomeToMapping(bestGenome);
const bestNotes = poemToNotes(poem, bestMapping);

document.getElementById('playButton').addEventListener('click', async () => {
  await Tone.start();
  playNotes(bestNotes);
  // playNotes(notes);
});

document.getElementById('stopButton').addEventListener('click', () => {
  if (part) {
    part.stop();
    part.dispose();
    Tone.Transport.stop();
  }
});