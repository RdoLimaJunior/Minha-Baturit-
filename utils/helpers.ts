export const haversineDistance = (
    coords1: { lat: number; lng: number },
    coords2: { lat: number; lng: number }
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in kilometers
};

export const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} anos atrás`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} meses atrás`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} dias atrás`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} horas atrás`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutos atrás`;
    return `${Math.floor(seconds)} segundos atrás`;
};
