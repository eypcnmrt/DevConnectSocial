import React, { useState, useEffect } from 'react';
import { ref, get, query, orderByChild, onValue, off } from 'firebase/database';
import { db } from '../services/firebase';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  tags: string[];
  userId: string;
  createdAt: number;
}

const getUserById = async (userId: string): Promise<string> => {
  try {
    // Kullanıcıyı Firebase Realtime Database'den çek
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      return userData.displayName || 'Bilinmeyen Kullanıcı';
    } else {
      return 'Bilinmeyen Kullanıcı';
    }
  } catch (error) {
    console.error('Kullanıcı bilgisi alınırken hata oluştu:', error);
    return 'Bilinmeyen Kullanıcı';
  }
};

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    const postsQuery = query(postsRef, orderByChild('createdAt'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleData = async (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const postsData: Post[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        postsData.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(postsData);

        // Kullanıcı adlarını al
        const userMap: { [key: string]: string } = {};
        for (const post of postsData) {
          if (!userMap[post.userId]) {
            userMap[post.userId] = await getUserById(post.userId);
          }
        }
        setUserNames(userMap);
      } else {
        setPosts([]);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unsubscribe = onValue(postsQuery, handleData, (error) => {
      console.error('Paylaşımlar alınırken hata oluştu: ', error);
    });

    return () => {
      off(postsQuery, 'value', handleData);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Paylaşımlar</h2>
      {posts.length === 0 && (
        <p className="text-gray-500">Henüz paylaşım yok.</p>
      )}
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex border border-gray-300 rounded-lg p-4 my-4 shadow-md bg-white items-center"
        >
          {/* Sol Taraf: İçerik */}
          <div className="flex-1">
            {/* Kullanıcı Adı */}
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {userNames[post.userId] || 'Bilinmeyen Kullanıcı'}
            </h3>

            {/* Başlık */}
            <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>

            {/* İçerik */}
            <p className="text-gray-700 mt-2">{post.content}</p>

            {/* Etiketler */}
            <p className="text-sm text-gray-500 mt-2">
              <strong>Etiketler:</strong> {post.tags.join(', ')}
            </p>

            {/* Paylaşım Tarihi */}
            <p className="text-xs text-gray-400 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Sağ Taraf: Görsel */}
          {post.imageUrl && (
            <div className="ml-4 flex-shrink-0">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-40 h-40 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;
