import { TouchableOpacity, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export function Button({ onPress, title, variant = 'primary' }: ButtonProps) {
  const variants = {
    primary: 'bg-pink-600',
    secondary: 'bg-purple-600',
    danger: 'bg-red-500',
    success: 'bg-green-500',
  };

  return (
    <TouchableOpacity onPress={onPress} className={`${variants[variant]} px-8 py-4 rounded-full`}>
      <Text className="text-white font-bold text-lg">{title}</Text>
    </TouchableOpacity>
  );
}

export function CameraButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-20 h-20 bg-white rounded-full border-4 border-white/50"
    />
  );
}

export function IconButton({ onPress, icon }: { onPress: () => void; icon: React.ReactNode }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-16 h-16 bg-white/30 rounded-xl justify-center items-center"
    >
      {icon}
    </TouchableOpacity>
  );
}

export function DeleteButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute -top-2 -right-2 bg-red-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white"
    >
      <X color="white" size={20} strokeWidth={3} />
    </TouchableOpacity>
  );
}