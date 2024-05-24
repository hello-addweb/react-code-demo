export const constructESFilters = filters => {
  return filters
    .map(item => {
      const key = Object.keys(item)[0];
      const selectedOption = item[key];
      if (selectedOption !== undefined) {
        if (selectedOption.includes(' TO ')) {
          const [min, max] = selectedOption.split(' TO ');
          return {range: {[key]: {gte: min.trim(), lte: max.trim()}}};
        } else {
          if (key === 'category_slug') {
            const newKey = 'category.slug.en.keyword';
            if (Array.isArray(selectedOption)) {
              return {terms: {[newKey]: selectedOption}};
            } else {
              return {match: {[newKey]: selectedOption}};
            }
          } else if (key === 'product_seo.product_tag.en') {
            const newKey = key + '.keyword';
            const productTagFilter = {
              script: {
                script: {
                  source: `doc["${newKey}"].size() > 0 && doc["${newKey}"].value.contains(params.match)`,
                  params: {
                    match: selectedOption,
                  },
                },
              },
            };
            return productTagFilter;
          } 
          else if (key.includes('attributes')){
            return {match: {[key]: selectedOption}};
          }
          else {
            const newKey = key + '.keyword';
            return {match: {[newKey]: selectedOption}};
          }
        }
      }
    })
    .filter(Boolean);
};

export const constructESSearch = criteria => {
  return criteria?.searchText
    ? [
        {
          query_string: {
            query: criteria.searchText.trim() + '*',
            fields: [
              'name.en^3',
              'name.ar^3',
              'original_short_description.en^2',
              'original_short_description.ar^2',
              'original_long_description.en^1',
              'original_long_description.ar^1',
            ],
          },
        },
      ]
    : [];
};

export const constructFilters = criteria => {
  return criteria.filters
    ? [
        ...criteria.filters,
        {
          status: 'PUBLISH',
        },
      ]
    : [
        {
          status: 'PUBLISH',
        },
      ];
};
