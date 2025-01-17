from pydub.generators import Sine
import simpleaudio as sa

# Note frequencies (in Hz)
note_frequencies = {
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00,
    "A4": 440.00, "B4": 493.88, "C5": 523.25, "D5": 587.33, "E5": 659.25,
    "F5": 698.46, "G5": 783.99, "A5": 880.00, "B5": 987.77, "C6": 1046.50,
    "D6": 1174.66, "E6": 1318.51
}

# Duration mapping to milliseconds
duration_mapping = {
    "8n": 125,  # Eighth note
    "4n": 250,  # Quarter note
    "2n": 500,  # Half note
    "1n": 1000  # Whole note
}

def play_tone_sequence(tone_sequence):
    for tone in tone_sequence:
        note = tone["note"]
        duration = tone["duration"]

        if note in note_frequencies and duration in duration_mapping:
            frequency = note_frequencies[note]
            duration_ms = duration_mapping[duration]

            # Generate sine wave for the note
            wave = Sine(frequency).to_audio_segment(duration=duration_ms)

            # Play the generated wave
            playback = sa.play_buffer(wave.raw_data, num_channels=1,bytes_per_sample=2,sample_rate=wave.frame_rate)
            playback.wait_done()

# Example tone sequence from your output
from genetic import generate_audio
tone_sequence = generate_audio("منم که گوشه میخانه خانقاه من است دعای پیر مغان ورد صبحگاه من است")

# Play the sequence
play_tone_sequence(tone_sequence)
