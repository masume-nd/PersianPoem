import random
import numpy as np

# Persian letter-to-note template
letter_to_note_template = {
    "ا": {},
    "ب": {},
    "پ": {},
    "ت": {},
    "ث": {},
    "ج": {},
    "چ": {},
    "ح": {},
    "خ": {},
    "د": {},
    "ذ": {},
    "ر": {},
    "ز": {},
    "ژ": {},
    "س": {},
    "ش": {},
    "ص": {},
    "ض": {},
    "ط": {},
    "ظ": {},
    "ع": {},
    "غ": {},
    "ف": {},
    "ق": {},
    "ک": {},
    "گ": {},
    "ل": {},
    "م": {},
    "ن": {},
    "و": {},
    "ه": {},
    "ی": {},
}

# Notes and durations
notes = [
    "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6",
]
durations = ["8n", "4n", "2n", "1n"]

# Genetic Algorithm parameters
POPULATION_SIZE = 100
GENERATIONS = 50
MUTATION_RATE = 0.1

def initialize_population(size, length):
    """Create an initial population of random solutions."""
    return [
        [
            {
                "note": random.choice(notes),
                "duration": random.choice(durations)
            } for _ in range(length)
        ] for _ in range(size)
    ]

def fitness_function(solution, poem):
    """Evaluate the fitness of a solution based on poem-tone alignment."""
    # Placeholder: Higher fitness for diversity in notes and matching tone lengths
    return len(set(note["note"] for note in solution))

def selection(population, fitnesses):
    """Select individuals based on fitness."""
    selected = random.choices(population, weights=fitnesses, k=len(population))
    return selected

def crossover(parent1, parent2):
    """Perform single-point crossover between two parents."""
    point = random.randint(1, len(parent1) - 1)
    child1 = parent1[:point] + parent2[point:]
    child2 = parent2[:point] + parent1[point:]
    return child1, child2

def mutate(individual):
    """Mutate an individual with a given mutation rate."""
    for gene in individual:
        if random.random() < MUTATION_RATE:
            gene["note"] = random.choice(notes)
            gene["duration"] = random.choice(durations)

def genetic_algorithm(poem, population_size, generations):
    """Run the Genetic Algorithm to evolve a tone sequence for a poem."""
    population = initialize_population(population_size, len(poem))

    for generation in range(generations):
        fitnesses = [fitness_function(ind, poem) for ind in population]
        population = selection(population, fitnesses)
        next_generation = []

        for i in range(0, len(population), 2):
            parent1, parent2 = population[i], population[(i + 1) % len(population)]
            child1, child2 = crossover(parent1, parent2)
            next_generation.extend([child1, child2])

        for individual in next_generation:
            mutate(individual)

        population = next_generation

    best_solution = max(population, key=lambda ind: fitness_function(ind, poem))
    return best_solution

# Example Usage
def generate_audio(poem):
    best_tone_sequence = genetic_algorithm(poem, POPULATION_SIZE, GENERATIONS)
    audio = []
    for tone in best_tone_sequence:
        audio.append(tone)
        print(f"Note: {tone['note']}, Duration: {tone['duration']}")

    return audio
