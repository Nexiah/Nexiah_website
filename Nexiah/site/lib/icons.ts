/**
 * Utilitaires partagés pour la gestion des icônes Lucide React
 */

import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Layers } from "lucide-react";

/**
 * Convertit une string en PascalCase (ex: "code" -> "Code", "map-pin" -> "MapPin")
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Obtient une icône Lucide React depuis son nom (string)
 * Gère les variantes de casse, les tirets, et les suffixes "Icon"
 */
export function getLucideIcon(
  iconName: string | undefined | null,
  fallback: LucideIcon = Layers
): LucideIcon {
  if (!iconName || !iconName.trim()) {
    return fallback;
  }

  const cleanName = iconName.trim();
  const pascalName = toPascalCase(cleanName);
  
  // Variantes à essayer
  const variants = [
    pascalName,
    cleanName,
    `${pascalName}Icon`,
    `${cleanName}Icon`,
    cleanName.toUpperCase(),
    // Essayer aussi sans les tirets
    cleanName.replace(/[-_]/g, ''),
    toPascalCase(cleanName.replace(/[-_]/g, '')),
  ];

  // Recherche dans les exports de lucide-react
  for (const variant of variants) {
    if (variant in LucideIcons) {
      const IconComponent = (LucideIcons as any)[variant];
      if (typeof IconComponent === 'function') {
        return IconComponent as LucideIcon;
      }
    }
  }

  // Recherche insensible à la casse
  const iconKeys = Object.keys(LucideIcons);
  const lowerCleanName = cleanName.toLowerCase();
  const foundKey = iconKeys.find(key => {
    const lowerKey = key.toLowerCase();
    return lowerKey === lowerCleanName ||
           lowerKey === `${lowerCleanName}icon` ||
           lowerKey === lowerCleanName.replace(/[-_]/g, '') ||
           lowerKey === `${lowerCleanName.replace(/[-_]/g, '')}icon`;
  });

  if (foundKey) {
    const IconComponent = (LucideIcons as any)[foundKey];
    if (typeof IconComponent === 'function') {
      return IconComponent as LucideIcon;
    }
  }

  // Mapping manuel pour quelques icônes courantes
  const manualMapping: Record<string, LucideIcon> = {
    'map': LucideIcons.Map as LucideIcon,
    'code': LucideIcons.Code as LucideIcon,
    'zap': LucideIcons.Zap as LucideIcon,
    'shield': LucideIcons.Shield as LucideIcon,
    'globe': LucideIcons.Globe as LucideIcon,
    'check': LucideIcons.Check as LucideIcon,
    'star': LucideIcons.Star as LucideIcon,
    'rocket': LucideIcons.Rocket as LucideIcon,
    'lock': LucideIcons.Lock as LucideIcon,
    'lockkeyhole': LucideIcons.LockKeyhole as LucideIcon,
    'lock-keyhole': LucideIcons.LockKeyhole as LucideIcon,
    'clock': LucideIcons.Clock as LucideIcon,
    'calendar': LucideIcons.Calendar as LucideIcon,
    'calendarcheck': LucideIcons.CalendarCheck as LucideIcon,
    'calendar-check': LucideIcons.CalendarCheck as LucideIcon,
    'briefcase': LucideIcons.Briefcase as LucideIcon,
    'lightbulb': LucideIcons.Lightbulb as LucideIcon,
    'ruler': LucideIcons.Ruler as LucideIcon,
    'trendingup': LucideIcons.TrendingUp as LucideIcon,
    'trending-up': LucideIcons.TrendingUp as LucideIcon,
  };

  const manualKey = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (manualMapping[manualKey]) {
    return manualMapping[manualKey];
  }
  
  if (manualMapping[cleanName.toLowerCase()]) {
    return manualMapping[cleanName.toLowerCase()];
  }

  return fallback;
}
