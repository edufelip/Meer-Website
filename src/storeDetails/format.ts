export function normalizePhoneHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `tel:${normalized || phone}`;
}

export function normalizeWhatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Check if it already has the country code 55
  const countryCodeDigits = digits.startsWith("55") ? digits : `55${digits}`;
  return digits ? `https://wa.me/${countryCodeDigits}` : "#"; 
}

export function getGoogleMapsEmbedUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.953250860361!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr`;
}

export function getGoogleMapsDirectionsUrl(destination: string | { latitude: number, longitude: number }): string {
  if (typeof destination === 'string') {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`;
}
