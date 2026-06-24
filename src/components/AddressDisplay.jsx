import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function AddressDisplay({ latitude, longitude, className = "" }) {
  const [address, setAddress] = useState('Fetching location...');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!latitude || !longitude) {
      setAddress('Unknown Location');
      return;
    }

    const fetchAddress = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        if (isMounted) {
          const amenity = data.address?.amenity || data.address?.building || data.address?.shop || data.address?.historic;
          const road = data.address?.road || data.address?.pedestrian;
          const locality = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || data.address?.village || data.address?.town;
          const city = data.address?.city || data.address?.state_district || data.address?.state;
          
          const parts = [];
          if (amenity) parts.push(amenity);
          else if (road) parts.push(road);
          
          if (locality) parts.push(locality);
          if (city) parts.push(city);
          
          if (parts.length > 0) {
            setAddress(parts.join(', '));
          } else {
            setAddress('Location available on map');
          }
        }
      } catch (err) {
        if (isMounted) {
          setAddress('Location available');
          setError(true);
        }
      }
    };

    // Slight delay to avoid hitting Nominatim rate limits if many components render at once
    const timeoutId = setTimeout(() => fetchAddress(), Math.random() * 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [latitude, longitude]);

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <MapPin className="w-3.5 h-3.5 text-slate-400" />
      <span className="truncate max-w-[200px]" title={address}>
        {address}
      </span>
    </span>
  );
}
