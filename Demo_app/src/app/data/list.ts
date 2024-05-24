interface LinkData {
  href: string;
  title: string;
  items?: LinkData[];
}

export const links: LinkData[] = [
  {
    href: "https://www.testsite.com.au/country-service/",
    title: "Country service",
    items: [
      {
        href: "https://www.testsite.com.au/service-sydney-to-armidale/",
        title: "Sydney to Armidale service",
        items: [
          {
            href: "https://www.testsite.com.au/moving-trucks/mighty-mouse/",
            title: "2 Men & 3T Truck",
          },
          {
            href: "https://www.testsite.com.au/moving-trucks/big-foot/",
            title: "2 Men & 4.5T Truck",
          },
        ],
      },
      {
        href: "https://www.testsite.com.au/service-sydney-to-blue-mountains/",
        title: "Sydney to Blue Mountains",
        items: [
          {
            href: "https://www.testsite.com.au/moving-trucks/mighty-mouse/",
            title: "this is sub mega menu link",
          },
          {
            href: "https://www.testsite.com.au/moving-trucks/big-foot/",
            title: "this is sub mega menu link 2",
          },
          {
            href: "https://www.testsite.com.au/moving-trucks/big-foot/",
            title: "this is sub mega menu link 4",
          },
          {
            href: "https://www.testsite.com.au/moving-trucks/big-foot/",
            title: "this is sub mega menu link 5",
          },
        ],
      },
    ],
  },
  {
    href: "https://www.testsite.com.au/moving-services/",
    title: "Moving Services & Trucks",
    items: [
      {
        href: "https://www.testsite.com.au/moving-trucks/mighty-mouse/",
        title: "2 Men & 3T Truck",
        items: [
          {
            href: "https://www.testsite.com.au/moving-trucks/mighty-mouse/",
            title: "this is sub mega menu link",
          },
          {
            href: "https://www.testsite.com.au/moving-trucks/big-foot/",
            title: "this is sub mega menu link 2",
          },
          {
            href: "https://www.testsite.com.au/moving-trucks/big-foot/",
            title: "this is sub mega menu link 4",
          },
          {
            href: "https://www.testsite.com.au/moving-trucks/big-foot/",
            title: "this is sub mega menu link 5",
          },
        ],
      },
      {
        href: "https://www.testsite.com.au/moving-trucks/big-foot/",
        title: "2 Men & 4.5T Truck",
      },
    ],
  },
  {
    href: "https://www.testsite.com.au/country-service/",
    title: "Country service",
  },
];
