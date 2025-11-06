import { Icon } from "@iconify/react/dist/iconify.js";

export default function Footer() {
  const footerItems: {
    sectionTitle: string;
    sectionItems: {
      icon?: string;
      link: {
        name: string;
        to: string;
      };
    }[];
  }[] = [
    {
      sectionTitle: "Show Motion Limited",
      sectionItems: [
        {
          icon: "mdi-map-marker",
          link: {
            name: "Russian Federation Blvd (110), Phnom Penh, Cambodia",
            to: "https://maps.app.goo.gl/KBEPEZKUzDabsgT79",
          },
        },
      ],
    },
    {
      sectionTitle: "Page’s",
      sectionItems: [
        {
          link: {
            name: "Movie",
            to: "/movies",
          },
        },
        {
          link: {
            name: "TV Series",
            to: "/tv-series",
          },
        },
      ],
    },
    {
      sectionTitle: "Contect Us",
      sectionItems: [
        {
          icon: "mdi-phone",
          link: {
            name: "+855 0974588804",
            to: "tel:+8550974588804",
          },
        },
        {
          icon: "mdi-email",
          link: {
            name: "rungsethyhk@gmail.com",
            to: "mailto:rungsethyhk@gmail.com",
          },
        },
      ],
    },
    {
      sectionTitle: "More At Cineplex",
      sectionItems: [
        {
          link: {
            name: "Student Reward Program",
            to: "#",
          },
        },
        {
          link: {
            name: "Privacy policy",
            to: "#",
          },
        },
      ],
    },
  ];
  return (
    <div className="w-full p-4 md:py-8 md:px-16 lg:px-52 bg-tertiary-500 flex flex-col md:flex-row items-center justify-between gap-6">
      {footerItems.map((ft, i) => (
        <div key={i} className="flex flex-col items-center md:items-start gap-2">
          {i === 0 && <img src="/assets/logo.svg" alt="logo" />}
          <h2 className="text-white text-center">{ft.sectionTitle}</h2>
          {ft.sectionItems.map((st, i) => (
            <div key={i} className="w-fit text-grey-500 flex items-center justify-center gap-2">
              {st.icon && <Icon icon={st.icon} width="16" />}
              <a href={st.link.to} className="text-xs">
                {st.link.name}
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
