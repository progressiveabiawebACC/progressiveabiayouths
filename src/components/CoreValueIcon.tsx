import {
  Users,
  Scale,
  UserCheck,
  Shield,
  Eye,
  Lightbulb,
  Flag,
  Handshake,
  Heart,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Scale,
  UserCheck,
  Shield,
  Eye,
  Lightbulb,
  Flag,
  Handshake,
  Heart,
};

interface CoreValueIconProps {
  icon: string;
  className?: string;
}

const CoreValueIcon = ({ icon, className = "h-5 w-5" }: CoreValueIconProps) => {
  const IconComponent = iconMap[icon];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export default CoreValueIcon;
