type GeneratorInputs = {
  companyName: string;
  companyDescription: string;
  style: 'block' | 'sharp' | 'rounded';
};

export function saveGeneratorInputs(inputs: GeneratorInputs) {
  localStorage.setItem('generator_inputs', JSON.stringify(inputs));
}

export function getGeneratorInputs(): GeneratorInputs | null {
  const saved = localStorage.getItem('generator_inputs');
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function clearGeneratorInputs() {
  localStorage.removeItem('generator_inputs');
}