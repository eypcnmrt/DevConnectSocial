import React, { useState } from 'react';
import { ref as dbRef, push, set } from 'firebase/database';
import { db, auth } from '../services/firebase';

// Gönderilecek post verisinin tipi
export interface PostData {
  title: string;
  content: string;
  imageUrl: string;
  tags: string[];
}

// PostForm bileşeni için prop tipi
interface PostFormProps {
  onSubmit: (postData: PostData) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>(''); // Kullanıcıdan URL alacağız
  const [tags, setTags] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Etiketleri virgülle ayrılmış string'den diziye dönüştürüyoruz
    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    // Kullanıcı kimliğini alıyoruz (giriş yapılmamışsa uyarı veriyoruz)
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert('Lütfen paylaşım yapmadan önce giriş yapınız.');
      return;
    }

    try {
      // Realtime Database'e post verisini ekliyoruz:
      const postsRef = dbRef(db, 'posts');
      const newPostRef = push(postsRef);
      await set(newPostRef, {
        title,
        content,
        imageUrl, // Kullanıcının girdiği resim URL'si
        tags: tagArray,
        userId,
        createdAt: new Date().toISOString(), // Yerel zaman damgası
      });

      // Eklenen verileri parent bileşene gönderiyoruz.
      const postData: PostData = {
        title,
        content,
        imageUrl,
        tags: tagArray,
      };
      onSubmit(postData);

      // Başarılı eklemeden sonra form alanlarını temizliyoruz
      setTitle('');
      setContent('');
      setImageUrl('');
      setTags('');
    } catch (error) {
      console.error('Veri eklenirken hata oluştu: ', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-md shadow-md"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-indigo-500"
        >
          Başlık:
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-indigo-500"
        >
          İçerik:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-indigo-500"
        >
          Resim URL'si:
        </label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/your-image.jpg"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-indigo-500"
        >
          Etiketler (virgülle ayrılmış):
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Paylaş
      </button>
    </form>
  );
};

export default PostForm;
