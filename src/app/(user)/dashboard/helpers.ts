const getTierBenefits = (tier: string) => {
  if (tier === 'FREE') {
    return {
      title: 'Free Tier',
      features: [
        'Browse all books catalog',
        'Read book descriptions',
        'View table of contents',
        'Listen to ONLY 10 seconds of audio',
        'Add reviews and ratings',
      ],
      limitations: ['Cannot listen to full audio', 'Cannot download PDFs', 'No favorites feature'],
    };
  } else {
    return {
      title: `${tier} Plan`,
      features: [
        'Full access to 10,000+ book summaries',
        'Read complete summaries online',
        'Listen to full audio summaries',
        'Download PDFs',
        'Add books to favorites',
        'Unlimited access',
      ],
      limitations: [],
    };
  }
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'LIFETIME':
      return 'from-purple-600 to-pink-600';
    case 'YEARLY':
      return 'from-blue-600 to-indigo-600';
    case 'MONTHLY':
      return 'from-green-600 to-emerald-600';
    default:
      return 'from-gray-600 to-gray-700';
  }
};

export const dashboardHelpers = {
  getTierBenefits,
  getTierColor,
};
