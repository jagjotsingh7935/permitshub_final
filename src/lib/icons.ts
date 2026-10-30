import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  ClipboardCheck,
  Compass,
  FileCheck2,
  FileText,
  Hammer,
  Handshake,
  HardHat,
  LandPlot,
  Landmark,
  Map,
  Ruler,
  Scale,
  Users,
  Warehouse,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  Building2, ClipboardCheck, Compass, FileCheck2, FileText, Hammer, Handshake, HardHat, LandPlot, Landmark, Map, Ruler, Scale, Users, Warehouse,
}

export function iconFor(name: string): LucideIcon {
  return icons[name] ?? Compass
}
