// Flavour Finder lookup tables. The matching logic in FlavourFinder.jsx scores
// products against the user's selections; this file just exposes the option
// vocabularies so the form, the filter chips and the assistant share one source.

export const flavourFamilies = [
  { id: 'Sweet', label: 'Sweet' },
  { id: 'Fresh', label: 'Fresh' },
  { id: 'Tobacco', label: 'Tobacco' },
  { id: 'Menthol', label: 'Menthol' },
  { id: 'Fruity', label: 'Fruity' },
  { id: 'Dessert', label: 'Dessert' },
  { id: 'Smooth', label: 'Smooth' },
  { id: 'Strong', label: 'Strong' },
]

export const nicStrengths = ['0mg', '3mg', '6mg', '10mg', '20mg', 'Not sure']

export const experienceLevels = ['New', 'Returning', 'Experienced']

export const desiredFeels = ['Smooth', 'Strong hit', 'Long-lasting', 'Budget-friendly']

export const useCases = [
  'Everyday',
  'Smooth Throat Hit',
  'Cloud Preference',
  'Compact',
  'Long Battery',
]

export const budgets = ['£', '££', '£££']
