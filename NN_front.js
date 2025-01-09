async function fetchAndPlayMusic() {
  const response = await fetch('generated_notes.json');
  const generatedNotes = await response.json();

  // تبدیل MIDI به نام نت (اگر به صورت عددی ذخیره شده)
  const midiToNote = (midi) => Tone.Frequency(midi, "midi").toNote();

  // ساختن آرایه‌ای از نت‌ها برای پخش
  const notes = generatedNotes.map((midi, index) => ({
      note: midiToNote(midi),  // تبدیل به نام نت
      duration: '8n',
      time: index * 0.5
  }));

  // پخش نت‌ها
  const synth = new Tone.Synth().toDestination();
  const part = new Tone.Part((time, value) => {
      synth.triggerAttackRelease(value.note, value.duration, time);
  }, notes).start(0);

  Tone.Transport.start();
}

document.getElementById('playButton').addEventListener('click', async () => {
  await Tone.start();
  fetchAndPlayMusic();
});

document.getElementById('stopButton').addEventListener('click', () => {
  Tone.Transport.stop();
});