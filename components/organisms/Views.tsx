import { View, Text } from 'react-native';
import { Check, X } from 'lucide-react-native';

interface FeedbackOverlayProps {
  direction: 'left' | 'right';
}

export function FeedbackOverlay({ direction }: FeedbackOverlayProps) {
  return (
    <View className="absolute inset-0 justify-center items-center z-50">
      <View className={`w-36 h-36 rounded-full justify-center items-center shadow-2xl ${
        direction === 'right' ? 'bg-green-500' : 'bg-red-500'
      }`}>
        {direction === 'right' ? (
          <Check color="white" size={100} strokeWidth={4} />
        ) : (
          <X color="white" size={100} strokeWidth={4} />
        )}
      </View>
    </View>
  );
}

interface EmptyStateProps {
  message: string;
  icon: React.ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-10">
      <View className="mb-4">{icon}</View>
      <Text className="text-white text-xl text-center">{message}</Text>
    </View>
  );
}