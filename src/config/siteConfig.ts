export const siteConfig = {
  contact: {
    email: "erayawellnesstravels@gmail.com",
    phone: {
      raw: "+9779765548080",
      formatted: "+977 9765548080",
    },
    whatsapp: "+9779765548080",
    address: "Kathmandu, Nepal",
  },
  social: {
    facebook: "#facebook",
    instagram: "https://www.instagram.com/eraya_wellness_/",
    twitter: "#twitter",
    linkedin: "#linkedin",
  },
};

export const getMailtoLink = () => `mailto:${siteConfig.contact.email}`;
export const getTelLink = () => `tel:${siteConfig.contact.phone.raw}`;
export const getWhatsAppLink = (message: string) =>
  `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
