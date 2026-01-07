import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useGalleryStore } from '@/lib/store/galleryStore';
import { PhotoCard } from '@/components/molecules/Cards';
import { EmptyState } from '@/components/organisms/Views';
import { Button } from '@/components/atoms/Buttons';

const { width } = Dimensions.get('window');
const imageSize = (width - 40) / 3;

export default function GalleryScreen() {
  const router = useRouter();
  const { photos, removePhoto } = useGalleryStore();

  return (
    <View className="flex-1 bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 pt-16">
      <View className="px-5 mb-5 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-white mb-2">Galería</Text>
          <Text className="text-purple-200">{photos.length} fotos</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-pink-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Volver</Text>
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <EmptyState message="No hay fotos aún" icon="📸" />
      ) : (
        <FlatList
          data={photos}
          numColumns={3}
          contentContainerStyle={{ padding: 10 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <PhotoCard
              uri={item}
              size={imageSize}
              onDelete={() => removePhoto(index)}
            />
          )}
        />
      )}
    </View>
  );
}