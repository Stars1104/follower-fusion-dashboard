
import { Instagram, Heart, Eye, MessageCircle } from 'lucide-react';

type ServiceType = 'followers' | 'likes' | 'views' | 'comments';

interface ServiceIconProps {
  serviceType: ServiceType;
}

export const ServiceIcon = ({ serviceType }: ServiceIconProps) => {
  const serviceDetails = {
    followers: { icon: <Instagram size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    likes: { icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
    views: { icon: <Eye size={20} />, color: 'text-purple-500', bg: 'bg-purple-50' },
    comments: { icon: <MessageCircle size={20} />, color: 'text-green-500', bg: 'bg-green-50' }
  };
  
  const detail = serviceDetails[serviceType];
  
  return (
    <div className={`p-2.5 rounded-md ${detail.bg} ${detail.color}`}>
      {detail.icon}
    </div>
  );
};
